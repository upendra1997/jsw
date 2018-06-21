import React from "react";

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
        // const list  = this.state.list.map(function (data) {
        //     return (<li id={data._id} key={data._id}>
        //         <div>
        //             <label>Order ID: {data._id}</label><br />
        //             <label>Contact Name: {data.name}</label><br />
        //             <label>Contact Number: {data.contact}</label><br />
        //             <label>Address: {data.address}</label><br />
        //             <label>PIN Code: {data.pincode}</label><br />
        //             {(data.GST)?<label>GST: {data.GST}</label>:''}{(data.GST)?<br/>:''}
        //             <label>Material Type: {data.materialType}</label><br />
        //             <label>Quantity: {data.quantity}</label><br />
        //             <label>Current Location: {data.location}</label><br />
        //             <label>Driver Name: {data.driver.name}</label><br />
        //             <label>Driver Contact: {data.driver.contact}</label><br />
        //         </div>
        //     </li>);
        // });
        const list  = this.state.list.map(function (data) {
            return (
                <div className={"card bg-light"} style={{display: "inline-block"}} id={data._id} key={data._id}>
                    <div className={"card-header bg-info"}>
                        <label>Order ID: {data._id}</label>
                    </div>
                    <div className={"card-body gap form-control"} align="left">
                        {(data.name) ? <label>Contact Name: {data.name}</label> : ''}{(data.name) ? <br/> : ''}
                        {(data.contact) ? <label>Contact Number: {data.contact}</label> : ''}{(data.contact) ?
                        <br/> : ''}
                        {(data.address) ? <label>Address: {data.address}</label> : ''}{(data.address) ? <br/> : ''}
                        {(data.pincode) ? <label>PIN Code: {data.pincode}</label> : ''}{(data.pincode) ? <br/> : ''}
                        {(data.GST) ? <label>GST: {data.GST}</label> : ''}{(data.GST) ? <br/> : ''}
                        {(data.materialType) ?
                            <label>Material Type: {data.materialType}</label> : ''}{(data.materialType) ? <br/> : ''}
                        {(data.quantity) ? <label>Quantity: {data.quantity}</label> : ''}{(data.quantity) ? <br/> : ''}
                        {(data.status) ? <label>Status: {data.status}</label> : ''}{(data.status) ? <br/> : ''}
                    </div>
                </div>);
        });

        return (
            <div align="center" className={"container-fluid gap"}>
                <div className={"card col-xl-12"}>
                    <div className="card-header"><h2>Track</h2></div>
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

export default Track;