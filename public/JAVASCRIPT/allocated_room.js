const rooms = document.getElementById('room_details');

fetch('/allocated_room')
  .then(response => response.json())
  .then((data) => {
    if (data.length === 0) {
      rooms.innerHTML = `<h2> No Allocated Rooms are Found... </h2>`;
      return;
    }
    rooms.innerHTML = '';

    data.forEach(room => {
      rooms.innerHTML += `
        <div class="room-box">
          <strong>Room Number:</strong> ${room.roomnumber}<br>
          <strong>Floor:</strong> ${room.floor}<br>
          <strong>Capacity:</strong> ${room.capacity}<br>
          <strong>Available:</strong> ${room.available}<br>
          <strong>Type:</strong> ${room.type}<br>
          <strong>Cooling:</strong> ${room.cool}<br>
          <strong>Occupy:</strong> ${room.occupy}<br><br>
        </div>
      `;
    });
  })
  .catch((error) => {
    rooms.innerHTML = "Error while fetching Allocated Room Details...";
    console.log(error);
  });
  
