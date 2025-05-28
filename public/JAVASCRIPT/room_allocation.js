document.querySelector('input[type="submit"]').addEventListener("click",(e)=>{
    e.preventDefault();
    const roomnumber=document.getElementById('roomnumber').value;
    const floor = document.getElementById('floor').value;
    const stid = document.getElementById('student-id').value;
    const allocated_date = document.getElementById('date').value;

    if(!roomnumber || !floor || !stid || !allocated_date)
    {
        alert("All Fields are Required....");
        return ;
    }
    fetch('room_allocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomnumber , floor , stid , allocated_date })
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
    })
})
