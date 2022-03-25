const firebaseConfig = {
    apiKey: "AIzaSyAJj6Z-kMC94FeLTY5aiEZ4NHhAklOcLnU",
    authDomain: "tour-guru-25442.firebaseapp.com",
    projectId: "tour-guru-25442",
    storageBucket: "tour-guru-25442.appspot.com",
    messagingSenderId: "1086343389478",
    appId: "1:1086343389478:web:a40eb9435a26b42a7021e7"
};
  
const firebaseApp = firebase.initializeApp(firebaseConfig);
let provider = new firebase.auth.GoogleAuthProvider();

let errorModal = document.getElementById("error-modal");
let signUpForm = document.getElementById("sign-up-form");
let signInForm = document.getElementById("sign-in-form");
let btnSignUp = document.getElementById("btn-sign-up-submit");
let btnSignIn = document.getElementById("btn-sign-in-submit");
let errorText = document.querySelector("#sign-up-error-modal #modal-error-content");
let signInErrorText = document.querySelector("#sign-in-error-modal #modal-error-content");
let biz_id;

window.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem("headerInfo", null);
    
    initializeEventListeners();

    if (window.location.search.includes("flight_confirmation")
    || window.location.search.includes("hotel_confirmation")) {
        
        Swal.fire({
            icon: 'error',
            text: "You need to login to complete the booking process."
        });
    }
})

const validateAndSignUp = () => {
    //Hide all invalid
    signUpForm.querySelectorAll(".invalid-text").forEach(input => {
        if (input.classList.contains("opacity-1")) {
            input.classList.remove("opacity-1");
        }
    })

    signUpForm.querySelectorAll("div div input").forEach(input => {
        if (input.classList.contains("wrong-input")) {
            input.classList.remove("wrong-input");
        }
    })

    errorText.innerHTML = "";

    //Get input
    let email = document.getElementById("sign-up-email").value;
    let password = document.getElementById("sign-up-password").value;
    let confirmPassword = document.getElementById("sign-up-confirm-password").value;
    let businessName = document.getElementById("sign-up-business").value;
    let businessType = parseInt(document.getElementById("sign-up-business-type").value);

    if (businessName.length == 0) {
        let businessNameInvalid = signUpForm.querySelector("#name-invalid");
        let businessNameInput = signUpForm.querySelector("#sign-up-business");
        if (!businessNameInvalid.classList.contains("opacity-1"))
            businessNameInvalid.classList.add("opacity-1");
        if (!businessNameInput.classList.contains("wrong-input"))
            businessNameInput.classList.add("wrong-input");
        swal.close();
        Swal.fire({
            icon: 'error',
            text: "Please type in your business name."
        });
        return;
    }

    if (email.length == 0) {
        let emailInvalid = signUpForm.querySelector("#email-invalid");
        let emailInput = signUpForm.querySelector("#sign-up-email");
        if (!emailInvalid.classList.contains("opacity-1"))
            emailInvalid.classList.add("opacity-1");
        if (!emailInput.classList.contains("wrong-input"))
            emailInput.classList.add("wrong-input");
        //errorText.innerHTML = "Please type in your email.";
        swal.close();
        Swal.fire({
            icon: 'error',
            text: "Please type in your email."
        });
        //$('#sign-up-error-modal').modal("show");
        //$('#sign-up-loading-modal').modal("hide")
        return;
    }

    if (businessType !== 0 && businessType !== 1) {
        let businessTypeInvalid = signUpForm.querySelector("#business-type-invalid");
        let businessTypeInput = signUpForm.querySelector("#sign-up-business-type");
        if (!businessTypeInvalid.classList.contains("opacity-1"))
        businessTypeInvalid.classList.add("opacity-1");
        if (!businessTypeInput.classList.contains("wrong-input"))
        businessTypeInput.classList.add("wrong-input");
        //errorText.innerHTML = "Please type in your email.";
        swal.close();
        Swal.fire({
            icon: 'error',
            text: "Business type is invalid."
        });
        //$('#sign-up-error-modal').modal("show");
        //$('#sign-up-loading-modal').modal("hide")
        return;
    }

    if (password.length < 6) {
        let passwordInvalid = signUpForm.querySelector("#password-invalid");
        let passwordInput = signUpForm.querySelector("#sign-up-password");
        if (!passwordInvalid.classList.contains("opacity-1"))
            passwordInvalid.classList.add("opacity-1");
        if (!passwordInput.classList.contains("wrong-input"))
            passwordInput.classList.add("wrong-input");
        //errorText.innerHTML = "Password must be at least 6 characters.";
        swal.close();
        Swal.fire({
            icon: 'error',
            text: "Password must be at least 6 characters."
        });
        // $('#sign-up-error-modal').modal("show");
        //$('#sign-up-loading-modal').modal("hide")
        return;
    }

    if (confirmPassword != password) {
        let passwordInvalid = signUpForm.querySelector("#password-invalid");
        let passwordInput = signUpForm.querySelector("#sign-up-password");
        let confirmPasswordInvalid = signUpForm.querySelector("#confirm-password-invalid");
        let confirmPasswordInput = signUpForm.querySelector("#sign-up-confirm-password");
        if (!passwordInvalid.classList.contains("opacity-1"))
            passwordInvalid.classList.add("opacity-1");
        if (!passwordInput.classList.contains("wrong-input"))
            passwordInput.classList.add("wrong-input");
        if (!confirmPasswordInvalid.classList.contains("opacity-1"))
            confirmPasswordInvalid.classList.add("opacity-1");
        if (!confirmPasswordInput.classList.contains("wrong-input"))
            confirmPasswordInput.classList.add("wrong-input");
        errorText.innerHTML = "Password confirmation is not correct.";
        swal.close();
        Swal.fire({
            icon: 'error',
            text: "Password confirmation is not correct."
        });
        //$('#sign-up-error-modal').modal("show");
        //$('#sign-up-loading-modal').modal("hide")
        return;
    }

    //Check confirm password
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(cred => {
        cred.user.sendEmailVerification()
        .then(res => {
            //Call to backend to add information to database
            let uid = cred.user.uid;
            const data = {
                "id": uid,
                "email": email,
                "password": password,
                "business_name": businessName,
                "business_type": businessType
            }
            updateToDatabaseNormalLogin(data);
            return;
        })
        .catch(err => {
            //errorText.innerHTML = "Error occured. Please try again later.";
            swal.close();
            Swal.fire({
                icon: 'error',
                text: "Error occured. Please try again later."
            });
            return;
        })
    })
    .catch(err => {
        if (err.code == "auth/missing-email") {
            let emailInvalid = signUpForm.querySelector("#email-invalid");
            let emailInput = signUpForm.querySelector("#sign-up-email");
            if (!emailInvalid.classList.contains("opacity-1"))
                emailInvalid.classList.add("opacity-1");
            if (!emailInput.classList.contains("wrong-input"))
                emailInput.classList.add("wrong-input");
            //errorText.innerHTML = "Please type in your email.";
            swal.close();
            Swal.fire({
                icon: 'error',
                text: "Please type in your email."
            });
            //$('#sign-up-error-modal').modal("show");
            //$('#sign-up-loading-modal').modal("hide")
            return;
        }
        if (err.code == "auth/invalid-email") {
            let emailInvalid = signUpForm.querySelector("#email-invalid");
            let emailInput = signUpForm.querySelector("#sign-up-email");
            if (!emailInvalid.classList.contains("opacity-1"))
                emailInvalid.classList.add("opacity-1");
            if (!emailInput.classList.contains("wrong-input"))
                emailInput.classList.add("wrong-input");
            //errorText.innerHTML = "Invalid email.";
            swal.close();
            Swal.fire({
                icon: 'error',
                text: "Invalid email."
            });
            //$('#sign-up-error-modal').modal("show");
            //$('#sign-up-loading-modal').modal("hide")
            return;
        }
        if (err.code == "auth/email-already-in-use") {
            let emailInvalid = signUpForm.querySelector("#email-invalid");
            let emailInput = signUpForm.querySelector("#sign-up-email");
            if (!emailInvalid.classList.contains("opacity-1"))
                emailInvalid.classList.add("opacity-1");
            if (!emailInput.classList.contains("wrong-input"))
                emailInput.classList.add("wrong-input");
            //errorText.innerHTML = "Email is already in used.";
            swal.close();
            Swal.fire({
                icon: 'error',
                text: "Email is already in used."
            });
            //$('#sign-up-error-modal').modal("show");
            //$('#sign-up-loading-modal').modal("hide")
            return;
        }
        //errorText.innerHTML = "Error occured. Please try again later.";
        swal.close();
        Swal.fire({
            icon: 'error',
            text: "Error occured. Please try again later."
        });
        //$('#sign-up-error-modal').modal("show");
        //$('#sign-up-loading-modal').modal("hide")
    })
}

const validateAndSignIn = () => {
    //Hide all invalid
    signInForm.querySelectorAll(".invalid-text").forEach(input => {
        if (input.classList.contains("opacity-1")) {
            input.classList.remove("opacity-1");
        }
    })

    signInForm.querySelectorAll("div div input").forEach(input => {
        if (input.classList.contains("wrong-input")) {
            input.classList.remove("wrong-input");
        }
    })

    signInErrorText.innerHTML = "";

    //Get input
    let email = document.getElementById("sign-in-email").value;
    let password = document.getElementById("sign-in-password").value;

    if (email.length == 0) {
        let emailInvalid = signInForm.querySelector("#email-invalid");
        let emailInput = signInForm.querySelector("#sign-in-email");
        if (!emailInvalid.classList.contains("opacity-1"))
            emailInvalid.classList.add("opacity-1");
        if (!emailInput.classList.contains("wrong-input"))
            emailInput.classList.add("wrong-input");
        //signInErrorText.innerHTML = "Please type in your email.";
        //$('#sign-in-error-modal').modal("show");
        Swal.fire({
            icon: 'error',
            text: "Please type in your email."
        });
        //$('#sign-in-loading-modal').modal("toggle");
        return;
    }

    if (password.length < 6) {
        let passwordInvalid = signInForm.querySelector("#password-invalid");
        let passwordInput = signInForm.querySelector("#sign-in-password");
        if (!passwordInvalid.classList.contains("opacity-1"))
            passwordInvalid.classList.add("opacity-1");
        if (!passwordInput.classList.contains("wrong-input"))
            passwordInput.classList.add("wrong-input");
        //signInErrorText.innerHTML = "Password must be at least 6 characters.";
        //$('#sign-in-error-modal').modal("show");
        Swal.fire({
            icon: 'error',
            text: "Password must be at least 6 characters."
        });
        //$('#sign-in-loading-modal').modal("toggle");
        return;
    }

    //Login
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(res => {
        if (res.user.emailVerified) {
            //Logged in
            //$('#sign-in-loading-modal').modal("toggle");
            localStorage.setItem("business", JSON.stringify({
                "uid": res.user.uid,
                "email": res.user.email,
                "password": password,
                "providerToken": res.user._delegate.accessToken,
                "isGoogle": false,
            }));

            biz_id = res.user.uid;

            loginRedirect()
        } else {
            Swal.fire({
                icon: 'error',
                text: "Please verify your account with your registered email."
            });
        }
    })
    .catch(err => {
        swal.close();
        if (err.code == "auth/invalid-email") {
            let emailInvalid = signInForm.querySelector("#email-invalid");
            let emailInput = signInForm.querySelector("#sign-in-email");
            if (!emailInvalid.classList.contains("opacity-1"))
                emailInvalid.classList.add("opacity-1");
            if (!emailInput.classList.contains("wrong-input"))
                emailInput.classList.add("wrong-input");
            Swal.fire({
                icon: 'error',
                text: "Invalid email."
            });
            return;
        }
        if (err.code == "auth/wrong-password") {
            //signInErrorText.innerHTML = "Wrong password.";
            let passwordInvalid = signInForm.querySelector("#password-invalid");
            let passwordInput = signInForm.querySelector("#sign-in-password");
            if (!passwordInvalid.classList.contains("opacity-1"))
                passwordInvalid.classList.add("opacity-1");
            if (!passwordInput.classList.contains("wrong-input"))
                passwordInput.classList.add("wrong-input");
            //$('#sign-in-error-modal').modal("show");
            Swal.fire({
                icon: 'error',
                text: "Wrong password."
            });
            //$('#sign-in-loading-modal').modal("toggle");
            return;
        }
        //signInErrorText.innerHTML = err.message;
        //$('#sign-in-error-modal').modal("show");
        Swal.fire({
            icon: 'error',
            text: err.message
        });
        //$('#sign-in-loading-modal').modal("toggle");
    })   
}

const initializeEventListeners = () => {
    //Button Google
    /*
    btnGoogle.addEventListener("click", () => {
        firebase.auth().signInWithPopup(provider)
        .then(res => {
            //Send to backend
            signInWithGoogle(res)
        })
        .catch(err => {
            //console.log(err);
            if (errorText != null) {
                Swal.fire({
                    icon: 'error',
                    text: "Error occured. Please try again later."
                });
            }
            
            if (signInErrorText != null) {
                Swal.fire({
                    icon: 'error',
                    text: "Error occured. Please try again later."
                });
            }
        })
    })
    */

    if (btnSignUp != null) {
        btnSignUp.addEventListener("click", (e) => {
            e.preventDefault();
            //$('#sign-up-loading-modal').modal("show");
            Swal.fire({
                title: 'Loading...',
                html: 'Please wait...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading()
                }
              });
            validateAndSignUp();
        })
    }

    btnSignIn && btnSignIn.addEventListener("click", (e) => {
        e.preventDefault();
        //$('#sign-in-loading-modal').modal("show");
        Swal.fire({
            title: 'Loading...',
            html: 'Please wait...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          });
        validateAndSignIn();
    })

    //Not allow click outside loading modal
    //$('#loading-modal').modal({backdrop: 'static', keyboard: false});
    
}

const updateToDatabaseNormalLogin = (data) => {
    let csrf = document.getElementById("csrf-sign-up").innerText;
    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "../../api/business/auth/auth.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
        Swal.close();
        if (xhr.status === 200 && xhr.readyState === 4) {
            //Register complete, login and save to local storage
            //errorText.innerHTML = "Register completed. Please verify your account by checking your email.";
            //$('#sign-up-error-modal').modal("show");
            Swal.fire({
                icon: 'success',
                text: "Register completed. Please verify your account by checking your email."
            });
        } else {
            //errorText.innerHTML = "Error occured. Please try again.";
            //$('#sign-up-error-modal').modal("show");
            Swal.fire({
                icon: 'error',
                text: "Error occured. Please try again."
            });
        }
        //$('#sign-up-loading-modal').modal("hide")
    }
    xhr.send(`localSignUp&id=${data.id}&email=${data.email}&password=${data.password}&csrf=${csrf}&business=${data.business_name}
    &type=${data.business_type}`);
}

const loginRedirect = async() => {
    await getInfoFromServer();
}

const getInfoFromServer = async() => {
    let csrf = "";
    if (signInErrorText != null) {
        //From sign up page
        csrf = document.getElementById("csrf-sign-in").innerText;
    } 
    if (errorText != null) {
        csrf = document.getElementById("csrf-sign-up").innerText;
    }
    let xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `../../api/business/profile/edit.php?getHeaderInfo&id=${biz_id}&csrf=${csrf}`,
        true
    )
    xhr.onload = () => {
        Swal.close();
        if (xhr.status === 200 && xhr.readyState === 4) {
           //Nhận thông tin và in ra các ô input
            try {
                let result = JSON.parse(xhr.responseText); 
                localStorage.setItem("headerInfo", JSON.stringify({
                    "isAdmin": false,
                    "image": result.image,
                    "isBusiness": true,
                    "businessName": result.businessName,
                    "businessCode": result.businessCode || "",
                    "businessType": result.businessType
                }));
                localStorage.removeItem("user");
                location.replace('./../');
            } catch (ex) {
                Swal.fire({
                    icon: 'error',
                    text: "Error occured. Please try again."
                });
            }
        }
    }
    xhr.send();
}

document.addEventListener("DOMContentLoaded", function() {
    //Hide 000webhost panel
    let getPanel = document.querySelector("div[style*='z-index:9999999;']");
    if (getPanel != null) {
        getPanel.style = "display: none;"
    }

    let getDisclaimer = document.querySelector(".disclaimer");
    if (getDisclaimer != null) {
        getDisclaimer.style = "display: none;";
    }
})