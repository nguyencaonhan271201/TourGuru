let searchDiv = document.getElementById("search-div");
let hotelDiv = document.getElementById("hotel-div");

getSearchInfo("Singapore");

//Hàm tìm kiếm từ query
function getSearchInfo(searchQuery) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
            printSearchInfo(results.suggestions);
        }
    }

    xhr.open("GET", `https://hotels4.p.rapidapi.com/locations/search?query=${searchQuery}&locale=en_US`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "10ab83fc29mshe06091597dcf6bap1ad11ajsn261f28be7f22");

    xhr.send();
}

//Hàm lấy danh mục khách sạn
function getHotelsList(destinationID, pageNumber, pageSize, adults, sortBy, starRatings) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
            printHotelList(results.data.body.header, results.data.body.searchResults.results);
        }
    }

    xhr.open("GET", `https://hotels4.p.rapidapi.com/properties/list?destinationId=${destinationID}` + 
        `&pageNumber=${pageNumber}` +
        `&pageSize=${pageSize}` +
        `&checkIn=2021-10-01` +
        `&checkOut=2021-10-04` +
        `&adults1=${adults}` +
        `&sortOrder=${sortBy}` +
        `&locale=en_US` +
        `&starRatings=${starRatings}` +
        `&currency=USD`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "10ab83fc29mshe06091597dcf6bap1ad11ajsn261f28be7f22");

    xhr.send();
}

//Hàm lấy thông tin khách sạn
function getHotelInfo(hotelID) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
            console.log(results.data.body);
        }
    }

    xhr.open("GET", `https://hotels4.p.rapidapi.com/properties/get-details?id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "10ab83fc29mshe06091597dcf6bap1ad11ajsn261f28be7f22");

    xhr.send();
}

//Hàm lấy ảnh khách sạn
function getHotelPhotos(hotelID) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
            console.log(results.hotelImages);
            
            //Xử lý kết quả khi in ảnh
            results.hotelImages.forEach(image => {
                //Format lại định dạng url ảnh
                let url = image.baseUrl;
                url = url.replace("_{size}", "");
                //url này hợp lệ và có thể pass vào <img>
            })
        }
    }

    xhr.open("GET", `https://hotels4.p.rapidapi.com/properties/get-hotel-photos?id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "10ab83fc29mshe06091597dcf6bap1ad11ajsn261f28be7f22");

    xhr.send();
}

function updateEventListeners() {
    document.querySelectorAll(".btn-hotel").forEach(button => {
        button.addEventListener("click", function(e) {
            e.preventDefault();
            let destinationID = e.target.getAttribute("data-dest-id");
            getHotelsList(destinationID, 1, 20, 1, "BEST_SELLER", "5")
        })
    })
}

//Các hàm in kết quả
function printSearchInfo(suggestions) {
    suggestions.forEach((group) => {
        group.entities.forEach((item) => {
            searchDiv.innerHTML += `
                <div class="col-md-4 col-sm-6">
                    <div class="card">
                        <div class="card-body">
                            <p>${item.caption}</p>
                            <a data-dest-id="${item.destinationId}" class="btn-hotel btn btn-info" href="#" role="button">
                                Chọn
                            </a>
                        </div>
                    </div>
                </div>
            `
        })
        updateEventListeners();
    })
}

function printHotelList(header, results) {
    searchDiv.innerHTML = "";
    hotelDiv.innerHTML = "";
    hotelDiv.innerHTML += `
        <h3 class="text-center">${header}</h3>
        <div id="hotels" class="row">
        </div>
    `

    results.forEach((result) => {
        console.log(result);
        hotelDiv.querySelector("#hotels").innerHTML += `
        <div class="col-md-4 col-sm-6">
            <div class="card">
                <img class="card-img-top" src="${result.optimizedThumbUrls.srpDesktop}" alt="">
                <div class="card-body">
                    <h5 class="card-title">${result.name} - ${result.starRating} stars</h5>
                    <p class="card-text">${result.address.streetAddress}</p>
                    ${
                        result.guestReviews && 
                        `
                        <p class="card-text">${result.guestReviews.badgeText? result.guestReviews.badgeText : ""} (${result.guestReviews.rating})</p>
                        `
                    }
                    <p class="card-text">Price: $${result.ratePlan.price.exactCurrent}</p>
                    <a class="btn-hotel btn btn-info" href="javascript:getHotelInfo(${result.id})" role="button">
                        Thông tin
                    </a>
                    <a class="btn-hotel btn btn-info" href="javascript:getHotelPhotos(${result.id})" role="button">
                        Ảnh
                    </a>
                </div>
            </div>
        </div>
        `
    })
}

const returnStar = (star) => {
    let result = "";

    for (let i = 1; i <= Math.floor(star); i++)
        result += `<i class="fa fa-star rating-star" aria-hidden="true"></i>`

    if (star > Math.floor(star))
        result += `<i class="fa fa-star-half-alt rating-star"></i>`

    return result;
}