 //  !display password
 let passwordInput = document.getElementById("inputPassword5");
  let toggleIcon = document.querySelector(".togglePassword");

  toggleIcon.addEventListener("click", () => {
    let type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // بدّل شكل الأيقونة
    toggleIcon.classList.toggle("fa-eye");
    toggleIcon.classList.toggle("fa-eye-slash");
  });

// ! back ground animation
VANTA.NET({
  el: "#right",
   mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color: 0x3c5368,
  backgroundColor: 0x213448,
  points: 15.00,
  maxDistance: 27.00,
  spacing: 16.00
})


// !html elements
let userName = document.querySelector(".name");
let email = document.querySelector(".email");
let password = document.querySelector(".password");
let signUp = document.querySelector("button");
let sucess = document.querySelector(".done");
let erorr = document.querySelector(".erorr");


let allInfo = localStorage.getItem("allusers") ?
    JSON.parse(localStorage.getItem("allusers")) : [];

// ! functions
function addInfo() {
    let userInfo = {
        user: userName.value.trim(),
        userEmail: email.value.trim(),
        userPass: password.value,
    }
    // !checkif email here
    let finalEmail = false;
    for (let i = 0; i <= allInfo.length - 1; i++) {
        if (allInfo[i].userEmail === userInfo.userEmail) {
            finalEmail = true;
            break;
        }
    }
    if (finalEmail !== true) {

        allInfo.push(userInfo);

        // !local storage
        localStorage.setItem("allusers", JSON.stringify(allInfo));


        sucess.classList.remove("d-none");
        erorr.classList.add("d-none");
        cleanInput();
    } else {
        erorr.classList.remove("d-none");
        sucess.classList.add("d-none");
        cleanInput();
    }

}

function cleanInput() {
    userName.value = "";
    email.value = "";
    password.value = ""
}
// !events
signUp.addEventListener("click", function() {

    addInfo();
})