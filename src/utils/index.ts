const { argv } = require("yargs");

export const isProd = argv.prod || argv["prod"] || false;
