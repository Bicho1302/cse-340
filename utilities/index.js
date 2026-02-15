const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ============================
   Build Navigation (dynamic)
============================ */
async function getNav() {
  const data = await invModel.getClassifications()

  let nav = "<ul>"
  nav += '<li><a href="/" title="Home page">Home</a></li>'

  data.forEach((row) => {
    nav += `<li>
      <a href="/inv/type/${row.classification_name.toLowerCase()}"
         title="See our inventory of ${row.classification_name} vehicles">
         ${row.classification_name}
      </a>
    </li>`
  })

  nav += "</ul>"
  return nav
}

/* ============================
   Build Classification Grid HTML
============================ */
function buildClassificationGrid(data) {
  let grid = '<ul id="inv-display">'

  if (!data || data.length === 0) {
    grid += "<li class='notice'>Sorry, no matching vehicles could be found.</li>"
    grid += "</ul>"
    return grid
  }

  data.forEach((vehicle) => {
    grid += `
      <li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
        </a>
        <div class="namePrice">
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>
    `
  })

  grid += "</ul>"
  return grid
}

/* ============================
   Build Vehicle Detail HTML
============================ */
function buildVehicleDetailHTML(vehicle) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(vehicle.inv_price)

  const miles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles)

  return `
    <section class="vehicle-detail">
      <div class="vehicle-detail__image">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />
      </div>

      <div class="vehicle-detail__content">
        <h2 class="vehicle-detail__title">${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

        <p class="vehicle-detail__price"><strong>Price:</strong> ${price}</p>
        <p class="vehicle-detail__miles"><strong>Mileage:</strong> ${miles} miles</p>

        <h3>Description</h3>
        <p>${vehicle.inv_description}</p>

        <ul class="vehicle-detail__meta">
          <li><strong>Color:</strong> ${vehicle.inv_color ?? "N/A"}</li>
        </ul>
      </div>
    </section>
  `
}

/* ============================
   Error-handling wrapper
============================ */
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/* ============================
   Build Classification <select>
============================ */
async function buildClassificationList(classification_id = null) {
  const data = await invModel.getClassifications()

  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"

  data.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (
      classification_id &&
      Number(row.classification_id) === Number(classification_id)
    ) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })

  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware to check token validity
 **************************************** */
function checkJWTToken(req, res, next) {
  // defaults for every request
  res.locals.loggedin = false
  res.locals.accountData = null

  const token = req.cookies.jwt
  if (!token) return next()

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
    if (err) {
      // invalid/expired token -> clear cookie, continue as guest
      res.clearCookie("jwt")
      return next()
    }
    res.locals.accountData = accountData
    res.locals.loggedin = true
    return next()
  })
}

/* ****************************************
 * Check Login
 **************************************** */
function checkLogin(req, res, next) {
  if (res.locals.loggedin) {
    return next()
  }
  req.flash("notice", "Please log in.")
  return res.redirect("/account/login")
}

/* ****************************************
 * Check Employee or Admin
 * Only allow Employee/Admin to access inventory admin routes
 **************************************** */
function checkEmployeeOrAdmin(req, res, next) {
  const type = res.locals.accountData?.account_type

  if (res.locals.loggedin && (type === "Employee" || type === "Admin")) {
    return next()
  }

  req.flash(
    "notice",
    "You must be logged in as an Employee or Admin to access that area."
  )
  return res.redirect("/account/login")
}

module.exports = {
  getNav,
  buildClassificationGrid,
  buildVehicleDetailHTML,
  handleErrors,
  buildClassificationList,
  checkJWTToken,
  checkLogin,
  checkEmployeeOrAdmin,
}
