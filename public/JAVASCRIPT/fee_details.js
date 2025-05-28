const form = document.getElementById('box');
const matter = document.getElementById('matter');
const feeSummary = document.getElementById('fee_summary');
const totalPaidEl = document.getElementById('total_paid');
const totalDueEl = document.getElementById('total_due');

document.querySelector('input[type="submit"]').addEventListener("click", (e) => {
  e.preventDefault();

  const stid = document.getElementById('student-id').value.trim();

  if (!stid) {
    alert("Student ID is required.");
    return;
  }

  console.log("Sending request for student ID:", stid);

  fetch('/fee-details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stid })
  })
    .then(response => {
      console.log("Response status:", response.status);
      return response.json();
    })
    .then((data) => {
      console.log("Received data:", data);

      if (!data || data.message) {
        alert(data.message || "Fee was not generated...");
        return;
      }

      form.style.display = 'none';
      matter.innerHTML = ''; // clear previous
      feeSummary.style.display = 'block'; // show summary box

      let feesHTML = '';
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

        feesHTML += `
          <div class="fee-card">
            <strong>Student-ID:</strong> ${fee.stid}<br>
            <strong>Room Number:</strong> ${fee.roomnumber || 'N/A'}<br>
            <strong>Month:</strong> ${fee.month}<br>
            <strong>Year:</strong> ${fee.year}<br>
            <strong>Amount:</strong> ₹${fee.amount}<br>
            <strong>Status:</strong> ${fee.status}<br>
            <strong>Generated date:</strong> ${new Date(fee.generatedOn).toLocaleDateString()}<br>
          </div>
        `;
      });

      matter.innerHTML = feesHTML;

      // Show totals in separate box
      totalPaidEl.innerHTML = `Total Paid: ₹${totalPaid}`;
      totalDueEl.innerHTML = `Total Due: ₹${totalDue}`;
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      alert("Something went wrong. Please try again.");
    });
});
