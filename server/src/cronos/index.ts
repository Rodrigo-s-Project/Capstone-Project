import cron from "node-cron";
import path from "path";
import fs from "fs";

export const timerPublicFolder = () => {
  cron.schedule("0 1 * * *", async () => {
    // At 01:00 so each day... at 1 am
    const dirPublic = path.join(__dirname + `../../public`);
    fs.rmdir(dirPublic, { recursive: true }, err => {});
  });
};
