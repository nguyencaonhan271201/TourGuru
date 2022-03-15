let uid;
let blogID;
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      uid = user.uid;

      let urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("id")) {
        blogID = urlParams.get("id");
      } else {
        location.replace("./../");
      }

      gatherInformation();
    } else {
      location.replace("./../../auth/login.php");
      return;
    }
  })
})

const gatherInformation = () => {
  let csrf = document.getElementById("csrf").innerText;
  let xhr = new XMLHttpRequest();
  xhr.open(
      "GET",
      `../../api/blogs/blog.php?getBlogInfo&user_id=${uid}&blog_id=${blogID}&csrf=${csrf}`,
      true
  )
  xhr.onload = () => {
      swal.close();
      if (xhr.status === 200 && xhr.readyState === 4) {
         //Nhận thông tin và lưu vào danh mục
          let result = JSON.parse(xhr.responseText); 
          retrievedPlanInfo = result[0];
          console.log(retrievedPlanInfo)
          printBlogDetail(retrievedPlanInfo);
      } else {
          Swal.fire({
              icon: "error",
              text: "Error occured."
          }).then(() => {
              location.replace("./../");
          })
      }
  }
  xhr.send();
}

const printBlogDetail = (info) => {
  document.getElementById("post-cover-img").setAttribute("src", info.cover);
  document.getElementById("post-title").innerHTML = info.title;
  document.title = `Tour Guru | Blog | ${info.title}`;
  document.getElementById("author-img").setAttribute("src", info.author_image);
  document.getElementById("post-author-name").innerHTML = info.author_name || info.author_email;

  let created_time = info.date_created.split(" ");
  created_time = created_time[created_time.length - 1];
  let updated_time = info.date_updated.split(" ");
  updated_time = updated_time[updated_time.length - 1];
  document.getElementById("created").innerHTML = `created: ${created_time} - ${getDisplayDateFormat(false, info.date_created)}`;
  document.getElementById("updated").innerHTML = `updated: ${updated_time} - ${getDisplayDateFormat(false, info.date_updated)}`;
  document.getElementById("post-content").innerHTML = info.content;
  document.getElementById("category").innerHTML = info.category_name;

  if (!info.plan_id) {
    document.querySelector(".plans").style.display = "none";
  } else {
    document.getElementById("plan-attachment").setAttribute("src", `../../plans/plan-iframe?id=${info.plan_id}`)
    document.getElementById("plan-attachment").onload = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
    }
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  })
}

const getDisplayDateFormat = (isWeekDay, ISODate) => {
  const newDateObj = new Date(ISODate);
  const toMonth = newDateObj.getMonth() + 1;
  const toYear = newDateObj.getFullYear();
  const toDate = newDateObj.getDate();
  const DOW = newDateObj.getDay()
  const dateTemplate = isWeekDay ? `${weekDays[DOW]}, ${toDate} ${months[toMonth - 1]} ${toYear}` : `${toDate} ${months[toMonth - 1]} ${toYear}`;
  // console.log(dateTemplate)
  return dateTemplate;
}