import React from "react";
import { Link } from "react-router-dom";

export default function CitizenTopbar() {
  return (
    <div className="topbar">

      <div className="topbar-logo">
        <div className="topbar-logo-mark">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
          >
            <path d="M3 9l9-7 9 7v11H3z" />
          </svg>
        </div>
        Urban Resolve
      </div>

      <div className="topbar-sep"></div>

      <div className="topbar-links">

        <Link className="topbar-link" to="/admin">
          Admin
        </Link>

        <Link className="topbar-link" to="/department">
          Department
        </Link>

        <Link className="topbar-link" to="/">
          General
        </Link>

        <Link className="topbar-link active" to="/citizen">
          Citizen
        </Link>

      </div>

      <div className="topbar-right">
        <span className="topbar-badge citizen">
          Citizen Zone
        </span>
      </div>

    </div>
  );
}