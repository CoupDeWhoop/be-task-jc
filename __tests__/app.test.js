const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const { getStudentById } = require("../controllers/students.controller");
const seed = require("../db/seed");

beforeEach(() => seed());
afterAll(() => db.end());

describe("Students api", () => {
  describe("POST /api/students", () => {
    test("201 successfully creates a new student", async () => {
      const newStudent = {
        name: "Jason Parse",
        email: "jp@json.com",
        date_of_birth: "23/09/2009",
        entry_year: 2020,
      };
      const response = await request(app)
        .post("/api/students")
        .send(newStudent)
        .expect(201);

      expect(response.body.student).toMatchObject({
        id: expect.any(Number),
        name: "Jason Parse",
        email: "jp@json.com",
        date_of_birth: expect.any(String),
        entry_year: 2020,
      });
    });

    test("400 - returns an error when name is missing", async () => {
      const newStudent = {
        email: "jp@json.com",
        date_of_birth: "23/09/2009",
        entry_year: 2020,
      };

      const response = await request(app)
        .post("/api/students")
        .send(newStudent)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid request");
    });

    test("409 - conflict on unique email field", async () => {
      const newStudent = {
        name: "Jason Parse",
        email: "krascal@gmail.com",
        date_of_birth: "23/09/2009",
        entry_year: 2020,
      };
      const response = await request(app)
        .post("/api/students")
        .send(newStudent)
        .expect(409);
      expect(response.body.error).toBe("Email already exists.");
    });
  });

  describe("GET /api/students", () => {
    test("200 retrieves a list of students", async () => {
      const response = await request(app).get("/api/students").expect(200);

      const { students } = response.body;
      expect(students).toHaveLength(2);
      students.forEach((student) => {
        expect(student).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          date_of_birth: expect.any(String),
          entry_year: expect.any(Number),
        });
      });
    });
  });

  describe("GET /api/students/:id", () => {
    test("200 - retrieves a student using their id", async () => {
      const response = await request(app).get("/api/students/2").expect(200);

      const { student } = response.body;
      const readableDate = new Date(student.date_of_birth)
        .toDateString()
        .split(" ")
        .slice(1)
        .join(" ");

      expect(readableDate).toBe("Apr 02 2013");
      expect(student).toMatchObject({
        id: 2,
        name: "Kyran Rascal",
        email: "krascal@gmail.com",
        entry_year: 2024,
      });
    });

    test("400 returns an error when ID is malformed", async () => {
      const response = await request(app)
        .get(`/api/students/invalid_id`)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid request");
    });

    test("404 returns an error when ID does not exist", async () => {
      const response = await request(app).get(`/api/students/9999`).expect(404);
      expect(response.body.message).toBe("Student not found.");
    });
  });

  describe("PATCH /api/students/:id", () => {
    test("200 should update the amended fields", async () => {
      const updates = {
        email: "newemail@email.com",
        entry_year: 2008,
      };
      const response = await request(app)
        .patch("/api/students/1")
        .send(updates)
        .expect(200);

      expect(response.body.student).toMatchObject({
        id: 1,
        name: "Phil Bobbins",
        date_of_birth: expect.any(String),
        ...updates,
      });
    });

    test("404 should return an error when updating with invalid student ID", async () => {
      const updates = {
        email: "newemail@email.com",
        entry_year: 2008,
      };
      const response = await request(app)
        .patch(`/api/students/9999`)
        .send(updates)
        .expect(404);
      expect(response.body.message).toBe("Student not found.");
    });

    test("400 should return an error when no update fields are provided", async () => {
      const response = await request(app).patch("/api/students/1").expect(400);
      expect(response.body.error).toBe("Update fields required");
    });

    test("400 should return an error when updating a non-existent field", async () => {
      const updates = {
        not_a_prop: "value",
      };
      const response = await request(app)
        .patch("/api/students/1")
        .send(updates)
        .expect(400);
      expect(response.body.error).toBe("Invalid request");
    });
  });

  describe("DELETE /api/students", () => {
    test("204 should delete the student with the specified ID", async () => {
      const studentId = 1;
      const response = await request(app)
        .delete(`/api/students/${studentId}`)
        .expect(204);
      expect(response.body).toEqual({});

      const checkDb = await request(app)
        .get(`/api/students/${studentId}`)
        .expect(404);
    });

    test("404 - should reject a request to delete a non-existent student id", async () => {
      const response = await request(app)
        .delete(`/api/students/9239`)
        .expect(404);
      expect(response.body.message).toBe("Student not found.");
    });

    test("400 returns an error when ID is malformed", async () => {
      const response = await request(app)
        .delete(`/api/students/invalid_id`)
        .expect(400);
      expect(response.body.error).toBe("Invalid request");
    });
  });
});
