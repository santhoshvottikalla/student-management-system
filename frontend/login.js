// =========================================
// LOGIN
// =========================================

const API_URL = "http://127.0.0.1:8000";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");


loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    // Get form values
    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    // Data sent to FastAPI
    const loginData = {
        email: email,
        password: password
    };


    try {

        loginMessage.textContent = "Logging in...";


        // =========================================
        // SEND LOGIN REQUEST
        // =========================================

        const response = await fetch(
            `${API_URL}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(loginData)
            }
        );


        // Get backend response
        const data = await response.json();


        // =========================================
        // CHECK LOGIN
        // =========================================

        if (!response.ok) {

            throw new Error(
                data.detail || "Invalid email or password"
            );

        }


        // =========================================
        // SAVE JWT TOKEN
        // =========================================

        localStorage.setItem(
            "accessToken",
            data.access_token
        );


        // Save student ID
        localStorage.setItem(
            "studentId",
            data.student_id
        );


        // Save student name
        localStorage.setItem(
            "studentName",
            data.name
        );


        console.log(
            "Login successful"
        );

        console.log(
            "Token:",
            data.access_token
        );


        // =========================================
        // SUCCESS MESSAGE
        // =========================================

        loginMessage.textContent =
            "Login successful!";


        // =========================================
        // GO TO DASHBOARD
        // =========================================

        setTimeout(function () {

            window.location.href =
                "dashboard.html";

        }, 500);

    }


    catch (error) {

        console.error(
            "Login error:",
            error
        );


        loginMessage.textContent =
            error.message;

    }

});