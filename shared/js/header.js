let root = "/TourGuru"

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("headerInfo") || localStorage.getItem("headerInfo") == "null") {
    document.getElementById("header-logged-in").style.display = "none";
    document.getElementById("header-not-logged-in").style.display = "initial";
  } else {
    document.getElementById("header-logged-in").style.display = "initial";
    document.getElementById("header-not-logged-in").style.display = "none";
    updateInfo();
  }

  document.getElementById("log-out").addEventListener("click", e => {
    e.preventDefault();
    location.replace(`${root}` + "/logout.php");
  })
})

const updateInfo = () => {
  let userInfo = JSON.parse(localStorage.getItem("headerInfo"));
  if (userInfo.isAdmin) {
    document.getElementById("admin-header-block").style.display = "block";
  } else {
    document.getElementById("admin-header-block").style.display = "none";
  }

  //getAvatar
  let profileImage = userInfo.image;
  if (profileImage.includes("../../"))
    profileImage = root + "/" + profileImage.substring(6, profileImage.length);
  document.getElementById("profile-img").setAttribute("src", profileImage);
}

