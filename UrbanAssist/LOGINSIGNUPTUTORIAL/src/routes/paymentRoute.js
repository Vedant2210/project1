const express = require('express');
//const payment_route = express();
const router = express.Router();
// Import the paymentController

const path = require('path');
const bodyParser = require('body-parser');
const paymentController = require('../controllers/paymentController');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended:false }));


const app = express();
app.set('view engine','ejs');
app.set('views',path.join(__dirname, '../views'));
// Assuming you have a function to render the order page

router.get('/', paymentController.renderOrderPage); 
router.post('/createOrder', paymentController.createOrder);

//payment_route.post('/createOrder', paymentController.createOrder);

module.exports = router;
