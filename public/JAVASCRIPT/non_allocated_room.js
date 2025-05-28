const rooms = document.getElementById('room_details');

fetch('/non_allocated_room')
  .then(response => response.json())
  .then((data) => {
    if (data.length === 0) {
      rooms.innerHTML = `<h2> Non Allocated Rooms are not Found... </h2> <h2> All rooms are occupied </h2>`;
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
    rooms.innerHTML = "Error while fetching NOn Allocated Room Details...";
    console.log(error);
  });
  
