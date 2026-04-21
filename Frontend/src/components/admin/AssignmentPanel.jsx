import React, { useState, useEffect } from "react";

export default function AssignmentPanel() {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const headers = { "Authorization": `Bearer ${token}` };
      const [compRes, deptRes] = await Promise.all([
        fetch("http://localhost:5000/api/v1/complaints", { headers }),
        fetch("http://localhost:5000/api/v1/admin/departments", { headers })
      ]);
      const comps = await compRes.json();
      setComplaints(comps.filter(c => !c.departmentAssigned));
      setDepartments(await deptRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (complaintId, deptId) => {
    if (!deptId) return alert("Select a department");
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`http://localhost:5000/api/v1/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ departmentAssigned: deptId, status: "In Progress" })
      });
      if (res.ok) {
        alert("Assigned successfully!");
        fetchData();
      }
    } catch (err) {
      alert("Assignment failed");
    }
  };

  return (
    <div className="panel active" id="p-assign">
      <div className="page-intro">
        <h2>Complaint Assignment</h2>
        <p>Route unassigned complaints to departments</p>
      </div>

      <div className="card">
        <div className="card-hd">
          <span className="card-title">Unassigned Complaints ({complaints.length})</span>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Citizen</th>
                <th>Assign To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c._id}>
                  <td><span className="cid">#{c._id.slice(-4)}</span></td>
                  <td>{c.category}</td>
                  <td>{c.ward}</td>
                  <td>
                    <select className="form-input" id={`select-${c._id}`} style={{ width: 160 }}>
                      <option value="">Select Dept</option>
                      {departments.map(d => (
                        <option key={d._id} value={d._id}>{d.departmentName}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={() => handleAssign(c._id, document.getElementById(`select-${c._id}`).value)}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr><td colSpan="5" style={{textAlign:"center"}}>All complaints are assigned</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}