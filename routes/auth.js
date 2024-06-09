const express = require('express');
const authController = require('../controllers/auth')
const router = express.Router();


router.post('/register', authController.register )

router.post('/login', authController.login )

//router.post('/dashboard', authController.dashboard )


// ...

router.get('/clientList', authController.clientList);
router.get('/clientInfo/:clientID', authController.clientInfo);
router.get('/pickupInfo', authController.pickupInfo);
router.get('/userDashboard', authController.userDashboard);
router.get('/editUser/:userID', authController.editUser);
router.post('/updateClient', authController.updateClient);
router.delete('/deleteUser/:userID', authController.deleteUser);

// ...


module.exports = router;





