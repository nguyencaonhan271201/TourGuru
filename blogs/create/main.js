function MyCustomUploadAdapterPlugin( editor ) {
  editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
      // Configure the URL to the upload script in your back-end here!
      return new MyUploadAdapter( loader );
  };
}

let searchBox = document.getElementById("category");
let categories = [];
let categoryInputText;
let createPostButton = document.getElementById("btn-create");
let createPostForm = document.getElementById("create-post-form");
let detailEditor;
let uid;
let imageInput = document.querySelector("#post-cover-img-input");
let image = document.querySelector("#post-cover-img");

ClassicEditor
  .create( document.querySelector( '#detail' ), {
    extraPlugins: [ MyCustomUploadAdapterPlugin ],
  } )
  .then( editor => {
    detailEditor = editor;
  } )
  .catch( error => {
    alert(error)
  } );

document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      uid = user.uid;

      image.addEventListener("click", () => {
        $("#post-cover-img-input").trigger("click");
      })
      
      imageInput.addEventListener("change", () => {
        previewFile(imageInput, $(".post-cover-img"));
      })

      getListOfCategories();
      getListOfLinkablePlans();

      searchBox.addEventListener("focusin", (e) => {
        if (document.querySelector("#category-result .result").innerHTML !== '')
          document.getElementById("category-result").style.display = "flex";
      })
    
      searchBox.addEventListener("focusout", (e) => {
        let isHovered = $('#category-result').is(":hover");
          if (!isHovered) {
            document.getElementById("category-result").style.display = "none";
          }
      })
    
      searchBox.addEventListener("keyup", (e) => {
        handleInputChanged(e);
      })
    
      createPostForm.addEventListener("submit", (e) => {
        formSubmit(e);
      })
    } else {
      location.replace("./../../auth/login.php");
      return;
    }
  })
})

const handleInputChanged = (e) => {
  categoryInputText = e.target.value;

  if (e.target.value === '') {
    document.getElementById("category-result").style.display = "none";
  } else {
    document.getElementById("category-result").style.display = "flex";

    let filtered = categories.filter(c => c.category_name.toUpperCase().indexOf(e.target.value.toUpperCase()) !== -1)

    if (filtered.length === 0) {
      document.getElementById("category-result").style.display = "none";
    } else {
      let html = ``;
      filtered.forEach(val => {
        html += `
          <div class="search-result" data-name="${val.category_name}">
              ${val.category_name}
          </div>
        `
      })

      document.querySelector("#category-result .result").innerHTML = html

      document.getElementById("category-result").style.display = "flex";

      document.querySelectorAll(".search-result")
      .forEach(result => {
        result.addEventListener("click", (e) => {
          e.preventDefault();
          categoryInputText = result.getAttribute("data-name");
          searchBox.value = result.getAttribute("data-name");
          document.getElementById("category-result").style.display = "none";
        })
      })
    }
  }
}

const getListOfCategories = () => {
  const xhr = new XMLHttpRequest();
  let csrf = "";
  csrf = document.getElementById("csrf").innerText;

  xhr.open(
      "GET",
      `../../api/blogs/create.php?getCategories&csrf=${csrf}`,
      true
  )

  xhr.onload = function() {
      if(this.status == 200) {
          categories = JSON.parse(xhr.responseText);
      } else {
          
      }
  }

  xhr.send();
}

const getListOfLinkablePlans = () => {
  let csrf = document.getElementById("csrf").innerText;
  let xhr = new XMLHttpRequest();
  xhr.open(
      "GET",
      `../../api/plans/plans.php?getPlans&id=${uid}&csrf=${csrf}`,
      true
  )
  xhr.onload = () => {
      swal.close();
      if (xhr.status === 200 && xhr.readyState === 4) {
          //Nh???n th??ng tin v?? l??u v??o danh m???c
          let result = JSON.parse(xhr.responseText); 
          let html = `<option value="-1" selected>none</option>`;
          result.forEach(plan => {
            let locations = "";
            if (plan.locations.length > 0) {
              for (let i = 0; i < plan.locations.length; i++) {
                  locations += ', ' + plan.locations[i].location_name;
              }
  
              locations = locations.slice(2);
  
              locations = " (" + locations + ")";
            }

            html += `
              <option value="${plan.id}">${plan.plan_title}${locations}</option>
            `
          })

          document.getElementById("plan").innerHTML = html;

          try {
            let urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has("plan")) {
              let planID = urlParams.get("plan");
              result.forEach(plan => {
                if (parseInt(planID) === plan.id) {
                  document.getElementById("plan").value = planID;
                }
              })
            }
          } catch(ex) {}
      } else {
          
      }
  }
  xhr.send();
}


const formSubmit = (e) => {
  e.preventDefault();
  let postDetails = detailEditor.getData();
  if (postDetails === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "All the fields must be filled.",
      showCloseButton: true,
    });
  } else {
    Swal.fire({
      title: 'Are you sure want to create this blog?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: 'green',
      cancelButtonColor: 'red'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
            title: 'Loading...',
            html: 'Please wait...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
        });
        createPost(postDetails);
      }
    })
  }
}

const createPost = (details) => {
  //Get csrf
  let csrf = "";
  csrf = document.getElementById("csrf").innerText;

  let title = document.getElementById("title").value;
  let category = categoryInputText;
  let description = document.getElementById("description").value;

  let xhr = new XMLHttpRequest();
  xhr.open(
      "POST",
      "../../api/blogs/create.php",
      true
  )
  xhr.onload = () => {
      if (xhr.status === 200 && xhr.readyState === 4) {
        Swal.fire({
          title: 'Blog has been created successfully.',
          icon: 'success'
        }).then(() => {
          location.replace(`./../post?id=${JSON.parse(xhr.responseText)}`);
        })
      } else {
        swal.close();
        Swal.fire({
            icon: "error",
            text: "Error occured. Please try again later."
        });
      }
  }

  let formData = new FormData();
  formData.append("createBlog", "");
  formData.append("user", uid);
  formData.append("content", encodeURIComponent(details));
  formData.append("title", encodeURIComponent(title));
  formData.append("category", encodeURIComponent(category));
  formData.append("description", encodeURIComponent(description));
  formData.append("csrf", csrf);
  formData.append("plan", document.getElementById("plan").value);
  if (imageInput.value != "") {
      formData.append("image", imageInput.files[0]);
  }
  xhr.send(formData);

  // xhr.send(`createBlog&user=${uid}&content=${encodeURIComponent(details)}&title=${encodeURIComponent(title)}
  // &category=${encodeURIComponent(category)}&description=${encodeURIComponent(description)}&csrf=${csrf}`);
}

const previewFile = (input, img) => {
  var file = input.files[0];
  if(file){
      var reader = new FileReader();

      reader.onload = function(){
          img.attr("src", reader.result);
      }

      reader.readAsDataURL(file);
  }
}

//For new update