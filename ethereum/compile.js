const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');

// delete everything in build folder

fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts','Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source,1).contracts;


// create build folder
// check if the directory exists, if not create a new path
fs.ensureDirSync(buildPath);

// loop through the output since there are 2 contracts
for(let contract in output){
    // outputJsonSync(filePath, data);
    // replace ":" in filename with empty string
    fs.outputJsonSync(path.resolve(buildPath, contract.replace(":","") + ".json"), output[contract]);
    
}