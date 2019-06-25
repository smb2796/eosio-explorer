'use strict';
const EosApi = require('eosjs-api')

//defining public endpoint
const options = {
    httpEndpoint: 'https://api.eosnewyork.io'
}
//passing httpEndpoint to eosjs api to override local default
const eos = EosApi(options);

//function called by router, controls flow of getting the most recent blocks
async function getBlocks() {
    try {
        return getBlockInfo().then(function(info) {
            //pass head block num to loop blocks
            return loopBlocks(info.head_block_num).then(function(blockList) {
                return blockList;
            });
        });
    } catch(err){
        let errorMessage = `Controller Error: ${err.message}`;
        return errorMessage;
    }
}

//eosjs rpc call to get blockchain information and gather headblock number to give us a reference for iterating on our requests
function getBlockInfo() {
    try {
        return eos.getInfo({}).then(function(blockInfo) {
            return blockInfo;
        });
    } catch (err) {
        let errorMessage = `Controller Error: ${err.message}`;
        return errorMessage;
    } 
}

//function to handle the logic behind making multiple getBlock calls. Takes head block number and iterates back 10 blocks, passing in each 
//block number as a parameter to getBlock
async function loopBlocks(headBlockNumber){
    try {
        let blockList = [];
        let delay = 50;
        for (let callNumber = 0; callNumber <= 10; callNumber++){
            //uses helper function to time out each endpoint call. without helper function, endpoint returns overload error
            await setAsyncTimeout(() => {
                //calls single instance of getBlock with (headblocknumber - # of calls made so far)
                getBlock(headBlockNumber - callNumber).then(function(currentBlock){
                    //currentBlock is equal to a single block returned at the current block number
                    blockList.push(currentBlock);
                })
            }, delay * callNumber);
        }
        //returning block list which is what we return to the UI
        return await blockList;
    } catch(err){
        let errorMessage = `Controller Error: ${err.message}`;
        return errorMessage;
    } 
}

//using eosjs rpc call to get a single block
function getBlock(headBlockNumber){
    try {
        return eos.getBlock(headBlockNumber).then(function(result) {
            return result;
        });
    } catch (err) {
        let errorMessage = `Controller Error: ${err.message}`;
        return errorMessage;
    } 
}


// Controls flow of getting ricardian contracts
// takes in params which is of format { 
//     "pairingList": [{ "account": accountname, "type": typeOfAction}, {...}]
// }
// These params were gathered in api by inspecting each transaction in block, and using the blocks with non-hashed txs to 
// gather each action's information from that tx 
// Necessary to pass in type, because each accountname has different ricardian contracts for different types of actions
async function getContractList(params) {
    try {
        return getAbiList(params.pairingList).then(function(abiTypePairList) {
            return getContractsFlow(abiTypePairList).then(function(contractList) {
                return contractList;
            });
        });

    } catch(err){
        let errorMessage = `Get Contract Controller Error: ${err.message}`;
        return errorMessage;
    }
}

// Handles the abi gathering flow
// takes params of format  [{ "account": accountname, "type": typeOfAction}, {...}]
async function getAbiList(params){
    try {
        let abiTypePairList = [];
        let delay = 50;
        for (let accountNumIndex = 0; accountNumIndex < params.length; accountNumIndex++){
            //same as in get blocks, delays each call to avoid overloading server with too many reqs
            await setAsyncTimeout(() => {
                //get single abi with account name gathered by iterating through params
                getAbi(params[accountNumIndex].account).then(function(currentAbi){
                    //create new object to tie type and abi together so type can be matched against abi data later on
                    let abiTypePairing = {
                        "type": params[accountNumIndex].type,
                        "abi": currentAbi
                    }
                    abiTypePairList.push(abiTypePairing);
                })
            }, delay * accountNumIndex);
        }
        //return all gathered abi/type pairs
        return await abiTypePairList;
    } catch (err) {
        let errorMessage = `Get ABI List Controller Error: ${err.message}`;
        return errorMessage;
    } 
}

//use eosjs rpc to get abi by account name
function getAbi(account){
    try {
        return eos.getAbi(account).then(function(abi) {
            return abi;
        });
    } catch (err) {
        let errorMessage = `Get Abi Controller Error: ${err.message}`;
        return errorMessage;
    } 
}

//once abis for each action have been gathered, some processing must be done to get and return each contract
async function getContractsFlow(abiTypePairList){
    try {
        let contractList = [];
        
        //iterate through each abi/type pairing and pass it to getContract helper function
        for (let i = 0; i < abiTypePairList.length; i++){
            getContract(abiTypePairList[i].abi, abiTypePairList[i].type).then(function(contract) {
                contractList.push(contract);
            });
        }
        //return all gathered ricardian contracts for a block
        return await contractList;
        
    } catch (err) {
        let errorMessage = `Get Contracts Controller Error: ${err.message}`;
        return errorMessage;
    } 
}

//helper function to get contract based on abi and type
async function getContract(abiObject, type){
    try {
        //for each action within abi, if the action type matches the type of action seen within the block transaction, return the ricardian contract
        for (let i = 0; i < abiObject.abi.actions.length; i++){
            if(abiObject.abi.actions[i].type == type){
                return abiObject.abi.actions[i].ricardian_contract;
            }
        }
    } catch (err) {
        let errorMessage = `Get Contract Controller Error: ${err.message}`;
        return errorMessage;
    } 
}

//helper function to not delay endpoint request and not overload it 
//with multiple requests at the same time
const setAsyncTimeout = (cb, timeout = 0) => new Promise(resolve => {
    setTimeout(() => {
        cb();
        resolve();
    }, timeout);
});

//export functions here
module.exports = {
    getBlocks,
    getContractList
}