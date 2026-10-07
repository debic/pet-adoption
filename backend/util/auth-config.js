// Shared auth settings, read from backend/.env
const JWT_KEY = process.env.JWT_KEY || "secret_token_key_dont_share";

// ADMIN_EMAILS is a comma-separated list, e.g. ADMIN_EMAILS=me@mail.com,other@mail.com
const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const isAdminEmail = (email) =>
  !!email && getAdminEmails().includes(email.toLowerCase());

module.exports = { JWT_KEY, isAdminEmail };
