import {React, useState} from 'react'
import './Login.css';
import {Button, Container, Form, Col, Row, Image, InputGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import GoogleButton from 'react-google-button'
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios'
import loginimage from './blackwave.png'
import { useEffect } from 'react';
import { FaGoogle ,FaKey, FaUserAlt} from "react-icons/fa";
import mainimg from'./wbgbike.png'


function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [resmsg, setResMsg] = useState(null);
  let   history                 = useHistory();
  let   redirectLink            = '';

   useEffect(() => {
    if (localStorage.getItem('localsession') === "1") {
      if (localStorage.getItem('localsession') === '1') history.push('/home');
    } else {
      const header = {
        'Content-Type'                    : 'Application/json',
        'Access-Control-Allow-Credentials': true,
      };
      axios
        .get('http://localhost:4000/check', { header, withCredentials: true })
        .then((response) => {
          redirectLink = response.data.redirect;
          if(response.data.message === "Authorized Access!"){
              history.push('/home');
          }

        });


      if(redirectLink!=='')
        history.push(redirectLink)
    }
  }, []);

  function handleClick(e) {


    e.preventDefault();
    var userInput = {
      username: userName,
      password: password,
    };

    const header = {
      'Content-Type': 'application/json',
    };
    axios
      .post('http://localhost:4000/auth/signin', userInput, { header })
      .then((response) => {
    
        setResMsg(response.data.message);
        redirectLink = response.data.redirect;
        if(response.data.user){
        localStorage.setItem('username', response.data.user.username);
        }

        
        if (response.data.successcode === '1'){
          localStorage.setItem('localsession', '1');
        

          let userCart = localStorage.getItem(response.data.user.username)
          if(userCart===null)
            localStorage.setItem(response.data.user.username,JSON.stringify({}));

          localStorage.setItem("curUser",response.data.user.username);
        }
        if(redirectLink==='')
         console.log(redirectLink);
        if (redirectLink !== '') history.push(redirectLink);
      });
  }

  function googlesignin() {
    window.open('http://localhost:4000/auth/google','_self');
  }

  return (

    <div class="logindiv">
    <img class="ani-bike" src={mainimg} style={{position: "absolute",height:"80px",opacity:"0",top:"55%",zIndex:"100"}}/>
    <Container sm={1} fluid id="overall-container">

        <Row fluid id="row">
          <Col>

            <div id="left-container">
            <div style={{fontSize:"5vw",color:"white",position:"relative"}} id="solefactory">SoleFactory</div>
            <br/>

            <h6 style={{color:"white"}}>One Stop Solution</h6>
            <Link   to        = {'./signup'}>
            <Button id="lorem-button" >SignUp</Button>
            </Link>

            </div>

          </Col>
          <Col>
        <Container fluid>
         <Row className = "justify-content-center" style = {{paddingTop: "5%"}}>
         <Col className= "justify-content-center">


             <p style={{fontSize:"3vw",marginLeft:"40%"}}>Signin</p>

             {/* Form */}
             <Form class="main-form">
               <Form.Group className = "form-elem">
                <InputGroup id="inputgrp">
                <FaUserAlt style={{marginLeft:"20px" ,marginTop:"8px"}}/>
                 <Form.Control
                 id="username"
                type        = "text"
                placeholder = "Username"
                value       = {userName}
                onChange    = {e=>setUserName(e.target.value)}
                ></Form.Control>
                </InputGroup>
              </Form.Group>
              <Form.Group className = "form-elem">
                <InputGroup id="inputgrp">
                <FaKey style={{marginLeft:"20px" ,marginTop:"7px"}}/>
                <Form.Control
                id="username"
                type        = "password"
                placeholder = "Enter Password"
                value       = {password}
                onChange    = {e=>setPassword(e.target.value)}
                ></Form.Control>
                </InputGroup>
              </Form.Group>
              <Form.Group className = "form-elem">
                <Button
                id="button"
                type      = "submit"
                className = "full-button"
                onClick   = {handleClick}
                >Login</Button>
                <Container style={{textAlign:"center",marginTop:"20px"}}><h6 style={{color:"red"}}>{resmsg}</h6></Container>

              </Form.Group>
              <Form.Group className = "form-elem">
              <Container fluid>
              <Row>

                 <Col >
                 <Button id="button" onClick={googlesignin}><FaGoogle/> Signin With Google</Button>

                 </Col>

              </Row>


              </Container>




              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>


          </Col>
        </Row>

    </Container>

    </div>
  )
}

export default Login;
