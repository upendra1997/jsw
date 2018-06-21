import React, {Component} from 'react';
import './App.css';

import {BrowserRouter, Link} from 'react-router-dom';

import Routes from './routes'

function Navigation(props) {
    console.log(props.kind);
    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <Link to='/'><img className="navbar-brand img-fluid" height={50} width={50} src={'favicon.png'}></img></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent" align="left">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link"><Link to={'/'}>Home</Link></a>
                    </li>
                    {props.kind === undefined ? (
                        <li className="nav-item">
                            <a className="nav-link"><Link to='/signup'>Signup</Link></a>
                        </li>
                    ) : ('')}
                    {props.kind == undefined ? (
                        <li className="nav-item">
                            <a className="nav-link"><Link to='/login'>Login</Link></a>
                        </li>
                    ) : ('')}
                    {props.kind == 'dealer' || props.kind == 'sub-dealer' ? (
                        <li className="nav-item">
                            <a className="nav-link"><Link to='/track'>Track</Link></a>
                        </li>
                    ) : ('')}
                    {props.kind == 'dealer' || props.kind == 'sub-dealer' ? (
                        <li className="nav-item">
                            <a className="nav-link"><Link to='/orderlist'>Order List</Link></a>
                        </li>
                    ) : ('')}
                    {props.kind == 'dealer' || props.kind == 'sub-dealer' ? (
                        <li className="nav-item">
                            <a className="nav-link"><Link to='/orderform'>Order Form</Link></a>
                        </li>
                    ) : ('')}
                    {props.kind == 'dealer' || props.kind == 'admin' ? (
                        <li className="nav-item">
                            <a className="nav-link"><Link to='/orderrequest'>Order Request</Link></a>
                        </li>
                    ) : ('')}
                    {props.kind == 'dealer' || props.kind == 'admin' ? (
                        <li className="nav-item">
                            <a className="nav-link"><Link to='/userRequest'>User Request</Link></a>
                        </li>
                    ) : ('')}
                    {props.kind !== undefined ? (
                        <li className="nav-item">
                            <a className="nav-link"><Link to='/orderhistory'>Order History</Link></a>
                        </li>
                    ) : ('')}
                    {props.kind !== undefined ? (
                        <li className="nav-item">
                            <a className="nav-link"><Link to={"/profile"}>Profile</Link></a>
                        </li>
                    ) : ('')}
                    {props.kind !== undefined ? (
                        <li className="nav-item">
                            <a className="nav-link"><Link to={"/logout"}>Logout</Link></a>
                        </li>
                    ) : ('')}
                </ul>
            </div>
        </nav>

        //
        // <div>
        //     <h1>
        //         JSW Dealer and Sub-Dealer Portal
        //     </h1>
        //     <br/>
        //     <span></span> |
        //     <span></span> |
        //     <span><Link to='/login'>Login</Link></span> |
        //     <span><Link to='/track'>Track</Link></span> |
        //     <span><Link to='/orderlist'>Order List</Link></span> |
        //     <span><Link to='/orderform'>Order Form</Link></span> |
        //     <span><Link to='/orderrequest'>Order Request</Link></span> |
        //     <span><Link to='/orderhistory'>Order History</Link></span> |
        //     <span><Link to='/userRequest'>User Request</Link></span> |
        //     <span></span>
        //     <br/><br/><br/>
        // </div>
    );
}


function Footer(prop) {
    return (<footer className="footer">
        <div className="container">
            <span className="text-muted">Created by Upendra Upadhyay</span>
        </div>
    </footer>);
}


class App extends Component {

    setUser = (user) => {
        this.setState({
            User: user
        });
    };
    removeUser = () => {
        this.setState({
            User: {}
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            User: {},
        };
        fetch('/user', {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            this.setState({
                User: data
            });
        }).catch(e => {
            this.setState({
                errors: "error",
            });
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Navigation kind={this.state.User.kind}/>
                    <Routes user={this.state.User} setUser={this.setUser} removeUser={this.removeUser}/>
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
