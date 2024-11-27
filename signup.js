
let arr = []

function getData() {
    let fullname = document.getElementById("fullName").value;
    console.log(fullname.value)
    let user = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("confirmPassword").value; 


    let obj = {};
    obj.fullname = fullname;
    obj.username = user;
    obj.email = email;
    obj.password = pass;

    console.log(obj)
    arr.push(JSON.stringify(obj));
    console.log(arr);


    localStorage.setItem("MyData", arr);
}
