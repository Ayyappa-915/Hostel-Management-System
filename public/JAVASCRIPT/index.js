

adminlogin = () =>{
    const uname=document.getElementById("uname").value;
    const pwd=document.getElementById("pwd").value;
    if(!uname || !pwd) { 
        alert("All Fields are required...");
        adminreset();
        return ;
     }
    fetch('/admin-login',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uname, pwd })
    })
    .then(response=>response.json())
    .then((result)=>{
        if(result.done)
        {
            window.location.href='admin_dashboard.html';
        }
        if(!result.done)
        {
            alert(result.message)
            adminreset();
        }
    })
    .catch((error)=>{
        alert(error.message)
    })
}
adminreset = () =>{
    document.getElementById("uname").value='';
    document.getElementById("pwd").value='';
}
studentreset=()=>{
    document.getElementById("student-id").value='';
    document.getElementById("dob").value='';
}

studentlogin = () =>{
    const stid=document.getElementById("student-id").value;
    const dob=document.getElementById("dob").value;
    if(!stid || !dob) { 
        alert("All Fields are required...");
        studentreset();
        return ;
     }
    fetch('/student-login',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stid , dob })
    })
    .then(response=>response.json())
    .then((result)=>{
        if(result.done)
        {
            window.location.href='student_dashboard.html';
        }
        if(!result.done)
        {
            alert(result.message)
            studentreset();
        }
    })
    .catch((error)=>{
        alert(error.message)
    })
}