const db = require("./connection");
const studentsData = require("./students-data.json");
const format = require("pg-format");
const { ukDateToSql } = require("../utils/dateUtil");

function seed() {
  return db
    .query("DROP TABLE IF EXISTS students")
    .then(() => {
      return db.query(`
      CREATE TABLE students(
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR UNIQUE,
        date_of_birth DATE,
        entry_year INT
      )`);
    })
    .then(() => {
      const formattedData = studentsData.students.map((student) => {
        const { name, email, dateOfBirth, entryYear } = student;
        const formattedDOB = ukDateToSql(dateOfBirth);
        return [name, email, formattedDOB, entryYear];
      });

      const queryString = format(
        `
      INSERT INTO students 
      (name, email, date_of_birth, entry_year)
      VALUES %L RETURNING *
      `,
        formattedData
      );
      return db.query(queryString);
    });
}

module.exports = seed;
