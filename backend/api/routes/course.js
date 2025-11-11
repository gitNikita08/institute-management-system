// import thr required libraries and files
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const Course = require("../model/CourseModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const Student = require("../model/StudentModel");
const fee = require("../model/FeeModel");

// Cloudinary config- Cloudinary config sets up authentication between your app and your Cloudinary account so you can upload, manage, and transform media.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Add New Course
router.post("/add-course", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  // Verify token and extract uId
  const verify = jwt.verify(token, "institute mangmnt 123");

  // Make sure verify.uId exists
  if (!verify.uId) {
    return res.status(401).json({ error: "Invalid token or uid missing" });
  }

  // Upload course image
  cloudinary.uploader.upload(req.files.image.tempFilePath, (error, result) => {
    if (error) {
      return res.status(500).json({ error });
    }

    // Create new course
    const newCourse = new Course({
      _id: new mongoose.Types.ObjectId(),
      courseName: req.body.courseName,
      price: req.body.price,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      uId: verify.uId,
      imageURL: result.secure_url,
      imageId: result.public_id,
    });

    newCourse
      .save()
      .then((result) => {
        res.status(200).json({
          newCourse: result,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: error,
        });
      });
  });
});

// get all courses for any user
router.get("/all-courses", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  // Verify token and extract uId
  const verify = jwt.verify(token, "institute mangmnt 123");

  Course.find({ uId: verify.uId })
    .select(
      "_id uId courseName description price startDate endDate imageURL imageId"
    )
    .then((result) => {
      res.status(200).json({
        courses: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// get one course for any user
router.get("/course-details/:id", checkAuth, (req, res) => {
  // const token = req.headers.authorization.split(" ")[1];

  // // Verify token and extract uId
  // const verify = jwt.verify(token, "institute mangmnt 123");

  Course.findById(req.params.id)
    .select(
      "_id uId courseName description price startDate endDate imageURL imageId"
    )
    .then((result) => {
      Student.find({ courseId: req.params.id }).then((students) => {
        res.status(200).json({
          course: result,
          studentList: students,
        });
      });
    })
    // .then((result) => {
    //   console.log(result);
    //   res.status(200).json({
    //     course: result,
    //   });
    // })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// delete course w.r.t the course id
router.delete("/:id", checkAuth, (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const verify = jwt.verify(token, "institute mangmnt 123");

  Course.findById(req.params.id)
    .then((course) => {
      console.log(course);
      if (course.uId == verify.uId) {
        Course.findByIdAndDelete(req.params.id)
          .then((result) => {
            cloudinary.uploader.destroy(course.imageId, (deletedImage) => {
              Student.deleteMany({ courseId: req.params.id })
                .then((data) => {
                  res.status(200).json({
                    result: data,
                  });
                })
                .catch((err) => {
                  res.status(500).json({
                    message: err,
                  });
                });
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: err,
            });
          });
      } else {
        res.status(500).json({
          message: "bad request",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// update course
router.put("/:id", checkAuth, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const verify = jwt.verify(token, "institute mangmnt 123");

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (verify.uId != course.uId)
      return res.status(403).json({ error: "Not authorized" });

    let updatedCourseData = {
      courseName: req.body.courseName,
      price: req.body.price,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      uId: verify.uId,
      imageURL: course.imageURL,
      imageId: course.imageId,
    };

    // If frontend sent a new file
    if (req.files && req.files.image) {
      // Delete old image
      await cloudinary.uploader.destroy(course.imageId);

      // Upload new image
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath
      );

      updatedCourseData.imageURL = result.secure_url;
      updatedCourseData.imageId = result.public_id;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updatedCourseData,
      { new: true }
    );

    res.status(200).json({ updatedCourse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Unknown error" });
  }
});

// get latest 5 courses data
router.get("/latest-courses", checkAuth, (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const verify = jwt.verify(token, "institute mangmnt 123");

  Course.find({ uId: verify.uId })
    .sort({ $natural: -1 })
    .limit(5)
    .then((result) => {
      res.status(200).json({
        course: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// home api
router.get("/home", checkAuth, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const verify = jwt.verify(token, "institute mangmnt 123");

    // latest 5 fees
    const newFees = await fee
      .find({ uId: verify.uId })
      .sort({ $natural: -1 })
      .limit(5);

    // latest 5 students
    const newStudents = await Student.find({ uId: verify.uId })
      .sort({ $natural: -1 })
      .limit(5);

    // count total courses
    const totalCourse = await Course.countDocuments({ uId: verify.uId });

    // count total students
    const totalStudents = await Student.countDocuments({ uId: verify.uId });

    // total amount
    const totalAmount = await fee.aggregate([
      { $match: { uId: verify.uId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      fees: newFees,
      students: newStudents,
      totalCourses: totalCourse,
      totalStudents,
      totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
    });
  } catch (err) {
    console.error("Error in /home:", err);
    res.status(500).json({ error: err.message });
  }
});

// export the router
module.exports = router;
