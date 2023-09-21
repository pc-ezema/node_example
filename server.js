const express = require('express');
const app = express();
const v1Routes = require('./routes/api/v1Routes');
const { logger } = require('./app/middlewares/logEvents');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./app/middlewares/credentials');
const port = process.env.PORT || 3000;

// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies
app.use(express.json());

// Use the route files as middleware
app.use('/api/v1', v1Routes);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});