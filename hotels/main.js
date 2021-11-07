let ratesList = null;
let choosingCurrency = "USD";
let locationSearch = document.getElementById("location");
let selectedLocationID = "";
let isPrintedHotel = false;
let starQuery = "";
let sortBy = "BEST_SELLER";
let searchButton = document.getElementById("btn-search");
let currentPageNumber = 1;
let numberOfNights = 1;
let newlySearch = false;
let checkIn = "";
let checkOut = "";

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.search.includes("session_ended")) {
        Swal.fire({
            icon: 'error',
            text: "Your session is expired. Please try again."
        });
    }

    localStorage.setItem("hotelInfo", null)

    document.querySelector(".search-result-div").style.display = "none";
    document.querySelector(".search-result-div").style.opacity = "1";

    initializeEventListener();
    getCurrencyInfo();

    let checkInPicker = document.getElementById('check-in');
    let checkOutPicker = document.getElementById('check-out');
    let picker = new Litepicker({
        element: checkInPicker,
        format: 'YYYY-MM-DD'
    });
    let picker2 = new Litepicker({
        element: checkOutPicker,
        format: 'YYYY-MM-DD'
    });
})

const getCurrencyInfo = () => {
    let xhr = new XMLHttpRequest();
    xhr.open(
        'GET',
        'https://exchangerate-api.p.rapidapi.com/rapid/latest/USD',
        true
    );
    xhr.onload = function() {
        if (this.status == 200) {
            let result = JSON.parse(xhr.responseText);
            ratesList = result.rates;

            //Upload the select
            Object.keys(ratesList).forEach((key) => {
                if (key != "USD") {
                    document.getElementById("currency").innerHTML += `<option value="${key}">${key}</option>`
                }
            })
        }
    }

    xhr.setRequestHeader("x-rapidapi-host", "exchangerate-api.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const initializeEventListener = () => {
    locationSearch.addEventListener("focusin", (e) => {
        document.getElementById("search-location-result").style.display = "flex";
    })

    locationSearch.addEventListener("focusout", (e) => {
        let isHovered = $('#search-location-result').is(":hover");
        if (!isHovered) {
            resetSearchResult();
        }
    })

    locationSearch.addEventListener("keyup", (e) => {
        if (e.target.value !== "") {
            checkSearchCondition(e.target, true);   
        } else {
            document.getElementById("search-location-result").innerHTML = "";
        }
    })

    searchButton.addEventListener("click", (e) => {
        newlySearch = true;

        e.preventDefault();
        Swal.fire({
            title: 'Loading...',
            html: 'Please wait...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          });

        //Validate information
        if (selectedLocationID == null || selectedLocationID == "") {
            Swal.close();
            Swal.fire({
                icon: 'error',
                text: "Location is invalid. Please search again.",
            });
            return;
        }

        //Validate day
        let fromDate = new Date($('#check-in').val());
        if (isNaN(fromDate.getTime())) {
            swal.close();
            Swal.fire({
                icon: 'error',
                text: "Check-in date is not valid. Please try again.",
            });
            return;
        }

        //Check for return day
        let toDate = new Date($('#check-out').val());
        if (isNaN(toDate.getTime())) {
            swal.close();
            Swal.fire({
                icon: 'error',
                text: "Check-out date is not valid. Please try again.",
            });
            return;
        }

        if (toDate.getTime() < fromDate.getTime()) {
            swal.close();
            //$("#loading-modal").modal("hide");
            //errorText.innerHTML += "Return date cannot be before Depart date. Please try again";
            //$("#error-modal").modal("show");
            Swal.fire({
                icon: 'error',
                text: "Check-out date cannot be before Check-in date. Please try again.",
            });
            return;
        } else {
            let Difference_In_Time = toDate.getTime() - fromDate.getTime();
            numberOfNights = Difference_In_Time / (1000 * 3600 * 24);

            if (numberOfNights == 0) {
                Swal.fire({
                    icon: 'error',
                    text: "Check-out date must be at least 1 day after Check-in date.",
                });
            }
        }

        checkIn = fromDate.toISOString().split('T')[0];
        checkOut = toDate.toISOString().split('T')[0];

        //Currency
        choosingCurrency = document.getElementById("currency").value;
        
        currentPageNumber = 1;
        sortBy = "BEST_SELLER";
        starQuery = "";

        getHotelsList(selectedLocationID, currentPageNumber, 30, 2, sortBy)

        document.querySelectorAll(".star-checkbox").forEach((checkbox) => {
            checkbox.checked = false;
        })
        starQuery = "";

        document.getElementById("sort").innerHTML = `
            <option value="BEST_SELLER" selected="selected">best seller</option>
            <option value="STAR_RATING_HIGHEST_FIRST">stars (high to low)</option>
            <option value="STAR_RATING_LOWEST_FIRST">stars (low to high)</option>
            <option value="DISTANCE_FROM_LANDMARK">distance from landmark</option>
            <option value="GUEST_RATING">guest rating</option>
            <option value="PRICE_HIGHEST_FIRST">price (highest first)</option>
            <option value="PRICE">price (lowest first)</option>
        `;
    
        setTimeout(() => {
            newlySearch = false;
        }, 500);
    })

    document.getElementById("sort").addEventListener("change", () => {
        if (!newlySearch) {
            sortBy = document.getElementById("sort").value;
            currentPageNumber = 1;

            if (selectedLocationID != "") {
                container = document.getElementById("result-choices");
                container.innerHTML = "";
                if (starQuery == "")
                    getHotelsList(selectedLocationID, currentPageNumber, 30, 2, sortBy)
                else
                    getHotelsList(selectedLocationID, currentPageNumber, 30, 2, sortBy, starQuery)
            }
        }
    })

    document.querySelectorAll(".star-checkbox").forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            checkStarInput();
        })
    })
}

const checkSearchCondition = (box, isFrom) => {
    let tmpStoringResult = box.value;
    setTimeout(() => {
        if (box.value == tmpStoringResult) {
            getSearchInfo(box.value, isFrom);
        }
    }, 300)
}

const getSearchInfo = (searchQuery) => {
    isPrintedHotel = false;
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);
            printSearchInfo(results.suggestions);
        } else {
            
        }
    }

    xhr.open("GET", `https://hotels4.p.rapidapi.com/locations/v2/search?query=${searchQuery}&locale=en_US`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const printSearchInfo = (suggestions) => {
    let getSearchBox = document.getElementById("search-location-result");
    getSearchBox.innerHTML = "";
    suggestions.forEach((group) => {
        if (group.group === "CITY_GROUP" || group.group === "LANDMARK_GROUP") {
            group.entities.forEach((item) => {
                getSearchBox.innerHTML += `
                    <div class="search-result" data-id=${item.destinationId}>
                        ${item.caption}
                    </div>
                `
            })
        }
    })

    //Add event listener for each search-result
    document.querySelectorAll(".search-result")
    .forEach(result => {
        result.addEventListener("click", () => {
            selectedLocationID = result.getAttribute("data-id");
            locationSearch.value = result.innerText;
            resetSearchResult();
        })
    })
}

const resetSearchResult = () => {
    document.getElementById("search-location-result").style.display = "none";
    document.getElementById("search-location-result").innerHTML = "";
}

const timePrintFormat = (minute) => {
    var num = minute;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    let returnString = rhours > 0? `${rhours}h ` : "";
    returnString += ` ${rminutes}m`;
    return returnString;
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

const getDisplayDateFormat = (isWeekDay, ISODate) => {
    const newDateObj = new Date(ISODate);
    const toMonth = newDateObj.getMonth() + 1;
    const toYear = newDateObj.getFullYear();
    const toDate = newDateObj.getDate();
    const DOW = newDateObj.getDay()
    const dateTemplate = isWeekDay? `${weekDays[DOW]}, ${toDate} ${months[toMonth - 1]} ${toYear}` : `${toDate} ${months[toMonth - 1]} ${toYear}`;
    // console.log(dateTemplate)
    return dateTemplate;
}

const getHotelsList = (destinationID, pageNumber, pageSize, adults, sortBy, starRatings) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        swal.close();
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);

            if (!isPrintedHotel) {
                isPrintedHotel = true;
                let searchBox = document.querySelector(".search-div");
                searchBox.classList.add("search-div-found");
            }

            if (results.data) {
                printHotelList(results.data.body.header, results.data.body.searchResults.results);
            } else {
                printNoResult();
            }
        } else {
            Swal.fire({
                icon: 'error',
                text: "Error occured. Please try again later"
            });
        }
    }

    let query = `https://hotels4.p.rapidapi.com/properties/list?destinationId=${destinationID}` + 
    `&pageNumber=${pageNumber}` +
    `&pageSize=${pageSize}` +
    `&checkIn=${checkIn}` +
    `&checkOut=${checkOut}` +
    `&adults1=${adults}` +
    `&sortOrder=${sortBy}` +
    `&locale=en_US` +
    `&currency=USD`

    if (starRatings != null)
        query += `&starRatings=${starRatings}`;

    xhr.open("GET", query);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const printHotelList = (header, results) => {
    container = document.getElementById("result-choices");
    container.innerHTML = "";
    document.querySelector(".search-result-div").style.display = "block";

    document.getElementById("location-title-h2").innerText = header;

    results.forEach((result) => {
        if (result.ratePlan != null) {
            let calculateFare = result.ratePlan.price.exactCurrent * ratesList[choosingCurrency] * numberOfNights;
            calculateFare = Math.round(calculateFare * 100) / 100
            let fare = calculateFare.toString() + " " + choosingCurrency;

            let nightString = numberOfNights > 1? `${numberOfNights} nights` : `night`

            let reviewHTML = "";
            if (result.guestReviews != null) {
                reviewHTML = `<h3 class="hotel-option-rating">${result.guestReviews? result.guestReviews.rating : ""}</h3>`;
            }

            container.innerHTML += `
                <div class="hotel-option-box">
                    <div class="d-flex">
                        <img 
                            src="${result.optimizedThumbUrls? result.optimizedThumbUrls.srpDesktop : ""}" 
                            alt=""
                            class="hotel-option-image">
                        
                        <div class="row" style="width: 100%">
                            <div class="col-md-9 col-sm-12">
                                <div class="hotel-option-info d-flex align-items-start flex-column">
                                    <h3 class="hotel-option-name">${result.name}</h3>
                                    <p class="hotel-option-star">${returnStar(result.starRating? result.starRating : 0)}</p>
                                    <p class="text-gray mb-1"><i class="fas fa-map-marked-alt">
                                    </i> ${result.address && result.address.streetAddress? result.address.streetAddress: ""}</p>
                                    <span class="m-0">
                                        <span class="total-price mb-0 mt-0">${fare}</span>
                                        <span class="mt-0 mb-0" id="container-total-price">/${nightString}</span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-12" style="position:relative">
                                ${reviewHTML}
                                <button class="btn-full btn-info button-choose mt-2 btn-depart" data-id=${result.id} 
                                data-image-url="${result.optimizedThumbUrls.srpDesktop}" data-price=${calculateFare}>
                                    more info
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    })

    let paginationHTML = "";
    paginationHTML = `<ul class="pagination">`
    for (let i = 1; i <= 5; i++) {
        let classActive = currentPageNumber === i? "active" : "";
        paginationHTML += `
            <li class="page-item ${classActive}"><a class="page-link" href="javascript:pageChange(${i})">${i}</a></li>
        `
    }
    paginationHTML += `</ul>`
    document.getElementById("hotel-pagination").innerHTML = paginationHTML;

    document.querySelectorAll(".btn-info").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let getID = btn.getAttribute("data-id");
            let getImage = btn.getAttribute("data-image-url");
            let price = btn.getAttribute("data-price");
            getHotelInfo(getImage, getID, price);
        })
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

const pageChange = (pageNumber) => {
    container = document.getElementById("result-choices");
    container.innerHTML = "";

    let paginationHTML = "";
    paginationHTML = `<ul class="pagination">`
    for (let i = 1; i <= 5; i++) {
        let classActive = pageNumber === i? "active" : "";
        paginationHTML += `
            <li class="page-item ${classActive}"><a class="page-link" href="javascript:pageChange(${i})">${i}</a></li>
        `
    }
    paginationHTML += `</ul>`
    document.getElementById("hotel-pagination").innerHTML = paginationHTML;

    currentPageNumber = pageNumber
    
    if (starQuery == "")
        getHotelsList(selectedLocationID, currentPageNumber, 30, 2, sortBy)
    else 
        getHotelsList(selectedLocationID, currentPageNumber, 30, 2, sortBy, starQuery)
}

const printNoResult = () => {
    document.getElementById("hotel-pagination").innerHTML = "";
    document.querySelector(".search-result-div").style.display = "block";

    document.getElementById("location-title-h2").innerText = "No results found";
}

document.querySelectorAll(".star-checkbox").forEach((checkbox) => {
    starQuery = "";
    checkbox.addEventListener("change", () => {
        checkStarInput();
    })
})

const checkStarInput = () => {
    if (!newlySearch) {
        starQuery = "";

        document.querySelectorAll(".star-checkbox").forEach((checkbox) => {
            if (checkbox.checked) {
                starQuery += `${checkbox.getAttribute("data-star")},`
            }
        })

        if (starQuery.length > 0)
            starQuery = starQuery.substring(0, starQuery.length - 1)

        currentPageNumber = 1;

        if (selectedLocationID != "") {
            container = document.getElementById("result-choices");
            container.innerHTML = "";

            if (starQuery == "")
                getHotelsList(selectedLocationID, currentPageNumber, 30, 2, sortBy)
            else
                getHotelsList(selectedLocationID, currentPageNumber, 30, 2, sortBy, starQuery)
        }
    }
}

const getHotelInfo = (hotelURL, hotelID, price) => {
    let hotelInfo = {};
    hotelInfo["currencyCode"] = choosingCurrency;
    hotelInfo["currencyRate"] = ratesList[choosingCurrency];
    hotelInfo["hotelID"] = hotelID; 
    hotelInfo["hotelImageURL"] = hotelURL;
    hotelInfo["checkIn"] = checkIn;
    hotelInfo["checkOut"] = checkOut;
    hotelInfo["numberOfNights"] = numberOfNights;
    hotelInfo["singleNight"] = price;
    localStorage.setItem("hotelInfo", JSON.stringify(hotelInfo));
    window.location.replace(`info?hotel=${hotelID}`)
}