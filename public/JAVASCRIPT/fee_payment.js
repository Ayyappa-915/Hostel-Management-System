document.querySelector('input[type="submit"]').addEventListener('click', function () {
    const stid = document.getElementById('stid').value;
    const roomnumber = document.getElementById('roomnumber').value;
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);
    const amount = parseInt(document.getElementById('amount').value);

    if (!stid || !roomnumber || !month || !year || !amount) {
        alert("Please fill in all fields.");
        return;
    }

    fetch('/pay-fee', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stid,roomnumber, month, year,amount })
    })
    .then(res => res.json())
    .then(data => {
        if(data)
        {
            alert(data.message);
            window.top.location.href='admin_dashboard.html';
        }
    })
    .catch(err => {
        alert("Error: " + err.message);
    });
});
