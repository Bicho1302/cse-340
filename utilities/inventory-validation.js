const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")

const validate = {}

validate.inventoryRules = () => {
  return [
    body("inv_make").trim().escape().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().escape().notEmpty().withMessage("Model is required."),

    body("inv_year")
      .trim()
      .notEmpty().withMessage("Year is required.")
      .isInt({ min: 1900, max: 2099 }).withMessage("Year must be a valid number."),

    body("inv_description").trim().escape().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().escape().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().escape().notEmpty().withMessage("Thumbnail path is required."),

    body("inv_price")
      .trim()
      .notEmpty().withMessage("Price is required.")
      .isFloat({ min: 0 }).withMessage("Price must be a number >= 0."),

    body("inv_miles")
      .trim()
      .notEmpty().withMessage("Miles is required.")
      .isInt({ min: 0 }).withMessage("Miles must be an integer >= 0."),

    body("inv_color").trim().escape().notEmpty().withMessage("Color is required."),

    body("classification_id")
      .trim()
      .notEmpty().withMessage("Classification is required.")
      .isInt().withMessage("Classification must be selected."),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const classificationList = await utilities.buildClassificationList(classification_id)

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),

      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  }

  return next()
}

module.exports = validate
