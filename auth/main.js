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

let btnGoogle = document.getElementById("btn-google");
let errorModal = document.getElementById("error-modal");
let signUpForm = document.getElementById("sign-up-form");
let signInForm = document.getElementById("sign-in-form");
let btnSignUp = document.getElementById("btn-sign-up-submit");
let btnSignIn = document.getElementById("btn-sign-in-submit");
let errorText = document.querySelector("#sign-up-error-modal #modal-error-content");
let signInErrorText = document.querySelector("#sign-in-error-modal #modal-error-content");

window.addEventListener("DOMContentLoaded", () => {
    initializeEventListeners();

    if (window.location.search.includes("flight_confirmation")
    || window.location.search.includes("hotel_confirmation")) {
        
        Swal.fire({
            icon: 'error',
            text: "You need to login to complete the booking process."
        });
    }
})

const signInWithGoogle = (res) => {
    //Get information
    let uid = res.user.uid
    let email = res.user.email
    let displayName = res.user.displayName;
    let photoURL = res.user.photoURL;

    //Check if is a new user
    if (res.additionalUserInfo.isNewUser) {
        //Call to backend to add information to database
        const data = {
            "id": uid,
            "email": email,
            "displayName": displayName,
            "password": "",
            "image": photoURL
        }
        updateToDatabaseProviderLogin(data, res.credential.idToken);
    } else {
        //Simply Log in
        localStorage.setItem("user", JSON.stringify({
            "uid": uid,
            "email": email,
            "password": "",
            "providerToken": res.credential.idToken,
            "isGoogle": true,
        }))
        loginRedirect();
    }
}

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
            //$('#sign-up-error-modal').modal("show");
            //$('#sign-up-loading-modal').modal("hide")
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
            $('#sign-in-loading-modal').modal("toggle");
            localStorage.setItem("user", JSON.stringify({
                "uid": res.user.uid,
                "email": res.user.email,
                "password": password,
                "providerToken": res.user._delegate.accessToken,
                "isGoogle": false,
            }));

            loginRedirect()
        } else {
            //signInErrorText.innerHTML = "Please verify your email.";
            //$('#sign-in-error-modal').modal("show");
            Swal.fire({
                icon: 'error',
                text: "Please verify your account with your registered email."
            });
            //$('#sign-in-loading-modal').modal("toggle");
        }
    })
    .catch(err => {
        swal.close();
        if (err.code == "auth/invalid-email") {
            //signInErrorText.innerHTML = "Invalid email.";
            let emailInvalid = signInForm.querySelector("#email-invalid");
            let emailInput = signInForm.querySelector("#sign-in-email");
            if (!emailInvalid.classList.contains("opacity-1"))
                emailInvalid.classList.add("opacity-1");
            if (!emailInput.classList.contains("wrong-input"))
                emailInput.classList.add("wrong-input");
            //$('#sign-in-error-modal').modal("show");
            Swal.fire({
                icon: 'error',
                text: "Invalid email."
            });
            //$('#sign-in-loading-modal').modal("toggle");
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
    btnGoogle.addEventListener("click", () => {
        firebase.auth().signInWithPopup(provider)
        .then(res => {
            //Send to backend
            signInWithGoogle(res)
        })
        .catch(err => {
            console.log(err);
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

const updateToDatabaseProviderLogin = (data, token) => {
    //Get csrf
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
        "POST",
        "../api/auth/auth.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
            //Register complete, login and save to local storage
            let storingItem = {
                "uid": data.id,
                "email": data.email,
                "password": "",
                "providerToken": token,
                "isGoogle": true,
            };
            localStorage.setItem("user", JSON.stringify(storingItem))
            loginRedirect();
        } else {
            if (signInErrorText != null) {
                Swal.fire({
                    icon: 'error',
                    text: "Error occured. Please try again later."
                });
            }
            if (errorText != null) {
                Swal.fire({
                    icon: 'error',
                    text: "Error occured. Please try again later."
                });
                
            }
        }
    }
    xhr.send(`googleSignUp&id=${data.id}&email=${data.email}&password=dummy&displayName=${data.displayName}&image=${data.image}&csrf=${csrf}`);
}

const updateToDatabaseNormalLogin = (data) => {
    let csrf = document.getElementById("csrf-sign-up").innerText;
    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "../api/auth/auth.php",
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
    xhr.send(`localSignUp&id=${data.id}&email=${data.email}&password=${data.password}&csrf=${csrf}`);
}

const loginRedirect = () => {
    if (localStorage.getItem("fromFlight") != "null")
        location.replace("./../flights/confirmation/");
    if (localStorage.getItem("hotelInfo") != "null")
        location.replace(`./../hotel/info/?hotel=${JSON.parse(localStorage.getItem("hotelInfo"))["hotelID"]}`);
    location.replace("./../");
}