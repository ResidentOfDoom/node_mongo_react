import React, { Component } from 'react';
import axios from 'axios';//remove this and put calls to auth
import { UserContext } from './userContext';


// Create a user provider class and define 
// how the context will be updated and how it will work. 
class UserProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
             username: null,
             token: null,
             isAuthenticated: this.isAuthenticated
        }
    }
    isAuthenticated(){
        return false;
    }
    render() {
        const { children } = this.props;
        return (
            // This provider will wrap the rest of the tree and we pass in all 
            // the user related data and functions in the 
            // state 
            <UserContext.Provider value={this.state}>
                {children}
            </UserContext.Provider>
        );
    }
};

export default UserProvider;