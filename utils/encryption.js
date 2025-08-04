const crypto = require("crypto");
require("dotenv").config();

const algorithm = "aes-256-cbc";

const keyHex = process.env.ENCRYPT_SECRET_KEY;
const ivHex = process.env.ENCRYPT_SECRET_IV;

if (!keyHex || !ivHex) {
  throw new Error("ENCRYPT_SECRET_KEY or ENCRYPT_SECRET_IV is missing in .env");
}

const key = Buffer.from(keyHex, "hex"); // 32 bytes
const iv = Buffer.from(ivHex, "hex"); // 16 bytes

if (key.length !== 32) {
  throw new Error(
    `Invalid encryption key length: expected 32 bytes, got ${key.length}`
  );
}

if (iv.length !== 16) {
  throw new Error(`Invalid IV length: expected 16 bytes, got ${iv.length}`);
}

// Encrypt a single text string
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(String(text), "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Decrypt a single encrypted string
function decrypt(text) {
  try {
    // Check if input looks like hex string (only 0-9, a-f chars)
    if (
      typeof text !== "string" ||
      text.length < 16 ||
      !/^[0-9a-f]+$/i.test(text)
    ) {
      // Not encrypted, return as is
      return text;
    }

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (e) {
    console.warn("Decryption failed:", e.message);
    return text;
  }
}

// Helper to decrypt multiple fields from client (on input)
function decryptFields(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "string" && value.length > 10) {
      result[key] = decrypt(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// Helper to encrypt multiple fields before sending response to client
function encryptFields(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "string" && value.length > 0) {
      result[key] = encrypt(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

module.exports = {
  encrypt,
  decrypt,
  decryptFields,
  encryptFields
};
