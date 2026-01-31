const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

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
 * Build inventory by classification name
 * URL example: /inv/type/sedan
 **************************************** */
invCont.buildByClassificationName = async function (req, res, next) {
  const classificationName = req.params.classificationName
  const nav = await utilities.getNav()

  const data = await invModel.getInventoryByClassificationName(classificationName)

  // If nothing found, still show the page (optional), or throw 404 if you want
  // I recommend showing the page with the "no vehicles" message.
  const displayName =
  classificationName.length <= 3
    ? classificationName.toUpperCase()
    : classificationName.charAt(0).toUpperCase() + classificationName.slice(1).toLowerCase()


  const grid = utilities.buildClassificationGrid(data)

  res.render("inventory/classification", {
    title: `${displayName} Vehicles`,
    nav,
    grid,
  })
}


/* ****************************************
 * Intentional error trigger (Assignment 3 Task 3)
 **************************************** */
invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 error for testing")
  utilities.handleErrors(invController.triggerError)

}

module.exports = invCont
