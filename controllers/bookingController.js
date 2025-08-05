const bookingModel = require("../models/bookingModel");
const { decrypt } = require("../utils/encryption");
const seatModel = require("../models/seatModel");
const User = require("../models/userModel");
const { getBookingById } = require("../models/bookingModel");
const { sendTicketEmail } = require("../services/emailService");

const busModel = require("../models/busModel");

exports.createBooking = async (req, res) => {
  try {
    const {
      busId,
      seatId,
      firstName,
      lastName,
      email,
      mobileNumber,
      presentAddressLine1,
      dateOfBirth,
      coupon,
      couponDiscount,
      seatNumber,
      totalPrice,
      journeyDate
    } = req.body;

    await seatModel.bookSeat(seatId);
    const bookingDate = new Date();
    const booking = await bookingModel.createBooking({
      busId,
      seatId,
      firstName,
      lastName,
      email,
      mobileNumber,
      presentAddressLine1,
      dateOfBirth,
      coupon,
      couponDiscount,
      totalPrice,
      journeyDate,
      bookingDate,
      userId: req.user?.id || null
    });

    const busDetails = await busModel.getBusDetailsById(busId);
    const user = await User.findUserById(req.user?.id || booking.userId);
    const userFullName = `${user.first_name} ${user.last_name}`;

    const ticketData = {
      email,
      firstName,
      lastName,
      busName: busDetails?.bus_name || "",
      fromCity: req.body.fromCity || busDetails?.from_city_name || "N/A",
      toCity: req.body.toCity || busDetails?.to_city_name || "N/A",
      departure: busDetails?.departure_time || "",
      arrival: busDetails?.arrival_time || "",
      duration: busDetails?.duration || "",
      seatNumber,
      totalPrice,
      journeyDate:
        busDetails?.journey_date || busDetails?.departure_date || null,
      bookingDate,
      userFullName
    };
    res.status(201).json({
      message: "Booking created! Your ticket will be emailed shortly.",
      booking
    });

    // Send email asynchronously, no await here
    sendTicketEmail(ticketData).catch((err) => {
      console.error("Email sending failed:", err);
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get bookings", error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await bookingModel.getBookingById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get booking", error: error.message });
  }
};
exports.getBookingsByUser = async (req, res) => {
  try {
    const paramUserId = parseInt(req.params.userId);
    const tokenUserId = req.user.id; // from verifyToken middleware

    if (paramUserId !== tokenUserId) {
      return res.status(403).json({ message: "Unauthorized access to bookings." });
    }

    const bookings = await bookingModel.getBookingsByUserId(paramUserId);

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Failed to get bookings", error: error.message });
  }
};



