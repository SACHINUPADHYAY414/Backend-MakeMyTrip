const pool = require('../config/db');

const getAllCountries = async () => {
  const res = await pool.query('SELECT * FROM countries ORDER BY name');
  return res.rows;
};

const getCountryById = async (id) => {
  const res = await pool.query('SELECT * FROM countries WHERE id = $1', [id]);
  return res.rows[0];
};

const addCountry = async (name) => {
  const res = await pool.query(
    'INSERT INTO countries (name) VALUES ($1) RETURNING *',
    [name]
  );
  return res.rows[0];
};

const deleteCountry = async (id) => {
  await pool.query('DELETE FROM countries WHERE id = $1', [id]);
};

const updateCountry = async (id, name) => {
  const res = await pool.query(
    'UPDATE countries SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return res.rows[0];
};

module.exports = {
  getAllCountries,
  getCountryById,
  addCountry,
  deleteCountry,
  updateCountry,
};
