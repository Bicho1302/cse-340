const pool = require("../database/")

async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO favorites (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT (account_id, inv_id) DO NOTHING
    RETURNING favorite_id;
  `
  return pool.query(sql, [account_id, inv_id])
}

async function removeFavorite(account_id, inv_id) {
  const sql = `
    DELETE FROM favorites
    WHERE account_id = $1 AND inv_id = $2
    RETURNING favorite_id;
  `
  return pool.query(sql, [account_id, inv_id])
}

async function isFavorite(account_id, inv_id) {
  const sql = `
    SELECT favorite_id
    FROM favorites
    WHERE account_id = $1 AND inv_id = $2
    LIMIT 1;
  `
  const data = await pool.query(sql, [account_id, inv_id])
  return data.rowCount > 0
}

async function getFavoritesByAccountId(account_id) {
  // join to inventory + classification so you can show details nicely
  const sql = `
    SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_thumbnail,
           c.classification_name
    FROM favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    JOIN classification c ON i.classification_id = c.classification_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC;
  `
  return pool.query(sql, [account_id])
}

module.exports = {
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavoritesByAccountId,
}
