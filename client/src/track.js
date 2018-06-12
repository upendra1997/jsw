import React from "react";
import OrderList from "./OrderList";

class Track extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            list: [],
            errors: new Set(),
            messages: new Set(),
        };
        let errors = new Set(this.state.errors);
        fetch('/order/track', {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            if (data.error) {
                errors.add(data.error);
            }
            else {
                this.setState({
                    list: data,
                    errors: errors,
                });
            }
        }).catch(e => {
            errors.add(e);
            this.setState({
                errors: errors,
            });
        });
    }

    render() {

        const errors = [];
        this.state.errors.forEach((error)=>{
            errors.push((<li key={error}>{error}</li>));
        });

        const messages = [];
        this.state.messages.forEach((error)=>{
            messages.push((<li key={error}>{error}</li>));
        });
        const that = this;
        const list  = this.state.list.map(function (data) {
            return (<li id={data._id} key={data._id}>
                <div>
                    <label>Order ID: {data._id}</label><br />
                    <label>Contact Name: {data.name}</label><br />
                    <label>Contact Number: {data.contact}</label><br />
                    <label>Address: {data.address}</label><br />
                    <label>PIN Code: {data.pincode}</label><br />
                    {(data.GST)?<label>GST: {data.GST}</label>:''}{(data.GST)?<br/>:''}
                    <label>Material Type: {data.materialType}</label><br />
                    <label>Quantity: {data.quantity}</label><br />
                    <label>Current Location: {data.location}</label><br />
                    <label>Driver Name: {data.driver.name}</label><br />
                    <label>Driver Contact: {data.driver.contact}</label><br />
                </div>
            </li>);
        });

        return (
            <div>
                <h1>Track</h1>
                <ul style={{"listStyleType":"none"}}>
                { list }
                </ul>
                <br />
                <br />
                {errors}
                <br />
                <br />
                {messages}
            </div>
        );
    }
}

export default Track;