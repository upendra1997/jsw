import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import OrdersForm from "./OrderForm";
import OrderHistory from './OrderHistory';
import OrderList from "./OrderList";
import Welcome from './Welcome';
import Logout from "./Logout";

const Routes = () => (
    <Switch>
        <Route exact path='/' component={Welcome}/>
        <Route path='/login' component={Login}/>
        <Route path='/signup' component={Signup}/>
        <Route path={'/orderform'} component={OrdersForm}/>
        <Route path={'/orderhistory'} component={OrderHistory}/>
        <Route path={'/orderlist'} component={OrderList}/>
        <Route path={'/logout'} component={Logout}/>
        <Route path='*' render={() => <Redirect to='/'/>}/>
    </Switch>
);

export default Routes;