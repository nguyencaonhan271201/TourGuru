let uid;
let category;
let query;
let author;
let searchTitle;
let searchResults = [];
let currentPage = 1;
let numberOfPages = 0;

document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      uid = user.uid;
    }

    searchTitle = document.getElementById("search-title");

      let urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("user")) {
        author = urlParams.get("user");
        findPostsByAuthor(author);
      } else if (urlParams.has("category")) {
        category = parseInt(urlParams.get("category"));
        findPostsByCategory(category);
      } else if (urlParams.has("query")) {
        query = urlParams.get("query");
        findPostsByQuery(query);
      } else {
        searchTitle.innerHTML = "search posts"
      }

    document.getElementById("search").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let query = e.target.value;
        window.location = `./../search?query=${query}`
    }
    })
  })
})

const findPostsByAuthor = (author) => {
  let csrf = document.getElementById("csrf").innerText;
  let xhr = new XMLHttpRequest();
  xhr.open(
      "GET",
      `../../api/blogs/search.php?findPostsByAuthor&author=${author}&csrf=${csrf}`,
      true
  )
  xhr.onload = () => {
      swal.close();
      if (xhr.status === 200 && xhr.readyState === 4) {
        //Nhận thông tin và lưu vào danh mục
        let result = JSON.parse(xhr.responseText); 
        if (result[0] === 1)  {
          //There are available results
          searchTitle.innerHTML = result[1].display_name || result[1].email;
          document.getElementById("title-author-img").setAttribute("src", result[1].image);
          document.getElementById("title-author-img").style.display = "block";
          document.getElementById("found-text").style.display = "block";
          document.getElementById("found-text").innerHTML = `found ${result.length - 1} ${result.length - 1 > 1? 'posts' : 'post'}`

          searchResults = [...result];
          searchResults.splice(0, 1);

          printPagination();
          printPosts(0, Math.min(5, searchResults.length - 1))
        } else {
          searchTitle.innerHTML = result[1].display_name || result[1].email;
          document.getElementById("title-author-img").setAttribute("src", result[1].image);
          document.getElementById("title-author-img").style.display = "block";
          document.getElementById("found-text").style.display = "block";
          document.getElementById("found-text").innerHTML = "no posts found"
        }
      } else {
          Swal.fire({
              icon: "error",
 text: "Error occured. Author is not valid."
          }).then(() => {
              location.replace("./../");
          })
      }
  }
  xhr.send();
}

const findPostsByCategory = (category) => {
  let csrf = document.getElementById("csrf").innerText;
  let xhr = new XMLHttpRequest();
  xhr.open(
      "GET",
      `../../api/blogs/search.php?findPostsByCategory&category=${category}&csrf=${csrf}`,
      true
  )
  xhr.onload = () => {
      swal.close();
      if (xhr.status === 200 && xhr.readyState === 4) {
        //Nhận thông tin và lưu vào danh mục
        let result = JSON.parse(xhr.responseText); 
        if (result[0] === 1)  {
            //There are available results
            searchTitle.innerHTML = `category: ${result[1].category_name}`;
            document.getElementById("found-text").style.display = "block";
            document.getElementById("found-text").innerHTML = `found ${result.length - 1} ${result.length - 1 > 1? 'posts' : 'post'}`
  
            searchResults = [...result];
            searchResults.splice(0, 1);
  
            printPagination();
            printPosts(0, Math.min(5, searchResults.length - 1))
          } else {
            searchTitle.innerHTML = `category: ${result[1].category_name}`;
            document.getElementById("found-text").style.display = "block";
            document.getElementById("found-text").innerHTML = "no posts found"
          }
      } else {
          Swal.fire({
              icon: "error",
text: "Error occured. Category is not valid."
          }).then(() => {
              location.replace("./../");
          })
      }
  }
  xhr.send();
}

const findPostsByQuery = (query) => {
  let csrf = document.getElementById("csrf").innerText;
  let xhr = new XMLHttpRequest();
  xhr.open(
      "GET",
      `../../api/blogs/search.php?findPostsByQuery&query=${query}&csrf=${csrf}`,
      true
  )
  xhr.onload = () => {
      swal.close();
      if (xhr.status === 200 && xhr.readyState === 4) {
        //Nhận thông tin và lưu vào danh mục
        let result = JSON.parse(xhr.responseText); 
        if (result.length > 0)  {
            //There are available results
            searchTitle.innerHTML = `keyword: '${query}'`;
            document.getElementById("found-text").style.display = "block";
            document.getElementById("found-text").innerHTML = `found ${result.length} ${result.length > 1? 'posts' : 'post'}`
  
            searchResults = [...result];
  
            printPagination();
            printPosts(0, Math.min(5, searchResults.length - 1))
          } else {
            searchTitle.innerHTML = `keyword: '${query}'`;
            document.getElementById("found-text").style.display = "block";
            document.getElementById("found-text").innerHTML = "no posts found"
          }
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

const printPosts = (start, end) => {
    let amount = end - start + 1;
    let resultHTML = '';

    let firstPost = ``;
    let secondPost = ``;
    let thirdPost = ``;

    for (let i = start; i <= Math.min(start + 2, end); i++) {
        if (i - start == 0 && i < searchResults.length) {
            firstPost = `
                <div class="post-result">
                    <a href="./../post?id=${searchResults[i].post_id}">
                        <img alt="" src="${searchResults[i].cover}" class="post-result-cover-img">
                    </a>
                    <div class="post-detail">
                        <div class="author d-flex align-items-center justify-content-start">
                            <a href="./../search?user=${searchResults[i].author}">
                            <img
                            class="post-author-img" 
                            src="${searchResults[i].image}"
                            alt=""></img>
                            </a>
                            <h5 class="post-author-name">
                            <a href="./../search?user=${searchResults[i].author}">
                                ${searchResults[i].display_name || searchResults[i].email}    
                            </a>
                            </h5>
                        </div>
                        <h2 class="post-title">
                            <a href="./../post?id=${searchResults[i].post_id}">
                                ${searchResults[i].title.length > 45? 
                                searchResults[i].title.substring(0, 45) + "..." : 
                                searchResults[i].title}
                            </a>
                        </h2>
                    </div>
                </div>
            `
        }

        if (i - start == 1 && i < searchResults.length) {
            secondPost = `
                <div class="post-result">
                    <a href="./../post?id=${searchResults[i].post_id}">
                        <img alt="" src="${searchResults[i].cover}" class="post-result-cover-img">
                    </a>
                    <div class="post-detail">
                        <div class="author d-flex align-items-center justify-content-start">
                            <a href="./../search?user=${searchResults[i].author}">
                            <img
                            class="post-author-img" 
                            src="${searchResults[i].image}"
                            alt=""></img>
                            </a>
                            <h5 class="post-author-name">
                            <a href="./../search?user=${searchResults[i].author}">
                                ${searchResults[i].display_name || searchResults[i].email}    
                            </a>
                            </h5>
                        </div>
                        <h2 class="post-title">
                            <a href="./../post?id=${searchResults[i].post_id}">
                                ${searchResults[i].title.length > 45? 
                                searchResults[i].title.substring(0, 45) + "..." : 
                                searchResults[i].title}
                            </a>
                        </h2>
                    </div>
                </div>
            `
        }

        if (i - start == 2 && i < searchResults.length) {
            thirdPost = `
                <div class="post-result">
                    <a href="./../post?id=${searchResults[i].post_id}">
                        <img alt="" src="${searchResults[i].cover}" class="post-result-cover-img">
                    </a>
                    <div class="post-detail">
                        <div class="author d-flex align-items-center justify-content-start">
                            <a href="./../search?user=${searchResults[i].author}">
                            <img
                            class="post-author-img" 
                            src="${searchResults[i].image}"
                            alt=""></img>
                            </a>
                            <h5 class="post-author-name">
                            <a href="./../search?user=${searchResults[i].author}">
                                ${searchResults[i].display_name || searchResults[i].email}    
                            </a>
                            </h5>
                        </div>
                        <h2 class="post-title">
                            <a href="./../post?id=${searchResults[i].post_id}">
                                ${searchResults[i].title.length > 45? 
                                searchResults[i].title.substring(0, 45) + "..." : 
                                searchResults[i].title}
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
        ${amount >= 1? '' : 'h-0'}">
            ${firstPost}
        </div>
        <div class="col-md-4 pl-0 col-12 pr-0 large-vertical-grid large-vertical-grid-right">
            ${secondPost}
            ${thirdPost}
        </div>
    </div>
    `

    if (amount > 3) {
        let fourthPost = ``;
        let fifthPost = ``;
        let sixthPost = ``;

        for (let i = start + 3; i <= Math.min(start + 5, end); i++) {
            if (i - start == 3 && i < searchResults.length) {
                fourthPost = `
                    <div class="post-result">
                        <a href="./../post?id=${searchResults[i].post_id}">
                            <img alt="" src="${searchResults[i].cover}" class="post-result-cover-img">
                        </a>
                        <div class="post-detail">
                            <div class="author d-flex align-items-center justify-content-start">
                                <a href="./../search?user=${searchResults[i].author}">
                                <img
                                class="post-author-img" 
                                src="${searchResults[i].image}"
                                alt=""></img>
                                </a>
                                <h5 class="post-author-name">
                                <a href="./../search?user=${searchResults[i].author}">
                                    ${searchResults[i].display_name || searchResults[i].email}    
                                </a>
                                </h5>
                            </div>
                            <h2 class="post-title">
                                <a href="./../post?id=${searchResults[i].post_id}">
                                    ${searchResults[i].title.length > 45? 
                                    searchResults[i].title.substring(0, 45) + "..." : 
                                    searchResults[i].title}
                                </a>
                            </h2>
                        </div>
                    </div>
                `
            }
    
            if (i - start == 4 && i < searchResults.length) {
                fifthPost = `
                    <div class="post-result">
                        <a href="./../post?id=${searchResults[i].post_id}">
                            <img alt="" src="${searchResults[i].cover}" class="post-result-cover-img">
                        </a>
                        <div class="post-detail">
                            <div class="author d-flex align-items-center justify-content-start">
                                <a href="./../search?user=${searchResults[i].author}">
                                <img
                                class="post-author-img" 
                                src="${searchResults[i].image}"
                                alt=""></img>
                                </a>
                                <h5 class="post-author-name">
                                <a href="./../search?user=${searchResults[i].author}">
                                    ${searchResults[i].display_name || searchResults[i].email}    
                                </a>
                                </h5>
                            </div>
                            <h2 class="post-title">
                                <a href="./../post?id=${searchResults[i].post_id}">
                                    ${searchResults[i].title.length > 45? 
                                    searchResults[i].title.substring(0, 45) + "..." : 
                                    searchResults[i].title}
                                </a>
                            </h2>
                        </div>
                    </div>
                `
            }
    
            if (i - start == 5 && i < searchResults.length) {
                sixthPost = `
                    <div class="post-result">
                        <a href="./../post?id=${searchResults[i].post_id}">
                            <img alt="" src="${searchResults[i].cover}" class="post-result-cover-img">
                        </a>
                        <div class="post-detail">
                            <div class="author d-flex align-items-center justify-content-start">
                                <a href="./../search?user=${searchResults[i].author}">
                                <img
                                class="post-author-img" 
                                src="${searchResults[i].image}"
                                alt=""></img>
                                </a>
                                <h5 class="post-author-name">
                                <a href="./../search?user=${searchResults[i].author}">
                                    ${searchResults[i].display_name || searchResults[i].email}    
                                </a>
                                </h5>
                            </div>
                            <h2 class="post-title">
                                <a href="./../post?id=${searchResults[i].post_id}">
                                    ${searchResults[i].title.length > 45? 
                                    searchResults[i].title.substring(0, 45) + "..." : 
                                    searchResults[i].title}
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
            <div style="${amount === 6? 'height: 400px;' : 'height: 0px;'}" class="post-grid-span col-md-8 col-12 pl-md-2 pl-0 pr-0
            ${amount === 6? '' : 'h-0'}">
                ${sixthPost}
            </div>
        </div>
        `
    }

    document.querySelector(".search-results").innerHTML = resultHTML;
}

const printPagination = (pageNumber = 1) => {
  numberOfPages = Math.ceil(searchResults.length / 6)
  if (searchResults.length > numberOfPages * 6)
    numberOfPages++;

  //Find list of items to show in pagination
  let pagesToShow = [];
  //Pages before
  for (let i = pageNumber - 2; i < pageNumber; i++) {
      if (i >= 1)
          pagesToShow.push(i);
  }
  pagesToShow.push(pageNumber);
  for (let i = pageNumber + 1; i <= Math.min(pageNumber + 3, numberOfPages); i++) {
      pagesToShow.push(i);
  }
  if (pagesToShow[pagesToShow.length - 1] === numberOfPages) {
      for (let i = pagesToShow.length; i <= 5; i++) {
          if (pageNumber - 3 - (pagesToShow.length) >= 1)
              pagesToShow.unshift(pageNumber - 3 - (pagesToShow.length)) 
      }
  }
  //Have enough page to show
  //Add to pagination
  let getPagination = document.querySelector('.pagination');
  getPagination.innerHTML = "";
  if (pageNumber !== 1) {
      getPagination.innerHTML += `<li class="page-item"><a class="page-link" href="javascript:pageChange(${pageNumber - 1})"><</a></li>`;
  } else {
      getPagination.innerHTML += `<li class="page-item disabled"><a class="page-link"><</a></li>`;
  }
  if (pagesToShow[0] !== 1) {
      getPagination.innerHTML += `<li class="page-item"><a class="page-link" href="javascript:pageChange(1)">1</a></li>`;
      if (pagesToShow[0] !== 2) {
          getPagination.innerHTML += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
      }
  }
  pagesToShow.forEach(page => {
      let isActive = page === pageNumber? "active": "";
      getPagination.innerHTML += `<li class="page-item ${isActive}"><a class="page-link" href="javascript:pageChange(${page})">${page}</a></li>`;
  })
  if (pagesToShow[pagesToShow.length - 1] !== numberOfPages) {
      if (pagesToShow[pagesToShow.length - 1] !== numberOfPages - 1) {
          getPagination.innerHTML += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
      }
      getPagination.innerHTML += `<li class="page-item"><a class="page-link" href="javascript:pageChange(${numberOfPages})">${numberOfPages}</a></li>`;
  }
  if (pageNumber !== numberOfPages) {
      getPagination.innerHTML += `<li class="page-item"><a class="page-link" href="javascript:pageChange(${pageNumber + 1})">></a></li>`;
  } else {
      getPagination.innerHTML += `<li class="page-item disabled"><a class="page-link">></a></li>`;
  }
}

const pageChange = (pageNumber) => {
  //Find list of items to show in pagination
  let pagesToShow = [];
  //Pages before
  for (let i = pageNumber - 2; i < pageNumber; i++) {
      if (i >= 1)
          pagesToShow.push(i);
  }
  pagesToShow.push(pageNumber);
  for (let i = pageNumber + 1; i <= Math.min(pageNumber + 3, numberOfPages); i++) {
      pagesToShow.push(i);
  }
  if (pagesToShow[pagesToShow.length - 1] === numberOfPages) {
      for (let i = pagesToShow.length; i <= 5; i++) {
          if (pageNumber - 3 - (pagesToShow.length) >= 1)
              pagesToShow.unshift(pageNumber - 3 - (pagesToShow.length)) 
      }
  }
  
  let getPagination = document.querySelector('.pagination');
  getPagination.innerHTML = "";
  if (pageNumber !== 1) {
      getPagination.innerHTML += `<li class="page-item"><a class="page-link" href="javascript:pageChange(${pageNumber - 1})"><</a></li>`;
  } else {
      getPagination.innerHTML += `<li class="page-item disabled"><a class="page-link"><</a></li>`;
  }
  if (pagesToShow[0] !== 1) {
      getPagination.innerHTML += `<li class="page-item"><a class="page-link" href="javascript:pageChange(1)">1</a></li>`;
      if (pagesToShow[0] !== 2) {
          getPagination.innerHTML += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
      }
  }
  pagesToShow.forEach(page => {
      let isActive = page === pageNumber? "active": "";
      getPagination.innerHTML += `<li class="page-item ${isActive}"><a class="page-link" href="javascript:pageChange(${page})">${page}</a></li>`;
  })
  if (pagesToShow[pagesToShow.length - 1] !== numberOfPages) {
      if (pagesToShow[pagesToShow.length - 1] !== numberOfPages - 1) {
          getPagination.innerHTML += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
      }
      getPagination.innerHTML += `<li class="page-item"><a class="page-link" href="javascript:pageChange(${numberOfPages})">${numberOfPages}</a></li>`;
  }
  if (pageNumber !== numberOfPages) {
      getPagination.innerHTML += `<li class="page-item"><a class="page-link" href="javascript:pageChange(${pageNumber + 1})">></a></li>`;
  } else {
      getPagination.innerHTML += `<li class="page-item disabled"><a class="page-link">></a></li>`;
  }

  let start = Math.min((pageNumber - 1) * 6, searchResults.length);
  let end = Math.min(6 * pageNumber - 1, searchResults.length);
  printPosts(start, end);
}