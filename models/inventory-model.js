const pool = require("../database/")

/* *****************************
 * Get all classifications
 * Used for building the nav
 ***************************** */
async function getClassifications() {
  try {
    const sql = `
      SELECT classification_id, classification_name
      FROM classification
      ORDER BY classification_name
    `
    const data = await pool.query(sql)
    return data.rows   
  } catch (error) {
    throw error
  }
}


/* *****************************
 * Get inventory by classification name
 * Used for /inv/type/:classificationName
 ***************************** */
async function getInventoryByClassificationName(classificationName) {
  try {
    const sql = `
      SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_thumbnail, i.inv_price
      FROM inventory i
      JOIN classification c
        ON i.classification_id = c.classification_id
      WHERE LOWER(c.classification_name) = LOWER($1)
      ORDER BY i.inv_make, i.inv_model
    `
    const data = await pool.query(sql, [classificationName])
    return data.rows
  } catch (error) {
    throw error
  }
}

/* *****************************
 * Get single vehicle by ID
 * Used for /inv/detail/:inv_id
 ***************************** */
async function getInventoryById(inv_id) {
  try {
    const sql = `
      SELECT i.*, c.classification_name
      FROM inventory i
      JOIN classification c
        ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationName,
  getInventoryById,
}
