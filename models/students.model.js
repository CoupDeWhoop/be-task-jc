const db = require("../db/connection");

exports.insertStudent = async (name, email, date_of_birth, entry_year) => {
  const { rows } = await db.query(
    `
  INSERT INTO students
  (name, email, date_of_birth, entry_year)
  VALUES
  ($1, $2, $3, $4)
  RETURNING *
  `,
    [name, email, date_of_birth, entry_year]
  );
  return rows[0];
};

exports.selectStudents = async () => {
  const { rows } = await db.query(`SELECT * FROM students;`);
  return rows;
};

exports.selectStudentById = async (id) => {
  const { rows } = await db.query("SELECT * FROM students where id = $1", [id]);
  if (rows.length === 0) {
    return Promise.reject({ status: 404, message: "Student not found." });
  }
  return rows[0];
};

exports.updateStudent = async (id, updates) => {
  let queryStr = "UPDATE students SET ";
  let paramIndex = 1; // not zero indexed
  const values = [];

  for (const param in updates) {
    const value = updates[param];
    if (values.length !== 0) queryStr += ",";
    queryStr += `${param} = $${paramIndex} `;
    values.push(value);
    paramIndex++;
  }

  queryStr += `WHERE id = $${paramIndex} RETURNING *;`;
  values.push(id);
  const { rows } = await db.query(queryStr, values);
  if (rows.length === 0)
    return Promise.reject({ status: 404, message: "Student not found." });

  return rows[0];
};

exports.removeStudent = async (id) => {
  const { rowCount } = await db.query("DELETE from students WHERE id = $1;", [
    id,
  ]);
  if (rowCount === 0)
    return Promise.reject({ status: 404, message: "Student not found." });

  return;
};
