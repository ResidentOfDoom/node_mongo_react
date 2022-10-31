import React from 'react';

class Dashboard extends React.Component {
    constructor(props){
        super(props);
        this.state={
            username: "user1234"
        }
    }
    render(){
        return(
            <div>
                <h1>Warehouse Inc.</h1>
                <h2>Welcome, {this.state.username}</h2>
                
            </div>
        )
    }
};

export default Dashboard;