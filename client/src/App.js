import React, {Component} from 'react';
import './App.css';

import {BrowserRouter, Link} from 'react-router-dom';

import Routes from './routes'

function Navigation(prop) {
    return (
        <div>
            <h1>
                JSW Dealer and Sub-Dealer Portal
            </h1>
            <br/>
            <span><Link to='/'>Home</Link></span> |
            <span><Link to='/signup'>Signup</Link></span> |
            <span><Link to='/login'>Login</Link></span> |
            <span><Link to='/orderform'>Order Form</Link></span> |
            <span><Link to='/orderlist'>Order List</Link></span> |
            <span><Link to='/orderhistory'>Order History</Link></span> |
            <span><Link to={"/logout"}>Logout</Link></span>
            <br/><br/><br/>
        </div>
    );
}


function Footer(prop) {
    return (<div className={"footer"}>
        Created by Upendra Upadhyay
    </div>);
}


class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Navigation/>
                    <Routes/>
                    <Footer/>
                    {/*<header className="App-header">*/}
                    {/*<img src={logo} className="App-logo" alt="logo" />*/}
                    {/*<h1 className="App-title">Welcome to React</h1>*/}
                    {/*</header>*/}
                    {/*<p className="App-intro">*/}
                    {/*To get started, edit <code>src/App.js</code> and save to reload.*/}
                    {/*</p>*/}
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
