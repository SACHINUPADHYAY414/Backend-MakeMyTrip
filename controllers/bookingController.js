// const bookingModel = require('../models/bookingModel');

// exports.createBooking = async (req, res) => {
//   try {
//     const booking = await bookingModel.createBooking(req.body);
//     res.status(201).json({ message: 'Booking created', booking });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to create booking', error: error.message });
//   }
// };

// exports.getAllBookings = async (req, res) => {
//   try {
//     const bookings = await bookingModel.getAllBookings();
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to get bookings', error: error.message });
//   }
// };

// exports.getBookingById = async (req, res) => {
//   try {
//     const bookingId = req.params.id;
//     const booking = await bookingModel.getBookingById(bookingId);

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to get booking', error: error.message });
//   }
// };
const bookingModel = require("../models/bookingModel");
const { decrypt } = require("../utils/encryption");

exports.createBooking = async (req, res) => {
  try {
    const decryptedUserId = parseInt(decrypt(req.user.id), 10);

    if (isNaN(decryptedUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const bookingData = {
      ...req.body,
      userId: decryptedUserId
    };

    const booking = await bookingModel.createBooking(bookingData);
    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create booking", error: error.message });
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
