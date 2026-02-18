const favoriteModel = require("../models/favorite-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

async function buildFavoritesView(req, res) {
  const nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id

  const data = await favoriteModel.getFavoritesByAccountId(account_id)

  res.render("favorites/index", {
    title: "My Favorites",
    nav,
    favorites: data.rows,
    errors: null,
  })
}

async function addFavorite(req, res) {
  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.body.inv_id)

  // optional: verify vehicle exists
  const vehicle = await invModel.getInventoryById(inv_id)
  if (!vehicle) {
    req.flash("notice", "That vehicle does not exist.")
    return res.redirect("/")
  }

  await favoriteModel.addFavorite(account_id, inv_id)
  req.flash("notice", "Added to favorites.")
  return res.redirect(`/inv/detail/${inv_id}`)
}

async function removeFavorite(req, res) {
  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.body.inv_id)

  await favoriteModel.removeFavorite(account_id, inv_id)
  req.flash("notice", "Removed from favorites.")
  return res.redirect(`/inv/detail/${inv_id}`)
}

module.exports = {
  buildFavoritesView,
  addFavorite,
  removeFavorite,
}
