stud_student_details = () =>{
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src ='stud_student_details.html'
}
stud_room_details = () =>{
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src ='stud_room_details.html'
}
stud_allocated_room_details = () =>{
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src ='allocated_room.html'
}
stud_nonallocated_room_details = () =>{
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src ='non_allocated_room.html'
}
stud_fee_details = () =>{
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src ='stud_fee_details.html'
}
stud_exists_room_details = () =>{
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src ='room_details.html'
}
logout = () => {
    fetch('/student-logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.done) {
            alert(data.message);
            window.location.href = '/';
        } else {
            alert('Logout failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Logout Error:', error);
        alert('Something went wrong during logout.');
    });
};
