import React, { useState, useEffect } from "react";
import "../components/style.css";
import SideNav from "./SideNav";
import { Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [imageURL, setImageURL] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const storedImage = localStorage.getItem("imageURL");
    const storedName = localStorage.getItem("fullName");
    if (storedImage) setImageURL(storedImage);
    if (storedName) setFullName(storedName);
  }, []);

  const defaultProfile = "/default-avatar.png"; // place in public folder

  return (
    <div className="dashboard-main-container">
      <div className="dashboard-container">
        <SideNav />
        <div className="main-container">
          <div className="top-bar">
            <div className="logo-container">
              <img
                alt="profile logo"
                className="profile-logo"
                src={imageURL || defaultProfile}
              />
            </div>
            <div className="profile-container">
              <h2 className="profile-name">{fullName}</h2>
              <button className="logout-btn" onClick={logoutHandler}>
                Logout
              </button>
            </div>
          </div>

          <div className="outlet-area">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
