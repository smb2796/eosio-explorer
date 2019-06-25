const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const rootDir = require('../util/path');

const router = express.Router();
const controller = require('../controllers/explorerController');

// route to get 10 most recent blocks
router.get('/getBlocks', async (req, res, next) => {
  try {
    console.log("Successfully Routed to getBlocks");
    const response = await controller.getBlocks();
    //return 10 most recent blocks
    res.json(response);
  } catch(e) {
    console.log(e);
  }
});

//route to controller to get ricardian contracts for a block
//req.body format: { 
//     "pairingList": [{ "account": accountname, "type": typeOfAction}, {...}]
// }
router.post('/getContractList', async (req, res, next) => {
  try {
    console.log("Successfully Routed to getContractList");
    const response = await controller.getContractList(req.body);
    //return list of ricardian contracts
    res.json(response);
  } catch(e) {
    console.log(e);
  }
});

router.get('/', (req, res, next) => {
  res.send("404 Error. Please check your path");
});

module.exports = router;
