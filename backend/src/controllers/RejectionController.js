const Booking = require("../models/Booking");

module.exports = {
  async store(request, response) {
    const { booking_id } = request.params;

    const booking = await Booking.findById(booking_id).populate("spot");

    booking.approved = false;

    await booking.save();

    return response.json(booking);
  },
};
