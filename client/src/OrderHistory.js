import React from "react";

class OrderHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            messages: new Set(),
            errors: new Set(),
        };
        let messages = new Set(this.state.messages);
        fetch('/order/history', {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        }).then(response => {
            return response.json();
        }).then(body => {
            const data = body;
            if (body.error) {
                messages.add(body.error);
            }
            else {
                data.map((data, index)=>{
                    const list = this.state.list.slice();
                    list.push(data);
                    this.setState({list: list});
                });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    render() {
        const errors = [];
        this.state.errors.forEach((error)=>{
            errors.push((<div className={"alert alert-danger"}>{error}</div>));
        });

        const messages = [];
        this.state.messages.forEach((error)=>{
            messages.push((<div className={"alert alert-info"}>{error}</div>));
        });
        const that =this;
        const list  = this.state.list.map(function (data) {
            return (
                <div className={"card bg-light"}  style={{display: "inline-block"}} id={data._id} key={data._id}>
                    <div className={"card-header bg-info"}>
                        <label>Order ID: {data._id}</label>
                    </div>
                    <div className={"card-body gap form-control"} align="left">
                        {(data.name)?<label>Contact Name: {data.name}</label>:''}{(data.name)?<br/>:''}
                        {(data.contact)?<label>Contact Number: {data.contact}</label>:''}{(data.contact)?<br/>:''}
                        {(data.address)?<label>Address: {data.address}</label>:''}{(data.address)?<br/>:''}
                        {(data.pincode)?<label>PIN Code: {data.pincode}</label>:''}{(data.pincode)?<br/>:''}
                        {(data.GST)?<label>GST: {data.GST}</label>:''}{(data.GST)?<br/>:''}
                        {(data.materialType)?<label>Material Type: {data.materialType}</label>:''}{(data.materialType)?<br/>:''}
                        {(data.quantity)?<label>Quantity: {data.quantity}</label>:''}{(data.quantity)?<br/>:''}
                        {(data.status)?<label>Status: {data.status}</label>:''}{(data.status)?<br/>:''}
                        <label>Message:</label> {data.message}
                    </div>
                    <div className={"card-footer text-muted"}>
                        {data.date}
                    </div>
                </div>);
        });

        // const list = this.state.list.map(function (data) {
        //     list.push(<li key={data.date}>{data.date} {data.message}</li>);
        // });

        return (
            <div align="center" className={"container-fluid gap"}>
                <div className={"card col-xl-12"}>
                    <div className="card-header"><h2>Order History</h2></div>
                    <div className={"card-body"}>
                        <div className={"card-columns"}>
                            {list}
                        </div>
                    </div>
                </div>
                <div>
                    <div className={"col-md-6 gap"}>
                        {errors}
                    </div>
                    <div className={"col-md-6 gap"}>
                        {messages}
                    </div>
                </div>
            </div>
        );
    }
}

export default OrderHistory;