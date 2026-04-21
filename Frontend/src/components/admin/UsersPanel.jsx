import React, { useState, useEffect } from "react";
import API_URL from '../../config.js';

export default function UsersPanel() {
  const [citizens, setCitizens] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDept, setShowAddDept] = useState(false);

  // Add Dept Form State
  const [deptName, setDeptName] = useState("");
  const [deptEmail, setDeptEmail] = useState("");
  const [deptHead, setDeptHead] = useState("");
  const [deptPass, setDeptPass] = useState("password123");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const headers = { "Authorization": `Bearer ${token}` };
      const [citRes, deptRes] = await Promise.all([
        fetch(API_URL + "/admin/citizens", { headers }),
        fetch(API_URL + "/admin/departments", { headers })
      ]);
      setCitizens(await citRes.json());
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

  const handleAddDept = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL + "/admin/register-department", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: deptHead,
          email: deptEmail,
          departmentName: deptName,
          password: deptPass
        })
      });
      if (res.ok) {
        alert("Department added successfully!");
        setShowAddDept(false);
        fetchData();
      } else {
        const d = await res.json();
        alert(d.message || "Failed to add department");
      }
    } catch (err) {
      alert("Error adding department");
    }
  };

  return (
    <div className="panel active" id="p-users" style={{ width: "100%" }}>
      <div className="page-intro">
        <h2>User & Department Management</h2>
        <p>Manage citizen accounts and department portals</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-hd">
            <span className="card-title">Departments ({departments.length})</span>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddDept(true)}>+ Add</button>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Head</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(d => (
                  <tr key={d._id}>
                    <td><strong>{d.departmentName}</strong></td>
                    <td>{d.name}</td>
                    <td>{d.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <span className="card-title">Citizens ({citizens.length})</span>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Ward</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {citizens.map(c => (
                  <tr key={c._id}>
                    <td>{c.firstName} {c.lastName}</td>
                    <td>{c.ward}</td>
                    <td>{c.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddDept && (
        <div className="modal-overlay" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div className="card" style={{ width: 400, padding: 24 }}>
            <h3>Add New Department</h3>
            <form onSubmit={handleAddDept}>
              <div className="form-group">
                <label>Department Name</label>
                <select className="form-input" value={deptName} onChange={e => setDeptName(e.target.value)} required>
                  <option value="">Select Category</option>
                  <option>Water Supply</option>
                  <option>Roads & Infrastructure</option>
                  <option>Sanitation</option>
                  <option>Electricity Board</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department Head Name</label>
                <input className="form-input" value={deptHead} onChange={e => setDeptHead(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Official Email</label>
                <input type="email" className="form-input" value={deptEmail} onChange={e => setDeptEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Temporary Password</label>
                <input className="form-input" value={deptPass} onChange={e => setDeptPass(e.target.value)} required />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn btn-primary">Create Dept</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddDept(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}