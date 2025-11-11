import React, { useState } from "react";
import "../components/style.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false); // 🔧 should be false by default

  const navigate = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    axios
      .post("http://localhost:4200/user/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        setLoading(false);

        // //Check if imageUrl is a valid Cloudinary URL
        // if (!res.data.imageUrl?.startsWith("http")) {
        //   toast.error("Invalid profile image URL");
        //   return;
        // }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("fullName", res.data.fullName);
        localStorage.setItem("imageURL", res.data.imageURL);
        localStorage.setItem("imageId", res.data.imageId);
        localStorage.setItem("email", res.data.email);

        // toast.success("Login successful!");
        navigate("/dashboard");
        // LOG the response to check what’s returned
        console.log(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Login error:", err);

        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      });
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <div className="signup-left">
          <img alt="logo" src={require("../assets/edu logo 1.png")} />
          <h1 className="signup-left-heading">Institute Management App</h1>
          <p className="signup-left-para">
            Manage Institute Data in an easier way...
          </p>
        </div>

        <div className="signup-right">
          <form onSubmit={submitHandler} className="form">
            <h1>Login with Your Account</h1>

            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />

            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
              ) : (
                "Submit"
              )}
            </button>

            <Link className="link" to="/signup">
              Create Your Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
