const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Classifies a complaint using Gemini API
 * @param {string} title - The title of the complaint
 * @param {string} description - The description of the complaint
 * @returns {Promise<{category: string, subCategory: string, priority: string, reason: string} | null>}
 */
const classifyComplaint = async (title, description) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_actual_api_key_here") {
    console.warn("AI Classifier: GEMINI_API_KEY is not set or placeholder. Skipping AI classification.");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-2.5-flash for speed and cost-effectiveness
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an AI assistant for a Smart City Grievance Redressal system named "Urban Resolve".
      Your job is to analyze a citizen's complaint and classify it accurately.

      Complaint Title: "${title}"
      Complaint Description: "${description}"

      Category must be one of the following values:
      - "Water Supply"
      - "Roads"
      - "Sanitation"
      - "Electricity"
      - "Street Lights"
      - "Other"

      SubCategory must be one of the allowed values corresponding to the category:
      - "Water Supply": "No Water Supply", "Pipe Leakage", "Contamination", "Low Pressure"
      - "Roads": "Potholes", "Broken Pavement", "Waterlogging"
      - "Sanitation": "Garbage Collection", "Blocked Drain", "Public Toilet"
      - "Electricity": "Power Outage", "Flickering Lights", "Sparking Pole"
      - "Street Lights": "Not Working", "Pole Damage"
      - "Other": "General Query"

      Priority must be: "Low", "Medium", or "High". Assess based on safety, urgency, and public disruption.
    `;

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            category: {
              type: "STRING",
              enum: ["Water Supply", "Roads", "Sanitation", "Electricity", "Street Lights", "Other"]
            },
            subCategory: {
              type: "STRING"
            },
            priority: {
              type: "STRING",
              enum: ["Low", "Medium", "High"]
            },
            reason: {
              type: "STRING"
            }
          },
          required: ["category", "subCategory", "priority", "reason"]
        }
      }
    });

    const text = response.response.text();
    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error("AI Classifier Error:", error.message);
    return null;
  }
};

module.exports = { classifyComplaint };
