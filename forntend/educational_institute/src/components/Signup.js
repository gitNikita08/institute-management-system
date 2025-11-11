import React, { useState } from "react";
import "../components/style.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
//import "react-toastify/dist/ReactTOastify.css";

// Signup function
const Signup = () => {
  // create bind
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setLoading] = useState(true);

  // getting from react-router-dom
  const navigate = useNavigate();

  // prevent from default setting of autoloading the browser- manually refresh the browser
  const submitHandler = (event) => {
    event.preventDefault();

    setLoading(true);
    // create and define the form data
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("image", image);
    axios
      .post("http://localhost:4200/user/signup", formData)
      .then((res) => {
        setLoading(false);
        toast.success("Your Account is Created!");
        navigate("/login");
        console.log(res);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Something went wrong!");
        console.log(err);
      });
  };

  // set the image url to the value
  const fileHandler = (e) => {
    setImage(e.target.files[0]);
    setImageURL(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <div className="signup-left">
          <img alt="book logo" src={require("../assets/book_logo2.png")} />
          <h1 className="signup-left-heading">Institute Management App</h1>
          <p className="signup-left-para">
            <b>Manage Institute Data in an easier way...</b>
          </p>
        </div>

        <div className="signup-right">
          <form onSubmit={submitHandler} className="form">
            <h1>Create Your Account</h1>
            <input
              required
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              type="text"
              placeholder="Institute Full Name"
            />
            <input
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="Email"
            />
            <input
              required
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              type="text"
              placeholder="Phone"
            />
            <input
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="Password"
            />
            <input required onChange={fileHandler} type="file" />
            {imageURL && (
              <img className="your-logo" alt="your logo" src={imageURL} />
            )}
            <button type="submit">
              {isLoading && (
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
              )}
              submit
            </button>

            <Link className="link" to="/login">
              Login with Your Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
