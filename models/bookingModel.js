const db = require("../config/db");
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
    userId
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
      userId
    ]
  );

  return result.rows[0]; // returns booking ID and data
};

const getAllBookings = async () => {
  const result = await db.query("SELECT * FROM booking_table");
  return result.rows;
};

const getBookingById = async (id) => {
  const result = await db.query(
    `
    SELECT b.*, bus.from_city_name, bus.to_city_name
    FROM booking_table b
    JOIN buses bus ON b.busid = bus.id
    WHERE b.id = $1
  `,
    [id]
  );
  return result.rows[0];
};

const getBookingsByUserId = async (userId) => {
  const result = await db.query(
    `
    SELECT 
      b.id, 
      b.busid, 
      b.firstname, 
      b.lastname, 
      b.email, 
      b.mobilenumber, 
      b.presentaddressline1, 
      b.dateofbirth, 
      b.coupon, 
      b.coupondiscount, 
      b.totalprice, 
      b.userid,
      bus.bus_name, 
      bus.from_city_id, 
      bus.to_city_id,
      bus.departure_time, 
      bus.arrival_time,
      bus.journey_date,
      cf.name AS from_city_name, 
      ct.name AS to_city_name,
      s.seat_number
    FROM booking_table b
    JOIN buses bus ON b.busid = bus.id
    JOIN cities cf ON bus.from_city_id = cf.id
    JOIN cities ct ON bus.to_city_id = ct.id
    JOIN seats_table s ON b.seatid::int = s.id
    WHERE b.userid = $1
    ORDER BY b.id DESC
  `,
    [userId]
  );
  const bookingsWithoutSeatId = result.rows.map(({ seatid, ...rest }) => rest);
  return bookingsWithoutSeatId;
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUserId
};
