import React from 'react';

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: ""
        }

    }
    render(){
      return(
        <div>        
            <form action="./users.js">
                <label for="username">Username:</label>
                <input
                  name="username"
                  type="text"
                  value={this.state.username}
                />
                <br/>
                <label for="password">Password:</label>
                <input
                  name="password"
                  type="password"
                  value={this.state.password}
                />
                <br/>
                <input
                  name="submit"
                  type="button"
                  value="submit" 
                />

            </form>
        
        </div>
        )
    }
};

export default Login;