const busModel = require("../models/busModel");

// Create Bus controller calls model function and sends response
const createBus = async (req, res) => {
  try {
    const busData = req.body;
    const bus = await busModel.createBus(busData);
    res.status(201).json({ message: "Bus created successfully", bus });
  } catch (error) {
    console.error("Error creating bus:", error);
    res.status(500).json({ message: "Failed to create bus", error: error.message });
  }
};

// Search buses
const searchBuses = async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const buses = await busModel.getBusesByRouteAndDate(from, to, date);
    res.status(200).json(buses);
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get bus details by id
const getBusDetailsById = async (req, res) => {
  try {
    const busId = req.params.id;
    const bus = await busModel.getBusDetailsById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.status(200).json(bus);
  } catch (error) {
    console.error("Error getting bus details:", error);
    res.status(500).json({ message: "Failed to get bus details" });
  }
};

module.exports = {
  createBus,
  searchBuses,
  getBusDetailsById,
};
