const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaign;


provider = new HDWalletProvider(
    'oil fitness trophy retire depart humor keen mystery rally mango twice differ',
    'https://ropsten.infura.io/v3/79c5e7d6a6c14e60a5f71862bd381e10'
  );

const web3 = new Web3(provider);

const deploy = async () => {
    accounts = await web3.eth.getAccounts(); 
    console.log("Attempting to deploy from", accounts[0]);

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({
        data : compiledFactory.bytecode
    })
    .send({
        from : accounts[0],
        gas: '10000000'
      })

      console.log("Contract deployed to", factory.options.address);
}

deploy();