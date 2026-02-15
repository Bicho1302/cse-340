const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***************************
 * Deliver Login View
 *************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ***************************
 * Deliver Register View
 *************************** */
async function buildRegister(req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ***************************
 * Process Registration
 *************************** */
async function registerAccount(req, res) {
  const nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

  // Check if email already exists
  const emailExists = await accountModel.checkExistingEmail(account_email)
  if (emailExists) {
    req.flash("error", "That email is already registered. Please log in.")
    return res.status(409).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  try {
    // Hash password and insert
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash("notice", "Registration successful! Please log in.")
      return res.redirect("/account/login")
    }

    req.flash("error", "Sorry, registration failed.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  } catch (error) {
    console.error("registerAccount error:", error)
    req.flash("error", "Sorry, an unexpected error occurred.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 * Deliver Account Management View
 *************************** */
async function buildManagement(req, res) {
  const nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData,
  })
}

/* ***************************
 * Process Login
 *************************** */
async function accountLogin(req, res) {
  console.log("LOGIN POST HIT:", req.body)

  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Invalid credentials.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      account_email,
    })
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password

      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3600,
      })

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        })
      }

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Invalid credentials.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        account_email,
      })
    }
  } catch (error) {
    throw new Error("Login failed")
  }
}

/* ****************************************
 * Deliver account update view
 * ************************************ */
async function buildUpdateView(req, res) {
  const nav = await utilities.getNav()
  res.render("account/update", {
  title: "Update Account",
  nav,
  errors: null,
  accountData: res.locals.accountData, // or fetched by id
})

}

/* ****************************************
 * Process account update
 * ************************************ */
async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body

  // 1) Check if email exists for someone else
  const existing = await accountModel.getAccountByEmail(account_email)

  if (existing && Number(existing.account_id) !== Number(account_id)) {
    req.flash("notice", "That email already exists. Please use a different email.")
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  // 2) Try update
  const updated = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (!updated) {
    req.flash("notice", "Sorry, the update failed.")
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  // 3) Refresh JWT so header shows new data
  const freshAccount = await accountModel.getAccountById(account_id)
  delete freshAccount.account_password

  const accessToken = jwt.sign(freshAccount, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600,
  })

  if (process.env.NODE_ENV === "development") {
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
  } else {
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600 * 1000,
    })
  }

  req.flash("notice", "Account updated successfully.")
  return res.redirect("/account/")
}

/* ****************************************
 * Process password change
 * ************************************ */
async function updatePassword(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)
  const result = await accountModel.updatePassword(account_id, hashedPassword)

  if (!result) {
    req.flash("notice", "Sorry, the password update failed.")
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }

  req.flash("notice", "Password updated successfully.")
  return res.redirect("/account/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildManagement,
  accountLogin,
  buildUpdateView,
  updateAccount,
  updatePassword,
}
