// cleaning up the employees.js file
const data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data) { this.employees = data; }
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createNewEmployee = (req, res) => {
    const newEmployee = {
        id: `${parseInt(data.employees[data.employees.length - 1].id) + 1}` || "1",
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };

    if(!newEmployee.firstname || !newEmployee.lastname){
        return res.status(400).json({"message": 'First and Last names are required'});
    }

    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
};

const updateEmpoyee = (req, res) => {
    const employeeToUpdate = data.employees.find(emp => emp.id === String(req.body.id));
    if(!employeeToUpdate){
        return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
    }
    if(req.body.firstname) employeeToUpdate.firstname = req.body.firstname;
    if(req.body.lastname) employeeToUpdate.lastname = req.body.lastname;
    const filteredArr = data.employees.filter(emp => emp.id !== String(req.body.id));
    const unSortedArr = [...filteredArr, employeeToUpdate];
    data.setEmployees(unSortedArr.sort(
        (a, b) => {
            a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
        }
    ));
    res.json(data.employees);
};

const deleteEmployee = (req, res) => {
    const employeeToDelete = data.employees.find(emp => emp.id === String(req.body.id));
    if(!employeeToDelete){
        return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
    }
    const filteredArr = data.employees.filter(emp => emp.id !== String(req.body.id));
    data.setEmployees([...filteredArr]); // this is using an "unlinked", shallow copy 
    res.json(data.employees);
};

const getEmployee = (req, res) => {
    const requestedEmployee = data.employees.find(emp => emp.id === String(req.params.id));
    if(!requestedEmployee){
        return res.status(400).json({"message": `Employee ID ${req.params.id} not found`});
    }
    res.json(requestedEmployee);
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmpoyee,
    deleteEmployee,
    getEmployee
};

