document.querySelector('input[type="submit"]').addEventListener("click", (e) => {
    e.preventDefault();

    const roomnumber = document.getElementById('roomnumber').value;
    const floor = document.getElementById('floor').value;
    const studentid = document.getElementById('student-id').value;
    const date = document.getElementById('date').value;

    if (!roomnumber || !floor || !studentid || !date) {
        alert("All fields are required for room deallocation.");
        return;
    }

    fetch('room_deallocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomnumber, floor, studentid, date })
    })
    .then(response => response.json())
    .then((result) => {
        alert(result.message);
        if (result.done) {
            window.top.location.href = 'admin_dashboard.html';
        }
        else
        {
            window.top.location.href = 'admin_dashboard.html';
        }
    })
    .catch((error) => {
        alert('Error: ' + error.message);
    });
});
