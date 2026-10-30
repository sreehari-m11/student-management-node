const http = require('http');
const fs = require('fs');
const path = require('path');

let students = [
    {
        id: 1,
        name: 'Anjali',
        age: 24,
        course: 'MERN'
    },
    {
        id: 2,
        name: 'Ajay',
        age: 22,
        course: 'Python'
    }
];

const server = http.createServer((req, res) => {

    //serve frontend files
    //index.html
    if (req.url === '/' && req.method === "GET") {
        fs.readFile(path.join(__dirname, '../frontend/index.html'),
            (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end("Error reading index.html");
                    return;
                }
                res.setHeader('Content-Type', 'text/html');
                res.end(data);
            })
        return;
    }

    //style.css
    if (req.url === '/style.css' && req.method === "GET") {
        fs.readFile(path.join(__dirname, '../frontend/style.css'),
            (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end("Error reading style.css");
                    return;
                }
                res.setHeader('Content-Type', 'text/css');
                res.end(data);
            })
        return;
    }

    //js file
    if (req.url === '/script.js' && req.method === "GET") {
        fs.readFile(path.join(__dirname, '../frontend/script.js'),
            (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end("Error reading script.js");
                    return;
                }
                res.setHeader('Content-Type', 'text/javascript');
                res.end(data);
            })
        return;
    }

    res.setHeader("Content-Type", "application/json");
    //GET - get all stusents
    if (req.url === '/students' && req.method === "GET") {
        res.statusCode = 200;
        res.end(JSON.stringify({
            message: "Students data fetched successfuly",
            students: students
        }))
    }
    //Get students by id
    else if (req.url.startsWith('/students/') && req.method === "GET") {
        const id = parseInt(req.url.split('/')[2])
        const student = students.find((student) => student.id == id);
        if (!student) {
            res.statusCode = 404;
            res.end(JSON.stringify({
                message: "Student not found"
            }))
            return;
        }
        res.statusCode = 200;
        res.end(JSON.stringify(
            {
                message: "Student found",
                student: student
            }
        ))
    }
    //add new student
    else if (req.url === '/addStudent' && req.method === "POST") {
        let body = "";
        req.on('data', (chunk) => {
            body += chunk.toString()
        });
        req.on("end", () => {
            const newStudent = JSON.parse(body);
            const student = {
                id: students.length + 1,
                name: newStudent.name,
                age: newStudent.age,
                course: newStudent.course
            }
            students.push(student);
            res.statusCode = 200;
            res.end(
                JSON.stringify({
                    message: "Student added successfuly",
                    student: student
                })
            )
        })
    }

    //update
    else if (req.url.startsWith('/updatestudent/') && req.method === 'PUT') {
        const id = parseInt(req.url.split('/')[2]);
        let body = '';
        req.on("data", (chunk) => {
            body += chunk.toString();
        })
        req.on('end', () => {
            const updateData = JSON.parse(body);
            const studentIndex = students.findIndex((student) => student.id === id);
            if (studentIndex === -1) {
                res.statusCode = 404;
                res.end(JSON.stringify({
                    message: "Student not found"
                }))
                return;
            }
            students[studentIndex].name = updateData.name;
            students[studentIndex].age = updateData.age;
            students[studentIndex].course = updateData.course;
            res.statusCode = 200;
            res.end(JSON.stringify({
                message: "Student data updated",
                student: students[studentIndex]
            }))
        })
    }

    //delete
    else if (req.url.startsWith('/deletestudent/') && req.method === "DELETE") {
        const id = parseInt(req.url.split('/')[2]);
        const studentIndex = students.findIndex((student) => student.id === id);
        if (studentIndex === -1) {
            res.statusCode = 404;
            res.end(JSON.stringify({
                message: "Student not found"
            }))
            return;
        }
        const deletedStudent = students.splice(studentIndex, 1);
        res.statusCode = 200;
        res.end(JSON.stringify({
            message: "Student deleted",
            deletedStudent: deletedStudent[0]
        }))
    }

    //invalid route
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({
            message: "Invalid route"
        }))
    }

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
})
