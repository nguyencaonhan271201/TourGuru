class Booking {
  constructor(id) {
    this.id = id;
  }
}

class HotelBooking extends Booking {
  constructor(bookingInfo, id) {
    super();
    this.hotel = {
      id: bookingInfo.hotel_id,
      name: bookingInfo.hotel_name,
      url: bookingInfo.hotel_image_url
    };
    this.booking_id = id;
    this.quantityInfo = {
      rooms: bookingInfo.number_of_beds,
      nights: bookingInfo.number_of_nights
    };
    this.date_booked = bookingInfo.date_booked;
    this.dates = {
      from: bookingInfo.date_start,
      to: bookingInfo.date_end,
    }
    this.totalCost = bookingInfo.total_cost;
  }

  buildDurationString() {
    let nightOrNights = this.quantityInfo.nights == 1 ? "night" : "nights";
    return `${this.quantityInfo.nights} ${nightOrNights}`;
  }
}

class FlightBookingIteration {
  constructor(iteration) {
    this.aircraft = iteration.aircraft;
    this.airline = iteration.airline;
    this.time = {
      departure: iteration.departure,
      arrival: iteration.arrival
    };
    this.locations = {
      from: {
        code: iteration.origin_code,
        name: iteration.origin
      },
      to: {
        code: iteration.dest_code,
        name: iteration.destination
      }
    };
    this.flightNumber = iteration.flight_number;
  }
}

class FlightBooking extends Booking {
  constructor(bookingInfo, id) {
    super();
    this.booking_id = id;
    this.class = bookingInfo[0].class;
    this.date_booked = bookingInfo[0].date_booked;
    this.date = bookingInfo[0].date;
    this.totalPrice = bookingInfo[0].total_price;
    this.numberOfPax = bookingInfo[0].number_of_pax;
    this.iterations = [];
    bookingInfo.forEach(iteration => {
      this.iterations.push(new FlightBookingIteration(iteration));
    })
    this.passengersList = [];
  }
}

class Factory {
  create() {}
}

class HotelBookingFactory extends Factory {
  create(bookingInfo, id) {
    return new HotelBooking(bookingInfo, id);
  }
}

class FlightBookingFactory extends Factory {
  create(bookingInfo, id) {
    return new FlightBooking(bookingInfo, id);
  }
}
