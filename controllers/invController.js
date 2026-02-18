const invModel = require("../models/inventory-model")
const utilities = require("../utilities")
const favoriteModel = require("../models/favorite-model")

const invCont = {}

/* ****************************************
 * Vehicle detail view
 * GET /inv/detail/:inv_id
 **************************************** */
invCont.buildInventoryDetail = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id, 10)
  const nav = await utilities.getNav()

  const vehicle = await invModel.getInventoryById(inv_id)

  if (!vehicle) {
    const err = new Error("Vehicle not found")
    err.status = 404
    throw err
  }

  const vehicleHTML = utilities.buildVehicleDetailHTML(vehicle)

  // ✅ Favorites check (SAFE - inside controller only)
  let isFav = false
  if (res.locals.loggedin && res.locals.accountData?.account_id) {
    isFav = await favoriteModel.isFavorite(
      res.locals.accountData.account_id,
      inv_id
    )
  }

  res.render("inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicleHTML,
    vehicle,   // pass full vehicle object to view
    isFav,     // pass favorite status
  })
}

/* ****************************************
 * Inventory by classification name
 * GET /inv/type/:classificationName
 **************************************** */
invCont.buildByClassificationName = async function (req, res, next) {
  const classificationName = req.params.classificationName
  const nav = await utilities.getNav()

  const data =
    await invModel.getInventoryByClassificationName(classificationName)

  const displayName =
    classificationName.length <= 3
      ? classificationName.toUpperCase()
      : classificationName.charAt(0).toUpperCase() +
        classificationName.slice(1).toLowerCase()

  const grid = utilities.buildClassificationGrid(data)

  res.render("inventory/classification", {
    title: `${displayName} Vehicles`,
    nav,
    grid,
  })
}

/* ****************************************
 * Intentional error trigger
 * GET /inv/trigger-error
 **************************************** */
invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 error for testing")
}

/* ****************************************
 * Management view
 * GET /inv/
 **************************************** */
invCont.buildManagement = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Build Add Classification view
 * GET /inv/add-classification
 **************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: "",
  })
}

/* ****************************************
 * Process Add Classification
 * POST /inv/add-classification
 **************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "✅ Classification added successfully.")
    const nav = await utilities.getNav()
    return res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  }

  req.flash("notice", "❌ Sorry, the classification could not be added.")
  const nav = await utilities.getNav()
  return res.status(500).render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name,
  })
}

/* ****************************************
 * Build Add Inventory view
 * GET /inv/add-inventory
 **************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,

    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: "",
  })
}

/* ****************************************
 * Process Add Inventory
 * POST /inv/add-inventory
 **************************************** */
invCont.addInventory = async function (req, res, next) {
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

  const result = await invModel.addInventoryItem({
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

  if (result) {
    req.flash("notice", "✅ Inventory item added successfully.")
    const nav = await utilities.getNav()
    return res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  }

  req.flash("notice", "❌ Sorry, the inventory item could not be added.")
  const nav = await utilities.getNav()
  const classificationList =
    await utilities.buildClassificationList(classification_id)

  return res.status(500).render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,

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

module.exports = invCont
