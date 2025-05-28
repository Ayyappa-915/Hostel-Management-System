const details = document.getElementById('room_details');

fetch("/generated-fee")
  .then(response => response.json())
  .then((data) => {
    details.innerHTML = '';

    if (Array.isArray(data.fees) && data.fees.length > 0) {
      data.fees.forEach(fee => {
        details.innerHTML += `
          <div class="room-box">
            <strong>Student-ID:</strong> ${fee.stid}<br>
            <strong>Room Number:</strong> ${fee.roomnumber}<br>
            <strong>Month:</strong> ${fee.month}<br>
            <strong>Year:</strong> ${fee.year}<br>
            <strong>Amount:</strong> ${fee.amount}<br>
            <strong>Status:</strong> ${fee.status}<br>
            <strong>Generated date:</strong> ${fee.generatedOn}<br><br>
          </div>
        `;
      });
    } else {
      details.innerHTML = `<div class="room-box">Fee was Not Generated</div>`;
    }
  })
  .catch((error) => {
    console.error(error);
    details.innerHTML = `<div class="room-box">An error occurred while fetching fee data.</div>`;
  });
