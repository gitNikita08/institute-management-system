const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const Student = require("../model/StudentModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const Fee = require("../model/FeeModel");
const Course = require("../model/CourseModel");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//Add new student
router.post("/add-student", checkAuth, (req, res) => {
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

    // Create new student
    const newStudent = new Student({
      _id: new mongoose.Types.ObjectId(),
      fullName: req.body.fullName,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      courseId: req.body.courseId,
      uId: verify.uId, // ← Using correct token field
      imageURL: result.secure_url,
      imageId: result.public_id,
    });

    newStudent
      .save()
      .then((result) => {
        res.status(200).json({
          newStudent: result,
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

// get all students
router.get("/all-students", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  // Verify token and extract uId
  const verify = jwt.verify(token, "institute mangmnt 123");

  Student.find({ uId: verify.uId })
    .select("_id uId fullName phone email address courseId imageURL imageId")
    .then((result) => {
      res.status(200).json({
        students: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// get student-detail by Id
router.get("/student-details/:id", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  // Verify token and extract uId
  const verify = jwt.verify(token, "institute mangmnt 123");

  Student.findById(req.params.id)
    .select("_id uId fullName phone email address courseId imageURL imageId")
    .then((result) => {
      Fee.find({
        uId: verify.uId,
        courseId: result.courseId,
        phone: result.phone,
      })
        .then((feeData) => {
          Course.findById(result.courseId)
          .then(courseDetail=>{
            res.status(200).json({
            studentDetail: result,
            feeDetail: feeData,
            courseDetail: courseDetail
          })
          })
          .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
          
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// get all students for a course
router.get("/all-students/:courseId", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  // Verify token and extract uId
  const verify = jwt.verify(token, "institute mangmnt 123");

  Student.find({ uId: verify.uId, courseId: req.params.courseId })
    .select("_id uId fullName phone email address courseId imageURL imageId")
    .then((result) => {
      res.status(200).json({
        students: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// delete student
router.delete("/:id", checkAuth, (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const verify = jwt.verify(token, "institute mangmnt 123");

    Student.findById(req.params.id).then((student) => {
      // ✅ Check if student exists
      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      // ✅ Safe comparison (ObjectId vs string)
      if (String(student.uId) === String(verify.uId)) {
        Student.findByIdAndDelete(req.params.id)
          .then((result) => {
            // ✅ Handle Cloudinary deletion properly
            cloudinary.uploader.destroy(
              student.imageId,
              (error, deletedImage) => {
                if (error) {
                  return res.status(500).json({
                    message: "Error deleting image from Cloudinary",
                    error: error,
                  });
                }

                res.status(200).json({
                  message: "Student deleted successfully",
                  result: result,
                });
              }
            );
          })
          .catch((err) => {
            res.status(500).json({
              message: "Error deleting student",
              error: err.message,
            });
          });
      } else {
        // ✅ Correct status for unauthorized access
        res.status(403).json({
          message: "You are not authorized to delete this student",
        });
      }
    });
  } catch (err) {
    res.status(401).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
});

// update student
router.put("/:id", checkAuth, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const verify = jwt.verify(token, "institute mangmnt 123");
    console.log(verify.uId);

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (verify.uId != student.uId) {
      return res.status(403).json({
        error: "You are not authorized to update this student",
      });
    }

    if (req.files) {
      cloudinary.uploader.destroy(student.imageId, (deletedImage) => {
        cloudinary.uploader.upload(
          req.files.image.tempFilePath,
          (error, result) => {
            // Updated student
            const newUpdatedStudent = {
              fullName: req.body.fullName,
              phone: req.body.phone,
              email: req.body.email,
              address: req.body.startDate,
              courseId: req.body.endDate,
              uId: verify.uId, // ← Using correct token field
              imageURL: result.secure_url,
              imageId: result.public_id,
            };

            Student.findByIdAndUpdate(req.params.id, newUpdatedStudent, {
              new: true,
            })
              .then((data) => {
                res.status(200).json({
                  updatedStudent: data,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        );
      });
    } else {
      const updateData = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        courseId: req.body.courseId,
        uId: verify.uId, // ← Using correct token field
        imageURL: student.imageURL,
        imageId: student.imageId,
      };

      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.status(200).json({ updatedData: updatedStudent });
    }
  } catch (err) {
    console.error(err); // Helps you see the real error in console
    res.status(500).json({ error: err.message || "Unknown error" });
  }
});

// get latest 5 students data
router.get("/latest-students", checkAuth, (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const verify = jwt.verify(token, "institute mangmnt 123");

  Student.find({ uId: verify.uId })
    .sort({ $natural: -1 })
    .limit(5)
    .then((result) => {
      res.status(200).json({
        students: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
