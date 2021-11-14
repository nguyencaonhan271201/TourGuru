let hotelInfo;
let bookingInfo;
let planID;
let hotelID;
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

window.addEventListener("DOMContentLoaded", () => {
    Swal.fire({
        title: 'Loading...',
        html: 'Please wait...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
        Swal.showLoading()
        }
    });
    
    //Check if signed in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = user.uid;
            user_email = user.email;

            let urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has("id")) {
                planID = urlParams.get("id");
            } else {
                location.replace("./../");
            }

            getHotelBookingInfo();
        } else {
            location.replace("./../../auth");
            return;
        }
    })

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

    document.getElementById("delete").addEventListener("click", () => {
        Swal.fire({
            title: 'Are you sure want to delete this booking?',
            text: 'You cannot restore the booking after deletion. Refund will be made by the hotel.',
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
                deleteBooking();
            }
        })
    });
})

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

const getHotelInfo = () => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            try {
                let results = JSON.parse(xhr.responseText);
                hotelInfo = results.data.body;
                printToDisplay();
            }
            catch (e) {
                Swal.fire({
                    icon: "error",
                    text: "Error occured."
                }).then(() => {
                    location.replace("./../");
                })
                
                return;
            }
        }
    }

    xhr.open("GET", `https://hotels4.p.rapidapi.com/properties/get-details?id=${hotelID}`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const getHotelBookingInfo = () => {
    const getBookingInfo = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/bookings/info.php?getHotelsInfo&booking_id=${planID}&user_id=${uid}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText); 
                bookingInfo = result;
                //console.log(result);
                hotelID = bookingInfo.hotel_id;
                getHotelInfo();
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Error occured."
                }).then(() => {
                    location.replace("./../");
                })
            }
        }
        xhr.send();
    }
    getBookingInfo();

    //dummyData();
}

const printToDisplay = () => {
    let hotelImageURL = bookingInfo.hotel_image_url;

    document.getElementById("hotel-image").setAttribute("src", hotelImageURL)

    document.getElementById("hotel-name").innerText = bookingInfo.hotel_name;
    document.getElementById("hotel-name-span").innerText = bookingInfo.hotel_name;
    document.getElementById("hotel-stars").innerHTML = returnStar(hotelInfo.propertyDescription.starRating);
    document.getElementById("hotel-address").innerText = hotelInfo.propertyDescription 
    && hotelInfo.propertyDescription.address? hotelInfo.propertyDescription.address.fullAddress : "";

    document.querySelector(".check-in-date").innerText = getDatePart(bookingInfo.date_start, "date")
    document.querySelector(".check-in-month").innerText = getDatePart(bookingInfo.date_start, "monthYear")
    document.querySelector(".check-in-weekday").innerText = getDatePart(bookingInfo.date_start, "weekDay")

    document.querySelector(".check-out-date").innerText = getDatePart(bookingInfo.date_end, "date")
    document.querySelector(".check-out-month").innerText = getDatePart(bookingInfo.date_end, "monthYear")
    document.querySelector(".check-out-weekday").innerText = getDatePart(bookingInfo.date_end, "weekDay")

    document.querySelector(".room-count").innerText = bookingInfo.number_of_beds;
    document.querySelector(".night-count").innerText = bookingInfo.number_of_nights;

    document.getElementById("total-price").innerText = bookingInfo.total_cost;

    swal.close();
}

const deleteBooking = () => {
    let csrf = "";
    csrf = document.getElementById("csrf").innerText;

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "../../api/bookings/info.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
            Swal.fire({
                title: 'Your booking has been deleted successfully.',
                icon: 'success'
            }).then(() => {
                location.replace("./../");
            })
        } else {
            swal.close();
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again later."
            });
        }
    }
    xhr.send(`deleteHotelBooking&booking_id=${planID}&user_id=${uid}&csrf=${csrf}`);
}

//For testing only
const dummyData = () => {
    bookingInfo = {
        'id': 1,
        'user_id': 1,
        'date_start': '2021-11-18',
        'date_end': '2021-11-20',
        'number_of_nights': 2,
        'hotel_id': "402984",
        'hotel_name': 'Bulgari Hotel London',
        'hotel_image_url': 'https://exp.cdn-hotels.com/hotels/5000000/4930000/4922200/4922121/9fb42f73_w.jpg',
        'status': 1,
        'number_of_beds': 1,
        'date_booked': '22:12 - 03/11/2021',
        'total_cost': '2646.12 EUR',
    };
    hotelID = bookingInfo.hotel_id;
    getHotelInfo();
}