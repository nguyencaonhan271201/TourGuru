class HotelBookingInfo {
  constructor (currencyCode, currencyRate, hotelID, hotelURL, checkIn, checkOut, numberOfNights, price,
    name, address, stars, long, lat, reviewScore, numberOfGuests, numberOfRooms) {
    this.currency = {
      code: currencyCode,
      rate: currencyRate,
    };
    this.hotel = {
      ID: hotelID,
      imageURL: hotelURL,
      name: name,
      stars: stars,
      address: address
    }
    this.date = {
      checkIn: checkIn,
      checkOut: checkOut,
    }
    this.numberOfNights = numberOfNights;
    this.singleNight = price;
    this.numberOfGuests = numberOfGuests;
    this.numberOfRooms = numberOfRooms;
    this.totalCost = 0;
    this.coordinates = {
      longitude: long,
      latitude: lat
    }
    this.score = {
      score: reviewScore.score,
      word: reviewScore.word
    }
    this.roomDetails = [];
  }

  displayNightFullString() {
    let nightOrNights = this.numberOfNights == 1 ? "night" : "nights";
    return `${this.numberOfNights} ${nightOrNights}`
  }

  buildObjectForSend(uid) {
    let sendData = {
      "user_id": `${uid}`,
      "date_start": `${this.date.checkIn}`,
      "date_end": `${this.date.checkOut}`,
      "number_of_nights": `${this.numberOfNights}`,
      "total_cost": `${this.buildCostString()}`,
      "hotel": {
        "name": `${this.hotel.name}`,
        "image_url": `${this.hotel.imageURL}`,
        "address": `${this.hotel.address.replace(/\s\s+/g, ' ').replaceAll(" ,", ",")}`,
        "stars": `${this.hotel.stars}`,
      }
    }

    return sendData;
  }

  buildCostString() {
    return `${this.totalCost.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${this.currency.code}`
  }

  displayRoomString() {
    let roomOrRooms = this.numberOfRooms == 1? "room" : "rooms";
    return `${this.numberOfRooms} ${roomOrRooms}`
  }
}
