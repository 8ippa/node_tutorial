const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
// const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    // .get(verifyJWT, employeesController.getAllEmployees) // --> works if we only want it for select routes
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmpoyee)
    .delete(employeesController.deleteEmployee);

router.route('/:id').get(employeesController.getEmployee);

module.exports = router;