import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AllCourses = () => {
  const [courseList, setCourseList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = () => {
    axios
      .get("http://localhost:4200/course/all-courses", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data.courses);
        setCourseList(res.data.courses);
        // navigate("/dashboard/courses");
      })
      .catch((err) => {
        console.log(err);
        toast.error("something went wrong...");
      });
  };

  return (
    <div className="course-wrapper">
      {
        courseList.map((course)=>(
          <div onClick={()=>{navigate("/dashboard/course-details/"+course._id)}} className="course-box" key={course._id}>
            <img className="course-thumbnail" alt="course pic" src={course.imageURL}/>
            <h3 className="course-name">{course.courseName}</h3>
            <p className="course-price">Rs. {course.price} only</p>
          </div>
        ))
      }
    </div>
  )
};

export default AllCourses;
