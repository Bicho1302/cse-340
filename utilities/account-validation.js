const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")
const accountModel = require("../models/account-model")

const regValidate = {}

/* *****************************
 * Registration Validation Rules
 * ***************************** */
regValidate.registrationRules = () => {
  return [
    body("account_firstname").trim().notEmpty().withMessage("First name is required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail()
      .custom(async (account_email) => {
        const exists = await accountModel.checkExistingEmail(account_email)
        if (exists) {
          throw new Error("That email is already registered. Please log in.")
        }
      }),
    body("account_password")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters and include uppercase, lowercase, number, and symbol."
      ),
  ]
}

regValidate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    errors.array().forEach((e) => req.flash("error", e.msg))

    const nav = await utilities.getNav()
    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* *****************************
 * Account Update Validation Rules
 * ***************************** */
regValidate.updateRules = () => {
  return [
    body("account_id").trim().notEmpty().withMessage("Account ID is missing."),
    body("account_firstname").trim().notEmpty().withMessage("First name is required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail(),
  ]
}

regValidate.checkUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    errors.array().forEach((e) => req.flash("error", e.msg))

    const nav = await utilities.getNav()
    // keep your update view sticky
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      accountData: res.locals.accountData, // used for hidden id + defaults
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* *****************************
 * Password Update Validation Rules
 * ***************************** */
regValidate.passwordRules = () => {
  return [
    body("account_id").trim().notEmpty().withMessage("Account ID is missing."),
    body("account_password")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters and include uppercase, lowercase, number, and symbol."
      ),
  ]
}

regValidate.checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    errors.array().forEach((e) => req.flash("error", e.msg))

    const nav = await utilities.getNav()
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      accountData: res.locals.accountData,
      account_id,
    })
  }
  next()
}

module.exports = regValidate
