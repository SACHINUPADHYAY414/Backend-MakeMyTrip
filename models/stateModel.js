const pool = require('../config/db');

const getStatesByCountryId = async (countryId) => {
  const res = await pool.query(
    'SELECT * FROM states WHERE country_id = $1 ORDER BY name',
    [countryId]
  );
  return res.rows;
};

const getAllStates = async () => {
  const res = await pool.query('SELECT * FROM states ORDER BY name');
  return res.rows;
};

const getStateById = async (id) => {
  const res = await pool.query('SELECT * FROM states WHERE id = $1', [id]);
  return res.rows[0];
};

const addState = async (name, country_id) => {
  const res = await pool.query(
    'INSERT INTO states (name, country_id) VALUES ($1, $2) RETURNING *',
    [name, country_id]
  );
  return res.rows[0];
};

const deleteState = async (id) => {
  await pool.query('DELETE FROM states WHERE id = $1', [id]);
};

const updateState = async (id, name, country_id) => {
  const res = await pool.query(
    'UPDATE states SET name = $1, country_id = $2 WHERE id = $3 RETURNING *',
    [name, country_id, id]
  );
  return res.rows[0];
};

module.exports = {
  getStatesByCountryId,
  getAllStates,
  getStateById,
  addState,
  deleteState,
  updateState,
};
