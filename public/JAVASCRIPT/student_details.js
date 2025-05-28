const matter = document.getElementById('matter');
const form = document.getElementById('form');

document.querySelector('input[type="submit"]').addEventListener("click", (e) => {
    e.preventDefault();

    const stid = document.getElementById('student-id').value;
    if (!stid) {
        alert("All Fields are required...");
        return;
    }

    fetch('/student_details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stid })
    })
    .then(response => response.json())
    .then((data) => {
        if (data.message == 'Student not registered') {
            alert(data.message);
            return;
        }

        const student = data.studentDetails;
        const room = data.roomDetails;

        form.style.display = 'none';
        matter.style.display = 'block';

        if (room) {
            matter.innerHTML = `
                <h2>Student Details</h2>
                <div class="student-box">
                    <strong>Student-Id:</strong> ${student.stid} <br>
                    <strong>First Name:</strong> ${student.fname} <br>
                    <strong>Last Name:</strong> ${student.lname} <br>
                    <strong>Date of Birth:</strong> ${student.dob} <br>
                    <strong>Email:</strong> ${student.email} <br>
                    <strong>Phone Number:</strong> ${student.phno} <br>
                    <strong>Address:</strong> ${student.address} <br>
                    <strong>Room Number:</strong> ${room.roomnumber} <br>
                    <strong>Floor Number:</strong> ${room.floor} <br>
                    <strong>Date of Room Allocation:</strong> ${room.allocated_date}
                </div>
            `;
        } 
        else 
        {
            matter.innerHTML = `
                <h2>Student Details</h2>
                <div class="student-box">
                    <strong>Student-Id:</strong> ${student.stid} <br>
                    <strong>First Name:</strong> ${student.fname} <br>
                    <strong>Last Name:</strong> ${student.lname} <br>
                    <strong>Date of Birth:</strong> ${student.dob} <br>
                    <strong>Email:</strong> ${student.email} <br>
                    <strong>Phone Number:</strong> ${student.phno} <br>
                    <strong>Address:</strong> ${student.address} <br>
                    <strong style="color:red;">No Room Allocated</strong>
                </div>
            `;
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while fetching student details.");
    });
});
