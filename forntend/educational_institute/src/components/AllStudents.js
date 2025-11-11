import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AllStudents = () => {
  const [studentList, setStudentList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getStudentList();
  }, []);

  const getStudentList = () => {
    axios
      .get("http://localhost:4200/student/all-students", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setStudentList(res.data.students)
      })
      .catch((err) => {
        console.log(err);
        toast.error("something went wrong...");
      });
  };

  return (
    <div>
       {studentList && studentList.length > 0 && (
        <div className="students-container">
          <table>
            <thead>
              <tr>
                <th>Student's Pic</th>
                <th>Student Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Course_ID</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((student) => (
                <tr onClick={()=>{navigate("/dashboard/student-details/"+student._id)}} key={student._id}>
                  <td>
                    <img alt="student pic"
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
                  <td>
                    <p>{student.courseId}</p>
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

export default AllStudents;
