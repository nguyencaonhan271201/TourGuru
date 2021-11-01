let title = "";
let uid;
let fromDate = "";
let toDate = "";
let description = "";
let detailsList = [];
let availableBookings = {
    flights: {},
    hotels: [],
};
let chosenBookings = {
    flights: [],
    hotels: []
};
let currentChoosingBooking = {
    flights: -1,
    hotels: -1
};
let details = [];
let choosingAttraction = {
    id: '',
    name: '',
    image: '',
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

window.addEventListener("DOMContentLoaded", () => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = user.uid;
        } else {
            location.replace("./../../auth/login.php");
            return;
        }
    })

    // Swal.fire({
    //     title: 'Loading...',
    //     html: 'Please wait...',
    //     allowEscapeKey: false,
    //     allowOutsideClick: false,
    //     didOpen: () => {
    //       Swal.showLoading()
    //     }
    // });

    getAvailableBookings();
    reInitializeEventListeners();

    document.getElementById("btn-create").addEventListener("click", () => {
        Swal.fire({
            title: 'Are you sure want to create this plan?',
            text: 'Further modifications are allowed.',
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
                savePlan();
            }
        })
    })
})

const reInitializeEventListeners = () => {
    document.querySelectorAll(".editable-icon").forEach(icon => {
        icon.addEventListener("click", () => {
            let getType = icon.getAttribute("data-type");

            switch (getType) {
                case "title":
                    showTitleSwal();
                    break;
                case "date":
                    showDateSwal();
                    break;
                case "description":
                    showDescriptionSwal();
                    break;
            }
        })
    })

    document.getElementById("add-description").addEventListener("click", () => {
        showDescriptionSwal();
    })

    document.getElementById("add-booking").addEventListener("click", () => {
        showAddBookingSwal();
    })

    document.getElementById("add-detail").addEventListener("click", () => {
        showAddDetailSwal();
    })
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

const showDateSwal = () => {
    Swal.fire({
        title: 'Change plan dates',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showCancelButton: true,
        html:
            `<label for="from" class="mr-2">from:</label><input class="swal2-input" type="date" id="from" value=${fromDate}><br>` +
            `<label for="from" class="mr-2">to: </label><input class="swal2-input" type="date" id="to" value=${toDate}>`,
        preConfirm: () => {
            //Get input
            let from = $('#from').val();
            let to = $('#to').val();
            
            let errorText = "";
            if (from === "")
                errorText += `input of start date is not correct.`
            else if (to === "") {
                if (errorText !== "")
                    errorText += '<br>'   
                errorText += `input of end date is not correct.`
            }
            else {
                let fromDate = new Date($('#from').val());
                let toDate = new Date($('#to').val());
                if (toDate.getTime() < fromDate.getTime()) {
                    if (errorText !== "")
                        errorText += '<br>'   
                    errorText += `start date cannot be after end date`
                }
            }
                
            if (errorText !== "")
                Swal.showValidationMessage(
                    errorText
                )  
            else {
                //Build display string
                let dateString = "";
                
                let from = new Date($('#from').val());
                let to = new Date($('#to').val());

                fromDate = from.toISOString().split('T')[0]
                toDate = to.toISOString().split('T')[0]
                
                if (from.getTime() == to.getTime()) {
                    dateString = getDisplayDateFormat(false, fromDate);
                } else {
                    dateString = `${getDisplayDateFormat(false, fromDate)} - ${getDisplayDateFormat(false, toDate)}`
                }

                document.getElementById("plan-date").innerText = dateString;
            }
        },
        onOpen: function () {
          $('#from').focus()
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const showTitleSwal = () => {
    Swal.fire({
        title: 'Change plan title',
        input: 'text',
        inputValue: title,
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Change',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        preConfirm: (newTitle) => {
            title = newTitle;
            document.getElementById("plan-title").innerText = title;
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const showDescriptionSwal = () => {
    Swal.fire({
        title: 'Edit plan description',
        input: 'textarea',
        inputValue: description,
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Change',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        preConfirm: (newDes) => {
            if (newDes === "") {
                Swal.showValidationMessage(
                    "please input a description"
                ) 
            } else {
                description = newDes;
                document.getElementById("description-div").innerHTML = `
                    <h5 class="editable" id="plan-description">${description}</h5>
                    <p class="editable-icon" data-type="description"><i class="fas fa-edit"></i></p>
                `;
                reInitializeEventListeners();
                document.getElementById("description-div").style.display = "block";
                document.getElementById("add-description").style.display = "none";
            }   
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const showAddBookingSwal = () => {
    Swal.fire({
        title: 'Link an existing booking',
        html: `
        <h3 class="text-pink">flight bookings</h3>
        <div class="input-block input-block-abs">
            <div id="search-flight-booking-result" class="header-search-result">Loading available bookings...</div>
        </div>
        <h3 class="text-pink mt-3">hotel bookings</h3>
        <div class="input-block input-block-abs">
            <div id="search-hotel-booking-result" class="header-search-result">Loading available bookings...</div>
        </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Change',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        didOpen: () => {
            currentChoosingBooking = {
                flights: -1,
                hotels: -1
            };
            
            createContentBookingSwal();
        },
        preConfirm: () => {
            if (currentChoosingBooking.flights != -1) {
                chosenBookings.flights.push(availableBookings.flights[currentChoosingBooking.flights])
            }

            if (currentChoosingBooking.hotels != -1) {
                availableBookings.hotels.forEach(hotel => {
                    if (hotel.id == currentChoosingBooking.hotels) {
                        chosenBookings.hotels.push(hotel);
                    }
                })
            }

            updateBookingLinkedDetail();
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const getAvailableBookings = () => {
    const getAvailableFlightBookings = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            "/api/plans/create.php",
            true
        )
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = () => {
            swal.close();
            if (this.status === 200 && this.readyState === 4) {
               //Nhận thông tin và lưu vào danh mục
               let result = JSON.parse(this.responseText); 
               result.forEach(iteration => {
                    if (!Object.keys(availableBookings.flights).includes(iteration.booking_id)) {
                        availableBookings.flights[iteration.booking_id] = [];
                        availableBookings.flights[iteration.booking_id].push(iteration);
                    } else {
                        availableBookings.flights[iteration.booking_id].push(iteration);
                    }
               })
               getAvailableHotelBookings();
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Error occured."
                });
                location.replace("./../../");
            }
        }
        xhr.send(`getFlightBookings&id=${uid}&csrf=${csrf}`);
    }

    const getAvailableHotelBookings = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            "/api/plans/create.php",
            true
        )
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = () => {
            swal.close();
            if (this.status === 200 && this.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(this.responseText); 
                availableBookings.hotels = result;
                Swal.close();
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Error occured."
                });
                location.replace("./../../");
            }
        }
        xhr.send(`getHotelBookings&id=${uid}&csrf=${csrf}`);
    }
    
    //getAvailableFlightBookings();

    availableBookings = {
        hotels: [
            {
                'id': 1,
                'user_id': 1,
                'date_start': '2021-11-18',
                'date_end': '2021-11-20',
                'number_of_nights': 2,
                'hotel_id': 12345,
                'hotel_name': 'Bulgari Hotel London',
                'hotel_image_url': 'https://pix10.agoda.net/hotelImages/4880829/228078015/97f70b1331c0e8d7ba87e1b478c8a6ff.jpg?s=1024x768',
                'status': 1,
                'number_of_beds': 1,
                'date_booked': '',
                'total_cost': '2646.12 EUR',
            }
        ],
        flights: {
            1: [
                {
                    'id': 1,
                    'booking_id': 1,
                    'origin_code': 'FCO',
                    'dest_code': 'LHR',
                    'origin': 'Leonardo Da Vinci - Fiumicino Airport',
                    'destination': 'Heathrow Airport',
                    'departure': '07:30',
                    'arrival': '09:30',
                    'date': '2021-11-18',
                    'class': 'BUSINESS',
                    'aircraft': 'Airbus A321neo',
                    'airline': 'British Airways',
                    'flight_number': 'BA551'
                }, {
                    'id': 2,
                    'booking_id': 1,
                    'origin_code': 'LHR',
                    'dest_code': 'FCO',
                    'origin': 'Heathrow Airport',
                    'destination': 'Leonardo Da Vinci - Fiumicino Airport',
                    'departure': '07:25',
                    'arrival': '10:55',
                    'date': '2021-11-20',
                    'class': 'BUSINESS',
                    'aircraft': 'Airbus A321',
                    'airline': 'ITA Italia Trasporto Aereo (Alitalia)',
                    'flight_number': 'AZ201'
                }
            ],
            2: [
                {
                    'id': 1,
                    'booking_id': 2,
                    'origin_code': 'FCO',
                    'dest_code': 'LHR',
                    'origin': 'Leonardo Da Vinci - Fiumicino Airport',
                    'destination': 'Heathrow Airport',
                    'departure': '07:30',
                    'arrival': '09:30',
                    'date': '2021-11-18',
                    'class': 'BUSINESS',
                    'aircraft': 'Airbus A321neo',
                    'airline': 'British Airways',
                    'flight_number': 'BA551'
                }, {
                    'id': 2,
                    'booking_id': 2,
                    'origin_code': 'LHR',
                    'dest_code': 'FCO',
                    'origin': 'Heathrow Airport',
                    'destination': 'Leonardo Da Vinci - Fiumicino Airport',
                    'departure': '07:25',
                    'arrival': '10:55',
                    'date': '2021-11-20',
                    'class': 'BUSINESS',
                    'aircraft': 'Airbus A321',
                    'airline': 'ITA Italia Trasporto Aereo (Alitalia)',
                    'flight_number': 'AZ201'
                }
            ]
        }
    }
}

const checkSelectedFlightBookings = (id) => {
    let isReturned = false;
    chosenBookings["flights"].forEach(booking => {
        if (booking[0].booking_id == id) {
            isReturned = true;
        }
    })
    return isReturned;
}

const checkSelectedHotelBookings = (id) => {
    let isReturned = false;
    chosenBookings["hotels"].forEach(booking => {
        if (booking.id == id)
            isReturned = true;
    })
    return isReturned;
}

const createContentBookingSwal = () => {
    //Load from array and show to list
    let html = '';
    Object.keys(availableBookings.flights).forEach(booking => {
        if (!checkSelectedFlightBookings(booking)) {
            let classBooking = currentChoosingBooking["flights"] == booking? "flight-booking-disabled" : "flight-booking-enabled";
            let flightDetailHTML = '';
            availableBookings["flights"][booking].forEach(flight => {
                flightDetailHTML += `
                    <div>
                        <img src="http://pics.avs.io/80/40/${flight.flight_number.substring(0, 2)}.png">
                        ${flight.flight_number}: ${flight.origin_code} - ${flight.dest_code} (${getDisplayDateFormat(false, flight.date)})
                        <br>
                        ${flight.departure} - ${flight.arrival}
                    </div>
                `
            })
            html += `
                <div class="${classBooking}" data-id=${booking}>
                    ${flightDetailHTML}
                </div>   
            `
        }
    })
    document.getElementById("search-flight-booking-result").innerHTML = html;

    html = '';
    availableBookings.hotels.forEach(booking => {
        if (!checkSelectedHotelBookings(booking.id)) {
            let classBooking = currentChoosingBooking["hotels"] == booking.id? "hotel-booking-disabled" : "hotel-booking-enabled";
            html += `
                <div class="${classBooking}" data-id=${booking.id}>
                    <div>
                        <b>${booking.hotel_name}</b> <br>
                        ${getDisplayDateFormat(false, booking.date_start)} - ${getDisplayDateFormat(false, booking.date_end)} <br>
                        ${booking.number_of_beds} rooms
                    </div>
                </div>   
            `
        }
    })
    document.getElementById("search-hotel-booking-result").innerHTML = html;

    bookingSwalEventListeners();
}

const bookingSwalEventListeners = () => {
    document.querySelectorAll('.flight-booking-enabled').forEach(item => {
        item.addEventListener("click", () => {
            let id = item.getAttribute("data-id");
            currentChoosingBooking.flights = id;

            createContentBookingSwal();
        })
    })

    document.querySelectorAll('.flight-booking-disabled').forEach(item => {
        item.addEventListener("click", () => {
            currentChoosingBooking.flights = -1;

            createContentBookingSwal();
        })
    })

    document.querySelectorAll('.hotel-booking-disabled').forEach(item => {
        item.addEventListener("click", () => {
            currentChoosingBooking.hotels = -1;

            createContentBookingSwal();
        })
    })

    document.querySelectorAll('.hotel-booking-enabled').forEach(item => {
        item.addEventListener("click", () => {
            let id = item.getAttribute("data-id");
            currentChoosingBooking.hotels = id;

            createContentBookingSwal();
        })
    })
}

const updateBookingLinkedDetail = () => {
    let html = ``;
    
    chosenBookings.flights.forEach(booking => {
        let subHTMLContent = ``;
        booking.forEach(iteration => {
            subHTMLContent += `
                <div>
                    <img src="http://pics.avs.io/80/40/${iteration.flight_number.substring(0, 2)}.png">
                    ${iteration.flight_number}: ${iteration.origin_code} - ${iteration.dest_code} (${iteration.departure} - ${iteration.arrival}) 
                    - ${getDisplayDateFormat(false, iteration.date)}
                </div>
            `
        })

        html += `
            <div class="flight-booking text-center mt-1 mb-1 editable-container" data-booking-id=${booking[0].booking_id}>
                ${subHTMLContent}
                <p class="editable-icon remove-icon" data-type="flight-booking-remove" data-id=${booking[0].booking_id}>
                <i class="fa fa-trash" aria-hidden="true"></i></p>
            </div>
        `
    })

    chosenBookings.hotels.forEach(hotel => {
        html += `
            <div class="hotel-booking text-center mt-2 mb-2 editable-container" data-booking-id=${hotel.id}>
                <i class="fa fa-hotel" aria-hidden="true"></i>
                ${hotel.hotel_name} - ${hotel.number_of_beds} rooms (${getDisplayDateFormat(false, hotel.date_start)} - ${getDisplayDateFormat(false, hotel.date_end)})
                <p class="editable-icon remove-icon" data-type="hotel-booking-remove" data-id=${hotel.id}>
                <i class="fa fa-trash" aria-hidden="true"></i></p>
            </div>
        `
    })

    document.querySelector(".bookings").innerHTML = html;

    document.querySelectorAll(".remove-icon").forEach(icon => {
        icon.addEventListener("click", () => {
            Swal.fire({
                title: 'Do you want to unlink this booking?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                confirmButtonColor: 'green',
                cancelButtonColor: 'red'
            }).then((result) => {
                if (result.isConfirmed) {
                    var new_element = icon.cloneNode(true);
                    icon.parentNode.replaceChild(new_element, icon);
                    new_element.addEventListener("click", () => {
                        //Remove
                        let type = new_element.getAttribute("data-type");
                        let id = new_element.getAttribute("data-id");
    
                        switch (type) {
                            case "flight-booking-remove":
                                chosenBookings["flights"].forEach((booking, index) => {
                                    if (booking[0].booking_id == id) {
                                        chosenBookings["flights"].splice(index, 1);
                                    }
                                })
                                break;
                            case "hotel-booking-remove":
                                chosenBookings["hotels"].forEach((booking, index) => {
                                    if (booking.id == id)
                                        chosenBookings["hotels"].splice(index, 1)
                                })
                                break;
                        }
    
                        updateBookingLinkedDetail();
                    })
                }
            })
        })
    })
}

function recreateNode(el, withChildren) {
    if (withChildren) {
      el.parentNode.replaceChild(el.cloneNode(true), el);
    }
    else {
      var newEl = el.cloneNode(false);
      while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
      el.parentNode.replaceChild(newEl, el);
    }
}

const showAddDetailSwal = () => {
    Swal.fire({
        title: 'Add a detail',
        html: `
            <div class="text-left">
                <label for="date" class="mr-2">date:</label><input class="swal2-input" type="date" id="date" required><br>
                <label for="time" class="mr-2">time:</label><input class="swal2-input" type="time" id="time" required><br>
                <label for="content" class="mr-2">detail:</label><textarea class="swal2-input" type="text" id="content" style="height: auto;" rows="3"></textarea><br>
                <label for="remind" class="mr-2">remind?</label><input type="checkbox" id="remind">
                <div id="chosen-attraction" class="text-center mt-2 mb-2"></div>
                <div class="text-center">
                    <label for="destination" class="mr-2">search for a destination:</label><input class="swal2-input mt-1" type="text" id="destination"></input><br>
                    <div class="input-block input-block-abs mt-2">
                        <div id="search-destination-result" class="header-search-result"></div>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        didOpen: () => {
            let destinationSearch = document.getElementById("destination")
            destinationSearch.addEventListener("keyup", (e) => {
                if (e.target.value !== "") {
                    document.getElementById("search-destination-result").innerHTML = "Searching...";
                    checkSearchCondition(e.target, true);   
                } else {
                    document.getElementById("search-destination-result").innerHTML = "";
                }
            })
        },
        preConfirm: () => {
            let date = $('#date').val();
            let time = $('#time').val();
            let detail = $('#content').val();
            let errorText = "";

            if (date === "")
                errorText += `input of date is not correct.`

            if (time === "") {
                if (errorText !== "")
                    errorText += '<br>'   
                errorText += `input of time is not correct.`
            }

            if (choosingAttraction.id === '' && detail === "") {
                if (errorText !== "")
                    errorText += '<br>'   
                errorText += `please input at least a detail or a destination to visit.`
            }

            if (errorText === "") {
                let detailToAdd = {
                    date: date,
                    time: time,
                    detail: detail,
                    attraction: choosingAttraction,
                    isRemind: $('#remind').is(':checked'),
                    rawID: details.length > 0? details[details.length - 1].rawID + 1 : 0
                }
                details.push(detailToAdd);
                choosingAttraction = {
                    id: '',
                    name: '',
                    image: '',
                }
                printDetails();
            } else {
                Swal.showValidationMessage(
                    errorText
                ) 
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const checkSearchCondition = (box, isFrom) => {
    let tmpStoringResult = box.value;
    setTimeout(() => {
        if (box.value == tmpStoringResult) {
            searchDestination(box.value);
        }
    }, 300)
}

const searchDestination = (searchQuery) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
            printDestinationSearchResults(results);
        } else {
            
        }
    }

    xhr.open("GET", `https://travel-advisor.p.rapidapi.com/locations/search?query=${searchQuery}&limit=30&offset=0`);
    xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "6015fab332mshe435514eb925d97p10417ejsn0296e3e75ef9");

    xhr.send();
}

const printDestinationSearchResults = (results) => {
    let resultBox = document.getElementById("search-destination-result");
    let html = ``
    results.data.forEach(result => {
        if (result.result_type === "things_to_do")
        {
            html += `
                <div class="destination-result" data-id="${result.result_object.location_id}" data-location="${result.result_object.name}"
                    data-image="${result.result_object.photo.images.original.url}">
                    <div class="row">
                        <div class="col-md-4 col-sm-6 offset-md-0 offset-sm-3">
                            <img src="${result.result_object.photo.images.original.url}" alt="" class="des-result-img">
                        </div>
                        <div class="col-md-8 col-sm-12 d-flex align-items-center">
                            <div class="text-md-left text-center">
                                <h5 class="text-pink">${result.result_object.name}</h5>
                                <p class="text-gray">${result.result_object.location_string}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    })
    resultBox.innerHTML = html;

    document.querySelectorAll(".destination-result").forEach(result => {
        result.addEventListener("click", () => {
            let id = result.getAttribute("data-id");
            let name = result.getAttribute("data-location");
            let image = result.getAttribute("data-image");
            choosingAttraction = {
                id: id,
                name: name,
                image: image,
            }
            document.getElementById("chosen-attraction").innerHTML = `
                <div class="mdc-chip" role="row" data-id = ${id}>
                    <div class="mdc-chip__ripple"></div>
                    <img class="mdc-chip__icon mdc-chip__icon--leading" src="${image}"></img>
                    <span role="gridcell">
                        <span role="button" tabindex="0" class="mdc-chip__primary-action">
                            <span class="mdc-chip__text">${name}</span>
                        </span>
                    </span>
                    <span role="gridcell">
                        <i class="chip-delete material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button"
                        onclick = "deleteSelectedDestination(event)">cancel</i>
                    </span>
                </div>
            `
            resultBox.innerHTML = "";
            document.getElementById("destination").value = "";
        })
    })
}

const deleteSelectedDestination = (e) => {
    let getParent = e.target.closest(".mdc-chip");
    let getID = getParent.getAttribute("data-id");
    choosingAttraction = {
        id: '',
        name: '',
        image: '',
    }
    document.getElementById("chosen-attraction").innerHTML = "";
}

const printDetails = () => {
    let detailsBox = document.getElementById("details");
    detailsBox.innerHTML = "";
    let html = "";

    const detailsByDay = {};
    details.forEach(detail => {
        let date = detail.date;
        if (Object.keys(detailsByDay).includes(date)) {
            detailsByDay[date].push(detail);
        } else {
            detailsByDay[date] = [];
            detailsByDay[date].push(detail);
        }
    }) 

    Object.keys(detailsByDay).forEach(key => {
        detailsByDay[key] = detailsByDay[key].sort(function(a, b) {
            return Date.parse('1970/01/01 ' + a.time.slice(0, -2) + ' ' + a.time.slice(-2)) - Date.parse('1970/01/01 ' + b.time.slice(0, -2) + ' ' + b.time.slice(-2))
        })
    })

    let listOfDays = Object.keys(detailsByDay).sort(
        function (a, b) {
            return Date.parse(a) - Date.parse(b)
        }
    )

    listOfDays.forEach(day => {
        html += `
            <h3 class="mt-2 text-purple">${getDisplayDateFormat(true, day)}</h3>
        `
        detailsByDay[day].forEach(detail => {
            let alarmClass = "";
            let attractionClass = "";
            if (detail.isRemind)
                alarmClass = '<span class="mr-1"><i class="fas fa-clock"></i></span>'
            if (detail.attraction.id != '')
                attractionClass = `
                    <p class="ml-2 mb-0">
                        <img style="width: 60px; height: 60px;" alt="" src="${detail.attraction.image}">
                        <span class="d-flex align-items-center" style="display: inline-flex !important">
                            <a href="#" class="destination">${detail.attraction.name}</a>
                        </span>
                    </p>
                `

            html += `
                <div class="editable-container left-container">
                    <p class="ml-2 mb-0 mt-1 text-gray">
                        <span class="text-pink time font-weight-bold" style="display: inline;">${detail.time}: </span>
                        <span>${detail.detail}</span>
                        ${alarmClass}
                    </p>
                    ${attractionClass}
                    <p class="editable-icon" data-type="detail" data-id=${detail.rawID}><i class="fas fa-edit"></i></p>
                    <p class="editable-icon remove-icon editable-detail-remove" data-type="flight-booking-remove" data-id=${detail.rawID}>
                    <i class="fa fa-trash" aria-hidden="true"></i></p>
                </div>
            `   
        }) 
    })

    detailsBox.innerHTML = html;

    detailsBox.querySelectorAll(".editable-icon").forEach(icon => {
        icon.addEventListener("click", () => {
            let id = icon.getAttribute("data-id");
            
            if (icon.classList.contains("remove-icon")) {
                showDeleteDetailConfirmation(id);
            } else {
                showEditDetail(id);
            }
        })
    })
}

const showEditDetail = (detailID) => {
    let choosingDetail;
    for (let i = 0; i < details.length; i++) {
        if (details[i].rawID == detailID) {
            choosingDetail = details[i];
            break;
        }
    }
    Swal.fire({
        title: 'Edit a detail',
        html: `
            <div class="text-left">
                <label for="date" class="mr-2">date:</label><input class="swal2-input" type="date" id="date" required><br>
                <label for="time" class="mr-2">time:</label><input class="swal2-input" type="time" id="time" required><br>
                <label for="content" class="mr-2">detail:</label><textarea class="swal2-input" type="text" id="content" style="height: auto;" rows="3"></textarea><br>
                <label for="remind" class="mr-2">remind?</label><input type="checkbox" id="remind">
                <div id="chosen-attraction" class="text-center mt-2 mb-2"></div>
                <div class="text-center">
                    <label for="destination" class="mr-2">search for a destination:</label><input class="swal2-input mt-1" type="text" id="destination"></input><br>
                    <div class="input-block input-block-abs mt-2">
                        <div id="search-destination-result" class="header-search-result"></div>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        didOpen: () => {
            let destinationSearch = document.getElementById("destination")
            destinationSearch.addEventListener("keyup", (e) => {
                if (e.target.value !== "") {
                    document.getElementById("search-destination-result").innerHTML = "Searching...";
                    checkSearchCondition(e.target, true);   
                } else {
                    document.getElementById("search-destination-result").innerHTML = "";
                }
            })

            $('#date').val(choosingDetail.date);
            $('#time').val(choosingDetail.time);
            $('#content').val(choosingDetail.detail);
            $('#remind').prop('checked', choosingDetail.isRemind);

            if (choosingDetail.attraction.id != '') {
                choosingAttraction = choosingDetail.attraction;
                document.getElementById("chosen-attraction").innerHTML = `
                    <div class="mdc-chip" role="row" data-id = ${choosingAttraction.id}>
                        <div class="mdc-chip__ripple"></div>
                        <img class="mdc-chip__icon mdc-chip__icon--leading" src="${choosingAttraction.image}"></img>
                        <span role="gridcell">
                            <span role="button" tabindex="0" class="mdc-chip__primary-action">
                                <span class="mdc-chip__text">${choosingAttraction.name}</span>
                            </span>
                        </span>
                        <span role="gridcell">
                            <i class="chip-delete material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button"
                            onclick = "deleteSelectedDestination(event)">cancel</i>
                        </span>
                    </div>
                `
            }

        },
        preConfirm: () => {
            let date = $('#date').val();
            let time = $('#time').val();
            let detail = $('#content').val();
            let errorText = "";

            if (date === "")
                errorText += `input of date is not correct.`

            if (time === "") {
                if (errorText !== "")
                    errorText += '<br>'   
                errorText += `input of time is not correct.`
            }

            if (choosingAttraction.id === '' && detail === "") {
                if (errorText !== "")
                    errorText += '<br>'   
                errorText += `please input at least a detail or a destination to visit.`
            }

            if (errorText === "") {
                let detailToAdd = {
                    date: date,
                    time: time,
                    detail: detail,
                    attraction: choosingAttraction,
                    isRemind: $('#remind').is(':checked'),
                    rawID: detailID
                }

                for (let i = 0; i < details.length; i++) {
                    if (details[i].rawID == detailID) {
                        details[i] = detailToAdd;
                        break;
                    }
                }

                choosingAttraction = {
                    id: '',
                    name: '',
                    image: '',
                }
                printDetails();
            } else {
                Swal.showValidationMessage(
                    errorText
                ) 
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const showDeleteDetailConfirmation = (detailID) => {
    Swal.fire({
        title: 'Do you want to delete this detail?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red'
    }).then((result) => {
        if (result.isConfirmed) {
            for (let i = 0; i < details.length; i++) {
                if (details[i].rawID == detailID) {
                    details.splice(i, 1);
                    break;
                }
            }
            printDetails();
        }
    })
}

const savePlan = () => {
    if (title == "" || fromDate == "" || toDate == "") {
        swal.close();
        Swal.fire({
            icon: "error",
            text: "Please fill in at least title and the dates of the plan."
        });
        return;
    }

    //Add booking info to table
    //Get csrf
    let csrf = "";
    csrf = document.getElementById("csrf").innerText;

    let data = {
        "user_id": uid,
        "plan_title": `${title}`,
        "description": `${description}`,
        "flight_id": `${chosenBookings.flights.toString}`,
        "hotel_id": `${chosenBookings.hotels.toString}`,
        "from_date": `${fromDate}`,
        "to_date": `${toDate}`
    }

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "/api/plans/create.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
        if (this.status === 200 && this.readyState === 4) {
            let planID = int.Parse(this.responseText);
            sendDetails(planID);
        } else {
            swal.close();
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again later."
            });
        }
    }
    xhr.send(`planInfo&data=${JSON.stringify(data)}&csrf=${csrf}`);
}

const sendDetails = (planID) => {
    //Add booking info to table
    //Get csrf
    let csrf = "";
    csrf = document.getElementById("csrf").innerText;

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "/api/plans/create.php",
        true
    )

    let sendData = [];
    details.forEach(detail => {
        let detailStorage = {
            "plan_id": planID,
            "destination_id": detail.attraction.id,
            "destination_name": detail.attraction.name,
            "destination_image": detail.attraction.image,
            "detail": detail.detail,
            "date": detail.date,
            "start": detail.time,
            "set_alarmed": detail.isRemind
        }

        sendData.push(detailStorage)
    })

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
        swal.close();
        if (this.status === 200 && this.readyState === 4) {
            //Booking complete
            Swal.fire({
                title: 'Plan has been saved successfully.',
                text: 'You can edit details of your plan in your profile section.',
                icon: 'success'
            })
            location.replace("./../")
        } else {
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again later."
            });
        }
    }
    xhr.send(`planDetails&data=${JSON.stringify(sendData)}&csrf=${csrf}`);
}