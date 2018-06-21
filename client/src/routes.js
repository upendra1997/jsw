import React from 'react';
import {Route, Switch} from 'react-router-dom';
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
import Profile from './Profile'

const Routes = (props) => {
    return (<Switch>
            <Route exact path='/' render={(prop) => {
                return <Welcome {...prop} user={props.user}/>
            }}/>
            {props.user.kind == undefined ? (
                <Route exact path='/login' render={(prop) => {
                    return <Login {...prop} setUser={props.setUser}/>
                }}/>
            ) : ('')}
            {props.user.kind === undefined ? (
                <Route exact path='/signup' render={(prop) => {
                    return <Signup {...prop} />
                }}/>
            ) : ('')}
            {props.user.kind == 'dealer' || props.user.kind == 'sub-dealer' ? (
                <Route exact path={'/track'} render={(prop) => {
                    return <Track {...prop} user={props.user}/>
                }}/>
            ) : ('')}
            {props.user.kind == 'dealer' || props.user.kind == 'sub-dealer' ? (
                <Route exact path={'/orderform'} render={(prop) => {
                    return <OrdersForm {...prop} user={props.user}/>
                }}/>
            ) : ('')}
            {props.user.kind == 'dealer' || props.user.kind == 'sub-dealer' ? (
                <Route exact path={'/orderlist'} render={(prop) => {
                    return <OrderList {...prop} user={props.user}/>
                }}/>
            ) : ('')}
            {props.user.kind == 'dealer' || props.user.kind == 'admin' ? (
                <Route exact path={'/userrequest'} render={(prop) => {
                    return <UserRequest {...prop} user={props.user}/>
                }}/>
            ) : ('')}
            {props.user.kind !== undefined ? (
                <Route exact path={'/orderhistory'} render={(prop) => {
                    return <OrderHistory {...prop} user={props.user}/>
                }}/>
            ) : ('')}
            {props.user.kind !== undefined ? (
                <Route exact path={'/orderrequest'} render={(prop) => {
                    return <OrderRequest {...prop} user={props.user}/>
                }}/>
            ) : ('')}
            {props.user.kind !== undefined ? (
                <Route exact path={'/logout'} render={(prop) => {
                    return <Logout {...prop} user={props.user} removeUser={props.removeUser}/>
                }}/>
            ) : ('')}
            {props.user.kind !== undefined ? (
                <Route path={'/profile'} render={(prop) => {
                    return <Profile {...prop} user={props.user}/>
                }}/>
            ) : ('')}
            {/*<Route path='*' render={(prop) =>{*/}
            {/*return <Welcome {...prop} user={props.user}/>*/}
            {/*}}/>*/}
    </Switch>
    )
};

export default Routes;