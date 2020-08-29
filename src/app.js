const express = require("express");
const config = require("config");
const { logger } = require("./loaders/logger");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const startServer = async () => {
  app.use(cors());
  app.use(bodyParser.json());

  const carAdRoutes = require("./API/Routes/car_ad.routes");

  app.use("/post", carAdRoutes);

  return new Promise((resolve) => {
    const server = app.listen(config.port, () => {
      logger.info(`Server is listening on port: ${config.port}`);
      const originalClose = server.close.bind(server);
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose);
        });
      };
      resolve(server);
    });
  });
};

startServer();

module.exports = startServer;
