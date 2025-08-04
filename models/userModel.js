const db = require("../config/db");

const createUser = async (userData) => {
  const {
    title,
    first_name,
    last_name,
    gender,
    date_of_birth,
    present_address_line1,
    present_pincode,
    present_country,
    present_state,
    present_city,
    email,
    mobile_number,
    password_hash,
    salt
  } = userData;

  const result = await db.query(
    `INSERT INTO users (
      title, first_name, last_name, gender, date_of_birth,
      present_address_line1, present_pincode, present_country,
      present_state, present_city, email, mobile_number, password_hash, salt
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING id`,
    [
      title,
      first_name,
      last_name,
      gender,
      date_of_birth,
      present_address_line1,
      present_pincode,
      present_country,
      present_state,
      present_city,
      email,
      mobile_number,
      password_hash,
      salt
    ]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email
  ]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

const updateUserProfile = async (id, data) => {
  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    present_address_line1,
    present_pincode,
    present_country,
    present_state,
    present_city,
    mobile_number
  } = data;

  const result = await db.query(
    `UPDATE users SET
      first_name = $1,
      last_name = $2,
      gender = $3,
      date_of_birth = $4,
      present_address_line1 = $5,
      present_pincode = $6,
      present_country = $7,
      present_state = $8,
      present_city = $9,
      mobile_number = $10
     WHERE id = $11 RETURNING *`,
    [
      first_name,
      last_name,
      gender,
      date_of_birth,
      present_address_line1,
      present_pincode,
      present_country,
      present_state,
      present_city,
      mobile_number,
      id
    ]
  );

  return result.rows[0];
};
async function updateUserById(id, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const setClause = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const query = `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1}`;

  await db.query(query, [...values, id]);
}

const updateUserPassword = async (userId, password_hash, salt) => {
  const result = await db.query(
    `UPDATE users SET password_hash = $1, salt = $2 WHERE id = $3 RETURNING id`,
    [password_hash, salt, userId]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserProfile,
  updateUserById,
  updateUserPassword
};
