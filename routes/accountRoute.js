const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

/* ***************************
 * Login routes
 * *************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post("/login", utilities.handleErrors(accountController.accountLogin))

/* ***************************
 * Registration routes
 * *************************** */
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* ***************************
 * Account management routes
 * *************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
)

router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
)

// ✅ Add server-side validation for updates
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// ✅ Add server-side validation for password changes
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

/* ***************************
 * Logout
 * *************************** */
router.get("/logout", (req, res) => {
  // clear cookie in both dev + prod reliably
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
  })
  return res.redirect("/")
})

module.exports = router
