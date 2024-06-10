function validatePasswords() {
    var password = document.getElementById("pass").value;
    var confirmPassword = document.getElementById("conform_pass").value;
    var errorMessage = document.getElementById("error-message");

    if (password !== confirmPassword) {
        errorMessage.textContent = "Please check your password.";
        return false; 
    }
    errorMessage.textContent = "";
    return true; 
 }

// for allignment
const signButton = document.getElementById('Sign');
const mainDiv = document.querySelector('.main-div');
const loginButton = document.getElementById('login');

signButton.addEventListener('click', () => {
  mainDiv.classList.remove('show-login');
  mainDiv.classList.add('show-signup');

});
loginButton.addEventListener('click', () => {
    mainDiv.classList.remove('show-signup');
    mainDiv.classList.add('show-login');
});

let eyeicons = document.querySelectorAll(".eye-icon");
let passwords = document.querySelectorAll(".password");

eyeicons.forEach((eyeicon, index) => {
    eyeicon.addEventListener('click', () => {
        if (passwords[index].type === "password") {
            passwords[index].type = "text";
            eyeicon.src = "images/eye-open.png";
        } else {
            passwords[index].type = "password";
            eyeicon.src = "images/eye-close.png";
        }
    });
});
