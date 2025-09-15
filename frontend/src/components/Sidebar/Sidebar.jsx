import React from "react";
import profileImage from "./profileImage.jpg";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const handleLogout = async () => {
    (async () => {
      const request = await fetch("http://localhost:3006/auth/logout", {
        method: "GET",
        //  credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      });
      const res = await request.json();
      console.log(res);
      console.log(res.success);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("loggedIn");
      window.open("http://localhost:3000/login", "_self");
    })();
  };
  return (
    <div
      className="d-flex bg-white border-end border-2 flex-column flex-shrink-0"
      style={{ width: "4.3rem" }}
    >
      <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
        <li className="nav-item">
          <div className="d-block p-2 border-bottom rounded-0">
            <img className="img-fluid" src={profileImage} alt="" />
            <div className="h5 mt-2 pt-2 cm-strong">IP</div>
          </div>
        </li>
        <li className="nav-item">
          <Link
            to="/"
            className="nav-link py-3 border-bottom rounded-0"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Home"
          >
            <i className="fa fa-home" aria-hidden="true" />
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/codeide"
            className="nav-link py-3 border-bottom rounded-0"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Code IDE"
          >
            <i className="fas fa-code" />
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/whiteboard"
            className="nav-link py-3 border-bottom rounded-0"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="White Board"
          >
            <i className="fa-solid fa-clipboard" />
          </Link>
        </li>
      </ul>
      <div className="border-top">
        <Link
          className="d-flex  align-items-center justify-content-center p-3 link-dark text-decoration-none"
          onClick={handleLogout}
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          title="Logout"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
