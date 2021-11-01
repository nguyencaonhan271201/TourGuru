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

document.getElementById("btn-login").addEventListener("click", function() {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
        console.log(res);
        showUserDetails(res.user);
    })
    .catch(err => {
        console.log(err);
    })
});

function showUserDetails(user) {
    document.getElementById("username").innerHTML = user.displayName;
    document.getElementById("email").innerHTML = user.email;
}

function checkAuthState() {
    firebase.auth().onAuthStateChanged(user => {
        if (user && user.emailVerified) {
            showUserDetails(user);
        } else {

        }
    });
}

document.getElementById("btn-logout").addEventListener("click", function() {
    firebase.auth().signOut()
    .then(() => {
        document.getElementById("username").innerHTML = "";
        document.getElementById("email").innerHTML = "";
    })
});

document.addEventListener("DOMContentLoaded", () => {
    checkAuthState();
})

document.getElementById("btn-register").addEventListener("click", function() {
    let email = document.getElementById("inp-email").value;
    let password = document.getElementById("password").value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(cred => {
        cred.user.sendEmailVerification()
        .then(res => {
            alert("Please verify by checking your email");
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
});

document.getElementById("btn-login-email").addEventListener("click", function() {
    let email = document.getElementById("inp-email").value;
    let password = document.getElementById("password").value;
    login(email, password);
});

function login(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(res => {
        if (res.user.emailVerified) {
            showUserDetails(res.user);
        } else {
            console.log("Please verify your email");
        }
    })
    .catch(err => {
        console.log(err);
    })   
}

document.getElementById("btn-logout-email").addEventListener("click", function() {
    firebase.auth().signOut()
    .then(() => {
        document.getElementById("username").innerHTML = "";
        document.getElementById("email").innerHTML = "";
    })
});