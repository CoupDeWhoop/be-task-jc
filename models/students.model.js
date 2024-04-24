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
  return db.query(queryStr, values).then(({ rows }) => rows[0]);
};
