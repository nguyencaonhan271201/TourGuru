let root = "/TourGuru_v2";
let isAdmin;

document.addEventListener("DOMContentLoaded", () => {
  if (
    !localStorage.getItem("headerInfo") ||
    localStorage.getItem("headerInfo") == "null"
  ) {
    document.getElementById("header-logged-in").style.display = "none";
    document.getElementById("header-not-logged-in").style.display = "block";
  } else {
    document.getElementById("header-logged-in").style.display = "block";
    document.getElementById("header-not-logged-in").style.display = "none";
    updateInfo();
  }

  document.querySelectorAll("#log-out").forEach(logOut => {
    logOut.addEventListener("click", (e) => {
      e.preventDefault();
      location.replace(`${root}` + "/logout.php");
    })
  })

  if (window.location.pathname.includes("/flights")) {
    document.getElementById("nav-flight").classList.add("active");
  } else if (window.location.pathname.includes("/hotels")) {
    document.getElementById("nav-hotel").classList.add("active");
  } else if (window.location.pathname.includes("/attraction")) {
    document.getElementById("nav-attraction").classList.add("active");
  }
});

const updateInfo = () => {
  let userInfo = JSON.parse(localStorage.getItem("headerInfo"));
  isAdmin = userInfo.isAdmin;
  isBusiness = userInfo.isBusiness || null; 

  if (isBusiness && isBusiness === true) {
    document.getElementById("user-dropdown").style.display = "none";
    document.getElementById("business-dropdown").style.display = "block";
    document.getElementById("business-name").style.display = "block";
  } else {
    document.getElementById("user-dropdown").style.display = "block";
    document.getElementById("business-dropdown").style.display = "none";
    document.getElementById("business-name").style.display = "none";
    if (userInfo.isAdmin) {
      document.getElementById("admin-header-block").style.display = "block";
    } else {
      document.getElementById("admin-header-block").style.display = "none";
    }
  }

  //getAvatar
  let profileImage = userInfo.image;
  if (profileImage && (profileImage.includes("../../") || profileImage.includes("../../../"))) {
    while (profileImage.includes("../")) {
      profileImage = profileImage.replace('../', '');
    }
    profileImage = root + "/" + profileImage;
  }
  document.getElementById("profile-img").setAttribute("src", profileImage);
};

document.addEventListener("DOMContentLoaded", function () {
  //Hide 000webhost panel
  let getPanel = document.querySelector("div[style*='z-index:9999999;']");
  if (getPanel != null) {
    getPanel.style = "display: none;";
  }
});
