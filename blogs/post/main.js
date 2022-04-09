let uid;
let blogID;
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let reactionSelection;
let reactionDiv;
let hoverTimeout;
let hoverOutTimeout;
let divHoverOutTimeout;
let isOver = false;
let reactionCount = 0;
let reacted = false;
let reactedType = -1;
let reactionsInfo = [];
let tmpDetailedReactions = {};
let commentBox;
let comments = [];
let commentsDiv;
let currentUser;
let seeMoreBlock;

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

      getUserInfo();

      reactionSelection = document.getElementById("reaction-selection");
      reactionDiv = document.querySelector(".reaction-select-div");
      
      reactionDiv.addEventListener("mouseenter", () => {
        clearTimeout(hoverOutTimeout);
      })
      reactionDiv.addEventListener("mouseleave", () => {
        divHoverOutTimeout = setTimeout(() => {
          hoverTimeout = null;
          reactionDiv.style.opacity = "0";
          reactionDiv.style.top = "-50px";
          setTimeout(() => {
            reactionDiv.style.display = "none";
          }, 300);
        }, 200);
      })
      reInitializeEventListeners();
      

      document.querySelectorAll(".reaction-select").forEach(reaction => {
        reaction.addEventListener("click", () => {
          let type = parseInt(reaction.getAttribute("data-id"));
          
          performReaction(type);
        })
      })

      document.querySelector(".backdrop").addEventListener("click", (e) => {
        if (e.target == document.querySelector(".backdrop")) {
          document.querySelector(".backdrop").style.display = "none";
        }
      })

      let getContainer = document.querySelector(".reaction-info");
      getContainer.addEventListener("click", () => {
        getReactionsDetail();

        document.querySelector(".backdrop").style.display = "flex";
      })

      commentBox = document.getElementById("comment");
      commentBox.addEventListener("keypress", (e) => {
        if (e.which == 13) {
          if (e.target.value.length <= 0 || e.target.value.length > 1000) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Comments cannot be blank or too long!",
              showCloseButton: true,
            });
            return;
          }
          newComment(e.target.value);
        }
      });

      commentsDiv = document.getElementById("comments-list")

      gatherInformation();
    } else {
      uid = '';

      let urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("id")) {
        blogID = urlParams.get("id");
      } else {
        location.replace("./../");
      }

      reactionSelection = document.getElementById("reaction-selection");
      reactionDiv = document.querySelector(".reaction-select-div");
      
      reactionSelection.addEventListener("click", () => {
        location.replace("./../../auth/login.php")
      })

      document.querySelector(".backdrop").addEventListener("click", (e) => {
        if (e.target == document.querySelector(".backdrop")) {
          document.querySelector(".backdrop").style.display = "none";
        }
      })

      let getContainer = document.querySelector(".reaction-info");
      getContainer.addEventListener("click", () => {
        getReactionsDetail();

        document.querySelector(".backdrop").style.display = "flex";
      })

      commentBox = document.querySelector(".comment-input-div");
      commentBox.style.display = "none";

      commentsDiv = document.getElementById("comments-list")

      gatherInformation();
    }
  })
})

const getReactionsDetail = () => {
  let csrf = document.getElementById("csrf").innerText;
  let xhr = new XMLHttpRequest();
  xhr.open(
      "GET",
      `../../api/blogs/blog.php?getBlogReactionDetails&blog_id=${blogID}&csrf=${csrf}`,
      true
  )
  xhr.onload = () => {
      swal.close();
      if (xhr.status === 200 && xhr.readyState === 4) {
        //Nhận thông tin và lưu vào danh mục
        let result = JSON.parse(xhr.responseText); 
        printDetailReactions(result);
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

const getComments = () => {
  let csrf = document.getElementById("csrf").innerText;
  let xhr = new XMLHttpRequest();
  xhr.open(
      "GET",
      `../../api/blogs/blog.php?getBlogComments&blog_id=${blogID}&csrf=${csrf}`,
      true
  )
  xhr.onload = () => {
      swal.close();
      if (xhr.status === 200 && xhr.readyState === 4) {
        //Nhận thông tin và lưu vào danh mục
        let result = JSON.parse(xhr.responseText); 

        //Store comments to list
        comments = [];
        result.forEach(comment => {
          let found = false;
          for (let i = 0; i < comments.length; i++) {
            if (comments[i].comment_id === comment.child_of) {
              comments[i].childComments.push(comment);
              found = true;
              break;
            }
          }
          if (!found) {
            let objectToPush = JSON.parse(JSON.stringify(comment));
            objectToPush.childComments = [];
            comments.push(objectToPush)
          }
        })

        comments = comments.reverse();

        printComments(0);
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

const printDetailReactions = (result) => {
  tmpDetailedReactions = {
    0: {
      count: 0,
      people: []
    }
  };

  result.forEach(reaction => {
    tmpDetailedReactions[0].count += 1;
    tmpDetailedReactions[0].people.push({
      display: reaction.display_name || reaction.email,
    uid: reaction.user_id,
      image: reaction.image,
      type: reaction.reaction_type
    })

    if (Object.keys(tmpDetailedReactions).includes(reaction.reaction_type.toString())) {
      tmpDetailedReactions[reaction.reaction_type.toString()].count += 1;
      tmpDetailedReactions[reaction.reaction_type.toString()].people.push({
        display: reaction.display_name || reaction.email,
        uid: reaction.user_id,
        image: reaction.image,
        type: parseInt(reaction.reaction_type)
      })
    } else {
      tmpDetailedReactions[reaction.reaction_type.toString()] = {
        count: 1,
        people: [{
          display: reaction.display_name || reaction.email,
          uid: reaction.user_id,
          image: reaction.image,
          type: parseInt(reaction.reaction_type)
        }]
      }
    }
  })

  reDisplayDetails(0);
}

const getUserInfo = async() => {
  let csrf = "";
  csrf = document.getElementById("csrf").innerText;
  let xhr = new XMLHttpRequest();
  xhr.open(
      "GET",
      `../../api/profile/edit.php?getHeaderInfo&id=${uid}&csrf=${csrf}`,
      true
  )
  xhr.onload = () => {
      Swal.close();
      if (xhr.status === 200 && xhr.readyState === 4) {
         //Nhận thông tin và in ra các ô input
          let result = JSON.parse(xhr.responseText); 
          currentUser = result;
          document.getElementById("comment-input-author-img").setAttribute("src", currentUser.image);
      }
  }
  xhr.send();
}

const reDisplayDetails = (selected) => {
  let getElement = document.querySelector('.reaction-type');
  getElement.innerHTML = "";
  let html = "";

  Object.keys(tmpDetailedReactions).forEach(key => {
    key = parseInt(key);
    let selectedString = "";
    switch (key) {
      case 0:
        selectedString = selected === 0? "reaction-item-selected-blue" : "";
        html += `<li class="reaction-item reaction-blue ${selectedString}" data-type="0">Tất cả</li>`
        break;
      case 1:
        selectedString = selected === 1? "reaction-item-selected-blue" : "";
        html += `
          <li class="reaction-item ${selectedString}" data-type="1"><img
            class="reaction-top" 
            id="reaction-1"
            src="../../shared/assets/images/posts/reactions/1.png"
            alt=""></img> 
            <span class="ml-1 reaction-blue">${tmpDetailedReactions[key].count}</span>
          </li>
        `
        break;
      case 2:
        selectedString = selected === 2? "reaction-item-selected-red" : "";
        html += `
          <li class="reaction-item ${selectedString}" data-type="2"><img
            class="reaction-top" 
            id="reaction-1"
            src="../../shared/assets/images/posts/reactions/2.png"
            alt=""></img> 
            <span class="ml-1 reaction-red">${tmpDetailedReactions[key].count}</span>
          </li>
        `
        break;
      case 3:
        selectedString = selected === 3? "reaction-item-selected-yellow" : "";
        html += `
          <li class="reaction-item ${selectedString}" data-type="3"><img
            class="reaction-top" 
            id="reaction-1"
            src="../../shared/assets/images/posts/reactions/3.png"
            alt=""></img> 
            <span class="ml-1 reaction-yellow">${tmpDetailedReactions[key].count}</span>
          </li>
        `
        break;
      case 4:
        selectedString = selected === 4? "reaction-item-selected-yellow" : "";
        html += `
          <li class="reaction-item ${selectedString}" data-type="4"><img
            class="reaction-top" 
            id="reaction-1"
            src="../../shared/assets/images/posts/reactions/4.png"
            alt=""></img> 
            <span class="ml-1 reaction-yellow">${tmpDetailedReactions[key].count}</span>
          </li>
        `
        break;
      case 5:
        selectedString = selected === 5? "reaction-item-selected-yellow" : "";
        html += `
          <li class="reaction-item ${selectedString}" data-type="5"><img
            class="reaction-top" 
            id="reaction-1"
            src="../../shared/assets/images/posts/reactions/5.png"
            alt=""></img> 
            <span class="ml-1 reaction-yellow">${tmpDetailedReactions[key].count}</span>
          </li>
        `
        break;
      case 6:
        selectedString = selected === 6? "reaction-item-selected-yellow" : "";
        html += `
          <li class="reaction-item ${selectedString}" data-type="6"><img
            class="reaction-top" 
            id="reaction-1"
            src="../../shared/assets/images/posts/reactions/6.png"
            alt=""></img> 
            <span class="ml-1 reaction-yellow">${tmpDetailedReactions[key].count}</span>
          </li>
        `
        break;
      case 7:
        selectedString = selected === 7? "reaction-item-selected-orange" : "";
        html += `
          <li class="reaction-item ${selectedString}" data-type="7"><img
            class="reaction-top" 
            id="reaction-1"
            src="../../shared/assets/images/posts/reactions/7.png"
            alt=""></img> 
            <span class="ml-1 reaction-orange">${tmpDetailedReactions[key].count}</span>
          </li>
        `
        break;
    }
  })

  getElement.innerHTML = html;

  // Display
  document.getElementById("reaction-list").innerHTML = "";
  let listHTML = "";
  tmpDetailedReactions[selected].people.forEach(reaction => {
    listHTML += `
      <div class="reactor d-flex align-items-center justify-content-start">
        <div style="position: relative;">
          <a target="_blank" href="./../search?user=${reaction.uid}">
          <img
          class="reactor-img" 
          src="${reaction.image}"
          alt=""></img>
          </a>
          <img
          class="reactor-img-type" 
          src="../../shared/assets/images/posts/reactions/${reaction.type}.png"
          alt=""></img>
        </div>
        <h5 id="reactor-name"><a target="_blank" href="./../search?user=${reaction.uid}">${reaction.display}</a></h5>
      </div>
    `;
  })
  document.getElementById("reaction-list").innerHTML = listHTML;

  document.querySelectorAll(".reaction-item").forEach(item => {
    item.addEventListener("click", () => {
      let getType = item.getAttribute("data-type");
      reDisplayDetails(parseInt(getType));
    })
  })
}

const performReaction = (type) => {
  if (!reacted) {
    reactionCount = reactionCount + 1;
    document.getElementById("reaction-count").innerHTML = reactionCount;

    //New reaction
    apiUpdateReaction(0, type);
  } else {
    reactionsInfo.forEach((info, index) => {
      if (info.id === reactedType) {
        reactionsInfo[index] = {
          id: reactedType,
          count: info.count - 1
        }
      }
    })

    apiUpdateReaction(1, type);
  }

  reactionSelection.outerHTML = `
  <img id="reaction-selection" class="reaction-top" src="../../shared/assets/images/posts/reactions/${type}.png" alt="">
  `

  reactionSelection = document.getElementById("reaction-selection");
  reInitializeEventListeners();

  reactionsInfo.forEach((info, index) => {
    if (info.id === type) {
      reactionsInfo[index] = {
        id: type,
        count: info.count + 1
      }
    }
  })

  reacted = true;
  reactedType = type;

  checkDisplayReactions();

  reactionDiv.style.opacity = "0";
  reactionDiv.style.top = "-50px";
  setTimeout(() => {
    reactionDiv.style.display = "none";
  }, 300);
}

const performCancelReaction = () => {
  apiUpdateReaction(2, 0);

  reactionCount = reactionCount - 1;
  document.getElementById("reaction-count").innerHTML = reactionCount;

  reactionsInfo.forEach((info, index) => {
    if (info.id === reactedType) {
      reactionsInfo[index] = {
        id: reactedType,
        count: info.count - 1
      }
    }
  })

  reacted = false;
  reactedType = -1;

  reactionSelection.outerHTML = `
    <i id="reaction-selection" class="far fa-thumbs-up"></i>
  `

  reactionSelection = document.getElementById("reaction-selection");
  reInitializeEventListeners();

  checkDisplayReactions();
}

const apiUpdateReaction = (actionType, reactionType) => {
  let csrf = document.getElementById("csrf").innerText;
  let xhr = new XMLHttpRequest();
  xhr.open(
      "POST",
      `../../api/blogs/blog.php`,
      true
  )
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
      swal.close();
      if (xhr.status === 200 && xhr.readyState === 4) {
      
      } else {
          Swal.fire({
              icon: "error",
              text: "Error occured."
          }).then(() => {
              location.replace("./../");
          })
      }
  }
  xhr.send(`updateReaction&uid=${uid}&blog_id=${blogID}&type=${actionType}&reaction=${reactionType}&csrf=${csrf}`);
}

const reInitializeEventListeners = () => {
  reactionSelection.addEventListener("mouseenter", () => {
    clearTimeout(hoverOutTimeout);
    clearTimeout(divHoverOutTimeout);
    hoverTimeout = setTimeout(() => {
      reactionDiv.style.display = "inline-flex";
      setTimeout(() => {
        reactionDiv.style.opacity = "1";
        reactionDiv.style.top = "-60px";
      }, 50);
    }, 500);
  })
  reactionSelection.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimeout);
    hoverOutTimeout = setTimeout(() => {
      hoverTimeout = null;
      reactionDiv.style.opacity = "0";
      reactionDiv.style.top = "-50px";
      setTimeout(() => {
        reactionDiv.style.display = "none";
      }, 300);
    }, 200);
  })
  reactionSelection.addEventListener("click", () => {
    if (reacted) {
      //Cancel reaction
      performCancelReaction();
    } else {
      performReaction(1);
    }
  })
}

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
          printBlogDetail(retrievedPlanInfo);
          gatherReactionsInformation();
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

const gatherReactionsInformation = () => {
  let csrf = document.getElementById("csrf").innerText;
  let xhr = new XMLHttpRequest();
  xhr.open(
      "GET",
      `../../api/blogs/blog.php?getBlogReactions&blog_id=${blogID}&csrf=${csrf}`,
      true
  )
  xhr.onload = () => {
      swal.close();
      if (xhr.status === 200 && xhr.readyState === 4) {
        //Nhận thông tin và lưu vào danh mục
        let result = JSON.parse(xhr.responseText); 
        printReactions(result);
        getComments();
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

const printReactions = (result) => {
  reactionCount = result.length;
  document.getElementById("reaction-count").innerHTML = reactionCount;

  reactionsInfo = [];
  for (let i = 1; i <= 7; i++) {
    reactionsInfo.push({
      id: i,
      count: 0
    })
  }

  result.forEach(reaction => {
    if (reaction.user_id === uid) {
      reacted = true;
      reactionSelection.outerHTML = `
        <img id="reaction-selection" class="reaction-top" src="../../shared/assets/images/posts/reactions/${reaction.reaction_type}.png" alt="">
      `
      reactedType = reaction.reaction_type;
      reactionSelection = document.getElementById("reaction-selection");
      reInitializeEventListeners();
    }

    reactionsInfo[reaction.reaction_type - 1] = {
      id: reaction.reaction_type,
      count: reactionsInfo[reaction.reaction_type - 1].count + 1
    }
  })

  checkDisplayReactions();
}

const checkDisplayReactions = () => {
  reactionsInfo.sort((a, b) => {
    if (a.count === b.count) {
      return a.id - b.id;
    }
    return a.count < b.count? 1 : -1;
  });


  //Print top 3 reactions
  document.getElementById("reaction-1").setAttribute("src", `../../shared/assets/images/posts/reactions/${reactionsInfo[0].id}.png`)
  document.getElementById("reaction-2").setAttribute("src", `../../shared/assets/images/posts/reactions/${reactionsInfo[1].id}.png`)
  document.getElementById("reaction-3").setAttribute("src", `../../shared/assets/images/posts/reactions/${reactionsInfo[2].id}.png`)

  if (reactionCount === 0) {
    let getContainer = document.querySelector(".reaction-info");
    if (getContainer.classList.contains("d-flex")) {
      getContainer.classList.remove("d-flex");
      getContainer.classList.add("d-none");
    }
  } else {
    let getContainer = document.querySelector(".reaction-info");
    if (getContainer.classList.contains("d-none")) {
      getContainer.classList.add("d-flex");
      getContainer.classList.remove("d-none");
    }
  }
}

const printBlogDetail = (info) => {
  document.getElementById("post-cover-img").setAttribute("src", info.cover);
  document.getElementById("post-title").innerHTML = info.title;
  document.title = `Tour Guru | Blogs | ${info.title}`;
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
  document.getElementById("description").innerHTML = info.description;

  let getEditButton = document.querySelector(".btn-edit");
  if (info.author === uid && uid !== "") {
    getEditButton.addEventListener("click", () => {
      window.location = `./../edit?id=${info.post_id}`
    })
  } else {
    getEditButton.classList.remove("d-flex");
    getEditButton.classList.add("d-none");
  }

  document.getElementById("author-img").addEventListener("click", () => {
    window.location = `./../search?user=${info.author}`
  })

  document.getElementById("post-author-name").addEventListener("click", () => {
    window.location = `./../search?user=${info.author}`
  })

  document.getElementById("category").addEventListener("click", () => {
    window.location = `./../search?category=${info.category}`
  })

  if (!info.plan_id) {
    document.querySelector(".plans").style.display = "none";
  } else {
    document.getElementById("plan-attachment").setAttribute("src", `../../plans/plan-iframe?id=${info.plan_id}`)
    document.getElementById("plan-attachment").onload = () => {
      // window.scrollTo({
      //   top: 0,
      //   left: 0,
      //   behavior: "smooth"
      // })
    }
  }

  // window.scrollTo({
  //   top: 0,
  //   left: 0,
  //   behavior: "smooth"
  // })
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

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

const getFullDate = (isWeekDay, ISODate) => {
  const newDateObj = new Date(ISODate);
  const toMonth = newDateObj.getMonth() + 1;
  const toYear = newDateObj.getFullYear();
  const toDate = newDateObj.getDate();
  const toHour = newDateObj.getHours();
  const toMinutes = newDateObj.getMinutes();
  const toSeconds = newDateObj.getSeconds();
  const DOW = newDateObj.getDay()
  const dateTemplate = `${toDate.pad(2)}/${(toMonth).pad(2)}/${toYear} ${toHour.pad(2)}:${toMinutes.pad(2)}:${toSeconds.pad(2)}`;
  // console.log(dateTemplate)
  return dateTemplate;
}

const apiUpdateComment = (actionType, comment, id = null, childOf = null) => {
  let csrf = document.getElementById("csrf").innerText;
  let xhr = new XMLHttpRequest();
  xhr.open(
      "POST",
      `../../api/blogs/blog.php`,
      true
  )
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
      swal.close();
      if (xhr.status === 200 && xhr.readyState === 4) {
        let commentID = parseInt(xhr.responseText);
        if (actionType === 0) {
          if (childOf === null) {
            commentsDiv.innerHTML = `
            <div class="comment" data-id="${commentID}" id="comment-${commentID}">
              <div class="comment-inline" id="comment-inline-${commentID}">
                <a href="./../search?user=${comment.author}"><img
                    class="commentor-img" 
                    src="${currentUser?.image|| ""}"
                    alt=""></img></a>
                <div class="comment-content" id="comment-content-${commentID}">
                  <div class="content" id="content-${commentID}">
                    <div class="d-flex align-items-center justify-content-between">
                      <p class="comment-author">
                        <a href="./../search?user=${uid}">${currentUser?.display_name || currentUser?.email || ""}</a>
                      </p>
                      <p class="comment-date ml-3">${getFullDate(false, new Date().toISOString())}</p>
                    </div>
                    <p class="comment-text">
                      ${comment}
                    </p>
                  </div>
                  <div class="editor d-none" id="editor-${commentID}">
                    <textarea class="comment-editor" id="comment-editor-${commentID}" data-id="${commentID}" 
                    rows="4"></textarea>
                    <p>Press Esc to <a class="blue-a" href="">cancel</a>.</p>
                  </div>
                </div>
                <div class="d-flex flex-column align-items-center justify-content-center comment-btn-block">
                    <button class="post-btn btn btn-sm d-flex align-items-center dropdown-toggle" type="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="edit-drop-down">
                      <a class="dropdown-item comment-edit" style="cursor: pointer;" data-id="${commentID}">Edit</a>
                      <a class="dropdown-item comment-reply-btn" style="cursor: pointer;" data-id="${commentID}">Reply</a>
                      <a class="dropdown-item comment-delete" style="cursor: pointer;" data-id="${commentID}">Delete</a>
                    </div>
                </div>
              </div>
              <div class="reply-expand">
              </div>
              <div class="reply-section d-none" id="reply-section-${commentID}">
                <div class="comment-reply" data-id="${commentID}">
                  <div class="replies" id="replies-${commentID}">
                  </div>
                  <div class="comment-input-div-inline">
                    <a><img
                      class="commentor-img" 
                      id="comment-input-author-img"
                      src="${currentUser?.image || ""}"
                      alt=""></img></a>
                    <input data-reply="${commentID}" type="text" id="comment" placeholder="write reply...">
                  </div>
                </div>
              </div>
            </div>
          ` + commentsDiv.innerHTML;
          if (commentBox)
            commentBox.value="";
          } else {
            let getContainer = document.getElementById(`replies-${childOf}`);
            getContainer.innerHTML += `
              <div class="comment" data-id="${commentID}" id="comment-${commentID}">
                <div class="comment-inline" id="comment-inline-${commentID}">
                  <a href="./../search?user=${currentUser?.author || ""}"><img
                      class="commentor-img" 
                      src="${currentUser?.image || ""}"
                      alt=""></img></a>
                  <div class="comment-content" id="comment-content-${commentID}">
                    <div class="content" id="content-${commentID}">
                      <div class="d-flex align-items-center justify-content-between">
                        <p class="comment-author">
                          <a href="./../search?user=${currentUser?.author || ""}">${currentUser?.display_name || currentUser?.email || ""}</a>
                        </p>
                        <p class="comment-date ml-3">${getFullDate(false, new Date().toISOString())}</p>
                      </div>
                      <p class="comment-text">
                        ${comment}
                      </p>
                    </div>
                    <div class="editor d-none" id="editor-${commentID}">
                      <textarea class="comment-editor" 
                      data-id="${commentID}" 
                      id="comment-editor-${commentID}" rows="4"></textarea>
                      <p>Press Esc to <a class="blue-a" href="">cancel</a>.</p>
                    </div>
                  </div>
<div class="d-flex flex-column align-items-center justify-content-center comment-btn-block">
                    <button class="post-btn btn btn-sm d-flex align-items-center dropdown-toggle" type="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="edit-drop-down">
                      <a class="dropdown-item comment-edit" style="cursor: pointer;" data-id="${commentID}">Edit</a>
                      <a class="dropdown-item comment-delete" style="cursor: pointer;" data-id="${commentID}">Delete</a>
                    </div>
                  </div>
                </div>
              </div>
            `
          }

          commentEventListeners();

          if (childOf === null) {
            comments.unshift({
              comment_id: commentID,
              post_id: parseInt(blogID),
              author: uid,
              content: comment,
              date_created: new Date().toISOString(),
              display_name: currentUser?.display_name || "",
              email: currentUser?.email || "",
              image: currentUser?.image || "",
              childOf: null
            })
          } else {
            comments.forEach(c => {
              if (c.comment_id === parseInt(childOf)) {
                c.childComments.push({
                  comment_id: commentID,
                  post_id: parseInt(blogID),
                  author: uid,
                  content: comment,
                  date_created: new Date().toISOString(),
                  display_name: currentUser?.display_name || "",
                  email: currentUser?.email || "",
                  image: currentUser?.image || "",
                  childOf: parseInt(childOf)
                })
                return;
              }
            })
          }
        } else if (actionType === 1) {
          comments.forEach(c => {
            if (c.comment_id === parseInt(id)) {
              c.content = comment;
              return;
            }

            c.childComments.forEach(childComment => {
              if (childComment.comment_id === parseInt(id)) {
                childComment.content = comment;
                return;
              }
            })
          })
        } else if (actionType === 2) {

          document.getElementById(`comment-${id}`).remove();

          let slideIndex = -1;
          let breakCondition = false;
          comments.forEach((c, index) => {
            if (!breakCondition) {
              if (c.comment_id === parseInt(id)) {
                slideIndex = index;
                breakCondition = true;
              }
              
              let childSlideIndex = -1;
              c.childComments.forEach((childComment, index2) => {
                if (childComment.comment_id === parseInt(id)) {
                  childSlideIndex = index2;
                }
              })
              if (childSlideIndex != -1) {
                c.childComments.splice(childSlideIndex, 1);
                breakCondition = true;
              }
            }
          })
          if (slideIndex != -1) {
            comments.splice(slideIndex, 1);
            return;
          }
        }
document.getElementById(`comment-${commentID}`).scrollIntoView({
          behavior: "smooth"
        })
      } else {
          Swal.fire({
              icon: "error",
              text: "Error occured."
          }).then(() => {
              location.replace("./../");
          })
      }
  }

  let additionalParam = childOf != null? `&childOf=${childOf}` : "";
  let additionalParam2 = id != null? `&originalID=${id}` : "";

  xhr.send(`updateComment&uid=${uid}&blog_id=${blogID}&type=${actionType}&comment=${encodeURIComponent(comment)}&csrf=${csrf}${additionalParam}${additionalParam2}`);
}

const newComment = (content, childOf = null) => {
  apiUpdateComment(0, content, null, childOf);
}

function recreateNode(el, withChildren) {
  if (withChildren) {
    el.parentNode.replaceChild(el.cloneNode(true), el);
  }
  else {
    var newEl = el.cloneNode(false);
    while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
    el.parentNode.replaceChild(newEl, el);
  }
}

const commentEventListeners = () => {

  if (uid === "") {
    document.querySelectorAll(".comment-input-div-inline").forEach(comment => {
      comment.style.display = "none";
    })
  }

  document.querySelectorAll("#comment").forEach((comment) => {
    let cloneNode = comment.cloneNode(true);
    comment.parentNode.replaceChild(cloneNode, comment);
    comment = cloneNode;

    comment.addEventListener("keypress", (e) => {
      if (e.which === 13) {
        let replyID = comment.getAttribute("data-reply");
        if (comment.value.length <= 0 || comment.value.length > 1000) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Comments cannot be blank or too long!",
            showCloseButton: true,
          });
          return;
        }
        if (replyID) {
          newComment(comment.value, replyID);
        } else {
          newComment(comment.value);
        }
        comment.value = "";
      }
    })
  })

  document.querySelectorAll(".comment-reply-btn").forEach((comment) => {
    let cloneNode = comment.cloneNode(true);
    comment.parentNode.replaceChild(cloneNode, comment);
    comment = cloneNode;

    comment.addEventListener("click", (e) => {
      e.preventDefault();
      let getID = comment.getAttribute("data-id");
      let getReplyList = document.getElementById(`reply-section-${getID}`);
      if (getReplyList.classList.contains("d-none"))
        getReplyList.classList.remove("d-none");
    })
  })

  document.querySelectorAll(".view-reply-text").forEach((comment) => {
    let cloneNode = comment.cloneNode(true);
    comment.parentNode.replaceChild(cloneNode, comment);
    comment = cloneNode;

    comment.addEventListener("click", (e) => {
      e.preventDefault();
      let getID = comment.getAttribute("data-id");
      let getReplyList = document.getElementById(`reply-section-${getID}`);
      if (getReplyList.classList.contains("d-none"))
        getReplyList.classList.remove("d-none");
      comment.style.display = "none";
    })
  })

  document.querySelectorAll(".comment-edit").forEach((comment) => {
    let cloneNode = comment.cloneNode(true);
    comment.parentNode.replaceChild(cloneNode, comment);
    comment = cloneNode;
    
    comment.addEventListener("click", (e) => {
      e.preventDefault();
      let getID = comment.getAttribute("data-id");

      let getEditor = document.getElementById(`editor-${getID}`);
      let getContent = document.getElementById(`content-${getID}`);

      let commentContent = getContent.querySelector(".comment-text").innerText;

      if (!getContent.classList.contains("d-none")) {
        getContent.classList.add("d-none");
      }

      if (getEditor.classList.contains("d-none")) {
        getEditor.classList.remove("d-none");
      }

      let getComment = document.getElementById(`comment-${getID}`);
      if (!getComment.classList.contains("comment-edit")) {
        getComment.classList.add("comment-edit");
      }

      let getCommentContent = document.getElementById(`comment-content-${getID}`);
      if (!getCommentContent.classList.contains("comment-content-edit")) {
        getCommentContent.classList.add("comment-content-edit");
      }

      let getCommentInline = document.getElementById(`comment-inline-${getID}`);
      if (!getCommentInline.classList.contains("comment-content-edit")) {
        getCommentInline.classList.add("comment-content-edit");
      }

      let getCommentEditor = document.getElementById(`comment-editor-${getID}`);
      getCommentEditor.innerText = commentContent;
      getCommentEditor.selectionStart = getCommentEditor.selectionEnd = getCommentEditor.value.length;
      getCommentEditor.focus();

      getCommentEditor.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          if (getContent.classList.contains("d-none")) {
            getContent.classList.remove("d-none");
          }
    
          if (!getEditor.classList.contains("d-none")) {
            getEditor.classList.add("d-none");
          }

          if (getComment.classList.contains("comment-edit")) {
            getComment.classList.remove("comment-edit");
          }

          if (getCommentContent.classList.contains("comment-content-edit")) {
            getCommentContent.classList.remove("comment-content-edit");
          }

          if (getCommentInline.classList.contains("comment-content-edit")) {
            getCommentInline.classList.remove("comment-content-edit");
          }
        } else if (e.key === "Enter") {
          let getID = getCommentEditor.getAttribute("data-id");

          if (getCommentEditor.length <= 0 || getCommentEditor.length > 1000) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Comments cannot be blank or too long!",
              showCloseButton: true,
            });
            return;
          }

          apiUpdateComment(1, getCommentEditor.value, getID, null);

          if (getContent.classList.contains("d-none")) {
            getContent.classList.remove("d-none");
          }

          getContent.querySelector(".comment-text").innerText = getCommentEditor.value;
    
          if (!getEditor.classList.contains("d-none")) {
            getEditor.classList.add("d-none");
          }

          if (getComment.classList.contains("comment-edit")) {
            getComment.classList.remove("comment-edit");
          }

          if (getCommentContent.classList.contains("comment-content-edit")) {
            getCommentContent.classList.remove("comment-content-edit");
          }

          if (getCommentInline.classList.contains("comment-content-edit")) {
            getCommentInline.classList.remove("comment-content-edit");
          }
        }
      })

      let getBlueA = getEditor.querySelector(".blue-a");
      getBlueA.addEventListener("click", (e) => {
        e.preventDefault();
        if (getContent.classList.contains("d-none")) {
          getContent.classList.remove("d-none");
        }
  
        if (!getEditor.classList.contains("d-none")) {
          getEditor.classList.add("d-none");
        }

        if (getComment.classList.contains("comment-edit")) {
          getComment.classList.remove("comment-edit");
        }

        if (getCommentContent.classList.contains("comment-content-edit")) {
          getCommentContent.classList.remove("comment-content-edit");
        }

        if (getCommentInline.classList.contains("comment-content-edit")) {
          getCommentInline.classList.remove("comment-content-edit");
        }
      })

    })
  })

  document.querySelectorAll(".comment-delete").forEach((comment) => {
    let cloneNode = comment.cloneNode(true);
    comment.parentNode.replaceChild(cloneNode, comment);
    comment = cloneNode;
    
    comment.addEventListener("click", (e) => {
      e.preventDefault();
      let getID = comment.getAttribute("data-id");

      Swal.fire({
        title: 'Are you sure want to delete this comment?',
        text: 'You cannot recover after deleted.',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red'
      }).then((result) => {
          if (result.isConfirmed) {
            apiUpdateComment(2,  '', getID, null);
          }
      })
    })
  })
}

const printComments = (start) => {
  start = parseInt(start);

  if (start === 0)
    commentsDiv.innerHTML = "";
  let html = ``;

  let commentsToPrint = [...comments]
  let end = Math.min(start + 5, comments.length);
  commentsToPrint = commentsToPrint.slice(start, end);

  commentsToPrint.forEach(comment => {
    //Build for reply
    let reply = "";

    let dropdownHTML = ``;
    if (comment.author === uid) {
      dropdownHTML += `
        <a class="dropdown-item comment-edit" style="cursor: pointer;" data-id="${comment.comment_id}">Edit</a>
        <a class="dropdown-item comment-reply-btn" style="cursor: pointer;" data-id="${comment.comment_id}">Reply</a>
        <a class="dropdown-item comment-delete" style="cursor: pointer;" data-id="${comment.comment_id}">Delete</a>
      `
    } else {
      dropdownHTML += `
        <a class="dropdown-item comment-reply-btn" style="cursor: pointer;" data-id="${comment.comment_id}">Reply</a>
      `
    }

    comment.childComments.forEach(childComment => {
      let childDropdownHTML = ``;
      if (childComment.author === uid) {
        childDropdownHTML += `
          <div class="d-flex flex-column align-items-center justify-content-center comment-btn-block">
            <button class="post-btn btn btn-sm d-flex align-items-center dropdown-toggle" type="button"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="edit-drop-down">
              <a class="dropdown-item comment-edit" style="cursor: pointer;" data-id="${childComment.comment_id}">Edit</a>
              <a class="dropdown-item comment-delete" style="cursor: pointer;" data-id="${childComment.comment_id}">Delete</a>
            </div>
          </div>
        `
      } 

      reply += `
        <div class="comment" data-id="${childComment.comment_id}" id="comment-${childComment.comment_id}">
          <div class="comment-inline" id="comment-inline-${childComment.comment_id}">
            <a href="./../search?user=${childComment.author}"><img
                class="commentor-img" 
                src="${childComment.image}"
                alt=""></img></a>
            <div class="comment-content" id="comment-content-${childComment.comment_id}">
              <div class="content" id="content-${childComment.comment_id}">
                <div class="d-flex align-items-center justify-content-between">
                  <p class="comment-author">
                    <a href="./../search?user=${childComment.author}">${childComment.display_name || childComment.email}</a>
                  </p>
                  <p class="comment-date ml-3">${getFullDate(false, childComment.date_created)}</p>
                </div>
                <p class="comment-text">
                  ${childComment.content}
                </p>
              </div>
              <div class="editor d-none" id="editor-${childComment.comment_id}">
                <textarea class="comment-editor" 
                data-id="${childComment.comment_id}" 
                id="comment-editor-${childComment.comment_id}" rows="4"></textarea>
                <p>Press Esc to <a class="blue-a" href="">cancel</a>.</p>
              </div>
            </div>
            ${childDropdownHTML}
          </div>
        </div>
      `
    });

    let replyExpandText = comment.childComments.length > 0? 
    `
    <a style="cursor: pointer" class="view-reply-text" data-id="${comment.comment_id}"><i class="fa fa-share"></i>
    view ${comment.childComments.length} ${comment.childComments.length == 1? 'reply' : 'replies'}</a>`
    : "";

    html += `
      <div class="comment" data-id="${comment.comment_id}" id="comment-${comment.comment_id}">
        <div class="comment-inline" id="comment-inline-${comment.comment_id}">
          <a href="./../search?user=${comment.author}"><img
              class="commentor-img" 
              src="${comment.image}"
              alt=""></img></a>
          <div class="comment-content" id="comment-content-${comment.comment_id}">
            <div class="content" id="content-${comment.comment_id}">
              <div class="d-flex align-items-center justify-content-between">
                <p class="comment-author">
                  <a href="./../search?user=${comment.author}">${comment.display_name || comment.email}</a>
                </p>
                <p class="comment-date ml-3">${getFullDate(false, comment.date_created)}</p>
              </div>
              <p class="comment-text">
                ${comment.content}
              </p>
            </div>
            <div class="editor d-none" id="editor-${comment.comment_id}">
              <textarea class="comment-editor" id="comment-editor-${comment.comment_id}" data-id="${comment.comment_id}" 
              rows="4"></textarea>
              <p>Press Esc to <a class="blue-a" href="">cancel</a>.</p>
            </div>
          </div>
          <div class="d-flex flex-column align-items-center justify-content-center comment-btn-block">
              <button class="post-btn btn btn-sm d-flex align-items-center dropdown-toggle" type="button"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="edit-drop-down">
                  ${dropdownHTML}
              </div>
          </div>
        </div>
        <div class="reply-expand">
        ${replyExpandText}
        </div>
        <div class="reply-section d-none" id="reply-section-${comment.comment_id}">
          <div class="comment-reply" data-id="${comment.comment_id}">
            <div class="replies" id="replies-${comment.comment_id}">
              ${reply}
            </div>
            <div class="comment-input-div-inline">
              <a><img
                class="commentor-img" 
                id="comment-input-author-img"
                src="${currentUser?.image || ""}"
                alt=""></img></a>
              <input data-reply="${comment.comment_id}" type="text" id="comment" placeholder="write reply...">
            </div>
          </div>
        </div>
      </div>
    `
  });

  let viewMore = document.getElementById("view-more-comment");
  if (viewMore) {
    viewMore.remove();
  }

  end -= 1;

  if (end < comments.length - 1) {
    let seeMoreHTML = `
      <a style="cursor: pointer" id="view-more-comment" data-start=${end + 1}><i class="fa fa-share"></i>
      view ${comments.length - 1 - end} ${comments.length - 1 - end > 1? 'comments' : 'comment'}</a>`

      html += seeMoreHTML;
  }

  commentsDiv.innerHTML += html;

  commentEventListeners();
  setSeeMoreEvent();
  if (commentBox) {
    commentBox.value="";
  }
}

const setSeeMoreEvent = () => {
  let viewMore = document.getElementById("view-more-comment");
  if (viewMore) {
    viewMore.addEventListener("click", () => {
      let getStart = viewMore.getAttribute("data-start");
      printComments(getStart);
    })
  }
}