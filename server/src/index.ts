import dotenv from "dotenv";
dotenv.config();

import { app } from "./server";
import { sequelize } from "./database/database";

async function main() {
  try {
    await sequelize.authenticate();
    console.log(`Connection has been established successfully`);

    await app.listen(app.get("port"));
    console.log(`Server on port: ${app.get("port")}`);
  } catch (error) {
    console.error(`Unable to connect: ${error}`);
  }
}

main();
