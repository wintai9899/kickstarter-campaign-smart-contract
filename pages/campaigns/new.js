import React, {Component} from 'react';
import Layout from "../../components/Layout";
import {Form, Button, Input, Message} from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import {Router} from "../../routes";

class CampaignNew extends Component {

    state = {
        minimumContribution : "",
        errorMesseage : "",
        errorState: false,
        loading: false
    }

    // handle user input when create campaign
    handleInput = (event) =>{
        this.setState({minimumContribution:event.target.value});
    }

    // submit form and create new campaign through factory

    onSubmit = async (event) =>{
        event.preventDefault();
        // set loading to true
        this.setState({loading:true, errorState:false});
        try {
            const accounts = await web3.eth.getAccounts();
            // create campaign
            await factory.methods.createCampaign(this.state.minimumContribution).send({
                from:accounts[0]
            })

            // Redirect user to index page 
            Router.pushRoute("/");
        } catch (error) {
            this.setState({errorState: true})
            this.setState({errorMesseage: error.message});
        }
        // set loading to false
        this.setState({loading:false});
    }

    render(){
        return(
            <Layout>
            <h1>Create a Campaign!</h1>
            <Form onSubmit={this.onSubmit} error={this.state.errorState}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input label="wei" labelPosition='right' value={this.state.minimumContribution} onChange={this.handleInput}/>
                </Form.Field>
                <Message error header="Oops" content={this.state.errorMesseage}></Message>
                <Button type='submit' primary loading={this.state.loading}>Create!</Button>
            </Form>
            </Layout>
        )
    }
}

export default CampaignNew;
