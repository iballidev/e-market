const express = require('express');
const {getAllCustomers, getAddCustomerView, addCustomer,
        getUpdateCustomerView, updateCustomer, getDeleteCustomerView, deleteCustomer} = require('../controllers/customer.controller');
const verifyJWT = require('../middleware/veryfyJWT');


const router = express.Router();

router.get('/', getAllCustomers);
router.get('/add', verifyJWT, getAddCustomerView);
router.post('/add', addCustomer);
router.get('/update/:id', getUpdateCustomerView);
router.post('/update/:id', updateCustomer);
router.get('/delete/:id', getDeleteCustomerView);
router.post('/delete/:id', deleteCustomer);



module.exports = {
    routes: router
}