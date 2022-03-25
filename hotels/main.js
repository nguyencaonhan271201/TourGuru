//DOM selectors
let locationSearch = document.getElementById("location");
let searchButton = document.getElementById("btn-search");

//Global variables
let ratesList = null;
let choosingCurrency = "USD";
let selectedLocationID = "";
let selectedLocationType = "";
let searchHeader = "";
let isPrintedHotel = false;
let starQuery = "";
let sortBy = "popularity";
let currentPageNumber = 1;
let numberOfNights = 1;
let numberOfGuests;
let numberOfRooms;
let newlySearch = false;
let checkIn = "";
let checkOut = "";

let numberOfPages;

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
    document.getElementById("carousel").style.display = "initial";

    initializeEventListener();
    getCurrencyInfo();

    let checkInPicker = document.getElementById('check-in');
    let checkOutPicker = document.getElementById('check-out');
    let picker = new Litepicker({
        element: checkInPicker,
        format: 'YYYY-MM-DD',
        minDate: new Date()
    });
    let picker2 = new Litepicker({
        element: checkOutPicker,
        format: 'YYYY-MM-DD',
        minDate: new Date()
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
    xhr.setRequestHeader("x-rapidapi-key", "53fc6537ccmsh8f41627347b7c3cp173fe7jsn844e3f55a629");

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
            locationSearch.value = searchHeader;
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
        sortBy = "popularity";
        starQuery = "";

        //Additional info
        numberOfGuests = document.getElementById("guests").value;
        numberOfRooms = document.getElementById("rooms").value;

        getHotelsList(selectedLocationID, selectedLocationType, currentPageNumber, sortBy, numberOfGuests, numberOfRooms, undefined, isNewSearch = true);

        document.querySelectorAll(".star-checkbox").forEach((checkbox) => {
            checkbox.checked = false;
        })
        starQuery = "";

        document.getElementById("sort").innerHTML = `
            <option value="popularity" selected="selected">popularity</option>
            <option value="class_ascending">stars (ascending)</option>
            <option value="class_descending">stars (descending)</option>
            <option value="distance">distance from landmark</option>
            <option value="review_score">review score</option>
            <option value="price">price (descending)</option>
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
                    getHotelsList(selectedLocationID, selectedLocationType, currentPageNumber, sortBy, numberOfGuests, numberOfNights, undefined, isNewSearch = false)
                else
                    getHotelsList(selectedLocationID, selectedLocationType, currentPageNumber, sortBy, numberOfGuests, numberOfNights, starQuery, isNewSearch = false)
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
            printSearchInfo(results);
        } else {
            
        }
    }

    xhr.open("GET", `https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${searchQuery}&locale=en-us`);
    xhr.setRequestHeader("x-rapidapi-host", "booking-com.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "e86a1525abmshcca4c416e787849p14438djsn32322c1f0a32");

    xhr.send();
}

const getIcon = (destionationType) => {
    switch (destionationType) {
        case "city":
            return `<i class="fas fa-city"></i>`;
        case "region":
            return `<i class="fas fa-map"></i>`;
        case "landmark":
            return `<i class="fas fa-landmark"></i>`;
        case "district":
            return `<i class="fas fa-map-marked-alt"></i>`;
        case "hotel":
            return `<i class="fas fa-hotel"></i>`;
        case "country":
            return `<i class="fas fa-flag"></i>`;
        case "airport":
            return `<i class="fas fa-plane-departure"></i>`;
        default:
            return `<i class="fas fa-map-marked-alt"></i>`;
    }
}

const printSearchInfo = (suggestions) => {
    let getSearchBox = document.getElementById("search-location-result");
    getSearchBox.innerHTML = "";

    suggestions.forEach(item => {
        getSearchBox.innerHTML += `
        <div class="search-result" data-id=${item.dest_id} data-type=${item.dest_type}>
            ${getIcon(item.dest_type)} ${item.label}
        </div>
        `
    })

    //Add event listener for each search-result
    document.querySelectorAll(".search-result")
    .forEach(result => {
        result.addEventListener("click", () => {
            selectedLocationID = result.getAttribute("data-id");
            selectedLocationType = result.getAttribute("data-type");
            searchHeader = result.innerText;
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

const getHotelsList = (destinationID, destinationType, pageNumber, order_by, adults, rooms, stars, isNewSearch) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        swal.close();
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);

            if (!isPrintedHotel) {
                isPrintedHotel = true;
                let searchBox = document.querySelector(".search-div");
                searchBox.classList.add("search-div-found");
                document.getElementById("carousel").style.display = "none";
            }

            if (results.result && results.result.length > 0) {
                printHotelList(searchHeader, results, pageNumber);
                if (isNewSearch && isNewSearch === true) {
                    getFilter(destinationID, destinationType, pageNumber, order_by, adults, rooms);
                }
            } else {
                printNoResult();

                if (isNewSearch) {
                    document.querySelector("#filter-blocks").innerHTML = "";
                }
            }
        } else {
            Swal.fire({
                icon: 'error',
                text: "Error occured. Please try again later"
            });
        }
    }

    let query = `https://booking-com.p.rapidapi.com/v1/hotels/search?dest_id=${destinationID}` +
    `&dest_type=${destinationType}` +
    `&page_number=${pageNumber - 1}` +
    `&checkin_date=${checkIn}` +
    `&checkout_date=${checkOut}` +
    `&adults_number=${adults}` +
    `&room_number=${rooms}` + 
    `&units=metric` + 
    `&order_by=${order_by}` +
    `&locale=en-us` +
    `&filter_by_currency=USD`;

    if (stars !== undefined) {
        query += `&categories_filter_ids=${stars}`;
    }

    xhr.open("GET", query);

    xhr.setRequestHeader("x-rapidapi-host", "booking-com.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "e86a1525abmshcca4c416e787849p14438djsn32322c1f0a32");    

    xhr.send();
}

const printHotelList = (header, results, pageNumber) => {
    container = document.getElementById("result-choices");
    container.innerHTML = "";
    document.querySelector(".search-result-div").style.display = "block";

    document.getElementById("location-title-h2").innerText = header;
    document.getElementById("number-of-props-h4").innerText = `${results.count} properties found`

    //Update pagination
    numberOfPages = Math.floor(results.count / 20);
    if (results.count > numberOfPages * 20)
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

    results.result.forEach((result) => {
        let {value, currency} = result.composite_price_breakdown.all_inclusive_amount;
        let calculateFare = value / ratesList[currency] * ratesList[choosingCurrency];
        calculateFare = Math.round(calculateFare * 100) / 100
        let fare = calculateFare.toFixed(1).replace('.0', '').replace(',0', '') + " " + choosingCurrency;

        let nightString = numberOfNights > 1? `${numberOfNights} nights` : `night`

        let reviewHTML = "";
        if (result.review_score != null) {
            reviewHTML = `<h3 class="hotel-option-rating">${result.review_score.toFixed(1)}</h3>`;
        }

        let address = `${result.address_trans}${result.district? `, ${result.district}` : ''}
        ${result.state_trans? `, ${result.state_trans}` : ''}${result.city_trans? `, ${result.city_trans}` : ''}
        ${result.country_trans? `, ${result.country_trans}` : ''}`;

        container.innerHTML += `
            <div class="hotel-option-box">
                <div class="d-flex">
                    <img 
                        src="${result.max_photo_url}" 
                        alt=""
                        class="hotel-option-image">
                    
                    <div class="row" style="width: 100%">
                        <div class="col-md-9 col-sm-12">
                            <div class="hotel-option-info d-flex align-items-start flex-column">
                                <h3 class="hotel-option-name">${result.hotel_name_trans}</h3>
                                <p class="hotel-option-star">${returnStar(result.class? result.class : 0)}</p>
                                <p class="text-gray mb-1"><i class="fas fa-map-marked-alt">
                                </i> ${address}
                                </p>
                                <span class="m-0">
                                    <span class="total-price mb-0 mt-0">${fare}</span>
                                    <span class="mt-0 mb-0" id="container-total-price">/${nightString}</span>
                                </span>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-12" style="position:relative">
                            ${reviewHTML}
                            <button class="btn-full button-choose mt-2 btn-depart" data-id=${result.hotel_id} 
                            data-image-url="${result.max_photo_url}" data-price=${calculateFare}
                            data-name="${result.hotel_name_trans}" data-address="${address}" data-stars="${result.class? result.class : 0}"
                            data-long="${result.longitude}" data-lat="${result.latitude}"
                            data-score="${result.review_score? result.review_score.toFixed(1) : ""}" data-score-word="${result.review_score_word}">
                                more info
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    })

    document.querySelectorAll(".button-choose").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let getID = btn.getAttribute("data-id");
            let getImage = btn.getAttribute("data-image-url");
            let price = btn.getAttribute("data-price");
            let getName = btn.getAttribute("data-name");
            let getAddress = btn.getAttribute("data-address");
            let getStars = btn.getAttribute("data-stars");
            let long = btn.getAttribute("data-long");
            let lat = btn.getAttribute("data-lat");
            let reviewScore = {
                score: btn.getAttribute("data-score"),
                word: btn.getAttribute("data-score-word")
            }
            getHotelInfo(getImage, getID, price, getName, getAddress, getStars, long, lat, reviewScore);
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

    currentPageNumber = pageNumber
    
    if (starQuery == "")
        getHotelsList(selectedLocationID, selectedLocationType, currentPageNumber, sortBy, numberOfGuests, numberOfRooms, undefined, isNewSearch = false)
    else 
        getHotelsList(selectedLocationID, selectedLocationType, currentPageNumber, sortBy, numberOfGuests, numberOfRooms, starQuery, isNewSearch = false)
}

const printNoResult = () => {
    document.getElementById("hotel-pagination").innerHTML = "";
    document.querySelector(".search-result-div").style.display = "block";

    document.getElementById("location-title-h2").innerText = "No results found";
    document.getElementById("number-of-props-h4").innerText = ``
}

const checkStarInput = () => {
    if (!newlySearch) {
        starQuery = "";

        document.querySelectorAll(".star-checkbox").forEach((checkbox) => {
            if (checkbox.checked) {
                starQuery += `class::${checkbox.getAttribute("data-star")},`
            }
        })

        document.querySelectorAll(".filter-checkbox").forEach((filterItem) => {
            if (filterItem.checked) {
                starQuery += `${filterItem.getAttribute("data-id")},`
            }
        })

        if (starQuery.length > 0)
            starQuery = starQuery.substring(0, starQuery.length - 1);

        currentPageNumber = 1;

        if (selectedLocationID != "") {
            container = document.getElementById("result-choices");
            container.innerHTML = "";

            if (starQuery == "")
                getHotelsList(selectedLocationID, selectedLocationType, currentPageNumber, sortBy, numberOfGuests, numberOfRooms, undefined, isNewSearch = false)
            else
                getHotelsList(selectedLocationID, selectedLocationType, currentPageNumber, sortBy, numberOfGuests, numberOfRooms, starQuery, isNewSearch = false)
        }
    }
}

const getHotelInfo = (hotelURL, hotelID, price, getName, getAddress, getStars, long, lat, reviewScore) => {
    let hotelInfo = new HotelBookingInfo(
        choosingCurrency,
        ratesList[choosingCurrency],
        hotelID,
        hotelURL,
        checkIn,
        checkOut,
        numberOfNights,
        price,
        getName, getAddress, getStars, long, lat, reviewScore,
        numberOfGuests, numberOfRooms
    );
    localStorage.setItem("hotelInfo", JSON.stringify(hotelInfo));
    window.location.replace(`info?hotel=${hotelID}`)
}

const getFilter = (destinationID, destinationType, pageNumber, order_by, adults, rooms) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        swal.close();
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);

            if (results.filter && results.filter.length > 0) {
                printFilters(results.filter)
            } else {
                document.querySelector("#filter-blocks").innerHTML = "";
            }
        } else {
            document.querySelector("#filter-blocks").innerHTML = "";
        }
    }

    let query = `https://booking-com.p.rapidapi.com/v1/hotels/search-filters?dest_id=${destinationID}` +
    `&dest_type=${destinationType}` +
    `&page_number=${pageNumber - 1}` +
    `&checkin_date=${checkIn}` +
    `&checkout_date=${checkOut}` +
    `&adults_number=${adults}` +
    `&room_number=${rooms}` + 
    `&units=metric` + 
    `&order_by=${order_by}` +
    `&locale=en-us` +
    `&filter_by_currency=USD`;

    xhr.open("GET", query);

    xhr.setRequestHeader("x-rapidapi-host", "booking-com.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "e86a1525abmshcca4c416e787849p14438djsn32322c1f0a32");

    xhr.send();
}

const printFilters = (result) => {
    //Get stars block
    let starsBlockHTML = document.querySelector("#star-block").outerHTML;

    //Get filter blocks
    let filterBlock = document.querySelector("#filter-blocks");
    filterBlock.innerHTML = "";
    filterBlock.innerHTML += starsBlockHTML;

    //Add more filter
    result.forEach(filterElement => {
        if (filterElement.iconfont !== "acstar" && !filterElement.title.toLowerCase().includes("budget")) {
            let addHTML = "";
            addHTML += `<div class="filter-element">`;
            addHTML += `<h5 class="mb-3 text-pink">${filterElement.title.toLowerCase()}</h5>`;

            filterElement.categories.forEach(cat => {
                addHTML += `
                <div class="mt-2 mb-2">
                    <input class="star-checkbox filter-checkbox" type="checkbox" data-id=${cat.id}>
                    <span class="text-purple">${cat.name.toLowerCase()}</span>
                </div>`
            })

            addHTML += `<hr class="overlap-hr">`;
            addHTML += `</div>`;

            filterBlock.innerHTML += addHTML;
        }
    })

    document.querySelectorAll(".star-checkbox").forEach((checkbox) => {
        starQuery = "";
        checkbox.addEventListener("change", () => {
            checkStarInput();
        })
    })

    //Update event addEventListener
    document.querySelectorAll(".filter-checkbox").forEach(element => {
        element.addEventListener("change", () => {
            checkStarInput();
        })
    })
}