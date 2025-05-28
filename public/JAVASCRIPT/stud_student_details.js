
const matter=document.getElementById('container')

fetch('/stud_student_details')
.then(response => response.json())
.then((data)=>{
    if(!data)
    {
        resizeBy.json({message:'Student was not Registered...'});
        return ;
    }
    matter.innerHTML=`
    <h2>Student Personal Details</h2>
    <div class="matter">
        <strong>Student-Id:</strong> ${data.stid} <br>
        <strong>First Name:</strong> ${data.fname} <br>
        <strong>Last Name:</strong> ${data.lname} <br>
        <strong>Gender:</strong> ${data.gender} <br>
        <strong>Date of Birth:</strong> ${data.dob} <br>
        <strong>Email:</strong> ${data.email} <br>
        <strong>Phone Number:</strong> ${data.phno} <br>
        <strong>Address:</strong> ${data.address} <br>
    </div>
    `;
    matter.style.display='block';
})
.catch((error)=>{
    console.error('Error:',error);
    alert("An error occurred while fetching student details.");
})