const pool = require("../database/")

async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password
       FROM account
       WHERE account_email = $1`,
      [account_email]
    )
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password
       FROM account
       WHERE account_id = $1`,
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    return null
  }
}

async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const result = await pool.query(
      `UPDATE account
       SET account_firstname = $1, account_lastname = $2, account_email = $3
       WHERE account_id = $4
       RETURNING *`,
      [firstname, lastname, email, account_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("updateAccount error:", error.message)
    return null
  }
}

async function updatePassword(account_id, hashedPassword) {
  try {
    const result = await pool.query(
      `UPDATE account
       SET account_password = $1
       WHERE account_id = $2
       RETURNING account_id`,
      [hashedPassword, account_id]
    )
    return result.rows[0]
  } catch (error) {
    return null
  }
}

/* *****************************
 * Registration helpers
 * ***************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT account_id FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rowCount > 0
  } catch (err) {
    throw err
  }
}

async function registerAccount(firstname, lastname, email, passwordHash) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING account_id
    `
    const result = await pool.query(sql, [firstname, lastname, email, passwordHash])
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
  checkExistingEmail,
  registerAccount,
}
