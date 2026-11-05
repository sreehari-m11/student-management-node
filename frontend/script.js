//Get all students

async function getStudents() {
    try {
        const response = await fetch('/students');
        const data = await response.json();
        displayStudents(data.students);
    } catch (error) {
        console.log(error);
        alert("Unable to connect to server");
    }
}

//display students
function displayStudents(students) {
    const table = document.getElementById('studentTable');
    table.innerHTML = "";
    students.forEach((student) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.age}</td>
                    <td>${student.course}</td>

                    <td>
                        <button class="edit-btn" onclick="editStudent(
                            ${student.id},
                            '${student.name}',
                            ${student.age},
                            '${student.course}',
                        )">
                            Edit
                        </button>

                        <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
                    </td>
        `
        table.appendChild(row);
    })
}

function clearForm() {
    document.getElementById("studentId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("course").value = "";
    document.getElementById("saveBtn").innerText = "Add student";
}

async function saveStudent() {
    const id = document.getElementById("studentId").value;
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const course = document.getElementById("course").value;

    //validation
    if (name === '' || age === '' || course === '') {
        alert("Please fill all the fields!");
        return;
    }

    const studentData = {
        name: name,
        age: Number(age),
        course: course
    };

    try {
        let response;


        //UPDATE
        if (id !== "") {
            response = await fetch(`/updatestudent/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            })
        }

        //ADD
        else {
            response = await fetch(`/addStudent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            })
        }

        const data = await response.json();
        alert(data.message);
        clearForm();
        getStudents();
    } catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
}

//Edit student
function editStudent(id, name, age, course) {
    document.getElementById("studentId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("age").value = age;
    document.getElementById("course").value = course;
    document.getElementById("saveBtn").innerText = "Update student";
}

//Delete student
async function deleteStudent(id) {

    let confirmDelete = confirm("Are you sure want to delete this student?");
    if (!confirmDelete) {
        return;
    }

    try {

        let response = await fetch(`/deletestudent/${id}`, {
            method: "DELETE"
        })
        let data = await response.json();
        alert(data.message);
        getStudents();
    } catch (error) {
        console.log(error);
        alert("Unable to delete this student")
    }
}

document.getElementById('saveBtn').addEventListener('click', saveStudent);
document.getElementById('clearBtn').addEventListener('click', clearForm);
document.getElementById('refreshBtn').addEventListener('click', getStudents);

getStudents();