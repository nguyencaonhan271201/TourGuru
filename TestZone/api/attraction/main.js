let citiesSearch = document.querySelector(".search-result-city .row");
let attractionsSearch = document.querySelector(".search-result-attractions .row");
let searchDiv = document.querySelector(".search-result")
let citySearchDiv = document.querySelector(".city-search-result")
let citySearchResult = citySearchDiv.querySelector(".row")
let attractionDetail = document.querySelector(".attraction-detail");

getSearchInfo("Ho Chi Minh", 30, 0)

//Hàm tìm kiếm từ query (tìm thành phố, quốc gia)
function getSearchInfo(searchQuery, limit, offset) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);
            //console.log(results);
            printSearchInfo(results.data);
        } else {
            console.log("Not found");
        }
    }

    xhr.open("GET", `https://travel-advisor.p.rapidapi.com/locations/search?query=${searchQuery}&limit=${limit}&offset=${offset}`);
    xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "6015fab332mshe435514eb925d97p10417ejsn0296e3e75ef9");

    xhr.send();
}

function getAttractionsOfGeo(geoID, name) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);
            (results);
            printAttractionsOfPlace(results.data, name)
        } else {
            console.log("Not found");
        }
    }

    xhr.open("GET", `https://travel-advisor.p.rapidapi.com/attractions/list?location_id=${geoID}`);

    xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "6015fab332mshe435514eb925d97p10417ejsn0296e3e75ef9");

    xhr.send();
}

function getDetailOfAttractions(geoID) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);
            console.log(results);
            printAttractionDetails(results)
        } else {
            console.log("Not found");
        }
    }

    xhr.open("GET", `https://travel-advisor.p.rapidapi.com/attractions/get-details?location_id=${geoID}`);

    xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "6015fab332mshe435514eb925d97p10417ejsn0296e3e75ef9");

    xhr.send();
}

function getPhotosOfLocation(geoID) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);
            console.log(results);
            let resultArray = [];
            results.data.forEach(image => {
                if (image.images.original)
                    resultArray.push(image.images.original.url);
                else
                    resultArray.push(image.images.large.url);
            })
            resultArray.forEach(imageURL => {
                attractionDetail.querySelector(".photos").innerHTML += `
                    <div class="col-md-4 col-sm-6 mt-1 mb-1">
                        <div class="container-fluid" style="width: 100%">
                            <img alt="" src="${imageURL}" style="max-width: 100%">
                        </div>
                    </div>
                `
            })
        } else {
            return null;
        }
    }

    xhr.open("GET", `https://travel-advisor.p.rapidapi.com/photos/list?location_id=${geoID}`);

    xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "6015fab332mshe435514eb925d97p10417ejsn0296e3e75ef9");

    xhr.send();
}


//Hàm in kết quả
function printAttractionDetails(detail) {
    searchDiv.style.display = "none";
    citySearchDiv.style.display = "none";
    attractionDetail.style.display = "initial";
    attractionDetail.innerHTML = "";
    let ancestorString = "";

    //Lấy toạ độ cho map nếu cần
    let lon = detail.longitude;
    let lat = detail.latitude;

    detail.ancestors.forEach(ancestor => {
        ancestorString += ancestor.name + " - "
    })
    if (ancestorString.length > 0) {
        ancestorString = ancestorString.substring(0, ancestorString.length - 3);
    }

    let subcatString = "";
    detail.subcategory.forEach(subcat => {
        subcatString += subcat.name + ", "
    })
    if (subcatString.length > 0) {
        subcatString = subcatString.substring(0, subcatString.length - 2);
    }

    attractionDetail.innerHTML += `
        <h4 class="text-center">${detail.name} - ${detail.rating} stars</h4>
        <div class="container-fluid" style="max-width: 100%">
            <img style="max-width: 100%;" class="text-center" src="${detail.photo.images.original.url}" alt="">
        </div>
        <p class="">${ancestorString}</p>
        <p class="">${detail.description}</p>
        <p class="">${detail.fee == "NO"? "FREE" : "PAID"}</p>
        <p class="">${subcatString}</p>
        <hr>
        <h5>Photos</h5>
        <div class="photos row"></div>
    `

    getPhotosOfLocation(detail.location_id);
}  

function printAttractionsOfPlace(results, name) {
    searchDiv.style.display = "none";
    citySearchDiv.style.display = "initial";
    attractionDetail.style.display = "none";
    document.getElementById("city-name").innerText = name;
    citySearchResult.innerHTML = "";
    results.forEach(result => {
        if (result.category && result.category.key === "attraction")
        {
            //Check and eliminate tours
            isTour = false;
            result.subcategory.forEach(subcat => {
                if (subcat.name.includes("Tours")) {
                    isTour = true;
                }
            })
            if (!isTour) {
                let ancestorString = "";
                result.ancestors.forEach(ancestor => {
                    ancestorString += ancestor.name + " - "
                })
                if (ancestorString.length > 0) {
                    ancestorString = ancestorString.substring(0, ancestorString.length - 3);
                }
                citySearchResult.innerHTML += `
                <div class="col-md-4 col-sm-6">
                    <div class="card">
                        <img class="card-img-top" src="${result.photo.images.original.url}" alt="">
                        <div class="card-body">
                            <h5 class="card-title">${result.name}</h5>
                            <p class="card-text">${result.address}</p>
                            <p class="card-text">${ancestorString}</p>
                            <a class="btn-hotel btn btn-info" href="javascript:getDetailOfAttractions(${result.location_id})" role="button">
                                Xem chi tiết
                            </a>
                        </div>
                    </div>
                </div>
                `
            }
        }
    })
}

function printSearchInfo(results) {
    searchDiv.style.display = "initial";
    citySearchDiv.style.display = "none";
    attractionDetail.style.display = "none";
    citiesSearch.innerHTML = "";
    attractionsSearch.innerHTML = "";
    results.forEach(result => {
        if (result.result_type === "geos") {
            result = result.result_object;
            citiesSearch.innerHTML += `
            <div class="col-md-4 col-sm-6">
                <div class="card">
                    <img class="card-img-top" src="${result.photo.images.original.url}" alt="">
                    <div class="card-body">
                        <h5 class="card-title">${result.location_string}</h5>
                        <p class="card-text">${result.category_counts.attractions.total} things to do</p>
                        <p class="card-text">${result.geo_description.substring(0, 100)}...</p>
                        <a class="btn-hotel btn btn-info" href="javascript:getAttractionsOfGeo(${result.location_id}, '${result.location_string}')" role="button">
                            Xem danh mục điểm đến
                        </a>
                    </div>
                </div>
            </div>
            `
        } else if (result.result_type === "things_to_do" && result.result_object.category.key === "attraction")
        {
            result = result.result_object;
            //Check and eliminate tours
            isTour = false;
            result.subcategory.forEach(subcat => {
                if (subcat.name.includes("Tours")) {
                    isTour = true;
                }
            })
            if (!isTour) {
                let ancestorString = "";
                result.ancestors.forEach(ancestor => {
                    ancestorString += ancestor.name + " - "
                })
                if (ancestorString.length > 0) {
                    ancestorString = ancestorString.substring(0, ancestorString.length - 3);
                }
                attractionsSearch.innerHTML += `
                <div class="col-md-4 col-sm-6">
                    <div class="card">
                        <img class="card-img-top" src="${result.photo.images.original.url}" alt="">
                        <div class="card-body">
                            <h5 class="card-title">${result.name}</h5>
                            <p class="card-text">${result.address}</p>
                            <p class="card-text">${ancestorString}</p>
                            <a class="btn-hotel btn btn-info" href="javascript:getDetailOfAttractions(${result.location_id})" role="button">
                                Xem chi tiết
                            </a>
                        </div>
                    </div>
                </div>
                `
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", function() {
    citySearchDiv.style.display = "none";
    attractionDetail.style.display = "none";
})

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
} 

//Get top tourist attractions
function getTop20TouristAttractions() {
    //Thực hiện lấy 3 lần (được khoảng 90-100 dữ liệu) và random
    let dataRetrieve  = [];
    let long1 = getRndInteger(0, 91);
    let lat1 = getRndInteger(90, 181);
    if (long1 > lat1) {
        let tmp = long1;
        long1 = lat1;
        lat1 = tmp;
    }
    let long2 = getRndInteger(0, 91);
    let lat2 = getRndInteger(-90, 1);
    if (long2 > lat2) {
        let tmp = long2;
        long2 = lat2;
        lat2 = tmp;
    }
    let time = 0;
    let result = [];

    const xhr = new XMLHttpRequest();
    const offset = 0;
    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);
            dataRetrieve = dataRetrieve.concat(results.data);

            let resultArray = [];

            for (let i = 0; i < dataRetrieve.length; i++) {
                if (dataRetrieve[i]["ad_position"] == null) {
                    resultArray.push(dataRetrieve[i]);
                }
            }

            let randomIndex = [];
            while (randomIndex.length != 20) {
                let random = Math.floor(Math.random() * (resultArray.length + 1));
                if (randomIndex.indexOf(random) == -1)
                {
                    randomIndex.push(random); 
                    result.push(resultArray[random]);
                }
            }

            console.log(result);
            return result;
        } else {
            return null;
        }
    }

    xhr.open("GET", `https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary?tr_longitude=${long1}&tr_latitude=${long2}&bl_longitude=${lat1}&bl_latitude=${lat2}&offset=${offset}&min_rating=5&currency=USD&limit=30&lunit=km&lang=en_US&subcategory=47`);

    xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "6015fab332mshe435514eb925d97p10417ejsn0296e3e75ef9");

    xhr.send();
}