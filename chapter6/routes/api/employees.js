const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
// const verifyJWT = require('../../middleware/verifyJWT');

const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// all users already have to have JWT

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        employeesController.createNewEmployee
    )
    .put(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        employeesController.updateEmpoyee
    )
    .delete(
        verifyRoles(ROLES_LIST.Admin),
        employeesController.deleteEmployee
    );

router.route('/:id').get(employeesController.getEmployee);

module.exports = router;