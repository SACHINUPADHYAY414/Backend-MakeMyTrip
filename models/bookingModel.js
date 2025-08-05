const db = require('../config/db');
const createBooking = async (bookingData) => {
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
    totalPrice,
    userId,
  } = bookingData;

  const result = await db.query(
    `INSERT INTO booking_table (
      busid, seatid, firstname, lastname, email, mobilenumber,
      presentaddressline1, dateofbirth, coupon, coupondiscount, totalprice, userid
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *`,
    [
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
      userId,
    ]
  );

  return result.rows[0]; // returns booking ID and data
};


const getAllBookings = async () => {
  const result = await db.query('SELECT * FROM booking_table');
  return result.rows;
};

const getBookingById = async (id) => {
  const result = await db.query(`
    SELECT b.*, bus.from_city_name, bus.to_city_name
    FROM booking_table b
    JOIN bus_table bus ON b.busid = bus.id
    WHERE b.id = $1
  `, [id]);
  return result.rows[0];
};


module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
};
