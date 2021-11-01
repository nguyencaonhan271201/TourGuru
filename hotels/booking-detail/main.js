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

    info = JSON.parse(localStorage.getItem("hotelInfo"));

    printToDisplay();

    document.getElementById("download").addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Aloha")
        document.getElementById("print-block").style.display = "none";
        
        var pdf = new jsPDF('p', 'pt', 'letter');
        pdf.canvas.height = 72 * 11;
        pdf.canvas.width = 72 * 8.5;

        pdf.addHTML(document.getElementById("booking-detail"), function() {
            pdf.save('TourGuru-HotelBooking.pdf');
        });

        document.getElementById("print-block").style.display = "initial";
    });

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
    let hotelImageURL = info.hotelImageURL;
    hotelImageURL = hotelImageURL.substring(0, hotelImageURL.indexOf("_"))
    hotelImageURL += "_w.jpg";

    document.getElementById("hotel-image").setAttribute("src", hotelImageURL)

    document.getElementById("hotel-name").innerText = info.hotelName;
    document.getElementById("hotel-name-span").innerText = info.hotelName;
    document.getElementById("hotel-stars").innerHTML = returnStar(info.stars);
    document.getElementById("hotel-address").innerText = info.address;

    document.querySelector(".check-in-date").innerText = getDatePart(info.checkIn, "date")
    document.querySelector(".check-in-month").innerText = getDatePart(info.checkIn, "monthYear")
    document.querySelector(".check-in-weekday").innerText = getDatePart(info.checkIn, "weekDay")

    document.querySelector(".check-out-date").innerText = getDatePart(info.checkOut, "date")
    document.querySelector(".check-out-month").innerText = getDatePart(info.checkOut, "monthYear")
    document.querySelector(".check-out-weekday").innerText = getDatePart(info.checkOut, "weekDay")

    document.querySelector(".room-count").innerText = info.numberOfRooms;
    document.querySelector(".night-count").innerText = info.numberOfNights;

    document.getElementById("total-price").innerText = info.totalCost;
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