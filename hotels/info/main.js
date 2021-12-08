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
        getHotelInfo(urlParams.get("hotel"))
        getHotelImages(urlParams.get("hotel"))
    } else {
        //location.replace("./../");
        console.log("4");
    } 

    //Not chosen any hotel
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

            //cloneHotelInfo["date"]["checkIn"] = checkIn;
            //cloneHotelInfo["date"]["checkOut"] = checkOut;

            //cloneHotelInfo["currency"]["code"] = choosingCurrency;
            //cloneHotelInfo["currency"]["rate"] = ratesList[choosingCurrency];

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

const getHotelInfo = (hotelID) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            try {
                let results = JSON.parse(xhr.responseText);
                hotelInfo = results.data.body;
                updateHotelInfo(hotelInfo);
            }
            catch (e) {
                console.log(e);
                //location.replace("./../");
                return;
            }
        }
    }

    xhr.open("GET", `https://hotels4.p.rapidapi.com/properties/get-details?id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "50ab243ea0mshdda18fe8e21df40p101ca6jsnac533b141bb6");

    xhr.send();
}

const getHotelImages = (hotelID) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            try {
                let results = JSON.parse(xhr.responseText);
            
                //Xử lý kết quả khi in ảnh
                hotelImages = results.hotelImages.map(image => {
                    //Format lại định dạng url ảnh
                    let url = image.baseUrl;
                    url = url.replace("_{size}", "_w");
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

    xhr.open("GET", `https://hotels4.p.rapidapi.com/properties/get-hotel-photos?id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "50ab243ea0mshdda18fe8e21df40p101ca6jsnac533b141bb6");

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
            if (getURL.includes("_s"))
                getURL = getURL.replace("_s.jpg", "_w.jpg")
            loadImage(getURL);
            showImageBox();
        })
    })
          
}

const updateHotelInfo = (hotelInfo) => {
    Swal.close()
    document.querySelector(".main-container").style.opacity = 1;

    document.querySelector(".hotel-option-name").innerText = hotelInfo.propertyDescription.name;
    hotelName = hotelInfo.propertyDescription.name;

    if (hotelInfo.guestReviews && hotelInfo.guestReviews.brands) {
        document.querySelector(".hotel-option-rating-div").style.display = "initial";
        document.querySelector(".hotel-option-rating").innerText = `${hotelInfo.guestReviews.brands.formattedRating}`;
        document.querySelector(".hotel-option-type").innerText = `${hotelInfo.guestReviews.brands.badgeText}`;
    } else {
        document.querySelector(".hotel-option-rating-div").style.display = "none";
    }

    document.querySelector(".hotel-address").innerText = hotelInfo.propertyDescription 
    && hotelInfo.propertyDescription.address? hotelInfo.propertyDescription.address.fullAddress : "";

    address = hotelInfo.propertyDescription 
    && hotelInfo.propertyDescription.address? hotelInfo.propertyDescription.address.fullAddress : "";
    stars = hotelInfo.propertyDescription.starRating;

    document.querySelector(".hotel-option-star").innerHTML = returnStar(hotelInfo.propertyDescription.starRating)

    let overviewHTML = ``;
    hotelInfo.overview.overviewSections.forEach(overview => {
        if (overview.title) {
            let childHTML = ``;
            overview.content.forEach(content => {
                childHTML += `<li class="col-md-6 col-sm-12"><i class="fa fa-check" aria-hidden="true"></i> ${content}</li>`
            })
            overviewHTML += `
                <div class="mb-2">
                    <h4 class="amenity-title"><i class="fas fa-utensils"></i> ${overview.title}</h4>
                    <ul class="hotel-info-ul row" style="width: 100%; margin: 0 auto;">
                        ${childHTML}
                    </ul>
                </div>
            `
        }
    })

    document.querySelector(".overview").innerHTML = overviewHTML;

    let hotelInfoHTML = "";

    Object.keys(hotelInfo.atAGlance.keyFacts).forEach(
        amenity => {
            let title;
            switch (amenity) {
                case "arrivingLeaving":
                    title = `<h5 class="ml-md-3 ml-sm-0 amenity-subtitle"><i class="fa fa-calendar-check" aria-hidden="true"></i> Check-in and Check-out</h5>`
                    break;
                case "hotelSize":
                    title = `<h5 class="ml-md-3 ml-sm-0 amenity-subtitle"><i class="fas fa-hotel"></i> Hotel</h5>`
                    break;
                case "requiredAtCheckIn":
                    title = `<h5 class="ml-md-3 ml-sm-0 amenity-subtitle"><i class="fa fa-check" aria-hidden="true"></i> Check-in Info</h5>`
                    break;
                case "specialCheckInInstructions":
                    title = `<h5 class="ml-md-3 ml-sm-0 amenity-subtitle"><i class="fa fa-question" aria-hidden="true"></i> Check-in Instructions</h5>`
                    break;
            }
    
            if (title != "") {
                let childHTML = ``;
                hotelInfo.atAGlance.keyFacts[amenity].forEach(item => {
                    childHTML += `<li class="ml-md-3 ml-sm-0">${item}</li>`
                })
                hotelInfoHTML += `
                    <div class="mb-2 col-md-6 col-sm-12">
                        ${title}
                        <ul class="hotel-info-ul row" style="width: 100%; margin: 0 auto;">
                            ${childHTML}
                        </ul>
                    </div>
                `
            }
        }
    )

    document.getElementById("hotel-policies").innerHTML = hotelInfoHTML;

    //Get map
    //initMap(new google.maps.LatLng(hotelInfo.pdpHeader.hotelLocation.coordinates.latitude, hotelInfo.pdpHeader.hotelLocation.coordinates.longitude))

    document.getElementById("booking-summary-img").setAttribute("src", document.querySelector(".head-img-right img").getAttribute("src"))

    tmpSingleNight = hotelInfo.propertyDescription.featuredPrice.currentPrice.plain;

    if (!localStorage.getItem("hotelInfo") || localStorage.getItem("hotelInfo") == "null") {
        cloneImageURL = document.querySelector(".head-img-right img").getAttribute("src"); 
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

    hotelChoosingInfo.hotel.name = hotelName;
    hotelChoosingInfo.numberOfRooms = numberOfRoom;
    hotelChoosingInfo.totalCost = totalRoomPriceReformatted;
    hotelChoosingInfo.hotel.stars = stars;
    hotelChoosingInfo.hotel.address = address;
    
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
            localStorage.setItem("hotelInfo", JSON.stringify(hotelChoosingInfo))
            sendBookingConfirmationEmail();
        } else {
            swal.close();
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again later."
            });
        }
    }

    xhr.send(`bookingInfo&data=${JSON.stringify(sendData).replace("&", "and")}&csrf=${csrf}`);
}

const sendBookingConfirmationEmail = () => {        
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
                                <p id="hotel-address" class="text-gray" style="color: gray">${hotelChoosingInfo.hotel.address}</p>
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
                                        <span class="text-purple room-count" style="color: #a082af">${hotelChoosingInfo.displayRoomString()}</span>
                                        -
                                        <span class="text-purple night-count" style="color: #a082af">${hotelChoosingInfo.displayNightFullString()}</span>
                                    </h2>                                    
                                </div>
                            </div>
                        </div>
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
    xhr.send(`sendEmail&to=${user_email}&subject=${subject}&content=${htmlContent}&csrf=${csrf}`);
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