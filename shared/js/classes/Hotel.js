class HotelBookingInfo {
  constructor (currencyCode, currencyRate, hotelID, hotelURL, checkIn, checkOut, numberOfNights, price) {
    this.currency = {
      code: currencyCode,
      rate: currencyRate,
    };
    this.hotel = {
      ID: hotelID,
      imageURL: hotelURL,
      name: '',
      stars: 0,
      address: ''
    }
    this.date = {
      checkIn: checkIn,
      checkOut: checkOut,
    }
    this.numberOfNights = numberOfNights;
    this.singleNight = price;
    this.numberOfRooms = 0;
    this.totalCost = 0;
  }

  displayNightFullString() {
    let nightOrNights = this.numberOfNights == 1 ? "night" : "nights";
    return `${this.numberOfNights} ${nightOrNights}`
  }

  buildObjectForSend(uid) {
    let reformattedImageURL = this.hotel.imageURL.indexOf("?") != -1? 
    this.hotel.imageURL.substring(0, this.hotel.imageURL.indexOf("?"))
    : this.hotel.imageURL;

    let sendData = {
      "user_id": `${uid}`,
      "date_start": `${this.date.checkIn}`,
      "date_end": `${this.date.checkOut}`,
      "number_of_nights": `${this.numberOfNights}`,
      "hotel_id": `${this.hotel.ID}`,
      "hotel_name": `${this.hotel.name}`,
      "hotel_image_url": `${reformattedImageURL}`,
      "number_of_beds": `${this.numberOfRooms}`,
      "total_cost": `${this.buildCostString()}`,
    }

    return sendData;
  }

  buildCostString() {
    return `${this.totalCost} ${this.currency.code}`
  }

  displayRoomString() {
    let roomOrRooms = this.numberOfRooms == 1? "room" : "rooms";
    return `${this.numberOfRooms} ${roomOrRooms}`
  }
}
