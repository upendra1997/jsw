import React from "react";

class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            errors: new Set(),
            messages: new Set(),
        };
        let errors = new Set(this.state.errors);
        fetch('/order', {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        }).then(response => {
            return response.json();
        }).then(data => {
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

    deleteOrder = (id)=> {
        return (action) => {
            action.preventDefault();
            let errors = new Set(this.state.errors);
            let messages = new Set(this.state.messages);
            document.getElementById(id).remove();
            fetch('/order/' + id, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            }).then(response => {
                return response.json();
            }).then(body => {
                messages.add("Order "+ id+" deleted");
                this.setState({
                    messages: messages,
                });
            }).catch((e) => {
                errors.add(JSON.stringify(e.message));
                this.setState({
                    errors: errors,
                });
            });
        };
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

        const that = this;
        const list  = this.state.list.map(function (data) {
            return (
                <div className={"card bg-light"}  style={{display: "inline-block"}} id={data._id} key={data._id}>
                <div className={"card-header bg-info"}>
                    <label>Order ID: {data._id}</label>
                </div>
                    <div className={"gap form-control"} align="left">
                        <label>Contact Name: {data.name}</label><br />
                        <label>Contact Number: {data.contact}</label><br />
                        <label>Address: {data.address}</label><br />
                        <label>PIN Code: {data.pincode}</label><br />
                        {(data.GST)?<label>GST: {data.GST}</label>:''}{(data.GST)?<br/>:''}
                        <label>Material Type: {data.materialType}</label><br />
                        <label>Quantity: {data.quantity}</label><br />
                    <input type={"button"} className={"btn btn-danger"} onClick={that.deleteOrder(data._id)} value={"Cancel"}/>
                </div>
            </div>);
        });

        return (
            <div align="center" className={"container-fluid gap"}>
                <div className={"card col-xl-12"}>
                    <div className="card-header"><h2>Order List</h2></div>
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


export default OrderList;