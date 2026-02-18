const express = require("express")
const router = new express.Router()

const favoriteController = require("../controllers/favoriteController")
const utilities = require("../utilities/")
const favValidate = require("../utilities/favorite-validation")

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.buildFavoritesView)
)

router.post(
  "/add",
  utilities.checkLogin,
  favValidate.favoriteRules(),
  favValidate.checkFavoriteData,
  utilities.handleErrors(favoriteController.addFavorite)
)

router.post(
  "/remove",
  utilities.checkLogin,
  favValidate.favoriteRules(),
  favValidate.checkFavoriteData,
  utilities.handleErrors(favoriteController.removeFavorite)
)

module.exports = router
