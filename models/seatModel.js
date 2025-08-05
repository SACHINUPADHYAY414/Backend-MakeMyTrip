const db = require("../config/db");

const createSeatsForBus = async (busId, totalSeats) => {
  const queries = [];
  for (let i = 1; i <= totalSeats; i++) {
    queries.push(
      db.query(
        `INSERT INTO seats_table (seat_number, "busId", is_booked) VALUES ($1, $2, FALSE)`,
        [i, busId]
      )
    );
  }
  await Promise.all(queries);
};
const bookSeat = async (seatId) => {
  const res = await db.query(
    `SELECT is_booked FROM seats_table WHERE id = $1`,
    [seatId]
  );
  console.log("bookSeat query result:", res.rows);
  console.log("seat numnber", seatId);
  if (res.rows.length === 0) throw new Error("Seat not found");
  if (res.rows[0].is_booked) throw new Error("Seat already booked");

  await db.query(`UPDATE seats_table SET is_booked = TRUE WHERE id = $1`, [
    seatId
  ]);
};

const getSeatsByBus = async (busId) => {
  const res = await db.query(
    `SELECT id, seat_number, is_booked FROM seats_table WHERE "busId" = $1 ORDER BY seat_number`,
    [busId]
  );
  return res.rows;
};
module.exports = { createSeatsForBus, bookSeat, getSeatsByBus };
