let uid;
let categories = [];
let topPosts = [];

document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      uid = user.uid;

      getTopPosts();
      getCategories();

      document.getElementById("search").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            let query = e.target.value;
            window.location = `./search?query=${query}`
        }
      })
    } else {
      uid = "";
      getTopPosts();
      getCategories();

      document.getElementById("search").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            let query = e.target.value;
            window.location = `./search?query=${query}`
        }
      })

      document.querySelector(".btn-create-div").style.display = "none";
    }
  })
})

const getTopPosts = () => {
  const xhr = new XMLHttpRequest();
  let csrf = "";
  csrf = document.getElementById("csrf").innerText;

  xhr.open(
      "GET",
      `../api/blogs/blog.php?getTopPosts&csrf=${csrf}`,
      true
  )

  xhr.onload = function() {
      if(this.status == 200) {
        topPosts = JSON.parse(xhr.responseText);
        printTopPosts();
      } else {
          
      }
  }

  xhr.send();
}

const getCategories = () => {
  const xhr = new XMLHttpRequest();
  let csrf = "";
  csrf = document.getElementById("csrf").innerText;

  xhr.open(
      "GET",
      `../api/blogs/create.php?getCategories&csrf=${csrf}`,
      true
  )

  xhr.onload = function() {
      if(this.status == 200) {
          categories = JSON.parse(xhr.responseText);
          
          let html = ``;
          let container = document.querySelector('.categories');
          categories.forEach(category => {
            html += `<p class="category-item" data-id="${category.category_id}">${category.category_name}</p>`
          })
          container.innerHTML = html;

          document.querySelectorAll(".category-item").forEach(item => {
            item.addEventListener("click", () => {
              let getID = item.getAttribute("data-id");
              window.location = `./search?category=${getID}`
            })
          });
      } else {
          
      }
  }

  xhr.send();
}

const printTopPosts = () => {
  let amount = topPosts.length;

  if (topPosts.length > 1) {
    let topPost = topPosts[0];
    document.getElementById("post-cover-img").setAttribute("src", topPost.cover.replace('../../', '../'));
    document.getElementById("author-img").setAttribute("src", topPost.image.replace('../../', '../'))
    document.getElementById("post-author-name").innerHTML = topPost.display_name || topPost.email;
    document.getElementById("post-title").innerHTML = topPost.title;

    document.getElementById("post-title").addEventListener("click", () => {
      window.location = `./post?id=${topPost.post_id}`
    })

    document.getElementById("post-cover-img").addEventListener("click", () => {
      window.location = `./post?id=${topPost.post_id}`
    })

    document.getElementById("author-img").addEventListener("click", () => {
      window.location = `./search?user=${topPost.author}`
    })

    document.getElementById("post-author-name").addEventListener("click", () => {
      window.location = `./search?user=${topPost.author}`
    })
  }

  let resultHTML = '';

  let firstPost = ``;
  let secondPost = ``;
  let thirdPost = ``;

  for (let i = 1; i <= Math.min(3, topPosts.length - 1); i++) {
    if (i - 1 == 0 && i < topPosts.length) {
        firstPost = `
            <div class="post-result">
                <a href="./post?id=${topPosts[i].post_id}">
                    <img alt="" src="${topPosts[i].cover.replace('../../', '../')}" class="post-result-cover-img">
                </a>
                <div class="post-detail">
                    <div class="author d-flex align-items-center justify-content-start">
                        <a href="./search?user=${topPosts[i].author}">
                        <img
                        class="post-author-img" 
                        src="${topPosts[i].image.replace('../../', '../')}"
                        alt=""></img>
                        </a>
                        <h5 class="post-author-name">
                        <a href="./search?user=${topPosts[i].author}">
                            ${topPosts[i].display_name || topPosts[i].email}    
                        </a>
                        </h5>
                    </div>
                    <h2 class="post-title">
                        <a href="./post?id=${topPosts[i].post_id}">
                            ${topPosts[i].title.length > 45? 
                            topPosts[i].title.substring(0, 45) + "..." : 
                            topPosts[i].title}
                        </a>
                    </h2>
                </div>
            </div>
        `
    }

    if (i - 1 == 1 && i < topPosts.length) {
        secondPost = `
            <div class="post-result">
                <a href="./post?id=${topPosts[i].post_id}">
                    <img alt="" src="${topPosts[i].cover.replace('../../', '../')}" class="post-result-cover-img">
                </a>
                <div class="post-detail">
                    <div class="author d-flex align-items-center justify-content-start">
                        <a href="./search?user=${topPosts[i].author}">
                        <img
                        class="post-author-img" 
                        src="${topPosts[i].image.replace('../../', '../')}"
                        alt=""></img>
                        </a>
                        <h5 class="post-author-name">
                        <a href="./search?user=${topPosts[i].author}">
                            ${topPosts[i].display_name || topPosts[i].email}    
                        </a>
                        </h5>
                    </div>
                    <h2 class="post-title">
                        <a href="./post?id=${topPosts[i].post_id}">
                            ${topPosts[i].title.length > 45? 
                            topPosts[i].title.substring(0, 45) + "..." : 
                            topPosts[i].title}
                        </a>
                    </h2>
                </div>
            </div>
        `
    }

    if (i - 1 == 2 && i < topPosts.length) {
        thirdPost = `
            <div class="post-result">
                <a href="./post?id=${topPosts[i].post_id}">
                    <img alt="" src="${topPosts[i].cover.replace('../../', '../')}" class="post-result-cover-img">
                </a>
                <div class="post-detail">
                    <div class="author d-flex align-items-center justify-content-start">
                        <a href="./search?user=${topPosts[i].author}">
                        <img
                        class="post-author-img" 
                        src="${topPosts[i].image.replace('../../', '../')}"
                        alt=""></img>
                        </a>
                        <h5 class="post-author-name">
                        <a href="./search?user=${topPosts[i].author}">
                            ${topPosts[i].display_name || topPosts[i].email}    
                        </a>
                        </h5>
                    </div>
                    <h2 class="post-title">
                        <a href="./post?id=${topPosts[i].post_id}">
                            ${topPosts[i].title.length > 45? 
                            topPosts[i].title.substring(0, 45) + "..." : 
                            topPosts[i].title}
                        </a>
                    </h2>
                </div>
            </div>
        `
    }
  }

  resultHTML += `
  <div class="row">
      <div style="height: 400px;" class="post-grid-span col-md-8 col-12 pl-0 pr-md-2 pr-0
      ${amount >= 2? '' : 'h-0'}">
          ${firstPost}
      </div>
      <div class="col-md-4 pl-0 col-12 pr-0 large-vertical-grid large-vertical-grid-right">
          ${secondPost}
          ${thirdPost}
      </div>
  </div>
  `

  if (topPosts.length > 4) {
    let fourthPost = ``;
    let fifthPost = ``;
    let sixthPost = ``;

    for (let i = 4; i <= Math.min(6, topPosts.length - 1); i++) {
        if (i - 1 == 3 && i < topPosts.length) {
            fourthPost = `
                <div class="post-result">
                    <a href="./post?id=${topPosts[i].post_id}">
                        <img alt="" src="${topPosts[i].cover.replace('../../', '../')}" class="post-result-cover-img">
                    </a>
                    <div class="post-detail">
                        <div class="author d-flex align-items-center justify-content-start">
                            <a href="./search?user=${topPosts[i].author}">
                            <img
                            class="post-author-img" 
                            src="${topPosts[i].image.replace('../../', '../')}"
                            alt=""></img>
                            </a>
                            <h5 class="post-author-name">
                            <a href="./search?user=${topPosts[i].author}">
                                ${topPosts[i].display_name || topPosts[i].email}    
                            </a>
                            </h5>
                        </div>
                        <h2 class="post-title">
                            <a href="./post?id=${topPosts[i].post_id}">
                                ${topPosts[i].title.length > 45? 
                                topPosts[i].title.substring(0, 45) + "..." : 
                                topPosts[i].title}
                            </a>
                        </h2>
                    </div>
                </div>
            `
        }

        if (i - 1 == 4 && i < topPosts.length) {
            fifthPost = `
                <div class="post-result">
                    <a href="./post?id=${topPosts[i].post_id}">
                        <img alt="" src="${topPosts[i].cover.replace('../../', '../')}" class="post-result-cover-img">
                    </a>
                    <div class="post-detail">
                        <div class="author d-flex align-items-center justify-content-start">
                            <a href="./search?user=${topPosts[i].author}">
                            <img
                            class="post-author-img" 
                            src="${topPosts[i].image.replace('../../', '../')}"
                            alt=""></img>
                            </a>
                            <h5 class="post-author-name">
                            <a href="./search?user=${topPosts[i].author}">
                                ${topPosts[i].display_name || topPosts[i].email}    
                            </a>
                            </h5>
                        </div>
                        <h2 class="post-title">
                            <a href="./post?id=${topPosts[i].post_id}">
                                ${topPosts[i].title.length > 45? 
                                topPosts[i].title.substring(0, 45) + "..." : 
                                topPosts[i].title}
                            </a>
                        </h2>
                    </div>
                </div>
            `
        }

        if (i - 1 == 5 && i < topPosts.length) {
            sixthPost = `
                <div class="post-result">
                    <a href="./post?id=${topPosts[i].post_id}">
                        <img alt="" src="${topPosts[i].cover.replace('../../', '../')}" class="post-result-cover-img">
                    </a>
                    <div class="post-detail">
                        <div class="author d-flex align-items-center justify-content-start">
                            <a href="./search?user=${topPosts[i].author}">
                            <img
                            class="post-author-img" 
                            src="${topPosts[i].image.replace('../../', '../')}"
                            alt=""></img>
                            </a>
                            <h5 class="post-author-name">
                            <a href="./search?user=${topPosts[i].author}">
                                ${topPosts[i].display_name || topPosts[i].email}    
                            </a>
                            </h5>
                        </div>
                        <h2 class="post-title">
                            <a href="./post?id=${topPosts[i].post_id}">
                                ${topPosts[i].title.length > 45? 
                                topPosts[i].title.substring(0, 45) + "..." : 
                                topPosts[i].title}
                            </a>
                        </h2>
                    </div>
                </div>
            `
        }
    }    

    resultHTML += `
    <div class="row pt-2">
        <div class="col-md-4 pl-0 col-12 pr-0 large-vertical-grid large-vertical-grid-right">
            ${fourthPost}
            ${fifthPost}
        </div>
        <div style="${amount === 7? 'height: 400px;' : 'height: 0px;'}" class="post-grid-span col-md-8 col-12 pl-md-2 pl-0 pr-0
        ${amount === 7? '' : 'h-0'}">
            ${sixthPost}
        </div>
    </div>
    `
  }

  document.querySelector(".posts").innerHTML = resultHTML;
}