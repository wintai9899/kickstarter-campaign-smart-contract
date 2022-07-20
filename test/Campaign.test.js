const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts; 
let factory;
let campaign;
let campaignAddress; 

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data : compiledFactory.bytecode})
    .send({
        from : accounts[0],
        gas : "1000000"
    })
    // minimum = 100 wei
    await factory.methods.createCampaign("100").send({
        from : accounts[0],
        gas : "1000000"
    });

    const addresses = await factory.methods.getDeployedCampaigns().call()
    campaignAddress = addresses[0];
    // [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    // create an instance of campaign contract object
    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
})


describe('Campaigns', () => {

    it("Deployed factory and campaign", () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
        //console.log(factory.options.address);
        //console.log(campaign.options.address);
    })

    it("mark caller as campaign manager", async () => {
        const manager = await campaign.methods.manager().call();
        //console.log(manager);
        assert.equal(manager, accounts[0]);
        
    })

    it("allows people to contribute money", async () => {
        // contribute money
        await campaign.methods.contribute().send({
            from : accounts[1],
            value : "200"
        })

        // Look up account[1] in approvers mappings
        // returns true if account[1] is a contributor
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
        
    })

    
    it("require at least 100 wei to enter", async () => {

        try {
            await lottery.methods.enter().send({
                from : accounts[2],
              // test with 0 eth, should fail in this scenario
                val: "90"
            })
            // assert it will fail if value < 0.1 ether
            assert(false);
            // handles error
        } catch (err) {

            assert(err);
            
        }
    })

    it("allows manager to make a payment request", async () => {
       
        await campaign.methods
        .createRequest("Buy Batteries", 1, accounts[1]).send({
            from : accounts[0],
            gas : "1000000"
        });

        // get the request from the requests array
        const request = await campaign.methods.requestsArray(0).call();
        console.log(request);

        assert.equal(request[0], "Buy Batteries");
    })

    it("processes requests", async () => {
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3.utils.toWei("10", "ether"),
        });
    
        await campaign.methods
          .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
          .send({ from: accounts[0], gas: "1000000" });
    
        await campaign.methods.approveRequest(0).send({
          from: accounts[0],
          gas: "1000000",
        });
    
        await campaign.methods.finaliseRequest(0).send({
          from: accounts[0],
          gas: "1000000",
        });
    
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, "ether");
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104);
      });
    
})

