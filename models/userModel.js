const db = require('../config/db');

const createUser = async (userData) => {
  const {
    title, first_name, last_name, gender, date_of_birth,
    present_address_line1, present_pincode, present_country,
    present_state, present_city, email, password_hash, salt
  } = userData;

  const result = await db.query(`
    INSERT INTO users (
      title, first_name, last_name, gender, date_of_birth,
      present_address_line1, present_pincode, present_country,
      present_state, present_city, email, password_hash, salt
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING id
  `, [
    title, first_name, last_name, gender, date_of_birth,
    present_address_line1, present_pincode, present_country,
    present_state, present_city, email, password_hash, salt
  ]);

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};
