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
      busId, seatId, firstName, lastName, email, mobileNumber,
      presentAddressLine1, dateOfBirth, coupon, couponDiscount, totalPrice, userId
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

  return result.rows[0];
};

const getAllBookings = async () => {
  const result = await db.query('SELECT * FROM booking_table');
  return result.rows;
};

const getBookingById = async (id) => {
  const result = await db.query('SELECT * FROM booking_table WHERE id = $1', [id]);
  return result.rows[0];
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
};
