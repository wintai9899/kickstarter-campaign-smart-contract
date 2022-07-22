// returns a function so ()() will immediately call the function
const routes  = require('next-routes')();

//route mapping
//route.add('/directory/:wildcard')
//redirects to /campaigns/show when address is clicked


routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show');

module.exports = routes;
