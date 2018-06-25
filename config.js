const setting = require('./config.json');
let env = {};
for (const i in setting) {
    process.env[i] = process.env[i] || setting[i];
    env[i] = process.env[i] || setting[i];
}
console.log(process.env);
console.log(env);
module.exports = {env};
