import React from "react";

export default function CategoriesPanel() {
  return (
    <div className="panel active" id="p-categories" style={{ width: "100%" }}>

      <div className="page-intro">
        <h2>Complaint Category Management</h2>
        <p>Configure categories and SLA routing</p>
      </div>

      <div className="card">

        <div className="card-hd">
          <span className="card-title">Active Categories</span>
          <button className="btn btn-primary btn-sm">+ Add Category</button>
        </div>

        <div className="tbl-wrap">

          <table className="tbl">

            <thead>
              <tr>
                <th>Category</th>
                <th>Sub-categories</th>
                <th>Routes To</th>
                <th>SLA (days)</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td><strong>Water Supply</strong></td>
                <td>Leakage, No Supply, Quality</td>
                <td>Water Supply Dept</td>
                <td>3</td>
                <td>842</td>
                <td>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button className="btn btn-ghost btn-sm">Edit</button>
                    <button className="btn btn-danger btn-sm">Del</button>
                  </div>
                </td>
              </tr>

              <tr>
                <td><strong>Roads & Potholes</strong></td>
                <td>Pothole, Broken Road</td>
                <td>Roads Dept</td>
                <td>7</td>
                <td>601</td>
                <td>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button className="btn btn-ghost btn-sm">Edit</button>
                    <button className="btn btn-danger btn-sm">Del</button>
                  </div>
                </td>
              </tr>

              <tr>
                <td><strong>Sanitation</strong></td>
                <td>Garbage, Drain, Clean</td>
                <td>Sanitation Dept</td>
                <td>2</td>
                <td>534</td>
                <td>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button className="btn btn-ghost btn-sm">Edit</button>
                    <button className="btn btn-danger btn-sm">Del</button>
                  </div>
                </td>
              </tr>

              <tr>
                <td><strong>Electricity</strong></td>
                <td>Power Cut, Streetlight</td>
                <td>Electricity Board</td>
                <td>1</td>
                <td>480</td>
                <td>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button className="btn btn-ghost btn-sm">Edit</button>
                    <button className="btn btn-danger btn-sm">Del</button>
                  </div>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}