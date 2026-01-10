const fs = require("fs");
const path = require("path");

const robotsPath = path.join(process.cwd(), "public", "robots.txt");
const content = [
  "#DaumWebMasterTool:88e28d206ec1e0974cd63fa38513c496434aaed44d885ccb32bcb6d01fe96f89:eKszeDhI0pPPnRomojb47Q==",
  "User-agent: *",
  "Allow: /",
  "",
  "Host: https://ourstime.com",
  "",
  "Sitemap: https://ourstime.com/sitemap.xml",
  "",
].join("\n");

fs.mkdirSync(path.dirname(robotsPath), { recursive: true });
fs.writeFileSync(robotsPath, content, "utf8");
