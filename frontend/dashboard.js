// =========================================
// CHECK LOGIN
// =========================================

const studentId =
    localStorage.getItem("studentId");


if (!studentId) {

    window.location.href = "login.html";

}

const API_URL = "http://127.0.0.1:8000";


// =========================================
// ELEMENTS
// =========================================

const tableBody =
    document.getElementById(
        "studentTableBody"
    );


const studentCount =
    document.getElementById(
        "studentCount"
    );


const message =
    document.getElementById(
        "message"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const branchFilter =
    document.getElementById(
        "branchFilter"
    );


// =========================================
// DATA
// =========================================

let students = [];

let currentPage = 1;

const studentsPerPage = 5;


// =========================================
// LOAD STUDENTS
// =========================================

async function loadStudents() {

    try {

        const token =
            localStorage.getItem(
                "accessToken"
            );


        const response =
            await fetch(
                `${API_URL}/students`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch students"
            );

        }


        const data =
            await response.json();


        students =
            data.students || [];


        studentCount.textContent =
            students.length;


        currentPage = 1;


        filterStudents();

    }

    catch (error) {

        console.error(error);

        message.textContent =
            "Unable to load students.";

    }

}


// =========================================
// FILTER STUDENTS
// =========================================

function filterStudents() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedBranch =
        branchFilter.value;


    const filteredStudents =
        students.filter(
            function(student) {

                const name =
                    String(student.name)
                        .toLowerCase();


                const email =
                    String(student.email)
                        .toLowerCase();


                const matchesSearch =
                    name.includes(searchText)
                    ||
                    email.includes(searchText);


                const matchesBranch =
                    selectedBranch === "all"
                    ||
                    student.branch ===
                    selectedBranch;


                return (
                    matchesSearch &&
                    matchesBranch
                );

            }
        );


    displayStudents(
        filteredStudents
    );

}


// =========================================
// DISPLAY STUDENTS
// =========================================

function displayStudents(studentList) {

    tableBody.innerHTML = "";


    // No students

    if (studentList.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="no-data"
                >
                    No students found
                </td>

            </tr>

        `;


        renderPagination(0);

        return;

    }


    // =====================================
    // PAGINATION
    // =====================================

    const totalPages =
        Math.ceil(
            studentList.length /
            studentsPerPage
        );


    if (currentPage > totalPages) {

        currentPage =
            totalPages;

    }


    const startIndex =
        (currentPage - 1) *
        studentsPerPage;


    const endIndex =
        startIndex +
        studentsPerPage;


    const currentStudents =
        studentList.slice(
            startIndex,
            endIndex
        );


    // =====================================
    // TABLE
    // =====================================

    currentStudents.forEach(
        function(student, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${startIndex + index + 1}
                </td>

                <td>
                    ${escapeHTML(student.name)}
                </td>

                <td>
                    ${escapeHTML(student.email)}
                </td>

                <td>
                    ${student.age}
                </td>

                <td>
                    ${escapeHTML(student.branch)}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editStudent(${student.id})"
                    >
                        Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteStudent(${student.id})"
                    >
                        Delete
                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );


    renderPagination(totalPages);

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


// =========================================
// PAGINATION
// =========================================

function renderPagination(totalPages) {

    let pagination =
        document.getElementById(
            "pagination"
        );


    pagination.innerHTML = "";


    if (totalPages <= 1) {

        return;

    }


    // Previous

    const previousButton =
        document.createElement(
            "button"
        );


    previousButton.textContent =
        "Previous";


    previousButton.disabled =
        currentPage === 1;


    previousButton.onclick =
        function() {

            if (currentPage > 1) {

                currentPage--;

                filterStudents();

            }

        };


    pagination.appendChild(
        previousButton
    );


    // Page numbers

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            document.createElement(
                "button"
            );


        pageButton.textContent =
            page;


        if (page === currentPage) {

            pageButton.classList.add(
                "active-page"
            );

        }


        pageButton.onclick =
            function() {

                currentPage =
                    page;

                filterStudents();

            };


        pagination.appendChild(
            pageButton
        );

    }


    // Next

    const nextButton =
        document.createElement(
            "button"
        );


    nextButton.textContent =
        "Next";


    nextButton.disabled =
        currentPage === totalPages;


    nextButton.onclick =
        function() {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                filterStudents();

            }

        };


    pagination.appendChild(
        nextButton
    );

}


// =========================================
// SEARCH
// =========================================

searchInput.addEventListener(
    "input",
    function() {

        currentPage = 1;

        filterStudents();

    }
);


// =========================================
// BRANCH FILTER
// =========================================

branchFilter.addEventListener(
    "change",
    function() {

        currentPage = 1;

        filterStudents();

    }
);


// =========================================
// EDIT
// =========================================

function editStudent(id) {

    window.location.href =
        `student.html?id=${id}`;

}


// =========================================
// DELETE
// =========================================

async function deleteStudent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {

        return;

    }


    try {

       const token =
            localStorage.getItem(
                "accessToken"
            );


        const response =
            await fetch(
                `${API_URL}/students/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Delete failed"
            );

        }


        message.textContent =
            "Student deleted successfully.";


        await loadStudents();

    }

    catch (error) {

        console.error(error);

        message.textContent =
            error.message;

    }

}

// =========================================
// LOGOUT
// =========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "accessToken"
            );

            localStorage.removeItem(
                "studentId"
            );

            localStorage.removeItem(
                "studentName"
            );


            window.location.href =
                "login.html";

        }
    );

}

// =========================================
// INITIAL LOAD
// =========================================

loadStudents();