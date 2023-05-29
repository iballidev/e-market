const express = require("express");
const {
  getAllCustomers,
  getAddCustomerView,
  addCustomer,
  getUpdateCustomerView,
  updateCustomer,
  getDeleteCustomerView,
  deleteCustomer,
} = require("../controllers/customer.controller");
const verifyRoles = require("../middleware/verify-roles");
const ROLE_LIST = require("../config/role-list");

const router = express.Router();

// router.get("/",verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor), getAllCustomers);
// router.get("/add", verifyJWT, getAddCustomerView);
// router.post(
//   "/add",
//   verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor),
//   addCustomer
// );
// router.get(
//   "/update/:id",
//   verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor),
//   getUpdateCustomerView
// );
// router.post(
//   "/update/:id",
//   verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor),
//   updateCustomer
// );
// router.get("/delete/:id", verifyRoles(ROLE_LIST.Admin), getDeleteCustomerView);
// router.post("/delete/:id", verifyRoles(ROLE_LIST.Admin), deleteCustomer);

router.get("/", getAllCustomers);
router.get("/add", getAddCustomerView);
router.post(
  "/add",

  addCustomer
);
router.get("/update/:id", getUpdateCustomerView);
router.post("/update/:id", updateCustomer);
router.get("/delete/:id", getDeleteCustomerView);
router.post("/delete/:id", deleteCustomer);

module.exports = {
  routes: router,
};
