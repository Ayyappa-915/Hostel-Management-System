const details = document.getElementById('room_details');
const totalPaidEl = document.getElementById('total_paid');
const totalDueEl = document.getElementById('total_due');
const summary = document.getElementById('fee_summary');

fetch("/stud-fee-details")
  .then(response => response.json())
  .then((data) => {
    details.innerHTML = '';
    totalPaidEl.innerHTML = '';
    totalDueEl.innerHTML = '';

    if (Array.isArray(data.fees) && data.fees.length > 0) {
      let totalPaid = 0;
      let totalDue = 0;

      data.fees.forEach(fee => {
        const amount = Number(fee.amount);
        const status = fee.status.trim().toLowerCase();

        if (status === 'paid') {
          totalPaid += amount;
        } else if (status === 'due') {
          totalDue += amount;
        }

        details.innerHTML += `
          <div class="room-box">
            <strong>Student-ID:</strong> ${fee.stid}<br>
            <strong>Room Number:</strong> ${fee.roomnumber}<br>
            <strong>Month:</strong> ${fee.month}<br>
            <strong>Year:</strong> ${fee.year}<br>
            <strong>Amount:</strong> ₹${fee.amount}<br>
            <strong>Status:</strong> ${fee.status}<br>
            <strong>Generated date:</strong> ${new Date(fee.generatedOn).toLocaleDateString()}<br><br>
          </div>
        `;
      });

      // Set totals in separate elements
      totalPaidEl.innerHTML = `Total Paid: ₹${totalPaid}`;
      totalDueEl.innerHTML = `Total Due: ₹${totalDue}`;
    } else {
      details.style.display='none';
      totalDueEl.style.display='none';
      totalPaidEl.style.display='none';
      summary.innerHTML = `Fee was Not Generated`;
    }
  })
  .catch((error) => {
    console.error(error);
    details.innerHTML = `<div class="room-box">An error occurred while fetching fee data.</div>`;
  });
