const pool = require("../database/")

async function getInventoryById(inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

module.exports = {
  // ...your other exports
  getInventoryById,
}
