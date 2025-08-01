const pool = require('../config/db');

const getCitiesByStateId = async (stateId) => {
  const res = await pool.query(
    'SELECT * FROM cities WHERE state_id = $1 ORDER BY name',
    [stateId]
  );
  return res.rows;
};

const getAllCities = async () => {
  const res = await pool.query('SELECT * FROM cities ORDER BY name');
  return res.rows;
};

const getCityById = async (id) => {
  const res = await pool.query('SELECT * FROM cities WHERE id = $1', [id]);
  return res.rows[0];
};

const addCity = async (name, state_id) => {
  const res = await pool.query(
    'INSERT INTO cities (name, state_id) VALUES ($1, $2) RETURNING *',
    [name, state_id]
  );
  return res.rows[0];
};

const deleteCity = async (id) => {
  await pool.query('DELETE FROM cities WHERE id = $1', [id]);
};

const updateCity = async (id, name, state_id) => {
  const res = await pool.query(
    'UPDATE cities SET name = $1, state_id = $2 WHERE id = $3 RETURNING *',
    [name, state_id, id]
  );
  return res.rows[0];
};

module.exports = {
  getCitiesByStateId,
  getAllCities,
  getCityById,
  addCity,
  deleteCity,
  updateCity,
};
