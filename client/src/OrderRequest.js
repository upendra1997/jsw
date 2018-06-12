import React from "react";

class OrderRequest extends React.Component {
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

    updateOrder = (id, index)=> {
        return (action) => {
            action.preventDefault();
            const data = this.state.list[index];
            let errors = new Set(this.state.errors);
            let messages = new Set(this.state.messages);
            fetch('/order/' + id, {
                body: JSON.stringify(data),
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            }).then(response => {
                return response.json();
            }).then(body => {
                if (body.error)
                    console.log(body.error);
                if (body.message)
                    alert(body.message)
            }).catch(e => {
                console.log("Please fill details properly.");
            });
        };
    }


    handleStatusChange = (index)=> {
        return (evt)=>{
            let list = this.state.list.slice();
            list[index].status = evt.target.value;
            this.setState({
                list: list
            });
        }
    }

    handleLocationChange = (index)=> {
        return (evt)=>{
            let list = this.state.list.slice();
            list[index].location = evt.target.value;
            this.setState({
                list: list
            });
        }
    }

    handleDriverNameChange = (index)=> {
        return (evt)=>{
            let list = this.state.list.slice();
            list[index].driver.name = evt.target.value;
            this.setState({
                list: list
            });
        }
    }

    handleDriverContactChange = (index)=> {
        return (evt)=>{
            let list = this.state.list.slice();
            list[index].driver.contact = evt.target.value;
            this.setState({
                list: list
            });
        }
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

        const list  = this.state.list.map(function (data, index) {
            if(!data.driver){
                data.driver = {
                    name: '',
                    contact: '',
                }
            }
            if(!data.location){
                data.location = '';
            }
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
                        <hr/>
                        <form onSubmit={(action) => that.handleSubmit(action, data._id)}>
                            <div className={"form-group"} align="left">
                                <label>Status</label>
                                <input type={"text"} className={"form-control"} value={data.status} placeholder={"Status"} name={"status"} onChange={that.handleStatusChange(index)} />
                            </div>
                            <div className={"form-group"} align="left">
                                <label>Location</label>
                                <input type={"text"} className={"form-control"} value={data.location} placeholder={"Location"} name={"location"} onChange={that.handleLocationChange(index)} />
                            </div>
                            <div className={"form-group"} align="left">
                                <label>Driver Name</label>
                                <input type={"text"} className={"form-control"} value={data.driver.name} placeholder={"Driver Name"} name={"driver.name"} onChange={that.handleDriverNameChange(index)} />
                            </div>
                            <div className={"form-group"} align="left">
                                <label>Driver Contact</label>
                                <input type={"text"} className={"form-control"} value={data.driver.contact} placeholder={"Driver Contact"} name={"driver.contact"} onChange={that.handleDriverContactChange(index)} />
                            </div>
                            <input type={"button"} className={"btn btn-success"} onClick={that.updateOrder(data._id, index)} value={"Update"}/>
                        </form>
                    </div>
                </div>);
        });

        return (
            <div align="center" className={"container-fluid gap"}>
                <div className={"card col-xl-12"}>
                    <div className="card-header"><h2>Order Requests</h2></div>
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


export default OrderRequest;