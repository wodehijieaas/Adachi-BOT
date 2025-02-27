import schedule from "node-schedule";
import express from "express";
import db from "./database.js";
import { gachaUpdate as updateGachaJob } from "./update.js";

function initDB() {
  db.init("aby");
  db.init("artifact");
  db.init("authority");
  db.init("character", { record: [] });
  db.init("cookies", { cookie: [], uid: [] });
  db.init("cookies_invalid", { cookie: [] });
  db.init("gacha", { user: [], data: [] });
  db.init("info");
  db.init("map");
  db.init("music", { source: [] });
  db.init("time");
}

function cleanDB(name) {
  let nums = db.clean(name);
  global.bots.logger.debug(`清理：删除数据库 ${name} 中 ${nums} 条无用记录。`);
  return nums;
}

function cleanDBJob() {
  let nums = 0;
  nums += cleanDB("aby");
  nums += cleanDB("cookies");
  nums += cleanDB("cookies_invalid");
  nums += cleanDB("info");
  return nums;
}

function serve(port = 9934) {
  const server = express();
  server.use(express.static(global.rootdir));
  server.listen(port, "localhost");
}

async function init() {
  serve(9934);
  initDB();
  updateGachaJob();
  cleanDBJob();

  schedule.scheduleJob("1 */1 * * *", async () => updateGachaJob());
  schedule.scheduleJob("1 */1 * * *", async () => cleanDBJob());
}

export { init };
