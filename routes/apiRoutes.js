const express = require("express");
const router = express.Router();

// Controllers
const countryController = require("../controllers/countryController");
const stateController = require("../controllers/stateController");
const cityController = require("../controllers/cityController");
const busController = require("../controllers/busController");
const authController = require("../controllers/authController");
const chatController = require("../controllers/chatBotController");
const bookingController = require("../controllers/bookingController");
const verifyToken = require("../middleware/verifyToken");
const seatController = require("../controllers/seatController");
const { sendTicketEmail } = require("../services/emailService");


// Auth Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get('/profile/:id', verifyToken, authController.getProfile);
router.put("/profile-setting", verifyToken, authController.updateProfile);
router.put("/change-password", authController.forgotPassword);


// Country CRUD
router.get("/countries", countryController.getAllCountries);
router.get("/countries/:id", countryController.getCountryById);
router.post("/countries", countryController.createCountry);
router.put("/countries/:id", countryController.updateCountry);
router.delete("/countries/:id", countryController.deleteCountry);

// State CRUD
router.get("/states", stateController.getAllStates);
router.get('/states/:id', stateController.getStateById);
// router.post('/states', stateController.createState);
// router.put('/states/:id', stateController.updateState);
// router.delete('/states/:id', stateController.deleteState);

// // City CRUD
router.get("/cities", cityController.getAllCities);
router.get('/cities/:id', cityController.getCityById);
// router.post('/cities', cityController.createCity);
// router.put('/cities/:id', cityController.updateCity);
// router.delete('/cities/:id', cityController.deleteCity);

router.get("/buses", busController.searchBuses);
// router.get('/buses/:id', busController.getBusById);
// router.post('/buses', busController.createBus);
// router.put('/buses/:id', busController.updateBus);
// router.delete('/buses/:id', busController.deleteBus);

// Chatbot
router.post("/chatbot", chatController.chatWithOpenAI);

router.get("/buses", busController.searchBuses);
router.get("/buses/:id", busController.getBusDetailsById); // bus details by id
router.post("/buses", busController.createBus); // create bus with seats

// Seat Routes (new)
router.get("/buses/:busId/seats", seatController.getSeatsByBus);
// Chatbot
router.post("/chatbot", chatController.chatWithOpenAI);

// Bus Booking
router.post("/busBooking", verifyToken, bookingController.createBooking);
router.get("/busBooking", bookingController.getAllBookings);
router.get("/busBooking/:id", bookingController.getBookingById);

// for mail
router.post("/send-ticket", sendTicketEmail);

module.exports = router;
