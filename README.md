# eosio-explorer

dependencies: 
Node 10.16.0+
npm 6.9.0+

To run: 
1. Make sure that you have necessary dependencies
2. Clone this repository
3. run npm install in root folder
4. navigate to views folder: cd views
5. run npm install in views folder
6. In root folder, run npm start. This will create a node server on localhost:3000
7. In a seperate terminal window, navigate to views folder and run npm start
	- this runs an angular application on localhost:4200
8. Open a web-browser (only tested with chrome) and navigate to localhost:4200
9. Congratulations! You now have access to an EOSIO block explorer where you can view the most recent blocks in the EOSIO blockchain 
as well as view the ricardian contracts associated with each block's abi

NOTES:

File Structure Functionality:
Node server:
app.js - Creates node server
routing.js - Creates application routes that are accessed by UI
controller.js - handles making EOSIO api requests and returning the results of those api requests to requests of the created node server. (EOSIO functionality is all in this file)


