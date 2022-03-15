//DOM selectors
let btnBook = document.querySelector("#btn-book");

//To store hotel info gathered from API
let hotelInfo = {};

let uid;
let user_email;

let hotelChoosingInfo = {}
let hotelImages = [];
let usingCurrency = "USD";
let currencyRate = 1;
let singleNightPrice = 0;
let numberOfRoom = 1;
let roomSelect;
let totalRoomPrice = 0;
let hotelName = "";
let hotelID = "";

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let ratesList = null;
let choosingCurrency = "USD";

//For case not chosen info about booking dates
let cloneHotelInfo = {}
let cloneImageURL;
let tmpSingleNight = 0;
let numberOfNights;

//For local storage
let stars;
let address;

//Get all required info
let hotelFull = {};

//For room details
let roomsInfo = [];

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".main-container").style.opacity = 0;
    Swal.fire({
        title: 'Loading...',
        html: 'Please wait...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      });

    //Check for parameter
    let urlParams = new URLSearchParams(window.location.search);

    //Initiate the rooms list
    if (urlParams.has("hotel")) {
        // getHotelInfo(urlParams.get("hotel"))
        // getHotelImages(urlParams.get("hotel"))
        hotelID = urlParams.get("hotel");
        getCurrencyInfo();
    } else {
        //location.replace("./../");
        console.log("4");
    } 

    //Not chosen any hotel
    /*
    if (!localStorage.getItem("hotelInfo") || localStorage.getItem("hotelInfo") == "null") {
        document.querySelector(".booking").style.display = "none";
        document.querySelector(".booking-hide").style.display = "block";

        //Load currencies
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

        document.getElementById('btn-search-form').addEventListener("click", (e) => {
            e.preventDefault();

            let urlParams = new URLSearchParams(window.location.search);
            //Initiate the rooms list
            //cloneHotelInfo["hotel"].id = urlParams.get("hotel");

            Swal.fire({
                title: 'Loading...',
                html: 'Please wait...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                Swal.showLoading()
                }
            });

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
                //cloneHotelInfo["numberOfNights"] = numberOfNights;

                if (numberOfNights == 0) {
                    swal.close();
                    Swal.fire({
                        icon: 'error',
                        text: "Check-out date must be at least 1 day after Check-in date.",
                    });
                }
            }

            choosingCurrency = document.getElementById("currency").value;

            let checkIn = fromDate.toISOString().split('T')[0];
            let checkOut = toDate.toISOString().split('T')[0];

            let calculateFare = tmpSingleNight * ratesList[choosingCurrency] * numberOfNights;
            calculateFare = Math.round(calculateFare * 100) / 100
            //cloneHotelInfo["singleNight"] = calculateFare;

            let hotelInfo = new HotelBookingInfo(
                choosingCurrency,
                ratesList[choosingCurrency],
                urlParams.get("hotel"),
                cloneImageURL,
                checkIn,
                checkOut,
                numberOfNights,
                calculateFare
            );

            localStorage.setItem("hotelInfo", JSON.stringify(hotelInfo));
            location.reload();
        })
    } else {
        //Check for the correct hotel
        if (!localStorage.getItem("hotelInfo") || JSON.parse(localStorage.getItem("hotelInfo")).hotel.ID !== urlParams.get("hotel").toString()) {
            //location.replace("./../");
            console.log("2");
            return;
        } else {
            document.querySelector(".booking").style.display = "initial";
            document.querySelector(".booking-hide").style.display = "none";

            hotelChoosingInfo = JSON.parse(localStorage.getItem("hotelInfo"));
            Object.setPrototypeOf(hotelChoosingInfo, HotelBookingInfo.prototype);
            usingCurrency = hotelChoosingInfo.currency.code;
            currencyRate = hotelChoosingInfo.currency.rate;
            singleNightPrice = hotelChoosingInfo.singleNight;
            totalRoomPrice = singleNightPrice;
            document.getElementById("total-price").innerText = `${Math.round(singleNightPrice * 100) / 100} ${usingCurrency}`;
            document.getElementById("nights-count").innerText = `${hotelChoosingInfo.displayNightFullString()}`;
            document.getElementById("nights-range").innerText = `${getDisplayDateFormat(false, hotelChoosingInfo.date.checkIn)} - ${getDisplayDateFormat(false, hotelChoosingInfo.date.checkOut)}`;
        
            roomSelect = document.getElementById("rooms");
            roomSelect.addEventListener("change", () => {
                numberOfRoom = parseInt(roomSelect.value);
                totalRoomPrice = singleNightPrice * numberOfRoom;
                document.getElementById("total-price").innerText = `${Math.round(totalRoomPrice * 100) / 100} ${usingCurrency}`;
                let roomOrRooms = numberOfRoom == 1? "room" : "rooms";
                document.getElementById("number-of-rooms").innerText = `${numberOfRoom} ${roomOrRooms}`;
            })
        
            btnBook.addEventListener("click", performBook);
        
            document.getElementById("btn-search").addEventListener("click", () => {
                location.replace('./../')
            })
        }
    }
    */
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

            getHotelInfo(hotelID)

            //Upload the select
            // Object.keys(ratesList).forEach((key) => {
            //     if (key != "USD") {
            //         document.getElementById("currency").innerHTML += `<option value="${key}">${key}</option>`
            //     }
            // })
        }
    }

    xhr.setRequestHeader("x-rapidapi-host", "exchangerate-api.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "53fc6537ccmsh8f41627347b7c3cp173fe7jsn844e3f55a629");

    xhr.send();
}

const getHotelInfo = (hotelID) => {
    hotelFull = {};

    if (localStorage.getItem("hotelInfo") !== "null") {
        hotelChoosingInfo = JSON.parse(localStorage.getItem("hotelInfo"));
        Object.setPrototypeOf(hotelChoosingInfo, HotelBookingInfo.prototype);
    }

    getHotelDescription(hotelID);
}

const performCheck = () => {
    if (Object.keys(hotelFull).length === 6) {
        updateHotelInfo(hotelFull);
    }
}

const getHotelDescription = async(hotelID) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            try {
                let results = JSON.parse(xhr.responseText);
                hotelFull.description = results.description;

                getHotelRoomsList(hotelID);
            }
            catch (e) {
                console.log(e);
                return;
            }
        }
    }

    xhr.open("GET", `https://booking-com.p.rapidapi.com/v1/hotels/description?locale=en-us&hotel_id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "booking-com.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const getHotelRoomsList = async(hotelID) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            try {
                let results = JSON.parse(xhr.responseText);
                hotelFull.roomsList = results[0];

                getHotelFacilities(hotelID);
            }
            catch (e) {
                console.log(e);
                return;
            }
        }
    }

    let tmpHotel = {}
    if (localStorage.getItem("hotelInfo") !== "null") {
        tmpHotel = JSON.parse(localStorage.getItem("hotelInfo"));
        Object.setPrototypeOf(tmpHotel, HotelBookingInfo.prototype);
    }
    let currentDate = new Date();
    let next4Days = new Date(new Date().getTime() + (4*24*60*60*1000));

    let query = `https://booking-com.p.rapidapi.com/v1/hotels/room-list?units=metric&adults_number_by_rooms=2&hotel_id=${hotelID}` +
    `&checkin_date=${tmpHotel.date.checkIn? tmpHotel.date.checkIn : currentDate.toISOString().split('T')[0]}` +
    `&checkout_date=${tmpHotel.date.checkOut? tmpHotel.date.checkOut: next4Days.toISOString().split('T')[0]}` +
    `&locale=en-us` +
    `&currency=USD`;

    xhr.open("GET", query);
    xhr.setRequestHeader("x-rapidapi-host", "booking-com.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const getHotelFacilities = async(hotelID) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            try {
                let results = JSON.parse(xhr.responseText);
                hotelFull.facilities = results;

                getNearbyPlaces(hotelID);
            }
            catch (e) {
                console.log(e);
                return;
            }
        }
    }

    xhr.open("GET", `https://booking-com.p.rapidapi.com/v1/hotels/facilities?locale=en-us&hotel_id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "booking-com.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const getNearbyPlaces = async(hotelID) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            try {
                let results = JSON.parse(xhr.responseText);
                hotelFull.nearbyPlaces = results;

                getHotelReviewScores(hotelID);
            }
            catch (e) {
                console.log(e);
                return;
            }
        }
    }

    xhr.open("GET", `https://booking-com.p.rapidapi.com/v1/hotels/nearby-places?locale=en-us&hotel_id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "booking-com.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const getHotelReviewScores = async(hotelID) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            try {
                let results = JSON.parse(xhr.responseText);
                hotelFull.scores = results.score_breakdown;

                getHotelMapLocation(hotelID);
            }
            catch (e) {
                console.log(e);
                return;
            }
        }
    }

    xhr.open("GET", `https://booking-com.p.rapidapi.com/v1/hotels/review-scores?locale=en-us&hotel_id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "booking-com.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const getHotelMapLocation = async(hotelID) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            try {
                let results = JSON.parse(xhr.responseText);
                hotelFull.map = results.map_preview_url;

                performCheck();
                getHotelImages(hotelID);
            }
            catch (e) {
                console.log(e);
                return;
            }
        }
    }

    xhr.open("GET", `https://booking-com.p.rapidapi.com/v1/hotels/map-markers?locale=en-us&hotel_id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "booking-com.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const getHotelImages = async(hotelID) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            try {
                let results = JSON.parse(xhr.responseText);
            
                //Xử lý kết quả khi in ảnh
                hotelImages = results.map(image => {
                    //Format lại định dạng url ảnh
                    let url = image.url_max;
                    return url
                })

                updateImages();
            }
            catch (e) {
                //location.replace("./../");
                console.log("1");
                return;
            }
        }
    }

    xhr.open("GET", `https://booking-com.p.rapidapi.com/v1/hotels/photos?locale=en-gb&hotel_id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "booking-com.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const updateImages = () => {
    document.querySelector(".head-img-right img").setAttribute("src", hotelImages[0])
    document.querySelectorAll(".image-head-left img").forEach((img, index) => {
        img.setAttribute("src", hotelImages[index + 1]);
    })

    let html = "";

    for (let i = 3; i < hotelImages.length; i++) {
        html += `
            <div class="swiper-slide">
                <img 
                    src="${hotelImages[i].replace("_w.jpg", "_w.jpg")}" alt="">
            </div>`
    }

    document.querySelector(".swiper-wrapper").innerHTML = html;
    
    //Initialize Slide    
    const swiper = new Swiper('.swiper', {
        // Default parameters
        slidesPerView: 2,
        spaceBetween: 10,
        // Responsive breakpoints
        breakpoints: {
            // when window width is >= 480px
            768: {
            slidesPerView: 4,
            spaceBetween: 10
            },
        }
    })

    document.querySelectorAll(".hotel-info-head img").forEach(img => {
        img.addEventListener("click", function(e) {
            e.preventDefault();
            let getURL = img.src;
            // if (getURL.includes("_s"))
            //     getURL = getURL.replace("_s.jpg", "_w.jpg")
            loadImage(getURL);
            showImageBox();
        })
    })
          
}

const updateHotelInfo = (hotelInfo) => {
    Swal.close()

    //Update form
    document.getElementById("property").value = hotelChoosingInfo.hotel.name;
    document.getElementById("check-in").value = hotelChoosingInfo.date.checkIn;
    document.getElementById("check-out").value = hotelChoosingInfo.date.checkOut;
    document.getElementById("guests").options[parseInt(hotelChoosingInfo.numberOfGuests) - 1].selected = true;
    document.getElementById("rooms").options[parseInt(hotelChoosingInfo.numberOfRooms) - 1].selected = true;

    document.querySelector(".main-container").style.opacity = 1;

    document.querySelector(".hotel-option-name").innerText = hotelChoosingInfo.hotel.name;
    hotelName = hotelChoosingInfo.hotel.name;

    if (hotelChoosingInfo.score && hotelChoosingInfo.score.score) {
        document.querySelector(".hotel-option-rating-div").style.display = "initial";
        document.querySelector(".hotel-option-rating").innerText = `${hotelChoosingInfo.score.score}`;
        document.querySelector(".hotel-option-type").innerText = `${hotelChoosingInfo.score.word}`;
    } else {
        document.querySelector(".hotel-option-rating-div").style.display = "none";
    }

    document.querySelector(".hotel-address").innerText = hotelChoosingInfo.hotel.address.replace(/\s\s+/g, ' ').replaceAll(" ,", ",");
    address = hotelChoosingInfo.hotel.address;
    stars = hotelChoosingInfo.hotel.stars;

    document.querySelector(".hotel-option-star").innerHTML = returnStar(hotelChoosingInfo.hotel.stars);

    //Map
    document.querySelector(".img-review-on-map").setAttribute("src", hotelInfo.map);
    document.querySelector(".img-review-on-map").style.height = 
    `${document.querySelector(".img-review-on-map").parentNode.offsetHeight - 
    document.querySelector("#search-box").offsetHeight - 20}px`;

    document.querySelector(".img-review-on-map").addEventListener("click", function(e) {
        e.preventDefault();
        let getURL = e.target.src;
        loadImage(getURL);
        showImageBox();
    })

    //About
    document.querySelector(".about p").innerHTML = hotelInfo.description.replace("\n\n", "<br>");

    //Facilities
    let facilities = {};

    hotelInfo.facilities.map(facility => {
        if (!Object.keys(facilities).includes(facility.facilitytype_name)) {
            facilities[facility.facilitytype_name] = [facility.facility_name];
        } else {
            facilities[facility.facilitytype_name].push(facility.facility_name);
        }
    })

    let overviewHTML = ``;
    Object.keys(facilities).forEach(facilityGroup => {
        let childHTML = ``;
        facilities[facilityGroup].forEach(facility => {
            childHTML += `<li class="col-md-4 col-sm-6 col-12 pl-1 pr-1 pt-2 pb-2"><i class="fa fa-check" aria-hidden="true"></i> ${facility}</li>`
        })
        overviewHTML += `
            <div class="mb-2">
                <h4 class="amenity-title"><i class="fas fa-utensils"></i> ${facilityGroup}</h4>
                <ul class="hotel-info-ul row" style="width: 100%; margin: 0 auto;">
                    ${childHTML}
                </ul>
            </div>
        `
    })

    document.querySelector(".overview").innerHTML = overviewHTML;

    //Surrounding
    let surroundingHTML = ``;
    let childHTML = ``;

    //Landmark
    hotelInfo.nearbyPlaces.landmarks.closests.forEach(place => {
        childHTML += `<li class="mr-3">
            <div class="d-flex justify-content-between pt-2 pb-2">
                <span>
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    ${place.landmark_name}
                </span>
                <span>${getKilometersDistance(place.distance)}</span>
            </div>
        </li>`
    })
    document.querySelector(".closest").innerHTML = childHTML;

    childHTML = ``;
    hotelInfo.nearbyPlaces.landmarks.populars.forEach(place => {
        childHTML += `<li class="mr-3">
            <div class="d-flex justify-content-between pt-2 pb-2">
                <span>
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    ${place.landmark_name}
                </span>
                <span>${getKilometersDistance(place.distance)}</span>
            </div>
        </li>`
    })

    document.querySelector(".popular").innerHTML = childHTML;

    //surroundings
    let surroundingByCategoriesHTML = ``;
    Object.keys(hotelInfo.nearbyPlaces.surroundings).forEach(placesGroup => {
        childHTML = ``;

        hotelInfo.nearbyPlaces.surroundings[placesGroup].items.forEach(item => {
            childHTML += `<li class="mr-3">
                <div class="d-flex justify-content-between pt-2 pb-2">
                    <span>
                        <i class="fas fa-map-marked-alt mr-2"></i>
                        ${item.landmark_name}
                    </span>
                    <span>${getKilometersDistance(item.distance)}</span>
                </div>
            </li>`
        })

        surroundingByCategoriesHTML += `
        <div class="col-md-6 col-12 p-2">
            <h4 class="amenity-title"><i class="fas fa-mountain"></i> 
            ${hotelInfo.nearbyPlaces.surroundings[placesGroup].type_title}</h4>
            <ul class="hotel-info-ul" style="width: 100%; margin: 0 auto;">
                ${childHTML}
            </ul>
        </div>
    `
    })
    

    document.querySelector(".surroundings-div").innerHTML = surroundingByCategoriesHTML;

    //Guest reviews
    
    let scoreToDisplay = [];
    hotelInfo.scores.forEach(score => {
        if (score.customer_type === "total") {
            scoreToDisplay = score.question;
        }
    })
    let reviewItemsHTML = ``;
    scoreToDisplay.forEach(item => {
        if (!isNaN(item.score)) {
            let score = parseFloat(item.score);
            reviewItemsHTML += `
            <div class="col-md-4 col-sm-6 col-12">
                <p class="mb-1">${item.localized_question}</p>
                <div class="review-progress-div">
                    <span class="progress" style="width: 90%;">
                        <div class="progress-bar review-progress" role="progressbar" style="width: ${score / 10 * 100}%" 
                        aria-valuenow="${score / 10 * 100}" aria-valuemin="0" aria-valuemax="100"></div>
                    </span>
                    <span class="ml-1">${score.toFixed(1)}</span>
                </div>
            </div>
        `
        }
    })
    document.querySelector("#guest-reviews-items").innerHTML = reviewItemsHTML;
    
    //Availability

    roomsInfo = [];
    hotelInfo.roomsList.block.forEach(room => {
        //Prevent duplicate
        id = room.room_id;

        let duplicated = false;
        for (let i = 0; i < roomsInfo.length; i++) {
            if (id === roomsInfo[i].id) {
                duplicated = true;
            }
        }

        if (!duplicated) {
            roomsInfo.push({
                name: room.name,
                id: room.room_id,
                price: room.min_price.price / ratesList[room.min_price.currency] * hotelChoosingInfo.currency.rate,
                currency: hotelChoosingInfo.currency.code,
                surface: room.room_surface_in_m2,
                adults: room.nr_adults,
                roomInfo: {
                    description: hotelInfo.roomsList.rooms[room.room_id].description,
                    facilities: hotelInfo.roomsList.rooms[room.room_id].facilities,
                    photos: hotelInfo.roomsList.rooms[room.room_id].photos,
                    highlights: hotelInfo.roomsList.rooms[room.room_id].highlights,
                    bedConfig: hotelInfo.roomsList.rooms[room.room_id].bed_configurations
                }
            })
        }
    })

    let tableHTML = ``;

    for (let j = 0; j < roomsInfo.length; j++) {
        let room = roomsInfo[j];

        let carouselImagesHTML = ``;

        for (let i = 0; i < room.roomInfo.photos.length; i++) {
            carouselImagesHTML += `
                <div class="carousel-item ${i == 0? "active" : ""}">
                    <img class="d-block w-100 img-room-type" src="${room.roomInfo.photos[i].url_original}" alt="">
                </div>
            `
        }

        let nightString = `${hotelChoosingInfo.numberOfNights} ${hotelChoosingInfo.numberOfNights === 1? "night" : "nights"}`;

        let facilitiesListing = ``;
        room.roomInfo.facilities.slice(0, Math.min(room.roomInfo.facilities.length, 20)).forEach(facility => {
            facilitiesListing += `🗸 ${facility.name}  `
        })

        let highlightsListing = ``;
        room.roomInfo.highlights.forEach(highlight => {
            highlightsListing += `🗸 ${highlight.translated_name}  `
        })

        let roomSubInfo = ``;
        let bedConfig = ``;
        for (let i = 0; i < room.roomInfo.bedConfig.length; i++) {
            if (i === 0) {
                bedConfig += room.roomInfo.bedConfig[i].bed_types[0].name_with_count;
            } else {
                bedConfig += " or " + room.roomInfo.bedConfig[i].bed_types[0].name_with_count;
            }
        }
        roomSubInfo += `${room.surface} m² · ${room.adults} ${room.adults > 1? "adults" : "adult"} · ${bedConfig}`

        tableHTML += `
            <tr>
                <td style="min-width: 350px; width: 350px">
                    <div class="d-flex flex-column align-items-center justify-content-center" style="height: 100%">
                        <div id="carousel-${j}" class="carousel slide carousel-fade" data-ride="carousel">
                            <div class="carousel-inner">
                                ${carouselImagesHTML}
                            </div>
                            <a class="carousel-control-prev" href="#carousel-${j}" role="button" data-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="sr-only">Previous</span>
                            </a>
                            <a class="carousel-control-next" href="#carousel-${j}" role="button" data-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="sr-only">Next</span>
                            </a>
                        </div>
                        <p class="font-weight-normal text-center">${room.name}</p>
                    </div>
                </td>
                <td style="min-width: 300px; width: 300px">
                    <div class="d-flex flex-column align-items-left justify-content-center" style="height: 100%">
                        <p class="font-weight-normal text-medium text-left">${room.roomInfo.description}</p>
                        <p class="font-weight-normal text-medium text-left">${roomSubInfo}</p>
                        <p class="font-weight-normal text-medium text-purple text-left">${highlightsListing}</p>
                        <p class="font-weight-normal text-tiny text-purple text-left">${facilitiesListing}</p>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-column align-items-center justify-content-center" style="height: 100%">
                        <h5 class="text-center text-pink">
                        ${room.price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${room.currency}/${nightString}</h5>
                    </div>
                </td>
                <td style="min-width: 90px; width: 90px">
                    <div class="d-flex flex-column align-items-center justify-content-center">
                        <select class="custom-select room-select" data-price="${room.price}" onChange="updateBookingQuantity()">
                            <option value="0" selected>0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </div>
                </td>
            </tr>
        `
    }

    document.getElementById("availability-tbody").innerHTML = tableHTML;

    document.querySelectorAll(".img-room-type").forEach(img => {
        img.addEventListener("click", function(e) {
            e.preventDefault();
            let getURL = e.target.src;
            loadImage(getURL);
            showImageBox();
        }
    )})

    document.querySelector("#total-price").innerHTML =
    `${totalRoomPrice.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${hotelChoosingInfo.currency.code}`
}

const updateBookingQuantity = () => {
    let tmpTotalPrice = 0;
    document.querySelectorAll(".room-select").forEach(select => {
        let getQuantity = select.value;
        let getPrice = select.getAttribute("data-price");
        tmpTotalPrice += getQuantity * getPrice;
    })

    totalRoomPrice = tmpTotalPrice.toFixed(2);
    document.querySelector("#total-price").innerHTML = 
    `${totalRoomPrice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${hotelChoosingInfo.currency.code}`

    if (totalRoomPrice > 0) {
        document.getElementById("book-now-row").style.display = "table-row";
    } else {
        document.getElementById("book-now-row").style.display = "none";
    }
}

function showImageBox() {
    $(".image-box").css("display", "flex");
    setTimeout(function() {
        $(".image-box").css("opacity", 1);
    }, 10);
}

function hideImageBox() {
    $(".image-box").css("opacity", 0);
    setTimeout(function() {
        $(".image-box").css("display", "none");
        $(".image-box img").attr("src", "");
    }, 300);
}

function loadImage(src) {
    $(".image-box img").attr("src", src);
}

document.querySelector(".image-box").addEventListener("click", function() {
    hideImageBox();
})

const returnStar = (star) => {
    let result = "";

    for (let i = 1; i <= Math.floor(star); i++)
        result += `<i class="fa fa-star rating-star" aria-hidden="true"></i>`

    if (star > Math.floor(star))
        result += `<i class="fa fa-star-half-alt rating-star"></i>`

    return result;
}

function initMap(center) {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: center,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    const centerMarker = new google.maps.Marker({
        position: center,
        map: map,
    });
}

const getKilometersDistance = (distanceInMeters) => {
    let kilometers = (distanceInMeters / 1000).toFixed(1);
    return `${kilometers} km`
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

const performBook = () => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = user.uid;
            user_email = user.email;

            Swal.fire({
                title: 'Are you sure want to book?',
                text: "Please check your information carefully. Further modifications may require an additional fee.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#028a0f',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
            }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'The booking is being processed...',
                    html: 'Please wait...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                      Swal.showLoading()
                    }
                  });
            
                sendBookingInfo();
            }});
        } else {
            location.replace("./../../auth/login.php?hotel_confirmation");
            return;
        }
    })
}

const sendBookingInfo = () => {
    //Add booking info to table
    //Get csrf
    let csrf = "";
    csrf = document.getElementById("csrf-hotel-info").innerText;

    let totalRoomPriceReformatted = Math.round(totalRoomPrice * 100) / 100

    // hotelChoosingInfo.hotel.name = hotelName;
    // hotelChoosingInfo.numberOfRooms = numberOfRoom;
    hotelChoosingInfo.totalCost = totalRoomPriceReformatted;
    // hotelChoosingInfo.hotel.stars = stars;
    // hotelChoosingInfo.hotel.address = address;
    
    let sendData = hotelChoosingInfo.buildObjectForSend(uid);

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "../../api/hotels/hotel.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let bookingID = parseInt(xhr.responseText);
            sendHotelBookingDetails(bookingID);
        } else {
            swal.close();
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again later."
            });
        }
    }

    xhr.send(`bookingInfo&data=${JSON.stringify(sendData).replaceAll("&", "and")}&csrf=${csrf}`);
}

const sendHotelBookingDetails = (bookingID) => {
    //Add booking details to table
    //Get csrf
    let csrf = "";
    csrf = document.getElementById("csrf-hotel-info").innerText;

    let hotelRoomInfos = [];

    document.querySelectorAll(".room-select").forEach((select, index) => {
        let getQuantity = select.value;
        let getPrice = select.getAttribute("data-price");
        if (getQuantity > 0) {
            hotelRoomInfos.push({
                room_name: roomsInfo[index].name,
                room_image: roomsInfo[index].roomInfo.photos[0].url_original || "",
                number_of_room: getQuantity,
                single_cost: getPrice,
                currency: roomsInfo[index].currency,
            })
        }
    })

    hotelChoosingInfo.roomDetails = hotelRoomInfos;
    let sendData = hotelRoomInfos;

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "../../api/hotels/hotel.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
            localStorage.setItem("hotelInfo", JSON.stringify(hotelChoosingInfo));
            sendBookingConfirmationEmail();
        } else {
            swal.close();
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again later."
            });
        }
    }

    xhr.send(`bookingDetails&data=${encodeURIComponent(JSON.stringify(sendData))}&bookingID=${bookingID}&csrf=${csrf}`);
}

const sendBookingConfirmationEmail = () => {      
    let hotelRoomInfoHTML = ``;
    hotelChoosingInfo.roomDetails.forEach(detail => {
        hotelRoomInfoHTML += `
            <div>
                <h3 id="total-price" style="color: #a082af; display: inline;">${detail.number_of_room} x </h3>
                <p style="display: inline;">${detail.room_name}</p>
                <p style="display: inline;">(${detail.single_cost} ${detail.currency})</p>
            </div>
        `
    })
    
    let htmlContent = `
        <html>
            <head>
                ${css}
            </head>
            <body>
                <div class="booking-detail">
                    <div class="booking-detail" id="booking-detail" style="position:relative;">
                        <div class="agency-detail">
                            <div class="agency-name">
                                <h2>Tour Guru</h2>
                            </div>
                        </div>
                        <h4 class="text-purple mt-3 mb-3 text-center" style="color: #a082af">Hotel Booking Confirmation</h4>
                        <div id="main-div">
                            <div class="hotel-info">
                                <h1 id="hotel-name" class="text-pink" style="color: #c95998">${hotelChoosingInfo.hotel.name}</h1>
                                <h4 id="hotel-stars" style="color: rgb(223, 167, 25)">${returnStarForMail(hotelChoosingInfo.hotel.stars)}</h4>
                                <p id="hotel-address" class="text-gray" style="color: gray">${hotelChoosingInfo.hotel.address.replace(/\s\s+/g, ' ').replaceAll(" ,", ",")}</p>
                            </div>
                        </div>
                        <div class="date-info">
                            <div class="check-in text-center">
                                <h4 class="text-pink" style="color: #c95998">check-in</h4>
                                <h2>
                                    <span class="text-purple check-in-date" style="color: #a082af">${getDatePart(hotelChoosingInfo.date.checkIn, "date")}</span>
                                    <span class="text-purple check-in-month" style="color: #a082af">${getDatePart(hotelChoosingInfo.date.checkIn, "monthYear")}</span>
                                    <span class="text-purple check-in-weekday" style="color: #a082af">${getDatePart(hotelChoosingInfo.date.checkIn, "weekDay")}</span>
                                </h2>
                                
                            </div>
                            <div class="check-out text-center">
                                <h4 class="text-pink" style="color: #c95998">check-out</h4>
                                <h2>
                                    <span class="text-purple check-out-date" style="color: #a082af">${getDatePart(hotelChoosingInfo.date.checkOut, "date")}</span>
                                    <span class="text-purple check-out-month" style="color: #a082af">${getDatePart(hotelChoosingInfo.date.checkOut, "monthYear")}</span>
                                    <span class="text-purple check-out-weekday" style="color: #a082af">${getDatePart(hotelChoosingInfo.date.checkOut, "weekDay")}</span>
                                </h2>
                            </div>
                            <div class="room-night text-center">
                                <div class="room">
                                    <h2 class="text-pink" style="color: #c95998">
                                        <span class="text-purple night-count" style="color: #a082af">${hotelChoosingInfo.displayNightFullString()}</span>
                                    </h2>                                    
                                </div>
                            </div>
                        </div>
                        <hr>
                        <h4 class="text-pink" style="color: #c95998">rooms</h4>
                        ${hotelRoomInfoHTML}

                        <hr>
                        <h4 class="text-pink" style="color: #c95998">total price</h4>
                        <h3 id="container-total-price"><h2 id="total-price" style="color: #a082af">${hotelChoosingInfo.buildCostString()}</h2></h3>

                        <hr>
                        <h4 class="text-pink" style="color: #c95998">payment info</h4>
                        <p class="payment-content">
                            <b id="hotel-name-span">${hotelChoosingInfo.hotel.name}</b> handles all the payment processes required.
                        </p>
                        <p class="payment-content">
                            payment methods accepted: American Express, Visa, Mastercard, Diners Club, JCB, Maestro, Discover, Bankcard, UnionPay Debit, UnionPay Credit
                        </p>
                        <hr>
                        <h4 class="text-pink" style="color: #c95998">policies</h4>
                        <p class="payment-content text-red" style="color: red;">
                            30% of the total fee must be completed in order for the booking to be valid. 
                        </p>
                    </div>
                </div>
            </body>
        </html>
    `
    
    let subject = `CONFIRMATION FOR YOUR ${hotelChoosingInfo["numberOfNights"]}-NIGHT HOTEL BOOKING ON ${getDisplayDateFormat(false, hotelChoosingInfo.date.checkIn).toUpperCase()}`;

    let csrf = "";
    csrf = document.getElementById("csrf-hotel-info").innerText;

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "../../api/hotels/hotel.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
            location.replace("./../booking-detail");
        } else {
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again later."
            });
        }
    }
    xhr.send(`sendEmail&to=${user_email}&subject=${subject}&content=${encodeURIComponent(JSON.stringify({'content': htmlContent}))}&csrf=${csrf}`);
}

const getDatePart = (ISODate, getPart) => {
    const newDateObj = new Date(ISODate);
    switch (getPart) {
        case "weekDay":
            return weekDays[newDateObj.getDay()];
        case "date":
            return newDateObj.getDate().toString();
        case "monthYear":
            return months[newDateObj.getMonth()] + " " + newDateObj.getFullYear().toString();
    }
}

const returnStarForMail = (star) => {
    let result = "";

    for (let i = 1; i <= Math.floor(star); i++)
        result += `★`

    if (star > Math.floor(star))
        result += `<span style="color: rgba(223, 167, 25, .5)">★</span>`

    return result;
}