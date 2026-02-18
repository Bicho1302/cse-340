const { body, validationResult } = require("express-validator")

const favoriteRules = () => {
  return [
    body("inv_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Invalid vehicle id."),
  ]
}

const checkFavoriteData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("notice", errors.array()[0].msg)
    return res.redirect("back")
  }
  next()
}

module.exports = { favoriteRules, checkFavoriteData }
