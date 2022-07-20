// Creates an instance of the factory contract for
import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

//web3.eth.Contract(interface, address)
const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface),"0x816D88168C0b1b17baE481DC4bd8aB2c353fba4D" );

export default instance;
