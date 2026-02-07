const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// validation middleware (new files you'll create)
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidate = require("../utilities/inventory-validation")

// ================================
// Management view (Assignment 4 Task 1)
// URL: /inv/
// ================================
router.get("/", utilities.handleErrors(invController.buildManagement))

// ================================
// Add classification (Task 2)
// ================================
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  classificationValidate.classificationRules(),
  utilities.handleErrors(classificationValidate.checkClassificationData),
  utilities.handleErrors(invController.addClassification)
)

// ================================
// Add inventory (Task 3)
// ================================
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)


router.post(
  "/add-inventory",
  inventoryValidate.inventoryRules(),
  utilities.handleErrors(inventoryValidate.checkInventoryData),
  utilities.handleErrors(invController.addInventory)
)

// ================================
// Existing routes
// ================================
router.get(
  "/type/:classificationName",
  utilities.handleErrors(invController.buildByClassificationName)
)

router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildInventoryDetail)
)

router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
)

module.exports = router
