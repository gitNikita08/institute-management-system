import React from "react";
import "../components/style.css";
import { Link, useLocation } from "react-router-dom";

const SideNav = () => {
  const location = useLocation();
  return (
    <div className="nav-container">
      <div className="brand-container">
        <img
          className="profile-logo"
          alt="brand-logo"
          src={require("../assets/edu logo 1.png")}
        />
        <div>
          <h2 className="brand-name">EI Management App</h2>
          <p className="brand-slogan">Manage your App in an easier way...</p>
        </div>
      </div>
      <div>
        <div className="menu-container">
          <Link
            to="/dashboard/home"
            className={
              location.pathname === "/dashboard/home"
                ? "menu-active-link"
                : "menu-link"
            }
          >
            <i className="fa-solid fa-house"></i>Home
          </Link>
          <Link
            to="/dashboard/courses"
            className={
              location.pathname === "/dashboard/all-courses"
                ? "menu-active-link"
                : "menu-link"
            }
          >
            <i className="fa-solid fa-chalkboard-user"></i>All Courses
          </Link>
          <Link
            to="/dashboard/add-course"
            className={
              location.pathname === "/dashboard/add-course"
                ? "menu-active-link"
                : "menu-link"
            }
          >
            <i className="fa-solid fa-square-plus"></i>Add Course
          </Link>
          <Link
            to="/dashboard/students"
            className={
              location.pathname === "/dashboard/students"
                ? "menu-active-link"
                : "menu-link"
            }
          >
            <i className="fa-solid fa-users-line"></i>All Students
          </Link>
          <Link
            to="/dashboard/add-student"
            className={
              location.pathname === "/dashboard/add-student"
                ? "menu-active-link"
                : "menu-link"
            }
          >
            <i className="fa-solid fa-user-plus"></i>Add Students
          </Link>
          <Link
            to="/dashboard/collect-fee"
            className={
              location.pathname === "/dashboard/collect-fee"
                ? "menu-active-link"
                : "menu-link"
            }
          >
            <i className="fa-solid fa-hand-holding-dollar"></i>Collect Fee
          </Link>
          <Link
            to="/dashboard/payment-history"
            className={
              location.pathname === "/dashboard/payment-history"
                ? "menu-active-link"
                : "menu-link"
            }
          >
            <i className="fa-solid fa-file-invoice"></i>Payment History
          </Link>
        </div>
        <div className="contact-us">
          <p>
            <i className="fa-solid fa-address-card"></i>Contact Developer
          </p>
          <p>
            <i className="fa-solid fa-mobile-screen-button"></i>3636363467
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
