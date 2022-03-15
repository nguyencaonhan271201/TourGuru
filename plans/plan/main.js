let title = "";
let uid;
let planID;
let created;
let fromDate = "";
let toDate = "";
let description = "";
let availableBookings = {
    flights: {},
    hotels: [],
};
let chosenBookings = {
    flights: [],
    hotels: []
};
let chosenBookingIndex = {
    flights: [],
    hotels: []
}
let details = [];
let planMode = 0;

let colabs = [];
let wrapperLocations = [];

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let isViewer = false;

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

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            uid = user.uid;

            let urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has("id")) {
                planID = urlParams.get("id");
            } else {
                location.replace("./../");
            }

            gatherInformation();
        } else {
            location.replace("./../../auth/login.php");
            return;
        }
    })

    document.getElementById("btn-print").addEventListener("click", () => {
        performPrint();
        return false;
    });

    document.getElementById("btn-edit").addEventListener("click", (e) => {
        e.preventDefault();
        location.replace(`./../edit?id=${planID}`)
    });
})

const performPrint = () => {
    document.querySelector(".btn-block").style.display = "none";
    document.querySelector(".agency-detail").style.display = "flex";

    setTimeout(() => {
        window.onload = () => {

        };
        window.print();

        document.querySelector(".btn-block").style.display = "block";
        document.querySelector(".agency-detail").style.display = "none";
    }, 300);
}

const gatherInformation = () => {
    const checkViewMode = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/plans/plans.php?checkPlanViewPermission&user_id=${uid}&plan_id=${planID}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
                isViewer = JSON.parse(xhr.responseText) !== 1;
                if (isViewer) {
                    document.getElementById("btn-edit").style.display = "none";
                } else {
                    document.getElementById("btn-edit").style.display = "initial";
                }
                gatherGeneralInfo();
            } else {
                Swal.fire({
                    icon: "error",
                    text: "You do not have permission to access this plan."
                }).then(() => {
                    location.replace("./../");
                })

            }
        }
        xhr.send();
    }

    const gatherGeneralInfo = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/plans/plans.php?getPlanGeneral&user_id=${uid}&plan_id=${planID}&is_viewer=${isViewer ? 1 : 0}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText);
                title = result.plan_title;
                description = result.description;
                fromDate = result.from_date;
                toDate = result.to_date;
                created = result.date_created;
                chosenBookingIndex.flights = result.flight_id.split(',');
                chosenBookingIndex.hotels = result.hotel_id.split(',');
                chosenBookingIndex.flights = chosenBookingIndex.flights.map(flight => parseInt(flight));
                chosenBookingIndex.hotels = chosenBookingIndex.hotels.map(hotel => parseInt(hotel));
                planMode = result.mode;
                gatherColabs();
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

    const gatherColabs = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/plans/plans.php?getPlanColabs&user_id=${uid}&plan_id=${planID}&is_viewer=${isViewer ? 1 : 0}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText);
                colabs = result;
                printColabs();
                gatherLocations();
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

    const gatherLocations = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/plans/plans.php?getPlanLocations&user_id=${uid}&plan_id=${planID}&is_viewer=${isViewer ? 1 : 0}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText);
                wrapperLocations = result;
                printWrapperLocations();
                getAvailableFlightBookings();
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

    const getAvailableFlightBookings = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/plans/create.php?getFlightBookings&id=${uid}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText);
                result.forEach(iteration => {
                    if (!Object.keys(availableBookings.flights).includes(iteration.booking_id.toString())) {
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
                }).then(() => {
                    location.replace("./../../");
                })
            }
        }
        xhr.send();
    }

    const getAvailableHotelBookings = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/plans/create.php?getHotelBookings&id=${uid}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText);
                availableBookings.hotels = result;
                gatherPlanDetails();
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Error occured."
                }).then(() => {
                    location.replace("./../../");
                })
            }
        }
        xhr.send();
    }

    const gatherPlanDetails = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/plans/plans.php?getPlanDetails&plan_id=${planID}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText);
                result.forEach(result => {
                    let date_order = result.date_order;
                    if (details.length <= date_order) {
                        details.push([]);
                    }
                    let detailToAdd = {
                        time: result.start,
                        detail: result.detail,
                        attraction: {
                            id: result.destination_id,
                            name: result.destination_name,
                            image: result.destination_image,
                        },
                        isRemind: result.set_alarmed,
                        rawID: result.time_order
                    }
                    details[date_order].push(detailToAdd);
                })
                //Load everything completed
                printToDisplay();
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

    checkViewMode();

    //dummyData();
}

const printToDisplay = () => {
    Swal.close();

    chosenBookingIndex.flights.forEach(index => {
        chosenBookings.flights.push(availableBookings.flights[index])
    });

    chosenBookingIndex.hotels.forEach(index => {
        availableBookings.hotels.forEach(hotelBooking => {
            if (hotelBooking.id == index) {
                chosenBookings.hotels.push(hotelBooking);
            }
        })
    });

    document.getElementById("plan-title").innerText = title;
    let dateString = "";
    /*
    if (fromDate == toDate) {
        dateString = getDisplayDateFormat(false, fromDate);
    } else {
        dateString = `${getDisplayDateFormat(false, fromDate)} - ${getDisplayDateFormat(false, toDate)}`
    }
    document.getElementById("plan-date").innerText = dateString;
    */
    let modeHTML = planMode === 0 ? `<i class="fas fa-lock"></i>` : `<i class="fas fa-globe-asia"></i>`;
    document.getElementById("plan-mode").innerHTML = modeHTML;

    if (planMode === 0 || isViewer) {
        document.getElementById("btn-share").style.display = "none";
    } else {
        document.getElementById("btn-share").addEventListener("click", () => {
            Swal.fire({
                title: 'Are you sure want to share this plan to Tour Guru blog?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                confirmButtonColor: 'green',
                cancelButtonColor: 'red'
              }).then((result) => {
                if (result.isConfirmed) {
                    location.replace(`./../../blog/create?plan=${planID}`)
                  }
              })
        })
    }

    if (description == "") {
        document.getElementById("description-div").style.display = "none";
    } else {
        document.getElementById("plan-description").innerText = description;
        document.getElementById("description-div").style.display = "block";
    }

    document.getElementById("plan-created").innerText = `updated: ${getDisplayDateFormatAdd7Hours(created)}`;

    updateBookingLinkedDetail();

    printDetails();
}

const printColabs = () => {
    let colabList = document.getElementById("colabs-display");
    let listHTML = ``;

    /*
        <div class="mdc-chip" role="row" data-id = ${colab.user_id}>
            <div class="mdc-chip__ripple"></div>
            <img class="mdc-chip__icon mdc-chip__icon--leading" src="${colab.image}"></img>
            <span role="gridcell">
                <span role="button" tabindex="0" class="mdc-chip__primary-action">
                    <span class="mdc-chip__text">${colab.display_name || colab.mail}</span>
                </span>
            </span>
        </div>
    */

    colabs.forEach((colab, index) => {
        listHTML += `<img 
            src=${colab.image}
            alt=""
            style="z-index: ${colabs.length + 1 - index}"></img>`
    })

    colabList.innerHTML = listHTML;
}

const printWrapperLocations = () => {
    if (wrapperLocations.length === 0) {
        document.getElementById("wrapper-location-div").style.setProperty("display", "none", "important");
    } else {
        document.getElementById("wrapper-location-div").style.setProperty("display", "block", "important");
        let wrapperLocationsList = document.getElementById("wrapper-locations-display");
        let listHTML = ``;
        wrapperLocations.forEach(location => {
            listHTML += `<div class="mdc-chip" role="row" data-id = ${location.location_id}>
                <div class="mdc-chip__ripple"></div>
                <img class="mdc-chip__icon mdc-chip__icon--leading" src="${location.location_image}"></img>
                <span role="gridcell">
                    <span role="button" tabindex="0" class="mdc-chip__primary-action">
                        <span class="mdc-chip__text">${location.location_name}</span>
                    </span>
                </span>
            </div>`
        })
        wrapperLocationsList.innerHTML = listHTML;
    }

}


const getDisplayDateFormatAdd7Hours = (ISODate) => {
    function addHoursToDate(date, hours) {
        return new Date(new Date(date).setHours(date.getHours() + hours));
    }

    let newDateObj = new Date(ISODate);
    newDateObj = addHoursToDate(newDateObj, 7);
    const toMonth = newDateObj.getMonth() + 1;
    const toYear = newDateObj.getFullYear();
    const toDate = newDateObj.getDate();
    const DOW = newDateObj.getDay()
    const dateTemplate = `${toDate} ${months[toMonth - 1]} ${toYear}`;
    return dateTemplate;
}

const updateBookingLinkedDetail = () => {
    let html = ``;
    let subHTMLContent = ``;

    chosenBookings.flights.forEach(booking => {
        if (booking) {
            booking.forEach(iteration => {
                subHTMLContent += `
                    <div class="flight-booking-detail col-xl-4 col-sm-6 col-12 mb-1">
                        <div class="flight-booking-detail-container d-flex flex-row">
                            <div class="d-flex flex-column align-items-center justify-content-center mr-1">
                                <div class="text-center">
                                    <img alt="" src="./../../shared/assets/images/plane.png"
                                        style="width: 30px;"
                                    >
                                    <div style="font-family: 'header'; color: #CCC6C6">
                                    ${iteration.origin_code.toLowerCase()}›${iteration.dest_code.toLowerCase()}</div>
                                </div>
                                <img src="http://pics.avs.io/80/40/${iteration.flight_number.substring(0, 2)}.png">
                            </div>
                            <div class="d-flex flex-column align-items-start justify-content-center ml-1">
                                <h5 class="text-purple" style="font-family: 'header'">${iteration.flight_number}</h5>
                                <h5 class="text-purple" style="font-family: 'header'">${getDisplayDateFormat(false, iteration.date)}</h5>
                                <h5 class="text-purple" style="font-family: 'header'">${iteration.departure} - ${iteration.arrival}</h5>
                            </div>
                        </div>
                    </div>
                `
            })
        }
    })

    document.querySelector(".flight-bookings").innerHTML = subHTMLContent;

    subHTMLContent = ``;

    chosenBookings.hotels.forEach(hotel => {
        let hotelLocation = ``;
        let splits = hotel.hotel_address.split(', ');
        hotelLocation = splits[splits.length - 1].toLowerCase();

        let dateString = "";
        let startDate = hotel.date_start.substring(5);
        splits = startDate.split('-');
        startDate = `${splits[1]}/${splits[0]}`
        dateString += startDate;
        startDate = hotel.date_end.substring(5);
        splits = startDate.split('-');
        startDate = `${splits[1]}/${splits[0]}`
        dateString += " › " + startDate;

        if (hotel) {
            subHTMLContent += `
            <div class="flight-booking-detail col-xl-4 col-sm-6 col-12 mb-1">
                <div class="flight-booking-detail-container d-flex flex-row">
                    <div class="d-flex flex-column align-items-center justify-content-center mr-1">
                        <div class="text-center">
                            <img alt="" src="./../../shared/assets/images/hotel.png"
                                style="width: 30px;"
                            >
                            <div style="font-family: 'header'; color: #CCC6C6">
                            ${hotelLocation}</div>
                        </div>
                        <img class="hotel-thumbnail" alt="" src="${hotel.hotel_image_url}">
                    </div>
                    <div class="d-flex flex-column align-items-start justify-content-center ml-1">
                        <h5 class="text-purple" style="font-family: 'header'">${dateString}</h5>
                        <h5 class="text-purple" style="font-family: 'header'; font-size: 1rem;">${hotel.hotel_name}</h5>
                    </div>
                </div>
            </div>
        `
        }
    })

    document.querySelector(".hotel-bookings").innerHTML = subHTMLContent;
}

const printDetails = () => {
    let detailsBox = document.getElementById("details");
    detailsBox.innerHTML = "";
    let html = "";

    details.forEach((detailsOfDay, index) => {
        let dayDetailsHTML = ``;
        detailsOfDay.forEach(detail => {

            let detailHTML = ``;
            if (detail.time !== "" || detail.detail !== "") {
                detailHTML += `<div class='detail-time-div ${detail.isRemind ? 'time-div-remind' : 'time-div-not-remind'}'>`
                let detailContent = ``;
                if (detail.detail !== "") {
                    if (detail.time !== "")
                        detailContent = `· ${detail.detail}`
                    else
                        detailContent = `${detail.detail}`
                }

                detailHTML += `
                    <span  style="font-family: 'header'">
                        <i style="color: ${!detail.isRemind ? 'var(--theme-purple);' : 'white'}" class="fas fa-clock"></i>
                        ${detail.time}
                        ${detailContent}
                    </span>
                `

                detailHTML += "</div>";
            }

            let alarmClass = "";
            let attractionClass = "";
            if (detail.isRemind)
                alarmClass = '<span class="mr-1"><i class="fas fa-clock"></i></span>'
            if (detail.attraction.id)
                attractionClass = `
                    <div class="mb-2 mt-2 plan-detail-attraction" style="background: white;">
                        <div class="img-div" style="width: 60px; height: 60px; object-fit: cover;
                        background-image: url('${detail.attraction.image}')
                        "></div>
                        
                        <div>
                            ${detailHTML}
                        </div>
                        
                        <span class="d-flex align-items-center detail-attraction-div" style="display: inline-flex !important">
                            <i class="fa fa-map-marker-alt mr-1" aria-hidden="true"></i>
                            <a class="destination" target="blank" 
                            href="../../attraction/attraction.php?id=${detail.attraction.id}">${detail.attraction.name}</a>
                        </span>

                    </div>
                `

            let timeHTML = `
                <p class="mb-0 mt-1 text-gray">
                    ${alarmClass}
                </p>
            `;

            if (detail.attraction.id)
                dayDetailsHTML += `
                    <div class="mb-2 mt-2 editable-container left-container draggable" draggable="true"
                    data-day=${index}>
                        ${attractionClass}
                    </div>
                `
            else {

                let divContent = ``;

                divContent += `<div class='detail-all-div ${detail.isRemind ? 'detail-all-remind' : 'detail-all-not-remind'}'>`
                let detailContent = ``;
                if (detail.detail !== "") {
                    if (detail.time !== "")
                        detailContent = `· ${detail.detail}`
                    else
                        detailContent = `${detail.detail}`
                }

                divContent += `
                <span  style="font-family: 'header'">
                    <i style="color: ${!detail.isRemind ? 'var(--theme-purple);' : 'white'}" class="fas fa-clock"></i>
                    ${detail.time}
                    ${detailContent}
                </span>
                `

                divContent += "</div>"

                if (detail.isRemind) {
                    dayDetailsHTML += `
                        <div class="mb-2 mt-2 editable-container left-container draggable" draggable="true"
                        data-day=${index}>
                            ${divContent}
                        </div>
                `
                } else {
                    dayDetailsHTML += `
                        <div class="mb-2 mt-2 editable-container left-container draggable" draggable="true"
                        data-day=${index}>
                            ${divContent}
                        </div>
                    `
                }
            }
        })
        html += `
            <div id="day-${index + 1}" class="day-draggable mt-3 mb-3 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12" >
                <div class="editable-container text-left day-div">
                    <h4 class="text-purple text-left" style="font-family: 'body'">day ${index + 1}</h4>
                </div>
                

                <div class="details" data-day="${index}">
                    ${dayDetailsHTML}
                </div>                
            </div>
        `


    })

    detailsBox.innerHTML = html;
}

const getDisplayDateFormat = (isWeekDay, ISODate) => {
    const newDateObj = new Date(ISODate);
    const toMonth = newDateObj.getMonth() + 1;
    const toYear = newDateObj.getFullYear();
    const toDate = newDateObj.getDate();
    const DOW = newDateObj.getDay()
    const dateTemplate = isWeekDay ? `${weekDays[DOW]}, ${toDate} ${months[toMonth - 1]} ${toYear}` : `${toDate} ${months[toMonth - 1]} ${toYear}`;
    // console.log(dateTemplate)
    return dateTemplate;
}

const showColabsSwal = () => {
    Swal.fire({
        title: 'List of authors',
        html: `
            <div class="text-center colab-details">
                
            </div>
        `,
        didOpen: () => {
            let colabList = document.querySelector(".colab-details");
            let listHTML = ``;
            colabs.forEach(colab => {
                listHTML += `
                    <div class="colab-result">
                        <div class="row">
                            <div class="col-md-4 col-sm-6 offset-md-0 offset-sm-3">
                                <img src="${colab.image}" alt="" class="des-result-img">
                            </div>
                            <div class="col-md-8 col-sm-12 d-flex align-items-center justify-content-center justify-content-md-start">
                                <div class="text-md-left text-center">
                                    <h5 class="text-pink">${colab.display_name}</h5>
                                    <p class="text-gray">${colab.mail}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            })
            colabList.innerHTML = listHTML;
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}