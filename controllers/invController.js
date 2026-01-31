const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

// existing controller methods...

invCont.buildInventoryDetail = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const nav = await utilities.getNav()

  const vehicle = await invModel.getInventoryById(inv_id)

  // If no vehicle found, send to 404 handler
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

module.exports = invCont
