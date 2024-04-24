const {
  insertStudent,
  selectStudents,
  selectStudentById,
  updateStudent,
  removeStudent,
} = require("../models/students.model");
const { ukDateToSql } = require("../utils/dateUtil");

exports.postStudent = async (req, res, next) => {
  try {
    const { name, email, date_of_birth, entry_year } = req.body;
    const formattedDOB = ukDateToSql(date_of_birth);

    const student = await insertStudent(name, email, formattedDOB, entry_year);
    res.status(201).send({ student });
  } catch (error) {
    next(error);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const students = await selectStudents();
    res.status(200).send({ students });
  } catch (error) {
    next(error);
  }
};

exports.getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await selectStudentById(id);
    res.status(200).send({ student });
  } catch (error) {
    next(error);
  }
};

exports.patchStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      res.status(400).send({ error: "Update fields required" });
    }

    const student = await updateStudent(id, updates);
    res.status(200).send({ student });
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await removeStudent(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
