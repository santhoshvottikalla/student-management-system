const API_URL = "http://127.0.0.1:8000";


// =========================================
// ELEMENTS
// =========================================

const form =
    document.getElementById("studentForm");

const formTitle =
    document.getElementById("formTitle");

const submitButton =
    document.getElementById("submitButton");

const message =
    document.getElementById("message");


// =========================================
// URL PARAMETER
// =========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const studentId =
    urlParams.get("id");


// =========================================
// EDIT MODE
// =========================================

if (studentId) {

    formTitle.textContent =
        "Edit Student";

    submitButton.textContent =
        "Update Student";

    loadStudent(studentId);

}


// =========================================
// LOAD STUDENT
// =========================================

async function loadStudent(id) {

    try {

        const token =
            localStorage.getItem(
                "accessToken"
            );


        const response =
            await fetch(
                `${API_URL}/students/${id}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Student not found"
            );

        }


        const student =
            await response.json();


        document.getElementById("name").value =
            student.name;

        document.getElementById("email").value =
            student.email;

        document.getElementById("age").value =
            student.age;

        document.getElementById("branch").value =
            student.branch;


    }

    catch (error) {

        console.error(error);

        message.textContent =
            "Unable to load student.";

    }

}


// =========================================
// FORM SUBMIT
// =========================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        const age =
            parseInt(
                document
                    .getElementById("age")
                    .value
            );


        const branch =
            document
                .getElementById("branch")
                .value;


        const student = {

            name: name,

            email: email,

            password: password,

            age: age,

            branch: branch

        };


        try {

            let response;


            // =================================
            // EDIT
            // =================================

            if (studentId) {

               const token =
                    localStorage.getItem(
                        "accessToken"
                    );


                response =
                    await fetch(
                        `${API_URL}/students/${studentId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body:
                                JSON.stringify(student)
                        }
                    );

            }


            // =================================
            // REGISTER
            // =================================

            else {

                response =
                    await fetch(
                        `${API_URL}/students`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(student)
                        }
                    );

            }


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Something went wrong"
                );

            }


            // =================================
            // SUCCESS
            // =================================

            if (studentId) {

                message.textContent =
                    "Student updated successfully.";

            }

            else {

                message.textContent =
                    "Student registered successfully.";

                form.reset();

            }


            setTimeout(
                function() {

                    window.location.href =
                        "dashboard.html";

                },
                1000
            );


        }

        catch (error) {

            console.error(error);

            message.textContent =
                error.message;

        }

    }
);