// const getBusesByRouteAndDate = async (fromCity, toCity, journeyDate) => {
//   const query = `
//     SELECT 
//       b.*, 
//       cf.name AS from_city_name, 
//       ct.name AS to_city_name,
//       json_agg(json_build_object('location', bp.location, 'time', bp.time)) AS boarding_points,
//       b.total_seats
//     FROM buses b
//     JOIN cities cf ON b.from_city_id = cf.id
//     JOIN cities ct ON b.to_city_id = ct.id
//     LEFT JOIN boarding_points bp ON b.id = bp.bus_id
//     WHERE cf.name = $1 AND ct.name = $2 AND b.journey_date = $3
//     GROUP BY b.id, cf.name, ct.name
//   `;
//   const values = [fromCity, toCity, journeyDate];
//   const result = await pool.query(query, values);
//   return result.rows;
// };// backend/models/busModel.js

const db = require('../config/db'); // or your DB config

const getBusesByRouteAndDate = async (fromCity, toCity, journeyDate) => {
    const query = `
        SELECT 
            b.*, 
            cf.name AS from_city_name, 
            ct.name AS to_city_name,
            json_agg(json_build_object('location', bp.location, 'time', bp.time)) AS boarding_points
        FROM buses b
        JOIN cities cf ON b.from_city_id = cf.id
        JOIN cities ct ON b.to_city_id = ct.id
        LEFT JOIN boarding_points bp ON bp.bus_id = b.id
        WHERE cf.name = $1 AND ct.name = $2 AND b.journey_date = $3
        GROUP BY b.id, cf.name, ct.name
    `;
    const values = [fromCity, toCity, journeyDate];

    const { rows } = await db.query(query, values);
    return rows;
};

module.exports = {
    getBusesByRouteAndDate,
};
