const mysql = require("mysql2/promise");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOSTNAME,
  port: process.env.MYSQL_SERVER_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
});


exports.register = async (req, res) => {
  const { userID, username, userType, password, confirmPassword } = req.body;
  console.log('Register request received:', req.body);

  try {
    const [result] = await pool.query('SELECT UserID FROM User WHERE UserID = ?', [userID]);
    console.log('Result from checking existing user:', result);

    if (result.length > 0) {
      return res.render('register', {
        message: 'User ID already exists'
      });
    } else if (password !== confirmPassword) {
      return res.render('register', {
        message: "Passwords do not match"
      });
    }

    let hashedPassword = await bcrypt.hash(password, 8);
    console.log('Hashed password:', hashedPassword);

    await pool.query('INSERT INTO User SET ?', { UserID: userID, Username: username, UserType: userType, Password: hashedPassword });
    console.log('New user inserted');

    return res.render('register', {
      message: 'Successfully registered!'
    });
  } catch (error) {
    console.log('Error during registration:', error);
    return res.render('register', {
      message: 'An error occurred during registration'
    });
  }
}; // end of register


exports.login = async (req, res) => {
  const { userID, password } = req.body;

  console.log("Login attempt - UserID:", userID);
  console.log("Login attempt - Password:", password);

  try {
    const [results] = await pool.query("SELECT * FROM User WHERE UserID = ?", [userID]);

    if (results.length === 0) {
      return res.render('login', {
        message: 'That user ID has not been registered yet'
      });
    }

    let match = await bcrypt.compare(password, results[0].Password);

    if (match) {
      req.session.userID = results[0].UserID;
      req.session.userType = results[0].UserType;

      //return res.render('dashboard', { userType: results[0].UserType });
      console.log("Login Successful - need to make dashboard.hbs")
    } else {
      return res.render('login', {
        message: 'Invalid password'
      });
    }
  } catch (error) {
    console.log("ERROR: " + error);
    return res.render('login', {
      message: 'An error occurred during login'
    });
  }
}; // end of login


// exports.dashboard = (req, res) => {
//     // Access user information from the session
//     const { userID, jobTitle } = req.session;

//     if (!userID || !jobTitle) {
//         // Redirect to login if user information is not found in the session
//         return res.redirect('/login');
//     }

//     // Render the dashboard with user information
//     return res.render('dashboard', { jobTitle });
    
// } // end of dashboard


// NEW STUFF


// ...

exports.clientList = async (req, res) => {
    try {
      const clients = await getClients();
      res.render('clientList', { clients });
    } catch (error) {
      console.error('Error retrieving clients:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  exports.clientInfo = async (req, res) => {
    const clientID = req.params.clientID;
    try {
      const client = await getClientByID(clientID);
      const isAdmin = req.session.userType === 'admin';
      res.render('clientInfo', { client, isAdmin });
    } catch (error) {
      console.error('Error retrieving client:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  exports.pickupInfo = async (req, res) => {
    try {
      const clients = await getClientsWithPickupInfo();
      res.render('pickupInfo', { clients });
    } catch (error) {
      console.error('Error retrieving pickup information:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  exports.userDashboard = async (req, res) => {
    try {
      const users = await getUsers();
      const currentUserID = req.session.userID;
      res.render('userDashboard', { users, currentUserID });
    } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  exports.editUser = async (req, res) => {
    const userID = req.params.userID;
    try {
      const user = await getUserByID(userID);
      res.render('editUser', { user });
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  exports.updateClient = async (req, res) => {
    const { clientID, clientName, clientLocation } = req.body;
    try {
      await updateClient(clientID, clientName, clientLocation);
      res.redirect(`/clientInfo/${clientID}`);
    } catch (error) {
      console.error('Error updating client:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  exports.deleteUser = async (req, res) => {
    const userID = req.params.userID;
    try {
      await deleteUser(userID);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ success: false });
    }
  };
  
  // Helper functions for database queries
  async function getClients() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM Client', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  
  async function getClientByID(clientID) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM Client WHERE ClientID = ?', [clientID], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
  
  async function getClientsWithPickupInfo() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT ClientName, ClientLocation, LastPickupDate, NeedsPickup FROM Client', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  
  async function getUsers() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM User', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  
  async function getUserByID(userID) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM User WHERE UserID = ?', [userID], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
  
  async function updateClient(clientID, clientName, clientLocation) {
    return new Promise((resolve, reject) => {
      pool.query('UPDATE Client SET ClientName = ?, ClientLocation = ? WHERE ClientID = ?', [clientName, clientLocation, clientID], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  
  async function deleteUser(userID) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM User WHERE UserID = ?', [userID], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  
  // ...


