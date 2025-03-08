/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Happy Akter Student ID: 170933238 Date: 08/03/2025
*
********************************************************************************/ 
 
var express = require("express"); // Importing Express framework
const collegedata = require('./modules/collegeData.js'); // Importing college data module
var app = express(); // Initializing Express app
var HTTP_PORT = process.env.PORT || 3000; // Setting port for the server
var path = require("path"); // Importing path module for handling file paths

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serving static files from the 'views' directory
app.use(express.static(path.join(__dirname, '/views')));
// Serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/public')));

// Route for home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/home.html'); // Sending home.html file
});

// Route for about page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html')); // Sending about.html file
});

// Route for HTML demo page
app.get("/htmlDemo", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html')); // Sending htmlDemo.html file
});

// Route to get students with optional course filter
app.get("/students", (req, res) => {
  var course = req.query.course; // Getting course query parameter
  if (typeof course !== 'undefined') { 
      collegedata.getStudentsByCourse(course).then(studentData => {
          res.send(studentData); // Sending student data filtered by course
      });
  } else {
      collegedata.getAllStudents().then(studentData => {
          res.send(studentData); // Sending all student data if no course filter
      });
  }
});

// Route to get Teaching Assistants (TAs)
app.get("/tas", (req, res) => {
    collegedata.getTAs().then(taData => {
      res.send(taData); // Sending TA data
    });
});

// Route to get all courses
app.get("/courses", (req, res) => {
    collegedata.getCourses().then(courseData => {
      res.send(courseData); // Sending course data
    });
});

// Route to get a student by student number
app.get("/student/:num", (req, res) => {
    const num = parseInt(req.params.num); // Extracting student number from URL parameter
    collegedata.getStudentByNum(num).then(studentData => {
      res.send(studentData); // Sending specific student data
    });
});

// Route for Add Student page
app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addStudent.html')); // Sending addStudent.html file
});

// Route to handle adding a new student
app.post("/students/add", (req, res) => {
    collegedata.addStudent(req.body).then(() => {
        res.redirect("/students"); // Redirecting to students list after adding a student
    }).catch(err => {
        res.send("Error adding student: " + err); // Sending error message if student not added
    });
});

// Catch-all route for undefined paths (404 error handling)
app.get('*', (req, res) => {
    res.status(404).send('Error 404 - page not found'); // Sending 404 error message
});

// Starting server on the specified port
app.listen(HTTP_PORT, () => {
  console.log(`Server listening on port ${HTTP_PORT}`); // Logging server start message
  collegedata.initialize(); // Initializing college data module
});