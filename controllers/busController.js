// const busModel = require('../models/busModel');

// const searchBuses = async (req, res) => {
//     const { from, to, date } = req.query;

//     if (!from || !to || !date) {
//         return res.status(400).json({ message: "from, to and date are required" });
//     }

//     try {
//         const buses = await busModel.getBusesByRouteAndDate(from, to, date);
//         res.json(buses);
//     } catch (error) {
//         console.error("Error fetching buses:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// module.exports = {
//     searchBuses,
// };
const busModel = require('../models/busModel'); // ✅ path must match file location

const searchBuses = async (req, res) => {
  const { from, to, date } = req.query;

  try {
    const buses = await busModel.getBusesByRouteAndDate(from, to, date);
    res.json(buses);
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { searchBuses };
