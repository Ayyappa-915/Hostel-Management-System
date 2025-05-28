
const matter=document.getElementById('container')

fetch('/stud_room_details')
.then(response => response.json())
.then((data)=>{
    if(!data)
    {
        resizeBy.json({message:'Room was Not Allocated...'});
        return ;
    }
    const rad=data.room_allocation_details;
    const rd=data.room_details;
    matter.style.display='block';
    matter.innerHTML=`
    <h2>Student Room Details</h2>
    <div class="matter">
        <strong>Student-Id:</strong> ${rad.stid} <br>
        <strong>Room Number:</strong> ${rad.roomnumber} <br>
        <strong>Floor Number:</strong> ${rad.floor} <br>
        <strong>Capacity:</strong> ${rd.capacity} <br>
        <strong>Available vacancies:</strong> ${rd.available} <br>
        <strong>Bed Type:</strong> ${rd.type} <br>
        <strong>AC / NON-AC type:</strong> ${rd.cool} <br>
        <strong>Date of Room Allocation:</strong> ${rad.allocated_date} <br>
    </div>
    `;
})
.catch((error)=>{
    console.error('Error:',error);
    alert("An error occurred while fetching student details.");
})