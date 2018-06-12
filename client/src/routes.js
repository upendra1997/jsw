import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import OrdersForm from "./OrderForm";
import OrderHistory from './OrderHistory';
import OrderList from "./OrderList";
import Welcome from './Welcome';
import Logout from "./Logout";
import Track from "./track";
import OrderRequest from "./OrderRequest";
import UserRequest from "./UserRequest";

const Routes = () => (
    <Switch>
        <Route exact path='/' component={Welcome}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/signup' component={Signup}/>
        <Route exact path={'/track'} component={Track} />
        <Route exact path={'/orderform'} component={OrdersForm}/>
        <Route exact path={'/orderlist'} component={OrderList}/>
        <Route exact path={'/userrequest'} component={UserRequest}/>
        <Route exact path={'/orderhistory'} component={OrderHistory}/>
        <Route exact path={'/orderrequest'} component={OrderRequest}/>
        <Route exact path={'/logout'} component={Logout}/>
        <Route path='*' render={() => <Redirect to='/'/>}/>
    </Switch>
);

export default Routes;