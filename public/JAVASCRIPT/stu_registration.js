document.querySelector('input[type="submit"]').addEventListener('click', (e) => {
    e.preventDefault();

    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.id || '';
    const dob = document.getElementById('dob').value;
    const stid = document.getElementById("student-id").value;
    const phno = document.getElementById('phno').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;


    if (!fname || !lname || !gender || !dob || !stid || !phno || !email || !address) {
        alert("All Fields are required....");
        return;
    }

    fetch('stu_registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fname, lname, gender, dob, stid, phno, email, address })
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
        alert(error.message);
    });
});
