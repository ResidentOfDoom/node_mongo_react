import './App.css';
import React from 'react';
import MainPage from './components/mainPage';
import Login from './components/login.js'

class Welcome extends React.Component {
  constructor(props){
      super(props);
      this.state={
          username: "user1234"
      }
  }
  render() {
      return(
          <div>
              <h1>Warehouse Inc.</h1>
              <h2>Welcome, {this.state.username}</h2>
              
          </div>
      )
  }
};

class Management extends React.Component {
  constructor(props) {
      super(props);
      this.state={
          products: [{
              barcode: "0123456789",
              data: {
                  corridor: "01",
                  subcorridor: "01",
                  position: "771",
                  description: "Aromatiki ammos gia gates",
                  quantityInPos: 10,
                  palletsInStock: 2
              }
          },
          {   
              barcode: "1234567890" ,
              data: {
                  corridor: "02" ,
                  subcorridor: "05",
                  position: "551",
                  description: "Mosxofilero",
                  quantityInPos: 20,
                  palletsInStock: 5
              }
          },
          {   barcode: "2345678901", 
              data: {
                  corridor: "03",
                  subcorridor: "03",
                  position: "910",
                  description: "Amita Lemoni",
                  quantityInPos: 12,
                  palletsInStock: 7
              }
          }],
          userInput: ""
      }
      this.find = this.find.bind(this);
      this.changePos = this.changePos.bind(this);
      this.add = this.add.bind(this);
      this.handleChange = this.handleChange.bind(this);
  
  }
  handleChange(event) {
      this.setState({
        userInput: event.target.value
      });
  }
  /*to find thelei ftiaksimo os pros to pio barcode sigkrinei */
  find(){
      if(this.state.userInput === this.state.products.barcode){
          <p>{this.state.products.data}</p>
          } else {
              <p>Barcode not found!</p>
          }
      }
  

  render(){
      
      
      return(
          <div>
              <input
                  type='text'
                  value={this.state.userInput}
                  onChange={this.handleChange}
              />
          </div>
      )
  }
};

function App() {
  return (
    <div>
        <Login />
    </div>
  );
}

export default App;
