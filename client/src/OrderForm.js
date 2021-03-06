import React from "react";
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
            <div className={"form-group col-md-6"} align="left">
                <label htmlFor={this.props.id}>{this.props.name}</label>
                <select className={"form-control"} id={this.props.id} name={this.props.id} value={this.props.value} onChange={this.props.onChange}>
                    {list}
                </select>
            </div>
        );
    }
}


class OrdersForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            pincode: '',
            contact: '',
            GST: '',
            name: '',
            materialType: 'CLINKER',
            packingType: 'Loose',
            quantity: '',
            errors: new Set(),
            messages: new Set(),
        };
    }

    handleCreateOrder = (action)=> {
        action.preventDefault();
        if(!(this.state.address && this.state.materialType && this.state.packingType && this.state.quantity && this.state.pincode && this.state.contact && this.state.name) || this.state.errors.size)
            return;
        let messages = new Set(this.state.messages);
        fetch('/order', {
            body: JSON.stringify(this.state),
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        }).then(response => {
            return response.json();
        }).then(body => {
            if (body.error)
                messages.add(body.error);
            if (body.message)
                messages.add(body.message);

            this.setState({messages: messages});
        }).catch(e => {
            messages.add("Please fill details properly.");
            messages.add(e);
            this.setState({messages: messages});
        });
    };

    handleAddressChange = (evt)=>{
        const message = "Please fill Address.";
        let errors = new Set(this.state.errors);
        if(validator.isEmpty(evt.target.value)){
            errors.add(message);
        }
        else{
            errors.delete(message);
        }
        this.setState({
            address: evt.target.value,
            errors: errors,
        });
    };

    handleMatrialChange = (evt)=>{
        const message = "Please select material.";
        let errors = new Set(this.state.errors);
        if(validator.isEmpty(evt.target.value)){
            errors.add(message);
        }
        else{
            errors.delete(message);
        }
        this.setState({
            materialType: evt.target.value,
            errors: errors,
        });
    };

    handlePackingChange = (evt)=>{
        const message = "Please select Packing.";
        let errors = new Set(this.state.errors);
        if(validator.isEmpty(evt.target.value)){
            errors.add(message);
        }
        else{
            errors.delete(message);
        }
        this.setState({
            packingType: evt.target.value,
            errors: errors,
        });
    };

    handlePincodeChange = (evt)=>{
        const message = "Please Enter valid PIN Code.";
        let errors = new Set(this.state.errors);
        if(evt.target.value.length !== 6){
            errors.add(message);
        }
        else{
            errors.delete(message);
        }
        if(evt.target.value.length <= 6 && validator.isNumeric(evt.target.value) || validator.isEmpty(evt.target.value)){
            this.setState({
                pincode: evt.target.value,
                errors: errors,
            });
        }
    };

    handleNameChange = (evt)=>{
        const message = "Please Enter Name.";
        let errors = new Set(this.state.errors);
        if(validator.isEmpty(evt.target.value)){
            errors.add(message);
        }
        else{
            errors.delete(message);
        }
        this.setState({
            name: evt.target.value,
            errors: errors,
        });
    };

    handleContactChange = (evt)=>{
        const message = "Not a valid contact number.";
        let errors = new Set(this.state.errors);
        if(!validator.isMobilePhone(evt.target.value,'en-IN')){
            errors.add(message);
        }
        else{
            errors.delete(message);
        }
        this.setState({
            contact: evt.target.value,
            errors: errors,
        });
    };

    handleGSTChange = (evt)=>{
        function val(str){
            if(validator.isNumeric(''+str[0]) && validator.isNumeric(''+str[1]) && str.length===15 && validator.isNumeric(''+str[12]))
                return true;
            return false;
        }
        const message = "Not a valid GST.";
        let errors = new Set(this.state.errors);
        if(!val(evt.target.value) && !validator.isEmpty(evt.target.value)){
            errors.add(message);
        }
        else{
            errors.delete(message);
        }
        this.setState({
            GST: evt.target.value,
            errors: errors,
        })
    };

    handleQuantityChange = (evt)=>{
        const message = "Please give quantity.";
        let errors = new Set(this.state.errors);
        if(validator.isEmpty(evt.target.value)){
            errors.add(message);
        }
        else{
            errors.delete(message);
        }
        this.setState({
            quantity: evt.target.value,
            errors: errors,
        });
    };

    render() {
        const errors = [];
        this.state.errors.forEach((error)=>{
            errors.push((<div className={"alert alert-danger"}>{error}</div>));
        });

        const messages = [];
        this.state.messages.forEach((error)=>{
            messages.push((<div className={"alert alert-info"}>{error}</div>));
        });

        return (
            <div align="center" className={"gap"}>
                <div className={"card col-lg-10"}>
                    <div className="card-header"><h2>Order Form</h2></div>
                    <div className={"card-body"}>
                        <form action={"/order"} method={"post"} onSubmit={this.handleCreateOrder}>
                            <div className={"form-group col-md-6"} align="left">
                                <label htmlFor="name">Contact name</label>
                                <input type={"text"} className={"form-control"} placeholder={"Contact Name"} id={"name"} name={"name"} onChange={this.handleNameChange} value={this.state.name}/>
                            </div>
                            <div className={"form-group col-md-6"} align="left">
                                <label htmlFor="contact">Contact Phone</label>
                                <input type={"text"} className={"form-control"} placeholder={"Contact Number"} id={"contact"} name={"contact"} onChange={this.handleContactChange} value={this.state.contact}/>
                            </div>
                            <div className={"form-group col-md-6"} align="left">
                                <label htmlFor="address">Delivery Address</label>
                                <div className={"form-inline"}>
                                    <input type={"text"} className={"form-control col-md-9"} id={"address"} placeholder={"Address"} name={"address"} value={this.state.address} onChange={this.handleAddressChange}/>
                                    <input type={"text"} className={"form-control col-sm-3"} id={"pincode"} placeholder={"PIN Code"} name={"pincode"} value={this.state.pincode} onChange={this.handlePincodeChange} />
                                </div>
                            </div>
                            <div className={"form-group col-md-6"} align="left">
                                <label htmlFor="GST">GST</label>
                                <input type={"text"} className={"form-control"} placeholder={"GST"} id={"GST"} name={"GST"} onChange={this.handleGSTChange} value={this.state.GST}/>
                            </div>
                            <OptionType onChange={this.handleMatrialChange} name={'Material Type'} id={'materialType'} value={this.state.materialType} list={['CLINKER', 'GGBS', 'GBS_SAND', 'GBS_SLAG', 'OPC-43', 'OPC-53', 'PSC', 'PSC-CHD', 'PPC']}/>
                            <OptionType onChange={this.handlePackingChange} name={'Packing Type'} id={'packingType'} value={this.state.packingType} list={['Loose','HPDE','2Side Lamination','1Side Lamination','Paper','Ultra Filteration','BP']}/>
                            <div className={"form-group col-md-6"} align="left">
                                <label htmlFor="quantity">Quantity</label>
                                <input type={"number"} className={"form-control"} placeholder={"Quantity"} id={"quantity"} name={"quantity"} onChange={this.handleQuantityChange} value={this.state.quantity}/>
                            </div>
                            <button type={"submit"} className={"btn btn-primary"}>Create Order</button>
                        </form>
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

export default OrdersForm;