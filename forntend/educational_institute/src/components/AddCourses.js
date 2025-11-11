import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddCourses = () => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null);

  const [imageURL, setImageURL] = useState("");
  const [isLoading, setLoading] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      console.log(location.state.course);
      setCourseName(location.state.course.courseName);
      setDescription(location.state.course.description);
      setPrice(location.state.course.price);
      setStartDate(location.state.course.startDate);
      setEndDate(location.state.course.endDate);
      setImageURL(location.state.course.imageURL);
    }
    else{
      setCourseName("");
      setDescription("");
      setPrice(0);
      setStartDate("");
      setEndDate("");
      setImageURL("");
    }
  }, [location]);

  // submitHandler used for submitting the form data w.r.t an event 'e'
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("courseName", courseName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    if (image) {
      formData.append("image", image);
    }

    if (location.state) {
      axios
        .put(
          "http://localhost:4200/course/" + location.state.course._id,
          formData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          setLoading(false);
          console.log(res.data);
          toast.success("course updated...");
          navigate("/dashboard/course-details/" + location.state.course._id);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          toast.error("something went wrong...");
        });
    } else {
      axios
        .post("http://localhost:4200/course/add-course", formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setLoading(false);
          console.log(res.data);
          toast.success("new course added...");
          navigate("/dashboard/courses");
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          toast.error("something went wrong...");
        });
    }
  };

  // fileHandler used for setting and uploading the image file w.r.t an event 'e'
  // set the image url to the value
  const fileHandler = (e) => {
    setImage(e.target.files[0]);
    setImageURL(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div>
      <form onSubmit={submitHandler} className="form">
        <h1>{location.state ? "Edit Course" : "Add New Course"}</h1>
        <input
          value={courseName}
          required
          onChange={(e) => {
            setCourseName(e.target.value);
          }}
          placeholder="Course Name"
          type="text"
        />
        <input
          value={description}
          required
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          placeholder="Description"
          type="text"
        />
        <input
          value={price}
          required
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          placeholder="Price"
          type="number"
        />
        <input
          value={startDate}
          required
          onChange={(e) => {
            setStartDate(e.target.value);
          }}
          placeholder="Start Date (DD-MM-YY)"
          type="text"
        />
        <input
          value={endDate}
          required
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
          placeholder="End Date (DD-MM-YY)"
          type="text"
        />
        <input required={!location.state} onChange={fileHandler} type="file" />
        {imageURL && (
          <img className="your-logo" alt="your logo" src={imageURL} />
        )}
        <button type="submit" required className="submit-btn">
          {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddCourses;
