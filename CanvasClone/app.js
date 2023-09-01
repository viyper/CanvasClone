'use strict';
const express = require('express')
//require('dotenv').config()

const { getCoursesByUser, getCourseTeachers, getCourseAssignments } = require('./apiHelper.js')

const app = express()
const port = 3000

app.get('/dashboard', (req, res) => {
    res.sendFile('files/mainPage.html', { root: __dirname });
});
app.get('/style.css', (req, res) => {
    res.sendFile('files/style.css', { root: __dirname });
});

app.get('/mainScript.js', (req, res) => {
    res.sendFile('files/mainScript.js', { root: __dirname });
});
app.get('/', (req, res) => {
    res.sendFile('files/login.html', { root: __dirname });
});
app.get('/loginPage.js', (req, res) => {
    res.sendFile('files/loginPage.js', { root: __dirname });
});
app.get('/login.css', (req, res) => {
    res.sendFile('files/login.css', { root: __dirname });
});

app.get('/coursesByUser/:userID/', (req, res) => {
    getCoursesByUser(req.headers.domain, req.headers.token, req.params.userID)  .then(courses => {
        //console.log(courses);
        res.send(courses);
    }).catch(err => {
        console.error(err);
    });
});

app.get('/getCourseTeachers/:courseID/', (req, res) => {
    getCourseTeachers(req.headers.domain, req.headers.token, req.params.courseID).then(teachers => {
        //console.log(teachers);
        res.send(teachers);
    }).catch(err => {
        //console.error(err);
        res.send("error");
    });
});
app.get('/getCourseAssignments/:courseID/', (req, res) => {
    getCourseAssignments(req.headers.domain, req.headers.token, req.params.courseID).then(assignments => {
        //console.log(assignments);
        res.send(assignments);
    }).catch(err => {
        console.error(err);
    });
});
app.get('/getCourseByID/:courseID/', (req, res) => {
    getCourseByID(req.headers.domain, req.headers.token, req.paramas.courseID).then(course => {
        res.send(course);
    }).catch(err => {
        console.error(err);
    });
});


app.listen(port, () => {
    console.log(`Canvas app listening on port ${port}`);
});

/*console.log(process.env);

canvasAPI.getUsersInCourse(45960) // first argument is Canvas course ID
    .then(students => console.log(students))*/

console.log('Hello world');