const { app } = require("./app");
const { env } = require("./config/env");

app.listen(env.port, () => {
  console.log(`SkillUp backend running on http://localhost:${env.port}`);
});
