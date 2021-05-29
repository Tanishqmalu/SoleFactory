import { React, useState, useEffect } from "react";
import Home from "./Home";
import Portal from "./Portal";
import {
  Button,
  Card,
  Container,
  FormControl,
  Form,
  Col,
  Row,
  ToggleButton,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useHistory } from "react-router-dom";
import ProductList from "./productlist";
import "./cart.css";
import axios from "axios";
import * as ReactBootStrap from "react-bootstrap";
import sole from "./sole.jpg";
import cart from "./cart.svg";
import coin from "./coin.png";
import "./Home.css";
import guccibelt from "./guccibelt.jpeg";
import { FaCartPlus, FaCoins } from "react-icons/fa";
import Badges from "./badge.js";
import EmptyImg from "./Credit Card Payment-cuate.png";
import Footer from "./footer";
function Cart(props) {
  const [currentCart, setCurrentCart] = useState({});
  const [message, setMessage] = useState(null);
  const [searchname, setSearchName] = useState("");
  const [category, setCategory] = useState("");

  const [ngo, setngo] = useState("false");
  const [coins, setcoins] = useState(null);

  const [popup, setPopUp] = useState(0);
  const [payWithCoin, setPayWithCoin] = useState(0);
  let totalAmount = 0;
  let numberOfCoins = 0;

  let history = useHistory();

  useEffect(() => {
    setCurrentCart(
      JSON.parse(localStorage.getItem(localStorage.getItem("curUser")))
    );
  }, []);

  useEffect(() => {
    if (localStorage.getItem("localsession") === "1") {
      //console.log("inside local storage");
      if (localStorage.getItem("localsession") !== "1") history.push("/");

      const header = {
        "Content-Type": "Application/json",
        "Access-Control-Allow-Credentials": true,
      };
      let x = localStorage.getItem("username");
      //console.log(x);
      axios
        .get("http://localhost:4000/getuser", {
          params: { usrname: x },
          header,
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.retuser) {
            // console.log(JSON.stringify(response.data.retuser));
            // console.log(JSON.stringify(response.data.retuser.Type));
            // console.log(JSON.stringify(response.data.retuser.CoinAmt));
            if (response.data.retuser && response.data.retuser.Type === "1") {
              setngo("true");
              //console.log("hello");
              var y = response.data.retuser.CoinAmt;
              //console.log(parseInt(y));
              setcoins(response.data.retuser.CoinAmt);
            }
          }
        });
    }
  }, []);

  useEffect(() => {
    if (category != "") {
      let data = { category: category };
      history.push({
        pathname: "/home",
        state: data,
      });
      return;
    }
  }, [category]);

  function logoutClick(e) {
    localStorage.clear();
    const header = {
      "Content-Type": "application/json",
    };
    axios.get("http://localhost:4000/logout", { header }).then((response) => {
      console.log(JSON.stringify(response.data.message));
      if (response.data.message === "Logout Successful!") history.push("/");
    });
  }

  function removeItem(id) {
    var currentlocal = JSON.parse(
      localStorage.getItem(localStorage.getItem("curUser"))
    );
    delete currentlocal[id];
    localStorage.setItem(
      localStorage.getItem("curUser"),
      JSON.stringify(currentlocal)
    );
    window.location.reload(true);
  }

  function handleClick(e) {
    if (searchname != "") {
      let data = { searchname: searchname };

      let query = null;
      if (searchname != "") query = "?searchname=" + searchname;

      //console.log("cart" + data);

      history.push({
        pathname: "/home",
        state: data,
      });
    }
  }
  let redirectLink = "";

  useEffect(() => {
    if (localStorage.getItem("localsession") === "1") {
      //console.log("inside local storage");
      if (localStorage.getItem("localsession") !== "1") history.push("/");
    } else {
      const header = {
        "Content-Type": "Application/json",
        "Access-Control-Allow-Credentials": true,
      };
      axios
        .get("http://localhost:4000/check", { header, withCredentials: true })
        .then((response) => {
          //console.log(JSON.stringify(response.data.message));
          redirectLink = response.data.redirect;
          if (response.data.message === "Unauthorized Access!") {
            history.push("/");
          }
        });

      if (redirectLink !== "") history.push(redirectLink);
    }
  }, []);

  function confirmBuy() {
    //BACKEND connection
    let inventory = JSON.parse(
      localStorage.getItem(localStorage.getItem("curUser"))
    );
    for (let keys in inventory) {
      if (inventory[keys].nearexpiry)
        inventory[keys].price = inventory[keys].discount;
      inventory[keys].quantity = String(inventory[keys].quantity);
    }
    inventory = JSON.stringify(inventory);

    let requestoptions = {
      inventory: inventory,
      userordered: localStorage.getItem("curUser"),
      coinsUsed: payWithCoin ? numberOfCoins : 0,
    };

    const header = {
      "Content-Type": "application/json",
    };
    axios
      .post("http://localhost:4000/order", requestoptions, { header })
      .then((response) => {
        setMessage(response.data.message);
      });
    setCurrentCart({});
    localStorage.setItem(localStorage.getItem("curUser"), JSON.stringify({}));
    window.location.reload(true);
  }
  var nameofuser = localStorage.getItem("curUser");
  if (!nameofuser) nameofuser = "hi";
  if (ngo === "false") {
    return (
      <div style={{ overflowX: "hidden" }}>
        <ReactBootStrap.Navbar
          collapseOnSelect
          expand="lg"
          bg="dark"
          variant="dark"
        >
          <ReactBootStrap.Navbar.Brand href="/home">
            <img
              alt=""
              src={sole}
              width="30"
              height="30"
              margin-right="10px"
              className="s_image"
            />
            SoleFactory
          </ReactBootStrap.Navbar.Brand>
          <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav">
            <ReactBootStrap.Nav className="mr-auto">
              <ReactBootStrap.NavDropdown
                title="Categories"
                id="collasible-nav-dropdown"
                onSelect={(key) => setCategory(key)}
              >
                <ReactBootStrap.NavDropdown.Item eventKey="All">
                  All
                </ReactBootStrap.NavDropdown.Item>
                <ReactBootStrap.NavDropdown.Divider />
                <ReactBootStrap.NavDropdown.Item eventKey="Food and Beverages">
                  Food n Beverages
                </ReactBootStrap.NavDropdown.Item>
                <ReactBootStrap.NavDropdown.Item eventKey="Electronics">
                  Electronics
                </ReactBootStrap.NavDropdown.Item>
                <ReactBootStrap.NavDropdown.Item eventKey="Body Care">
                  Body Care
                </ReactBootStrap.NavDropdown.Item>
                <ReactBootStrap.NavDropdown.Item eventKey="Miscellaneous">
                  Miscellaneous
                </ReactBootStrap.NavDropdown.Item>
              </ReactBootStrap.NavDropdown>

              <ReactBootStrap.Nav.Link href="http://localhost:3000/nearexpiry">
                Near Expiry Products
              </ReactBootStrap.Nav.Link>
              <ReactBootStrap.Nav.Link href="/bestseller">
                BestSellers
              </ReactBootStrap.Nav.Link>
            </ReactBootStrap.Nav>
            <ReactBootStrap.Nav>
              <Form inline div="search_bar">
                <FormControl
                  type="text"
                  placeholder="Search"
                  className="mr-sm-2"
                  value={searchname}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <Button variant="outline-info" onClick={handleClick}>
                  Search
                </Button>
              </Form>

              <ReactBootStrap.Nav.Link href="/orderhistory">
                Orders
              </ReactBootStrap.Nav.Link>

              <ReactBootStrap.NavDropdown
                title={nameofuser}
                id="collasible-nav-dropdown"
              >
                <ReactBootStrap.NavDropdown.Item href="/profile">
                  My Profile
                </ReactBootStrap.NavDropdown.Item>
                <ReactBootStrap.NavDropdown.Divider />
                <ReactBootStrap.NavDropdown.Item onClick={logoutClick}>
                  Signout
                </ReactBootStrap.NavDropdown.Item>
              </ReactBootStrap.NavDropdown>
              <ReactBootStrap.Nav.Link href="/cart">
                <Badges />
              </ReactBootStrap.Nav.Link>
            </ReactBootStrap.Nav>
          </ReactBootStrap.Navbar.Collapse>
        </ReactBootStrap.Navbar>
        <div style={{ height: "100%", width: "100%" }}>
          <Container fluid>
            <Row fluid>
              <Col>
                <div class="freeDel-div">
                  <h5 style={{ color: "gold", textAlign: "center" }}>
                    GET ASSURED FREE DELIVERY ON EVERY PURCHASE
                  </h5>
                  <h6 style={{ textAlign: "center" }}>
                    With your every purchase SoleFactory gives certain profit to
                    NGO ( SAMARPAN )
                  </h6>
                </div>
                <br />
                <h3
                  style={{
                    backgroundColor: "gray",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <b>YOUR CART</b>
                </h3>
                {Object.keys(currentCart).length == 0 ? (
                  <div>
                    <img
                      src={EmptyImg}
                      style={{ height: "350px", marginLeft: "30%" }}
                    />{" "}
                    <h4 style={{ textAlign: "center", color: "red" }}>
                      <b>Your Cart Is Empty</b>
                    </h4>
                  </div>
                ) : (
                  Object.keys(currentCart).map((data, key) => {
                    if (currentCart[data].quantity == 0) {
                      return <h3>Your Cart Is Empty</h3>;
                    }
                    totalAmount +=
                      (currentCart[data].nearexpiry
                        ? currentCart[data].discount
                        : currentCart[data].price) * currentCart[data].quantity;
                    numberOfCoins = Math.min(
                      Math.ceil(totalAmount / 100),
                      localStorage.getItem("coins")
                    );
                    return (
                      <Card class="cart-card">
                        <Card.Body class="cart-body">
                          <div class="inside-cart">
                            <div
                              style={{
                                height: "100%",
                                width: "30%",
                                float: "left",
                              }}
                            >
                              <img
                                src={
                                  "http://localhost:4000/upload/" +
                                  currentCart[data].img_url
                                }
                                style={{ height: "100%", width: "100%" }}
                              />
                            </div>
                            <div
                              style={{
                                height: "100%",
                                width: "70%",
                                float: "right",
                              }}
                            >
                              <Card.Title
                                style={{ height: "50px", overflow: "hidden" }}
                              >
                                {currentCart[data].title}
                              </Card.Title>
                              <Card.Subtitle className="mb-2 text-muted">
                                By {currentCart[data].brand}
                              </Card.Subtitle>
                              <Card.Text>
                                <h5>Quantity: {currentCart[data].quantity}</h5>
                                <div style={{ display: "inline-block" }}>
                                  <Button
                                    style={{
                                      backgroundColor: "red",
                                      border: "0px",
                                    }}
                                    onClick={() =>
                                      removeItem(currentCart[data].prod_id)
                                    }
                                  >
                                    remove
                                  </Button>
                                </div>
                              </Card.Text>
                              <div>
                                
                                <h3>
                                  <strong>
                                    Checkout Price: ₹
                                    {(currentCart[data].nearexpiry
                                      ? currentCart[data].discount
                                      : currentCart[data].price) *
                                      currentCart[data].quantity}
                                  </strong>
                                </h3>
                                <br />
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    );
                  })
                )}
              </Col>

              <Col>
                <Container id="summary-container">
                  <Row>
                    <Col>
                      <h4 style={{ color: "white" }}>SUMMARY</h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p style={{ color: "white" }}>
                        DO YOU HAVE A PROMO CODE?
                      </p>
                    </Col>
                  </Row>
                  <Row fluid>
                    <Col fluid>
                      <div
                        style={{
                          display: "inline-block",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <h6 style={{ color: "white", float: "left" }}>
                          SUBTOTAL
                        </h6>
                        <p style={{ color: "white", float: "right" }}>
                          ₹{totalAmount}
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <Row fluid>
                    <Col fluid>
                      <div
                        style={{
                          display: "inline-block",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <h6 style={{ color: "white", float: "left" }}>
                          ESTIMATED SHIPPING CHARGES
                        </h6>
                        <p style={{ color: "white", float: "right" }}>₹0</p>
                      </div>
                    </Col>
                  </Row>
                  <Row fluid>
                    <Col fluid>
                      <div
                        style={{
                          display: "inline-block",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <h6 style={{ color: "white", float: "left" }}>TOTAL</h6>
                        <p style={{ color: "white", float: "right" }}>
                          ₹{totalAmount}
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <Row fluid>
                    <Col fluid>
                      <Button
                        style={{
                          backgroundColor: "#F28C28",
                          border: "0px",
                          width: "90%",
                          borderRadius: "0px 0px 0px 0px",
                          marginLeft: "5%",
                        }}
                        onClick={() => setPopUp(1)}
                        disabled={totalAmount < 10000}
                      >
                        {" "}
                        CHECKOUT
                      </Button>
                    </Col>
                  </Row>
                  <Row fluid>
                    <Col fluid>
                      <p
                        style={{
                          color: "white",
                          marginLeft: "50%",
                          marginTop: "10px",
                        }}
                      >
                        OR
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        style={{
                          backgroundColor: "white",
                          border: "0px",
                          width: "90%",
                          borderRadius: "0px 0px 0px 0px",
                          marginLeft: "5%",
                        }}
                        onClick={() => setPopUp(1)}
                        disabled={totalAmount < 10000}
                      >
                        {" "}
                        <span style={{ color: "black" }}>PAY WITH UPI</span>
                      </Button>
                      <h3 style={{ color: "green", marginLeft: "30%" }}>
                        {message}
                      </h3>
                      {popup ? (
                        <Portal>
                          <h1>Your total is: {totalAmount}</h1>
                          {payWithCoin ? (
                            <div>
                              <ToggleButton
                                type="checkbox"
                                checked={payWithCoin}
                                onChange={() => setPayWithCoin(!payWithCoin)}
                              >
                                Pay with coins
                              </ToggleButton>
                              <h1>
                                You need to pay: {numberOfCoins}Coins and{" "}
                                {Math.max(totalAmount - numberOfCoins * 10, 0)}
                                Rupees
                              </h1>
                            </div>
                          ) : (
                            <div>
                              {localStorage.getItem("ngo") ? (
                                <ToggleButton
                                  type="checkbox"
                                  checked={payWithCoin}
                                  onChange={() => setPayWithCoin(!payWithCoin)}
                                >
                                  Pay with coins
                                </ToggleButton>
                              ) : null}
                              <h1>You need to pay: {totalAmount}Rupees</h1>
                            </div>
                          )}
                          <Button
                            onClick={() => {
                              setPopUp(0);
                              confirmBuy();
                            }}
                          >
                            Pay
                          </Button>
                          <Button onClick={() => setPopUp(0)}>Cancel</Button>
                        </Portal>
                      ) : null}
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {console.log(popup)}
        <ReactBootStrap.Navbar
          collapseOnSelect
          expand="lg"
          bg="dark"
          variant="dark"
        >
          <ReactBootStrap.Navbar.Brand href="/home">
            <img
              alt=""
              src={sole}
              width="30"
              height="30"
              margin-right="10px"
              className="s_image"
            />
            SoleFactory
          </ReactBootStrap.Navbar.Brand>
          <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav">
            <ReactBootStrap.Nav className="mr-auto">
              <ReactBootStrap.NavDropdown
                title="Categories"
                id="collasible-nav-dropdown"
                onSelect={(key) => setCategory(key)}
              >
                <ReactBootStrap.NavDropdown.Item eventKey="All">
                  All
                </ReactBootStrap.NavDropdown.Item>
                <ReactBootStrap.NavDropdown.Divider />
                <ReactBootStrap.NavDropdown.Item eventKey="Food and Beverages">
                  Food n Beverages
                </ReactBootStrap.NavDropdown.Item>
                <ReactBootStrap.NavDropdown.Item eventKey="Electronics">
                  Electronics
                </ReactBootStrap.NavDropdown.Item>
                <ReactBootStrap.NavDropdown.Item eventKey="Body Care">
                  Body Care
                </ReactBootStrap.NavDropdown.Item>
                <ReactBootStrap.NavDropdown.Item eventKey="Miscellaneous">
                  Miscellaneous
                </ReactBootStrap.NavDropdown.Item>
              </ReactBootStrap.NavDropdown>

              <ReactBootStrap.Nav.Link href="http://localhost:3000/nearexpiry">
                Near Expiry Products
              </ReactBootStrap.Nav.Link>
              <ReactBootStrap.Nav.Link href="/bestseller">
                BestSellers
              </ReactBootStrap.Nav.Link>
            </ReactBootStrap.Nav>
            <ReactBootStrap.Nav>
              <Form inline div="search_bar">
                <FormControl
                  type="text"
                  placeholder="Search"
                  className="mr-sm-2"
                  value={searchname}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <Button variant="outline-info" onClick={handleClick}>
                  Search
                </Button>
              </Form>

              <div className="coin_display">
                <FaCoins style={{ marginRight: "3px" }} />

                {coins}
              </div>

              <ReactBootStrap.Nav.Link href="/orderhistory">
                Orders
              </ReactBootStrap.Nav.Link>

              {/* <ReactBootStrap.Nav>
        <Button variant = "outline-info" onClick = {logoutClick}>SignOut</Button>
      </ReactBootStrap.Nav> */}

              <ReactBootStrap.NavDropdown
                title={nameofuser}
                id="collasible-nav-dropdown"
              >
                <ReactBootStrap.NavDropdown.Item href="/profile">
                  My Profile
                </ReactBootStrap.NavDropdown.Item>
                <ReactBootStrap.NavDropdown.Divider />
                <ReactBootStrap.NavDropdown.Item
                  onClick={logoutClick}
                  eventKey="Signout"
                >
                  Signout
                </ReactBootStrap.NavDropdown.Item>
              </ReactBootStrap.NavDropdown>
              <ReactBootStrap.Nav.Link href="/cart">
                <Badges />
              </ReactBootStrap.Nav.Link>
            </ReactBootStrap.Nav>
          </ReactBootStrap.Navbar.Collapse>
        </ReactBootStrap.Navbar>
        <div style={{ height: "100%", width: "100%" }}>
          <Container fluid>
            <Row fluid>
              <Col>
                <div class="freeDel-div">
                  <h5 style={{ color: "black", textAlign: "center" }}>
                    GET ASSURED FREE DELIVERY ON EVERY PURCHASE
                  </h5>
                  <h6 style={{ color: "black", textAlign: "center" }}>
                    <b>
                      With your every purchase SoleFactory gives certain profit
                      to NGO ( SAMARPAN )
                    </b>
                  </h6>
                </div>
                <br />
                <h3
                  style={{
                    backgroundColor: "grey",
                    color: "black",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <b>YOUR CART</b>
                </h3>
                {Object.keys(currentCart).length == 0 ? (
                  <div>
                    <img
                      src={EmptyImg}
                      style={{ height: "350px", marginLeft: "30%" }}
                    />{" "}
                    <h4 style={{ textAlign: "center", color: "red" }}>
                      <b>Your Cart Is Empty</b>
                    </h4>
                  </div>
                ) : (
                  Object.keys(currentCart).map((data, key) => {
                    if (currentCart[data].quantity == 0) {
                      return;
                    }
                    totalAmount +=
                      (currentCart[data].nearexpiry
                        ? currentCart[data].discount
                        : currentCart[data].price) * currentCart[data].quantity;
                    numberOfCoins = Math.min(
                      Math.ceil(totalAmount / 100),
                      localStorage.getItem("coins")
                    );
                    return (
                      <Card class="cart-card">
                        <Card.Body class="cart-body">
                          <div class="inside-cart">
                            <div
                              style={{
                                height: "100%",
                                width: "30%",
                                float: "left",
                              }}
                            >
                              <img
                                src={
                                  "http://localhost:4000/upload/" +
                                  currentCart[data].img_url
                                }
                                style={{ height: "100%", width: "100%" }}
                              />
                            </div>
                            <div
                              style={{
                                height: "100%",
                                width: "70%",
                                float: "right",
                              }}
                            >
                              <Card.Title
                                style={{ height: "50px", overflow: "hidden" }}
                              >
                                {currentCart[data].title}
                              </Card.Title>
                              <Card.Subtitle className="mb-2 text-muted">
                                By {currentCart[data].brand}
                              </Card.Subtitle>
                              <Card.Text>
                                <h5>Quantity: {currentCart[data].quantity}</h5>
                                <div style={{ display: "inline-block" }}>
                                  <Button
                                    style={{
                                      backgroundColor: "red",
                                      border: "0px",
                                    }}
                                    onClick={() =>
                                      removeItem(currentCart[data].prod_id)
                                    }
                                  >
                                    remove
                                  </Button>
                                </div>
                              </Card.Text>
                              <div>

                                <h3>
                                  <strong>
                                    Checkout Price: ₹
                                    {(currentCart[data].nearexpiry
                                      ? currentCart[data].discount
                                      : currentCart[data].price) *
                                      currentCart[data].quantity}
                                  </strong>
                                </h3>
                                <br />
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    );
                  })
                )}
              </Col>

              <Col>
                <Container id="summary-container">
                  <Row>
                    <Col>
                      <h4 style={{ color: "white" }}>SUMMARY</h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p style={{ color: "white" }}>
                        DO YOU HAVE A PROMO CODE?
                      </p>
                    </Col>
                  </Row>
                  <Row fluid>
                    <Col fluid>
                      <div
                        style={{
                          display: "inline-block",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <h6 style={{ color: "white", float: "left" }}>
                          SUBTOTAL
                        </h6>
                        <p style={{ color: "white", float: "right" }}>
                          ₹{totalAmount}
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <Row fluid>
                    <Col fluid>
                      <div
                        style={{
                          display: "inline-block",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <h6 style={{ color: "white", float: "left" }}>
                          ESTIMATED SHIPPING CHARGES
                        </h6>
                        <p style={{ color: "white", float: "right" }}>₹0</p>
                      </div>
                    </Col>
                  </Row>
                  <Row fluid>
                    <Col fluid>
                      <div
                        style={{
                          display: "inline-block",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <h6 style={{ color: "white", float: "left" }}>TOTAL</h6>
                        <p style={{ color: "white", float: "right" }}>
                          ₹{totalAmount}
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <Row fluid>
                    <Col fluid>
                      <Button
                        style={{
                          backgroundColor: "#F28C28",
                          border: "0px",
                          width: "90%",
                          borderRadius: "0px 0px 0px 0px",
                          marginLeft: "5%",
                        }}
                        onClick={() => setPopUp(1)}
                        disabled={totalAmount <= 0}
                      >
                        {" "}
                        CHECKOUT
                      </Button>
                    </Col>
                  </Row>
                  <Row fluid>
                    <Col fluid>
                      SINCE LOCKDOWN, I HAVE BEEN BUYING FROM MY HOME, BUSINESS
                      HAS BECAME SO EASY MY FRIEND
                      <p
                        style={{
                          color: "white",
                          marginLeft: "50%",
                          marginTop: "10px",
                        }}
                      >
                        OR
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        style={{
                          backgroundColor: "white",
                          border: "0px",
                          width: "90%",
                          borderRadius: "0px 0px 0px 0px",
                          marginLeft: "5%",
                        }}
                        onClick={() => setPopUp(1)}
                        disabled={totalAmount <= 0}
                      >
                        {" "}
                        <span style={{ color: "black" }}>PAY WITH UPI</span>
                      </Button>
                      <h3 style={{ color: "green", marginLeft: "30%" }}>
                        {message}
                      </h3>
                      {popup ? (
                        <Portal>
                          <h1>Your total is: {totalAmount}</h1>
                          {payWithCoin ? (
                            <div>
                              <ToggleButton
                                type="checkbox"
                                checked={payWithCoin}
                                onChange={() => setPayWithCoin(!payWithCoin)}
                              >
                                Pay with coins
                              </ToggleButton>
                              <h1>
                                You need to pay: {numberOfCoins}Coins and{" "}
                                {Math.max(totalAmount - numberOfCoins * 100, 0)}
                                Rupees
                              </h1>
                            </div>
                          ) : (
                            <div>
                              {localStorage.getItem("ngo") ? (
                                <ToggleButton
                                  type="checkbox"
                                  checked={payWithCoin}
                                  onChange={() => setPayWithCoin(!payWithCoin)}
                                >
                                  Pay with coins
                                </ToggleButton>
                              ) : null}
                              <h1>You need to pay: {totalAmount}Rupees</h1>
                            </div>
                          )}
                          <Button
                            onClick={() => {
                              setPopUp(0);
                              confirmBuy();
                            }}
                          >
                            Pay
                          </Button>
                          <Button onClick={() => setPopUp(0)}>Cancel</Button>
                        </Portal>
                      ) : null}
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default Cart;
