const db = require("../config/db");
const seatModel = require("./seatModel");

const createBus = async (busData) => {
  const {
    bus_name,
    from_city_id,
    to_city_id,
    departure_time,
    arrival_time,
    journey_date,
    price,
    total_seats,
    boarding_points
  } = busData;

  const result = await db.query(
    `INSERT INTO buses (
      bus_name, from_city_id, to_city_id, departure_time, arrival_time, journey_date, price
    ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [bus_name, from_city_id, to_city_id, departure_time, arrival_time, journey_date, price]
  );

  const bus = result.rows[0];

  // Create seats for the bus
  await seatModel.createSeatsForBus(bus.id, total_seats);

  // Insert boarding points
  if (boarding_points && boarding_points.length > 0) {
    const boardingPromises = boarding_points.map(point =>
      db.query(
        `INSERT INTO boarding_points (bus_id, location, time) VALUES ($1, $2, $3)`,
        [bus.id, point.location, point.time]
      )
    );
    await Promise.all(boardingPromises);
  }

  return bus;
};

const getBusesByRouteAndDate = async (fromCity, toCity, journeyDate) => {
  const query = `
    SELECT 
      b.*, 
      cf.name AS from_city_name, 
      ct.name AS to_city_name,
      json_agg(DISTINCT jsonb_build_object('location', bp.location, 'time', bp.time)) FILTER (WHERE bp.location IS NOT NULL) AS boarding_points,
  json_agg(DISTINCT jsonb_build_object('id', s.id, 'seat_number', s.seat_number, 'is_booked', s.is_booked)) FILTER (WHERE s.id IS NOT NULL) AS seats

    FROM buses b
    JOIN cities cf ON b.from_city_id = cf.id
    JOIN cities ct ON b.to_city_id = ct.id
    LEFT JOIN boarding_points bp ON bp.bus_id = b.id
    LEFT JOIN seats_table s ON s."busId" = b.id
    WHERE cf.name = $1 AND ct.name = $2 AND b.journey_date = $3
    GROUP BY b.id, cf.name, ct.name
  `;
  const values = [fromCity, toCity, journeyDate];
  const { rows } = await db.query(query, values);
  return rows;
};

const getBusDetailsById = async (busId) => {
  const res = await db.query("SELECT * FROM buses WHERE id = $1", [busId]);
  return res.rows[0];
};

module.exports = {
  createBus,
  getBusesByRouteAndDate,
  getBusDetailsById
};
