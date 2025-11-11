import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const params = useParams();
  const [course, setCourse] = useState({});
  const [studentList, setStudentList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getCourseDetails();
  }, []);

  const getCourseDetails = () => {
    axios
      .get("http://localhost:4200/course/course-details/" + params.id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        console.log(res.data.course)
        setCourse(res.data.course);
        setStudentList(res.data.studentList);
      })
      .catch((err) => {
        console.log(err);
        toast.error("something went wrong...");
      });
  };

  const deleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      axios
        .delete("http://localhost:4200/course/" + courseId, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          toast.success("Course deleted successfully");
          navigate("/dashboard/courses");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong...");
        });
    }
  };

  return (
    <div className="course-detail-main-wrapper">
      {course && course._id && (
        <div className="course-detail-wrapper">
          <img alt="course thumbnail" src={course.imageURL} />
          <div className="course-detail-text">
            <h2>{course.courseName}</h2>
            <p>Price : {course.price}</p>
            <p>Start Date : {course.startDate}</p>
            <p>End Date : {course.endDate}</p>
          </div>
          <div className="course-description-box">
            <div className="btn-container">
              <button
                className="primary-btn"
                onClick={() => {
                  navigate("/dashboard/update-course/" + course._id, {
                    state: { course },
                  });
                }}
              >
                Edit
              </button>
              <button
                className="secondary-btn"
                onClick={() => {
                  deleteCourse(course._id);
                }}
              >
                Delete
              </button>
            </div>
            <h3>Course Description</h3>
            <div className="course-description-container">
              <p>{course.description}</p>
            </div>
          </div>
        </div>
      )}

      {studentList && studentList.length > 0 && (
        <div className="studentList-container">
          <table>
            <thead>
              <tr>
                <th>Student's Pic</th>
                <th>Student Name</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((student) => (
                <tr
                  onClick={() => {
                    navigate("/dashboard/student-details/" + student._id);
                  }}
                  key={student._id}
                >
                  <td>
                    <img
                      alt="student pic"
                      className="student-profile-pic"
                      src={student.imageURL}
                    />
                  </td>
                  <td>
                    <p>{student.fullName}</p>
                  </td>
                  <td>
                    <p>{student.phone}</p>
                  </td>
                  <td>
                    <p>{student.email}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
