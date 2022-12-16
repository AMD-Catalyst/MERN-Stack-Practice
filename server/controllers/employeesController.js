const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees)
    return res.status(204).json({ message: "No Employee Found." });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and Last name are required" });
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    //or
    // const employees = new Employee(req.body);
    // const results = await employees.save();
    // res.status(201).json(results)

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}.` });
  }

  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Employee ID required." });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    res.status(204).json({ message: `No employee matches ID ${req.body.id}.` });
  }

  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Employee ID required" });

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res
      .status(400)
      .json({ message: `No employee matches ID ${req.params.id}.` });
  }

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};

// module.exports = {
//   getAllEmployees: (req, res) => {
//     console.log("get All Employee");
//     res.json(data.employees);
//   },

//   createNewEmployee: (req, res) => {
//     console.log("insert an Employee");
//     res.json("insert an Employee");
//   },

//   updateEmployee: (req, res) => {
//     console.log("update an Employee");
//     res.json("update an Employee");
//   },

//   deleteEmployee: (req, res) => {
//     console.log("delete an Employee");
//     res.json("delete an Employee");
//   },

//   getEmployee: (req, res) => {
//     console.log("get an Employee");
//     res.json("get an Employee");
//   },
// };
