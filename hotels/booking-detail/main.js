let info;
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

window.addEventListener("DOMContentLoaded", () => {
    //Check if signed in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = user.uid;
            user_email = user.email;
        } else {
            location.replace("./../../auth");
            return;
        }
    })

    //Not chosen any flight
    if (!localStorage.getItem("hotelInfo") || localStorage.getItem("hotelInfo") == "null") {
        location.replace("./../");
        return;
    }

    //Booking complete
    Swal.fire({
        title: 'Booking is completed.',
        text: 'Please complete your payment and receive the confirmation through your email.',
        icon: 'success'
    })

    info = JSON.parse(localStorage.getItem("hotelInfo"));
    Object.setPrototypeOf(info, HotelBookingInfo.prototype)

    printToDisplay();

    document.getElementById("print").addEventListener("click", () => {
        document.getElementById("print-block").style.display = "none";

        var headstr = "<html><head><title>Booking Details</title></head><body>";
        var footstr = "</body>";
        var newstr = document.getElementById("booking-detail").innerHTML;
        var oldstr = document.body.innerHTML;
        document.body.innerHTML = headstr+newstr+footstr;
        window.print();
        document.body.innerHTML = oldstr;

        document.getElementById("print-block").style.display = "initial";

        return false;

    });
})

const printToDisplay = () => {
    //Modify the URL
    let hotelImageURL = info.hotel.imageURL;

    document.getElementById("hotel-image").setAttribute("src", hotelImageURL)

    document.getElementById("hotel-name").innerText = info.hotel.name;
    document.getElementById("hotel-name-span").innerText = info.hotel.name;
    document.getElementById("hotel-stars").innerHTML = returnStar(info.hotel.stars);
    document.getElementById("hotel-address").innerText = info.hotel.address.replace(/\s\s+/g, ' ').replaceAll(" ,", ",");

    document.querySelector(".check-in-date").innerText = getDatePart(info.date.checkIn, "date")
    document.querySelector(".check-in-month").innerText = getDatePart(info.date.checkIn, "monthYear")
    document.querySelector(".check-in-weekday").innerText = getDatePart(info.date.checkIn, "weekDay")

    document.querySelector(".check-out-date").innerText = getDatePart(info.date.checkOut, "date")
    document.querySelector(".check-out-month").innerText = getDatePart(info.date.checkOut, "monthYear")
    document.querySelector(".check-out-weekday").innerText = getDatePart(info.date.checkOut, "weekDay")

    // document.querySelector(".room-count").innerText = info.numberOfRooms;
    document.querySelector(".night-count").innerText = info.numberOfNights;

    document.getElementById("total-price").innerText = info.buildCostString();

    let roomDetailsHTML = ``;
    info.roomDetails.forEach(detail => {
        roomDetailsHTML += `
            <div class="room-detail d-flex align-items-center justify-content-center">
                <div class="d-flex flex-column align-items-center justify-content-center" style="max-width: 350px;">
                    <img src="${detail.room_image}" alt="" class="img-room-type">
                    <p class="font-weight-normal text-center">${detail.room_name}</p>
                </div>
                <div class="ml-4 mr-4" style="width: fit-content;">
                    <h5 class="font-weight-normal text-center">(${parseFloat(detail.single_cost).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${detail.currency})</h5>
                </div>
                <div class="ml-4 mr-4" style="width: fit-content; margin-top: -7.5px">
                    <h3 class="total-price" style="display: inline;"> x </h3>
                    <h3 class="total-price" style="display: inline;"> ${detail.number_of_room} </h3>
                </div>
            </div>
        `
    })
    document.getElementById("rooms-detail").innerHTML = roomDetailsHTML;
}

const getDisplayDateFormat = (isWeekDay, ISODate) => {
    const newDateObj = new Date(ISODate);
    const toMonth = newDateObj.getMonth() + 1;
    const toYear = newDateObj.getFullYear();
    const toDate = newDateObj.getDate();
    const DOW = newDateObj.getDay()
    const dateTemplate = isWeekDay? `${weekDays[DOW]}, ${toDate} ${months[toMonth - 1]} ${toYear}` : `${toDate} ${months[toMonth - 1]} ${toYear}`;
    return dateTemplate;
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

const returnStar = (star) => {
    let result = "";

    for (let i = 1; i <= Math.floor(star); i++)
        result += `<i class="fa fa-star rating-star" aria-hidden="true"></i>`

    if (star > Math.floor(star))
        result += `<i class="fa fa-star-half-alt rating-star"></i>`

    return result;
}