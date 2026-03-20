
const { format, createLogger, transports } = require("winston");

const { LOG_LEVEL } = require("../../config");

const formats = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  format.simple(),
  format.splat(), // This is generally for string interpolation, might not be strictly needed if passing an object directly
  format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: [email:${info.email}] [location:${info.location}] [procType:${info.procType}] [log:${JSON.stringify(info.log)}]`) // Direct access to properties and stringify log object
);

// Örnek Çıktı Formatı:
// 2023-05-04 12:12:12 INFO: [email:asd] [location:asd] [procType:asd] [log:{}]

const logger = createLogger({
  level: LOG_LEVEL,
  transports: [
    new transports.Console({ format: formats })
  ]
});

module.exports = logger;