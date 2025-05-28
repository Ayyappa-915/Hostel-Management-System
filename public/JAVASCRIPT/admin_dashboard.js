


stu_registration = () => {
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src = 'stu_registration.html';
};
add_room = () => {
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src = 'add_room.html';
};
allocated_room = () => {
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src = 'allocated_room.html';
};
non_allocated_room = () => {
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src = 'non_allocated_room.html';
};
room_allocation = () => {
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src = 'room_allocation.html';
};
room_deallocation = () => {
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src = 'room_deallocation.html';
};
student_details = () => {
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src = 'student_details.html';
};
room_details = () => {
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src = 'room_details.html';
};
logout = () => {
    fetch('/admin-logout', {
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
generated_fee_details = () => {
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src = 'generated_fee.html';
}
student_fee_details = () => {
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src = 'fee_details.html';
}
fee_payment = () => {
    document.getElementById("right").style.display = 'none';
    document.getElementById('contentFrame').src = 'fee_payment.html';
}