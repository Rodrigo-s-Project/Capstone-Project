import dotenv from "dotenv";
dotenv.config();

import { app } from "./server";
import { setAssociations } from "./associations/index";
import { sequelize } from "./database/database";
import { timerPublicFolder } from "./cronos/index";

async function main() {
  try {
    setAssociations();
    await sequelize.sync();
    console.log(`Connection has been established successfully`);

    await app.listen(app.get("port"));
    console.log(`Server on port: ${app.get("port")}`);
  } catch (error) {
    console.error(`Unable to connect: ${error}`);
  }
}

main();

// Cron Jobs
timerPublicFolder();
