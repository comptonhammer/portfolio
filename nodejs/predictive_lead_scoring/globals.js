require('dotenv').config();
let path = require('path');

global.appRoot = path.resolve(__dirname);
global.environment = process.env.ENVIRONMENT;
global.errorStyle = `<link href="https://fonts.googleapis.com/css?family=News+Cycle" rel="stylesheet"><style> 
body{
  font-family: 'News Cycle', sans-serif;
  text-align: center;
}
</style>`;