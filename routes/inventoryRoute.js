const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// ================================
// Inventory by classification (Task 1 example from activities)
// URL example: /inventory/type/suv
// ================================
router.get(
  "/type/:classificationName",
  utilities.handleErrors(invController.buildByClassificationName)
)

// ================================
// Vehicle detail view (Assignment 3 Task 1)
// URL example: /inventory/detail/5
// ================================
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildInventoryDetail)
)

// ================================
// Intentional error route (Task 3)
// URL example: /inventory/trigger-error
// ================================
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
)

module.exports = router
