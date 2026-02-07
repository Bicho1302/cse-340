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
/* *****************************
 * Add new classification
 ***************************** */
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING classification_id, classification_name;
    `
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

/* *****************************
 * Add new inventory item
 ***************************** */
async function addInventoryItem(item) {
  try {
    const sql = `
      INSERT INTO inventory
      (inv_make, inv_model, inv_year, inv_description,
       inv_image, inv_thumbnail, inv_price,
       inv_miles, inv_color, classification_id)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING inv_id;
    `

    const params = [
      item.inv_make,
      item.inv_model,
      parseInt(item.inv_year),
      item.inv_description,
      item.inv_image,
      item.inv_thumbnail,
      parseFloat(item.inv_price),
      parseInt(item.inv_miles),
      item.inv_color,
      parseInt(item.classification_id),
    ]

    const data = await pool.query(sql, params)
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationName,
  getInventoryById,
  addClassification,
  addInventoryItem,
}
