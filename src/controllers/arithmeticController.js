const Joi = require("joi");
const redisClient = require("../utils/redis");
const ArithmeticLog = require("../models/ArithmeticLog");

exports.performOperation = async (req, res, next) => {
  const start = Date.now();

  // Validación de entrada
  const schema = Joi.object({
    number1: Joi.number().required(),
    number2: Joi.number().required(),
    operation: Joi.string().valid("add", "subtract", "multiply", "divide").required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
      timestamp: new Date().toISOString(),
    });
  }

  const { number1, number2, operation } = value;

  // Manejo de operaciones
  const operations = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => (b !== 0 ? a / b : null),
  };

  if (operation === "divide" && number2 === 0) {
    return res.status(400).json({
      status: "error",
      message: "Division by zero is not allowed",
      timestamp: new Date().toISOString(),
    });
  }

  // Verificar en caché
  const cacheKey = `${number1}-${operation}-${number2}`;
  const cachedResult = await redisClient.get(cacheKey);
  if (cachedResult) {
    return res.json({
      status: "success",
      operation,
      inputs: { number1, number2 },
      result: JSON.parse(cachedResult),
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - start}ms`,
    });
  }

  const result = operations[operation](number1, number2);

  // Guardar en MongoDB
  const log = new ArithmeticLog({
    operation,
    inputs: { number1, number2 },
    result,
    timestamp: new Date(),
    responseTime: Date.now() - start,
  });

  await log.save();

  // Almacenar en Redis
  await redisClient.set(cacheKey, JSON.stringify(result), { EX: 60 });

  // Respuesta
  res.json({
    status: "success",
    operation,
    inputs: { number1, number2 },
    result,
    timestamp: new Date().toISOString(),
    responseTime: `${Date.now() - start}ms`,
  });
};
