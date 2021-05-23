import {React,useState,useEffect} from 'react'
import Home from './Home'
import {Button,Card, Container, FormControl, Form, Col, Row} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link, useHistory } from 'react-router-dom';
import ProductList from "./productlist"
import "./OrderHistory.css"
import axios from 'axios'
import * as ReactBootStrap from 'react-bootstrap'
import sole from "./sole.jpg"
import cart from "./cart.svg"
import guccibelt from "./guccibelt.jpeg"

function Cart(props) {
  const [currentCart, setCurrentCart] = useState({})
  useEffect(() => {
    setCurrentCart(JSON.parse(localStorage.getItem(localStorage.getItem("curUser")))) 
  },[])
  let history = useHistory();

  const [searchname, setSearchName] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => {
      if(category!=""){
          let data = {"category":category}
          history.push({
          pathname: "/home",
          state: data
      })
      return;
      }
  },[category])

  function logoutClick(e){
    localStorage.clear();
    const header = {
      "Content-Type": "application/json"
    };
    axios.get("http://localhost:4000/logout",{header})
    .then(response => {console.log(JSON.stringify(response.data.message))
          if(response.data.message === "Logout Successful!")
            history.push('/');           
    
    });

  }

  function handleClick(e){
    if(searchname!=""){
      let data = {"searchname":searchname}
      history.push({
        pathname: "/home",
        state: data
      })
      return;
    }
  }
  let redirectLink = '';

  useEffect(() => {
    if (localStorage.getItem('localsession') === "1") {
      console.log("inside local storage");
      if (localStorage.getItem('localsession') !== '1') history.push('/');
    } else {
      const header = {
        'Content-Type'                    : 'Application/json',
        'Access-Control-Allow-Credentials': true,
      };
      axios
        .get('http://localhost:4000/check', { header, withCredentials: true })
        .then((response) => {
          console.log(JSON.stringify(response.data.message));
          redirectLink = response.data.redirect;
          if(response.data.message === "Unauthorized Access!"){
              history.push('/');
          }
          
        });


      if(redirectLink!=='')
        history.push(redirectLink)
    }
  }, []);

  function confirmBuy(){
    //BACKEND connection
    setCurrentCart({})
    localStorage.setItem(localStorage.getItem("curUser"),JSON.stringify({}))
    
  }
    return (
        <div>
            <ReactBootStrap.Navbar       collapseOnSelect expand = "lg" bg = "dark" variant = "dark">
      <ReactBootStrap.Navbar.Brand href                    = "/home">
      <img 
        alt          = ""
        src          = {sole}
        width        = "30"
        height       = "30"
        margin-right = "10px"
        className    = "s_image"
      />SoleFactory</ReactBootStrap.Navbar.Brand>
  <ReactBootStrap.Navbar.Toggle   aria-controls = "responsive-navbar-nav" />
  <ReactBootStrap.Navbar.Collapse id            = "responsive-navbar-nav">
  <ReactBootStrap.Nav             className     = "mr-auto">
      
      <ReactBootStrap.NavDropdown 
      title="Categories" 
      id="collasible-nav-dropdown"
      onSelect={(key) => setCategory(key)}>
        <ReactBootStrap.NavDropdown.Item eventKey="All">All</ReactBootStrap.NavDropdown.Item>
        <ReactBootStrap.NavDropdown.Divider />
        <ReactBootStrap.NavDropdown.Item eventKey="Food and Beverages">Food n Beverages</ReactBootStrap.NavDropdown.Item>
        <ReactBootStrap.NavDropdown.Item eventKey="Electronics">Electronics</ReactBootStrap.NavDropdown.Item>
        <ReactBootStrap.NavDropdown.Item eventKey="Body Care">Body Care</ReactBootStrap.NavDropdown.Item>
        <ReactBootStrap.NavDropdown.Item eventKey="Miscellaneous">Miscellaneous</ReactBootStrap.NavDropdown.Item>
      </ReactBootStrap.NavDropdown>
      
      <ReactBootStrap.Nav.Link href = "#features">About Us</ReactBootStrap.Nav.Link>

    </ReactBootStrap.Nav>
    <ReactBootStrap.Nav>
        
      <Form inline div = "search_bar">
      <FormControl
      type        = "text"
      placeholder = "Search"
      className   = "mr-sm-2"
      value       = {searchname}
      onChange    = {e=>setSearchName(e.target.value)} />
      <Button
      variant = "outline-info"
      onClick = {handleClick}>Search</Button>
    </Form>

      <ReactBootStrap.Nav.Link href = "/orderhistory">Orders</ReactBootStrap.Nav.Link>
      <ReactBootStrap.Nav>
        <Button variant = "outline-info" onClick = {logoutClick}>SignOut</Button>
      </ReactBootStrap.Nav>
    </ReactBootStrap.Nav>
  </ReactBootStrap.Navbar.Collapse>
</ReactBootStrap.Navbar>
  <div className="you_orders" >
 <h2 className="your_orders"><strong>Your Orders</strong></h2>
 </div>
 <div className="whole_page">
    <Container >
  {
    Object.keys(currentCart).map((data,key) => {
      if(currentCart[data].quantity==0)
        return;
      return(
        <Row className="row_orders">
          <Col style={{padding: "0px"}}>
            <img className="img_row"
            fluid 
            src={'http://localhost:4000/upload/' + currentCart[data].img_url} alt="" 
            width="150"
            height="120"/>
          </Col>
          <Col style={{padding: "5px"}}><br/>
            <h4><strong>{currentCart[data].title}</strong></h4>
            <p>By {currentCart[data].brand} </p>
            <h5>Quantity: {currentCart[data].quantity}</h5>
          </Col>
          <Col className="row_price">
            <h3><strong>Your total for this item: {currentCart[data].price * currentCart[data].quantity}</strong></h3><br/>
            <button lg color="secondary">Buy it Again</button>
          </Col>
        </Row>
      )
    })
  }
    <Button variant="primary" onClick={confirmBuy}>Buy All</Button>
    </Container>
  </div> 


</div>
        
    )
}

export default Cart;
