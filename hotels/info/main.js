let hotelInfo = {}
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
let btnBook = document.querySelector("#btn-book");
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
        location.replace("./../");
    } 

    //Not chosen any hotel
    if (!localStorage.getItem("hotelInfo") || localStorage.getItem("hotelInfo") == "null") {
        location.replace("./../");
        return;
    }

    //Check for the correct hotel
    if (JSON.parse(localStorage.getItem("hotelInfo")).hotelID !== urlParams.get("hotel").toString()) {
        location.replace("./../");
        return;
    } 
    

    hotelChoosingInfo = JSON.parse(localStorage.getItem("hotelInfo"));
    usingCurrency = hotelChoosingInfo["currencyCode"];
    currencyRate = hotelChoosingInfo["currencyRate"];
    singleNightPrice = hotelChoosingInfo["singleNight"];
    totalRoomPrice = singleNightPrice;
    document.getElementById("total-price").innerText = `${Math.round(singleNightPrice * 100) / 100} ${usingCurrency}`;
    let nightOrNights = hotelChoosingInfo["numberOfNights"] == 1 ? "night" : "nights";
    document.getElementById("nights-count").innerText = `${hotelChoosingInfo["numberOfNights"]} ${nightOrNights}`;
    document.getElementById("nights-range").innerText = `${getDisplayDateFormat(false, hotelChoosingInfo["checkIn"])} - ${getDisplayDateFormat(false, hotelChoosingInfo["checkOut"])}`;

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
})

const getHotelInfo = (hotelID) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            try {
                let results = JSON.parse(this.responseText);
                hotelInfo = results.data.body;
                updateInfo(hotelInfo);
            }
            catch (e) {
                location.replace("./../");
                return;
            }
        }
    }

    xhr.open("GET", `https://hotels4.p.rapidapi.com/properties/get-details?id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const getHotelImages = (hotelID) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            try {
                let results = JSON.parse(this.responseText);
            
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
                location.replace("./../");
                return;
            }
        }
    }

    xhr.open("GET", `https://hotels4.p.rapidapi.com/properties/get-hotel-photos?id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
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
            if (getURL.includes("_s"))
                getURL = getURL.replace("_s.jpg", "_w.jpg")
            loadImage(getURL);
            showImageBox();
        })
    })
          
}

const updateInfo = (hotelInfo) => {
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

    /*
    hotelInfo.amenities.forEach(amenity => {
        let currentDiv;
        if (amenity.heading == "In the hotel") {
            currentDiv = document.getElementById("in-the-hotel-amenities");
            
        } else if (amenity.heading == "In the room") {
            currentDiv = document.getElementById("in-the-room-amenities");
        }

        let html = "";
        amenity.listItems.forEach(item => {
            if (item.heading) {
                let childHTML = ``;
                item.listItems.forEach(content => {
                    childHTML += `<li class="col-md-4 col-sm-6"><i class="fa fa-check" aria-hidden="true"></i> ${content}</li>`
                })
                html += `
                    <div class="mb-2">
                        <h5 class="ml-md-3 ml-sm-0 amenity-subtitle"><i class="fas fa-utensils"></i> ${item.heading}</h5>
                        <ul class="hotel-info-ul row" style="width: 100%; margin: 0 auto;">
                            ${childHTML}
                        </ul>
                    </div>
                `
                currentDiv.innerHTML = html;
            }
        })
    })
    */

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
        } else {
            location.replace("./../../auth/login.php?hotel_confirmation");
            return;
        }
    })

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
        //sendBookingConfirmationEmail();

        // let totalRoomPriceReformatted = Math.round(totalRoomPrice * 100) / 100
        // let totalCostString = `${totalRoomPriceReformatted} ${usingCurrency}`
        // hotelChoosingInfo["hotelName"] = hotelName;
        // hotelChoosingInfo["numberOfRooms"] = numberOfRoom;
        // hotelChoosingInfo["totalCost"] = totalCostString;
        // hotelChoosingInfo["stars"] = stars;
        // hotelChoosingInfo["address"] = address;
        // localStorage.setItem("hotelInfo", JSON.stringify(hotelChoosingInfo))
        // location.replace("./../booking-detail");
    }
    })
}

const sendBookingInfo = () => {
    //Add booking info to table
    //Get csrf
    let csrf = "";
    csrf = document.getElementById("csrf-hotel-info").innerText;

    let totalRoomPriceReformatted = Math.round(totalRoomPrice * 100) / 100
    let totalCostString = `${totalRoomPriceReformatted} ${usingCurrency}`

    let sendData = {
        "user_id": `${uid}`,
        "date_start": `${hotelChoosingInfo["checkIn"]}`,
        "date_end": `${hotelChoosingInfo["checkOut"]}`,
        "number_of_nights": `${hotelChoosingInfo["numberOfNights"]}`,
        "hotel_id": `${hotelChoosingInfo["hotelID"]}`,
        "hotel_name": `${hotelName}`,
        "hotel_image_url": `${hotelChoosingInfo["hotelImageURL"]}`,
        "number_of_beds": `${numberOfRoom}`,
        "total_cost": `${totalCostString}`,
    }

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "/api/hotels/hotel.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
        if (this.status === 200 && this.readyState === 4) {
            //Booking complete
            Swal.fire({
                title: 'Booking is completed.',
                text: 'Please complete your payment and receive the confirmation through your email.',
                icon: 'success'
            })

            hotelChoosingInfo["hotelName"] = hotelName;
            hotelChoosingInfo["numberOfRooms"] = numberOfRoom;
            hotelChoosingInfo["totalCost"] = totalCostString;
            hotelChoosingInfo["stars"] = stars;
            hotelChoosingInfo["address"] = address;
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
    xhr.send(`bookingInfo&data=${JSON.stringify(sendData)}&csrf=${csrf}`);
}

const sendBookingConfirmationEmail = () => {    
    let roomOrRooms = numberOfRoom == 1? "room" : "rooms";
    let nightOrNights = hotelChoosingInfo["numberOfNights"] == 1 ? "night" : "nights"

    let totalRoomPriceReformatted = Math.round(totalRoomPrice * 100) / 100
    
    let htmlContent = `
        <html>
            <head>
                ${css}
            </head>
            <body>
                <div class="booking-detail">
                    <div class="booking-detail" id="booking-detail" style="position:relative;">
                        <div class="agency-detail">
                            <img id="agency-logo" src="https://firebasestorage.googleapis.com/v0/b/tour-guru-25442.appspot.com/o/logo.svg?alt=media&token=ca6b15e1-bce5-4d6b-be8d-8d834788d043" alt="">
                            <div class="agency-name">
                                <h2>Tour Guru</h2>
                            </div>
                        </div>
                        <h4 class="text-purple mt-3 mb-3 text-center" style="color: #a082af">Hotel Booking Confirmation</h4>
                        <div id="main-div">
                            <div class="hotel-info">
                                <h1 id="hotel-name" class="text-pink" style="color: #c95998">${hotelName}</h1>
                                <h4 id="hotel-stars" style="color: rgb(223, 167, 25)">${returnStarForMail(stars)}</h4>
                                <p id="hotel-address" class="text-gray" style="color: gray">${address}</p>
                            </div>
                        </div>
                        <div class="date-info">
                            <div class="check-in text-center">
                                <h4 class="text-pink" style="color: #c95998">check-in</h4>
                                <h2>
                                    <span class="text-purple check-in-date" style="color: #a082af">${getDatePart(hotelChoosingInfo.checkIn, "date")}</span>
                                    <span class="text-purple check-in-month" style="color: #a082af">${getDatePart(hotelChoosingInfo.checkIn, "monthYear")}</span>
                                    <span class="text-purple check-in-weekday" style="color: #a082af">${getDatePart(hotelChoosingInfo.checkIn, "weekDay")}</span>
                                </h2>
                                
                            </div>
                            <div class="check-out text-center">
                                <h4 class="text-pink" style="color: #c95998">check-out</h4>
                                <h2>
                                    <span class="text-purple check-out-date" style="color: #a082af">${getDatePart(hotelChoosingInfo.checkOut, "date")}</span>
                                    <span class="text-purple check-out-month" style="color: #a082af">${getDatePart(hotelChoosingInfo.checkOut, "monthYear")}</span>
                                    <span class="text-purple check-out-weekday" style="color: #a082af">${getDatePart(hotelChoosingInfo.checkOut, "weekDay")}</span>
                                </h2>
                            </div>
                            <div class="room-night text-center">
                                <div class="room">
                                    <h2 class="text-pink" style="color: #c95998">
                                        <span class="text-purple room-count" style="color: #a082af">${numberOfRoom} ${roomOrRooms}</span>
                                        -
                                        <span class="text-purple night-count" style="color: #a082af">${hotelChoosingInfo["numberOfNights"]} ${nightOrNights}</span>
                                    </h2>                                    
                                </div>
                            </div>
                        </div>
                        <hr>
                        <h4 class="text-pink" style="color: #c95998">total price</h4>
                        <h3 id="container-total-price"><h2 id="total-price" style="color: #a082af">${totalRoomPriceReformatted} ${usingCurrency}</h2></h3>

                        <hr>
                        <h4 class="text-pink" style="color: #c95998">payment info</h4>
                        <p class="payment-content">
                            <b id="hotel-name-span">${hotelName}</b> handles all the payment processes required.
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
    
    let subject = `CONFIRMATION FOR YOUR ${hotelChoosingInfo["numberOfNights"]}-NIGHT HOTEL BOOKING ON ${getDisplayDateFormat(false, hotelChoosingInfo["checkIn"]).toUpperCase()}`;

    let csrf = "";
    csrf = document.getElementById("csrf-hotel-info").innerText;

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "/api/hotels/hotel.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
        if (this.status === 200 && this.readyState === 4) {
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
        result += `&#11240;`

    return result;
}