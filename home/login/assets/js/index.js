//  !display password
 const passwordInput = document.getElementById("inputPassword5");
  const toggleIcon = document.querySelector(".togglePassword");

  toggleIcon.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // بدّل شكل الأيقونة
    toggleIcon.classList.toggle("fa-eye");
    toggleIcon.classList.toggle("fa-eye-slash");
  });
// !backgrond animation
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

// !HTML VARIABLES
var loginEmail=document.querySelector(".email");
var loginPass=document.querySelector(".pass");
var loginButton=document.querySelector("button");
var errorText=document.querySelector(".error");



// !js variabbles
// !functions
function login(){
    var userInfo={
        email:loginEmail.value,
        passwrd:loginPass.value,
        

    }
    var sucess=false;
var local=JSON.parse(localStorage.getItem("allusers")) ||[];
    for(i=0;i<=local.length-1;i++){
        if(local[i].userEmail===userInfo.email && local[i].userPass===userInfo.passwrd){
            sucess=true;
            
            break;
        }
    }
    if(sucess!==false){
        errorText.classList.add("d-none") ;
      
        
        
      window.location.replace("/");
    }
    else{
        clear();
       errorText.classList.remove("d-none") ;
    }

}
function clear(){
   loginEmail.value=""; 
   loginPass.value="";
}
// !EVENTS
loginButton.addEventListener("click", function() { 
    login();

})
