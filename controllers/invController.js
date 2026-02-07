const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

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

  res.render("inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicleHTML,
  })
}

/* ****************************************
 * Inventory by classification name
 * GET /inv/type/:classificationName
 **************************************** */
invCont.buildByClassificationName = async function (req, res, next) {
  const classificationName = req.params.classificationName
  const nav = await utilities.getNav()

  const data = await invModel.getInventoryByClassificationName(classificationName)

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
 * Intentional error trigger (Assignment 3 Task 3)
 * GET /inv/trigger-error
 **************************************** */
invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 error for testing")
}

/* ****************************************
 * Management view (Assignment 4 Task 1)
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
 * Build Add Classification view (Task 2)
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
 * Process Add Classification (Task 2)
 * POST /inv/add-classification
 **************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "✅ Classification added successfully.")
    const nav = await utilities.getNav() // rebuild nav immediately
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
 * Build Add Inventory view (Task 3)
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

    // sticky defaults (blank on first load)
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
 * Process Add Inventory (Task 3)
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
  const classificationList = await utilities.buildClassificationList(classification_id)

  return res.status(500).render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,

    // ✅ sticky values returned
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
