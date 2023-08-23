const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find(); // no filter => returns all 
    if(!employees){
        return res.status(204).json({
            'message': 'No employees found'
        });
    }
    res.json(employees);
};

const createNewEmployee = async (req, res) => {
    if(!req?.body?.firstname || !req?.body?.lastname){
        return res.status(400).json({"message": 'First and Last names are required'});
    }
    try{
        const result = await Employee.create(
            {
                firstname: req.body.firstname,
                lastname: req.body.lastname
            }
        );
        res.status(201).json(result);
    }
    catch(err){
        console.error(err);
    }
};

const updateEmpoyee = async (req, res) => {
    if(!req?.body?.id){
        return res.status(400).json({
            'message': 'ID parameter is required'
        });
    }
    const employeeToUpdate = await Employee.findOne({_id: req.body.id}).exec();
    if(!employeeToUpdate){
        return res.status(204).json({"message": `No employee matches the ID ${req.body.id}.`});
    }
    if(req.body?.firstname) employeeToUpdate.firstname = req.body.firstname;
    if(req.body?.lastname) employeeToUpdate.lastname = req.body.lastname;
    const result = await employeeToUpdate.save();
    res.json(result);
};

const deleteEmployee = async (req, res) => {
    if(!req?.body?.id){
        return res.status(400).json({
            'message': 'ID parameter is required'
        });
    }
    const employeeToDelete = await Employee.find({ _id: req.body.id }).exec();
    if(!employeeToDelete){
        return res.status(204).json({"message": `No employee matches the ID ${req.body.id}.`});
    }
    const result = await Employee.deleteOne({ _id: req.body.id });
    res.json(result);
};

const getEmployee = async (req, res) => {
    if(!req?.params?.id){
        return res.status(400).json({
            'message': 'ID parameter is required'
        });
    }
    const requestedEmployee = await Employee.findOne({ _id: req.params.id }).exec();
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

