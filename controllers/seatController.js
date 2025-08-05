const seatModel = require('../models/seatModel');

exports.getSeatsByBus = async (req, res) => {
  try {
    const seats = await seatModel.getSeatsByBus(req.params.busId);
    res.status(200).json(seats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get seats", error: error.message });
  }
};