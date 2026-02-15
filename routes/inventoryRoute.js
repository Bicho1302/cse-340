const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// validation middleware
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidate = require("../utilities/inventory-validation")

// ================================
// Management view (restricted)
// URL: /inv/
// ================================
router.get(
  "/",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
)

// ================================
// Add classification (restricted)
// ================================
router.get(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  classificationValidate.classificationRules(),
  utilities.handleErrors(classificationValidate.checkClassificationData),
  utilities.handleErrors(invController.addClassification)
)

// ================================
// Add inventory (restricted)
// ================================
router.get(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  inventoryValidate.inventoryRules(),
  utilities.handleErrors(inventoryValidate.checkInventoryData),
  utilities.handleErrors(invController.addInventory)
)

// ================================
// Public routes (do NOT restrict)
// ================================
router.get(
  "/type/:classificationName",
  utilities.handleErrors(invController.buildByClassificationName)
)

router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildInventoryDetail)
)

// keep as-is (for testing errors)
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
)

module.exports = router
