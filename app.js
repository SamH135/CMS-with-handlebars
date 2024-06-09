const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const session = require('express-session');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);
const app = express();


// Load environment variables from .env file
dotenv.config({ path: './.env' });


// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOSTNAME,
  port: process.env.MYSQL_SERVER_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10, // Adjust the connection limit based on requirements
});


// Test the database connection
pool.query('SELECT 1')
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });


// Middleware setup
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Set up session middleware with express-mysql-session
const sessionStore = new MySQLStore({
  expiration: 86400000, // Session expiration time (in milliseconds)
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data',
    },
  },
}, pool);

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));


// Helper function for handlebars
const hbs = require('hbs');
hbs.registerHelper('equal', function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});


// Set handlebars as the view engine
app.set('view engine', 'hbs');
app.use('/js', express.static(__dirname + '/public/js', { 'Content-Type': 'application/javascript' }));


// Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});