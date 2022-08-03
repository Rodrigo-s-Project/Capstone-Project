import dotenv from "dotenv";
dotenv.config();

import { app, server } from "./server";
import { setAssociations } from "./associations/index";
import { sequelize } from "./database/database";
import { timerPublicFolder } from "./cronos/index";
// import { textQuery } from "./bots/index";

async function main() {
  try {
    setAssociations();
    await sequelize.sync({ alter: true });
    console.log(`Connection has been established successfully`);

    await server.listen(app.get("port"));
    console.log(`Server on port: ${app.get("port")}`);

    // const res = await textQuery(
    //   "Hi!, good morning!",
    //   "dssdgrhehekrujlgkiufdkbbfltllnjuflibfuhttu"
    // );
    // console.log(res);
  } catch (error) {
    console.error(`Unable to connect: ${error}`);
  }
}

main();

// Cron Jobs
timerPublicFolder();
