import React, {Component} from 'react';
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import {Card, Grid} from "semantic-ui-react";
import ContributeForm from "../../components/ContributeForm";
import web3 from "../../ethereum/web3";

class CampaignShow extends Component {

    
    // NOTE: this props here is different
    // this props depends on the routing, token from the URL
    static async getInitialProps(props){
        // actual address of the campaign instance;
        const campaignAddress = props.query.address;
        const campaign = Campaign(campaignAddress);

        const summary = await campaign.methods.getSummary().call();
        //console.log(summary);
        return {
                minimumContribution: summary[0],
                campaignBalance : summary[1],
                pendingRequests : summary[2],
                contributorCount : summary[3],
                managerAddress : summary[4],
                campaignAddress : campaignAddress
            }
    }
    // Display Campaign statistics in card groups
    renderCards(){
        const items = [
            // manager card
            {
                header : this.props.managerAddress,
                meta : "Manager Address",
                description : "This manager created this campaign",
                style : { overflowWrap : 'break-word'}

            },
            // Campaign Balance
            {
                header : web3.utils.fromWei(this.props.campaignBalance, "ether"),
                meta : "ETH",
                description : "Campaign Balance",
                style : { overflowWrap : 'break-word'}
            },
            //Approver count
            {
                header : this.props.contributorCount,
                meta : "Approvers Count",
                description : "Number of contributors who have already donated to this campaign",
                style : { overflowWrap : 'break-word'}
            },
            // Minumum count
            {
                header : this.props.minimumContribution,
                meta : "Minimnum Contribution (wei)",
                description : "This is the minimum contribution to enter the campaign",
                style : { overflowWrap : 'break-word'}
            },
            {
                header : this.props.pendingRequests,
                meta : "Pending Requests",
                description : "A request tries to withdraw money from the contract, must be approved by more than 50% of contributors to proceed",
                style : { overflowWrap : 'break-word'}
            }
        ]

        return <Card.Group items={items} />
    }


    render() {
        return(
        <Layout>
        <h3>Campaign Show</h3>
        <Grid>
            <Grid.Column width={10}>
                {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={6}>
            {/* adds address property to the form */}
                <ContributeForm address={this.props.campaignAddress}/>
            </Grid.Column>
        </Grid>
        </Layout>
        )
    }
}

export default CampaignShow;
