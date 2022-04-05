let rootDir = "/TourGuru";

const firebaseConfig = {
  apiKey: "AIzaSyAJj6Z-kMC94FeLTY5aiEZ4NHhAklOcLnU",
  authDomain: "tour-guru-25442.firebaseapp.com",
  projectId: "tour-guru-25442",
  storageBucket: "tour-guru-25442.appspot.com",
  messagingSenderId: "1086343389478",
  appId: "1:1086343389478:web:a40eb9435a26b42a7021e7",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
let provider = new firebase.auth.GoogleAuthProvider();

const signOut = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      localStorage.setItem("headerInfo", null);
      location.replace(`${rootDir}/`);
    });
};

// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//         uid = user.uid;
//     } else {
//         location.replace(`${rootDir}/auth/login.php`);
//         return;
//     }
// })
