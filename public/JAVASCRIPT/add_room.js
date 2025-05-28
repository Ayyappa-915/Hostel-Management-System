document.querySelector('input[type="submit"]').addEventListener( 'click', (e)=>{
    e.preventDefault();

    const roomnumber = document.getElementById('roomnumber').value;
        const capacity = document.getElementById('capacity').value;
        const available = document.getElementById('available').value;
        const floor = document.getElementById('floor').value;
        const type = document.getElementById('type').value;
        const cool = document.getElementById('cool').value;
        const occupy = document.getElementById('occupy').value;

        if (!roomnumber || !available || !capacity || !floor || !type || !cool || !occupy) {
            alert("Please fill all the fields.");
            return;
        }
    fetch('/add_room' , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomnumber , floor , capacity,available, type , cool , occupy})
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

})
