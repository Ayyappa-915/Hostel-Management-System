const matter = document.getElementById('matter');
const form = document.getElementById('form');

document.querySelector('input[type="submit"]').addEventListener("click", (e) => {
    e.preventDefault();

    const roomnumber = document.getElementById('roomnumber').value;
    const floor = document.getElementById('floor').value;

    if (!roomnumber || !floor) {
        alert("All Fields are required...");
        return;
    }

    fetch('/room_details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomnumber, floor })
    })
    .then(response => response.json())
    .then((data) => {
        matter.innerHTML = '';
        if (data.message == 'Rooms are not available for this Room Number and Floor Number') {
            alert(data.message);
            return ;
        }

        const rd = data.room_details;
        const ad = data.allocation_details;

        form.style.display = 'none';
        matter.style.display = 'block';

        let html = `
            <div class="room-box">
                <strong>Room Number:</strong> ${rd.roomnumber}<br>
                <strong>Floor:</strong> ${rd.floor}<br>
                <strong>Capacity:</strong> ${rd.capacity}<br>
                <strong>Available:</strong> ${rd.available}<br>
                <strong>Type:</strong> ${rd.type}<br>
                <strong>Cooling:</strong> ${rd.cool}<br>
                <strong>Occupy:</strong> ${rd.occupy}<br><br>
        `;

        if (ad && ad.length > 0) {
            ad.forEach(student => {
                html += `<strong>Student-ID:</strong> ${student.stid}<br>`;
                html += `<strong>Date of Allocation:</strong> ${student.allocated_date}<br><br>`;
            });
        } else {
            html += `<strong style="color:red;">This room is not allocated to any student.</strong>`;
        }

        html += '</div>';
        matter.innerHTML = html;
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while fetching room details.");
    });
});
