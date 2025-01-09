const request = require('supertest');
const app = require('../src/app'); // Asegúrate de importar la aplicación correctamente

describe("Arithmetic API", () => {
  it("should return the sum of two numbers", async () => {
    const res = await request(app).post("/api/v1/arithmetic").send({
      number1: 5,
      number2: 3,
      operation: "add",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toEqual(8);
  });

  it("should handle division by zero", async () => {
    const res = await request(app).post("/api/v1/arithmetic").send({
      number1: 5,
      number2: 0,
      operation: "divide",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Division by zero is not allowed");
  });
});
