
import Web3 from "web3";

let web3;

// We are in the browser and metamask is running
if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
    // use metamask provider to create web3 instance and
    web3 = new Web3(window.web3.currentProvider);

}else{
    // we are on the server and no metamask
    // create own web3 instance using infura api
    const provider = new Web3.providers.HttpProvider(
        'https://ropsten.infura.io/v3/79c5e7d6a6c14e60a5f71862bd381e10'
    )

    web3 = new Web3(provider);

}
export default web3;