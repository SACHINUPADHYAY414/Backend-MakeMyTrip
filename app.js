// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // app.use(cors({
// //   origin: 'http://localhost:3000',
// //   credentials: true,
// // }));
// app.use(cors({
//   origin: "*"
// }));

// app.use(express.json());

// const apiRoutes = require('./routes/apiRoutes');
// app.use('/api', apiRoutes);

// module.exports = app;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

module.exports = app;
