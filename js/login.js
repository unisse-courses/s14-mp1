const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));
signInButton.addEventListener('click', () => container.classList.remove('right-panel-active'));

var regValid = false;
var regName = "";
var regId = "";
var regPass1 = "";
var regPass2 = "";

$("#signUpBtn").click(function(){
    regName = $("#regName").val();
    regId = $("#regId").val();
    regPass1 = $("#regPass1").val();
    regPass2 = $("#regPass2").val();

    if(regName === "") $("#regName").css("border", "1px solid red");
    else $("#regName").css("border", "0px");

    if(regId === "") $("#regId").css("border", "1px solid red");
    else $("#regId").css("border", "0px");
    
    if(regPass1 === "" && regPass2 === ""){
        $("#regPass1").css("border", "1px solid red");
        $("#regPass2").css("border", "1px solid red");
    }
    else if(regPass1 === ""){
        $("#regPass1").css("border", "1px solid red");
        alert("Provide a password");
    }
    else if(regPass2 === ""){
        $("#regPass2").css("border", "1px solid red");
        alert("Confirm your password");
    }
    
    else if(regPass1 !== regPass2){
        $("#regPass1").css("border", "1px solid red");
        $("#regPass2").css("border", "1px solid red");
        alert("Password mismatch! Please try again!!");
    }
    else{
        $("#regPass1").css("border", "0px");
        $("#regPass2").css("border", "0px");
        alert("Hi " + regName + "! Your account for ID: " + regId + " has been created. Please sign in now.");
        regValid = true;
    }
});

$("#signInBtn").click(function(){
    var siId = $("#siId").val();
    var siPass = $("#siPass").val();

    if((regName === "" || regId === "" || regPass1 === "" || regPass2 === "") && regValid === false){
        alert("Please register for an account first!");
    }
    else if(regId === siId){
        if(regPass1 === siPass){
            alert("Hi " + siId + "! Welcome to the DLSU Community Forum!");
            window.location.replace("home.html");
        }
        else alert("Password is incorrect or might have been changed! Please sign-up again.");
    }
    else alert("Account not found. Please register for an account!");
});