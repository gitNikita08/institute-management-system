import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home";
import AllCourses from "./components/AllCourses";
import AddCourses from "./components/AddCourses";
import AllStudents from "./components/AllStudents";
import AddStudents from "./components/AddStudents";
import CollectFee from "./components/CollectFee";
import PaymentHistory from "./components/PaymentHistory";
import CourseDetails from "./components/CourseDetails";
import StudentDetails from "./components/StudentDetails";

const App = () => {
  // define routing
  const myRouter = createBrowserRouter([
    { path: "", Component: Login },
    { path: "login", Component: Login },
    { path: "signup", Component: Signup },
    {
      path: "dashboard",
      Component: Dashboard,
      children: [
        { path: "", Component: Home },
        { path: "home", Component: Home },
        { path: "courses", Component: AllCourses },
        { path: "add-course", Component: AddCourses },
        { path: "students", Component: AllStudents },
        { path: "add-student", Component: AddStudents },
        { path: "collect-fee", Component: CollectFee },
        { path: "payment-history", Component: PaymentHistory },
        { path: "course-details/:id", Component: CourseDetails },
        { path: "update-course/:id", Component: AddCourses },
        { path: "update-student/:id", Component: AddStudents },
        { path: "student-details/:id", Component: StudentDetails },
      ],
    },
  ]);
  return (
    //define props
    <>
      <RouterProvider router={myRouter} />
      <ToastContainer />
    </>
  );
};

export default App;
