import React from "react";
import Dropzone from 'react-dropzone';
import DataFrame from 'dataframe-js';
import validator from "validator";

class OptionType extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            list: this.props.list,
        }
    }

    render(){
        const list = this.state.list.map((item)=>{
            return <option value={item}>{item}</option>
        });

        return (
            <div className={"form-group"} align="left">
                <label htmlFor={this.props.id}>{this.props.name}</label>
                <select className={"form-control"} id={this.props.id} name={this.props.id} value={this.props.value} onChange={this.props.onChange}>
                    {list}
                </select>
            </div>
        );
    }
}



class OrderRequest extends React.Component {
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
                    messages.add(body.error);
                if (body.message)
                    messages.add(body.message);
                console.log(messages);
                this.setState({messages: messages});
            }).catch(e => {
                messages.add("Please fill details properly.");
                messages.add(e);
                this.setState({messages: messages});
            });
        };
    };
    handleStatusChange = (index)=> {
        return (evt)=>{
            let list = this.state.list.slice();
            list[index].status = evt.target.value;
            this.setState({
                list: list
            });
        }
    };
    handleLocationChange = (index)=> {
        return (evt)=>{
            let list = this.state.list.slice();
            list[index].location = evt.target.value;
            this.setState({
                list: list
            });
        }
    };
    handleDriverNameChange = (index)=> {
        return (evt)=>{
            let list = this.state.list.slice();
            list[index].driver.name = evt.target.value;
            this.setState({
                list: list
            });
        }
    };
    handleDriverContactChange = (index)=> {
        return (evt)=>{
            let list = this.state.list.slice();
            const message = "Not a valid contact number.";
            let errors = new Set(this.state.errors);
            if (!validator.isMobilePhone(evt.target.value, 'en-IN')) {
                errors.add(message);
            }
            else {
                errors.delete(message);
            }
            list[index].driver.contact = evt.target.value;
            this.setState({
                list: list,
                errors: errors,
            });
        }
    };
    handleDownload = (evt) => {
        evt.preventDefault();
        fetch('/order/download', {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        }).then((response => {
            return response.blob();
        })).then((blob) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "filename.csv";
            a.click();
        });
    };
    batchUpdate = (evt) => {
        evt.preventDefault();
        for (let i = 0; i < this.state.list.length; i++) {
            console.log(this.state.list[i]);
            this.updateOrder(this.state.list[i]._id, i)({
                preventDefault: function () {
                }
            });
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            errors: new Set(),
            messages: new Set(),
        };
        let errors = new Set(this.state.errors);
        fetch('/order/request/verify', {
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

    onDrop(acceptedFiles, rejectedFiles) {
        DataFrame.fromCSV(acceptedFiles[0]).then(df => {
            const data = df.toCollection();
            const list = this.state.list;
            for (const item of data) {
                let i = list.findIndex(a => a._id === item._id);
                if (i == -1) continue;
                list[i].status = item.status;
                list[i].location = item.location;
                list[i].driver = {name: '', contact: ''};
                list[i].driver.name = item["driver.name"];
                list[i].driver.contact = item["driver.contact"];
            }
            this.setState({list: list});
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
                        <label>Packing Type: {data.packingType}</label><br />
                        <label>Quantity: {data.quantity}</label><br />
                        <hr/>
                        <form onSubmit={(action) => that.handleSubmit(action, data._id)}>
                            <OptionType onChange={that.handleStatusChange(index)} name={'Status'} id={'status'} value={data.status} list={['NotVerified', 'Under Process','Delivery Instruction Issued','Under Loading', 'In transit', 'Delivered']}/>
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
                        <div className={"card-footer"}>
                            <div className={"form-group"}>
                                <div className={"row"}>
                                    <div className={"col"}>
                                        <input type={"button"} className={"btn btn-dark"} value={"Download CSV"}
                                               onClick={this.handleDownload}/>
                                    </div>
                                    <div className={"col"}>
                                        <Dropzone className={"btn btn-dark"}
                                                  onDrop={(files) => this.onDrop(files)}>{"Uplaod CSV"}</Dropzone>
                                    </div>
                                    <div className={"col"}>
                                        <input type={"button"} className={"btn btn-dark"} value={"Batch Update"}
                                               onClick={this.batchUpdate}/>
                                    </div>
                                </div>
                            </div>
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