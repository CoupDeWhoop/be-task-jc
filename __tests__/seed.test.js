const db = require("../db/connection");
const seed = require("../db/seed");

beforeAll(() => seed());
afterAll(() => db.end());

describe("seed students", () => {
  test("students table exists", () => {
    return db
      .query(
        `SELECT EXISTS (
          SELECT FROM 
            information_schema.tables
            WHERE 
              table_name = 'students'
        );`
      )
      .then(({ rows }) => {
        expect(rows[0].exists).toBe(true);
      });
  });
  test("student data has been inserted correctly", () => {
    return db.query(`SELECT * FROM students;`).then(({ rows: students }) => {
      expect(students).toHaveLength(2);
      students.forEach((student) => {
        console.log(student);
        expect(student).toHaveProperty("id");
        expect(student).toHaveProperty("name");
        expect(student).toHaveProperty("email");
        expect(student).toHaveProperty("date_of_birth");
        expect(student).toHaveProperty("entry_year");
      });
    });
  });
});
