const { GoogleGenerativeAI } = require("@google/generative-ai");
const Complaint = require("../models/complaintModel");

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_actual_api_key_here") {
    console.warn("AI Controller: GEMINI_API_KEY is not set or placeholder.");
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

/**
 * AI Chat Copilot
 * Helps citizen write grievances, answers FAQs, and formats input.
 */
const handleChatCopilot = async (req, res) => {
  try {
    const { message, history } = req.body;
    const model = getGeminiModel();
    
    if (!model) {
      return res.status(200).json({
        replyText: "AI Assistant is currently offline (API key missing). You can still file complaints manually.",
        draftComplaint: null
      });
    }

    const systemInstruction = `
      You are "UrbanAI", the official virtual assistant for "Urban Resolve", a Government Smart City Grievance Redressal Portal.
      Your goal is to help citizens file complaints, answer municipal service FAQs, and look up rules.
      
      If the citizen describes a civic problem or complaint:
      1. Be helpful and polite.
      2. Analyze their input and extract a structured draft complaint.
      3. Return a JSON response with:
         - replyText: A friendly greeting/explanation of what you drafted.
         - draftComplaint: A structured object containing:
             - title: A concise, formal title (e.g., "Sewerage overflow near Block C")
             - description: A professional, grammatically correct detail of the issue.
             - category: Must be one of ["Water Supply", "Roads", "Sanitation", "Electricity", "Street Lights", "Other"]
             - subCategory: Choose the closest one:
                 * Water Supply: "No Water Supply", "Pipe Leakage", "Contamination", "Low Pressure"
                 * Roads: "Potholes", "Broken Pavement", "Waterlogging"
                 * Sanitation: "Garbage Collection", "Blocked Drain", "Public Toilet"
                 * Electricity: "Power Outage", "Flickering Lights", "Sparking Pole"
                 * Street Lights: "Not Working", "Pole Damage"
                 * Other: "General Query"
             - priority: "Low", "Medium", or "High"
      
      If they are just chatting or asking a general question:
      1. Provide a helpful reply text.
      2. Return draftComplaint as null.
      
      Ensure you output valid JSON matching the schema.
    `;

    const chatHistory = (history || []).map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            replyText: { type: "STRING" },
            draftComplaint: {
              type: "OBJECT",
              nullable: true,
              properties: {
                title: { type: "STRING" },
                description: { type: "STRING" },
                category: { type: "STRING", enum: ["Water Supply", "Roads", "Sanitation", "Electricity", "Street Lights", "Other"] },
                subCategory: { type: "STRING" },
                priority: { type: "STRING", enum: ["Low", "Medium", "High"] }
              },
              required: ["title", "description", "category", "subCategory", "priority"]
            }
          },
          required: ["replyText", "draftComplaint"]
        }
      }
    });

    const prompt = `${systemInstruction}\n\nUser Message: "${message}"`;
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();
    
    try {
      const parsed = JSON.parse(responseText);
      res.json(parsed);
    } catch (parseErr) {
      res.json({
        replyText: responseText,
        draftComplaint: null
      });
    }
  } catch (error) {
    console.error("Chat Copilot error:", error.message);
    res.status(200).json({
      replyText: "Namaste! The AI Redressal Assistant is currently offline for system maintenance. Please feel free to draft and submit your grievance manually using the form.",
      draftComplaint: null
    });
  }
};

/**
 * AI Duplicate & Spam Grievance Scanner
 * Compares new description against active complaints in the same ward.
 */
const handleDuplicateScan = async (req, res) => {
  try {
    const { title, description, ward } = req.body;
    
    if (!title || !description || !ward) {
      return res.status(400).json({ message: "Title, description, and ward are required." });
    }

    // Fetch complaints in the same ward within the last 7 days that are not resolved/rejected
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeComplaints = await Complaint.find({
      ward,
      status: { $in: ["Pending", "In Progress"] },
      createdAt: { $gte: sevenDaysAgo }
    }).select("_id title description category subCategory");

    if (activeComplaints.length === 0) {
      return res.json({
        isDuplicate: false,
        matchPercentage: 0,
        reason: "No active complaints found in this ward recently.",
        matchedComplaintId: null
      });
    }

    const model = getGeminiModel();
    if (!model) {
      return res.json({
        isDuplicate: false,
        matchPercentage: 0,
        reason: "AI Duplicate Scanner offline.",
        matchedComplaintId: null
      });
    }

    const activeListText = activeComplaints.map((c, i) => 
      `[Index: ${i}, ID: ${c._id}] Title: "${c.title}", Description: "${c.description}", Category: "${c.category}"`
    ).join("\n\n");

    const prompt = `
      You are an expert AI moderator for Urban Resolve Smart City Portal.
      Your task is to analyze if a newly submitted complaint is a duplicate of any existing active complaints in the same ward.
      
      New Complaint:
      Title: "${title}"
      Description: "${description}"
      
      Existing Active Complaints in this Ward:
      ${activeListText}
      
      Evaluate the similarity. If the new complaint describes the same physical issue (e.g., the same pothole on a street, the same leaking pipe, the same street light broken), it is a duplicate.
      
      Return a JSON response:
      {
        "isDuplicate": true | false,
        "matchPercentage": 0 to 100, // similarity score (0 = totally unique, 100 = exact copy)
        "reason": "Clear, objective explanation of similarity or difference",
        "matchedComplaintId": "The string _id of the matching complaint, or null if no duplicate match (matchPercentage < 65)"
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            isDuplicate: { type: "BOOLEAN" },
            matchPercentage: { type: "INTEGER" },
            reason: { type: "STRING" },
            matchedComplaintId: { type: "STRING", nullable: true }
          },
          required: ["isDuplicate", "matchPercentage", "reason", "matchedComplaintId"]
        }
      }
    });

    const parsed = JSON.parse(result.response.text());
    res.json(parsed);
  } catch (error) {
    console.error("Duplicate scan error:", error.message);
    res.status(200).json({
      isDuplicate: false,
      matchPercentage: 0,
      reason: "The AI Duplicate Check is currently offline. Verification will be processed during department screening.",
      matchedComplaintId: null
    });
  }
};

/**
 * AI Resolution Draft Generator
 * Suggests resolution notes/comments to department operators based on the complaint.
 */
const handleResolutionDraft = async (req, res) => {
  try {
    const { complaintId } = req.body;
    
    if (!complaintId) {
      return res.status(400).json({ message: "Complaint ID is required" });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const model = getGeminiModel();
    if (!model) {
      return res.json({
        draftNotes: "Assigned team inspected the site and carried out necessary repairs. Grievance resolved."
      });
    }

    const prompt = `
      You are an AI assistant for a Government Smart City Redressal portal.
      An officer from the "${complaint.category}" department is resolving this complaint:
      Title: "${complaint.title}"
      Description: "${complaint.description}"
      Location: "${complaint.location}"
      
      Generate professional, concise resolution notes that the department officer can enter as "Resolution Notes" to close the complaint.
      Keep it professional, action-oriented, and specific to the category.
      Format it as:
      1. Action Taken: (e.g. Cleared drainage, replaced light, etc.)
      2. Verification: (e.g. Tested flow, checked connection, verified with residents)
      3. Closure statement.
      
      Keep the length under 60 words total. Do not use markdown tags, just plain text.
    `;

    const result = await model.generateContent(prompt);
    res.json({
      draftNotes: result.response.text().trim()
    });
  } catch (error) {
    console.error("Resolution draft error:", error.message);
    res.status(200).json({
      draftNotes: "Action Taken: Addressed the reported issue in accordance with municipal protocols.\nVerification: Inspected site and verified issue resolution.\nClosure statement: Grievance resolved successfully."
    });
  }
};

module.exports = {
  handleChatCopilot,
  handleDuplicateScan,
  handleResolutionDraft
};
