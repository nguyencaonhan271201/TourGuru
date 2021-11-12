class Flight {
  //Constructor
  constructor (segmentReturn) {
    this.aircraft = segmentReturn.aircraft;
    this.airline = segmentReturn.airline;
    this.arrival = segmentReturn.arrival;
    this.depart = segmentReturn.depart;
    this.duration = segmentReturn.duration;
    this.fare = segmentReturn.fare;
    this.flightNumber = segmentReturn.flightnumber;
    this.icaos = {
      from: segmentReturn.fromICAO, 
      to: segmentReturn.toICAO
    };
    this.locations = {
      from: segmentReturn.from, 
      to: segmentReturn.to
    };
    this.formattedFare = segmentReturn.formattedFare;
  }

  //Methods
  getFlightNumberDisplay() {
    return `${this.airline.code}${this.flightNumber}`;
  }

  getDepartTime() {
    return this.depart.substring(11, 16);
  }

  getReturnTime() {
    return this.arrival.substring(11, 16);
  }

  getFareString() {
    return `${this.formattedFare.value} ${this.formattedFare.currency}`;
  }

  getDate() {
    return this.depart.substring(0, 10);
  }

  buildObjectForSend(getClass, bookingID) {
    let flight = {
      "booking_id": bookingID,
      "origin_code": `${this.icaos.from}`,
      "dest_code": `${this.icaos.to}`,
      "origin": `${this.locations.from.name}`,
      "destination": `${this.locations.to.name}`,
      "departure": `${this.getDepartTime()}`,
      "arrival": `${this.getReturnTime()}`,
      "date": `${this.getDate()}`,
      "class": `${getClass == "Y"? "ECONOMY" : getClass == "J"? "BUSINESS" : getClass == "F"? "FIRST" : "PREMIUM ECONOMY"}`,
      "aircraft": `${this.aircraft}`,
      "airline": this.airline.name,
      "flight_number": `${this.getFlightNumberDisplay()}`,
    }
    return flight;
  }
}

class Passenger {
  constructor(title, dob, first, last, passport) {
    this.title = title;
    this.dob = dob;
    this.first = first;
    this.last = last;
    this.passport = passport;
  }

  getDisplayName() {
    return `${this.first} ${this.last}`
  }

  getDisplayFull() {
    return `${this.title} ${this.first} ${this.last}`
  }

  buildObjectForSend(bookingID) {
    let passenger = {
      "booking_id": bookingID,
      "title": this.title,
      "display_name": `${this.getDisplayName()}`,
      "dob": this.dob,
      "passport": this.passport
    }
    return passenger;
  }
}