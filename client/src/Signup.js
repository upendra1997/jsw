import React from "react";
import validator from 'validator';

class Signup extends React.Component {
    handleSignup = (action) => {
        action.preventDefault();
        if(!(this.state.name && this.state.email && this.state.contact && this.state.address && this.state.password && this.state.password1) || this.state.errors.size)
            return;
        let messages = new Set(this.state.messages);
        fetch('/signup', {
            body: JSON.stringify(this.state),
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        }).then((response) => {
            return response.json()
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
    handleNameChange = (evt)=>{
        const message = "Please fill Name.";
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
    handleEmailChange = (evt)=>{
        const message = "Not a valid email.";
        let errors = new Set(this.state.errors);
        if(!validator.isEmail(evt.target.value)){
            errors.add(message);
        }
        else{
            errors.delete(message);
        }
        this.setState({
            email: evt.target.value,
            errors: errors
        });
    };
    handleAddressChange = (evt)=>{
        const message = "Please fill address.";
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
    handlePasswordChange = (evt)=>{
        const message = "Password is not valid";
        let errors = new Set(this.state.errors);
        if(evt.target.value !== this.state.password1 || evt.target.value.length<8){
            errors.add(message);
        }else{
            errors.delete(message);
        }

        this.setState({
            password: evt.target.value,
            errors: errors,
        });
    };
    handlePassword1Change = (evt)=>{
        const message = "Password is not valid";
        let errors = new Set(this.state.errors);
        if(evt.target.value !== this.state.password || evt.target.value.length<8){
            errors.add(message);
        }else{
            errors.delete(message);
        }
        this.setState({
            password1: evt.target.value,
            errors: errors,
        });
    };
    handleKindChange = (evt) => {
        this.setState({
            kind: evt.target.value,
        });
    };

    constructor(prop) {
        super(prop);
        this.state = {
            name: '',
            email: '',
            address: '',
            contact: '',
            password: '',
            password1: '',
            kind: 'admin',
            errors: new Set(),
            messages: new Set(),
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

        return (
            <div align="center" className={"gap"}>
                <div className={"card col-lg-10"}>
                    <div className="card-header"><h2>Signup</h2></div>
                    <div className={"card-body"}>
                        <form action={"/signup"} method={"post"} onSubmit={this.handleSignup}>
                            <div className={"form-group col-md-6"} align="left">
                                <label htmlFor="name">Name</label>
                                <input type={"text"} className={"form-control"} id="name" placeholder={"Name"} name={"name"} value={this.state.name} onChange={this.handleNameChange}/>
                            </div>
                            <div className={"form-group col-md-6"} align="left">
                                <label htmlFor="email">Email</label>
                                <input type={"email"} className={"form-control"} id={"email"} placeholder={"Email"} name={"email"} value={this.state.email} onChange={this.handleEmailChange}/>
                            </div>
                            <div className={"form-group col-md-6"} align="left">
                                <label htmlFor="address">Address</label>
                                <input type={"text"} className={"form-control"} id={"address"} placeholder={"Address"} name={"address"} value={this.state.address} onChange={this.handleAddressChange}/>
                            </div>
                            <div className={"form-group col-md-6"} align="left">
                                <label htmlFor="contact">Contact</label>
                                <input type={"text"} id="contact" className={"form-control"} placeholder={"Contact"} name={"contact"} value={this.state.contact} onChange={this.handleContactChange}/>
                            </div>
                            <div className={"form-group col-md-6"} align="left">
                                <label htmlFor="password">Password</label>
                                <input type={"password"} id="password" className={"form-control"} placeholder={"Password"} name={"password"} minLength={8} value={this.state.password} onChange={this.handlePasswordChange}/>
                            </div>
                            <div className={"form-group col-md-6"} align="left">
                                <label htmlFor="password1">Retype Password</label>
                                <input type={"password"} id="password1" className={"form-control"} placeholder={"Retype Password"} name={"password1"} value={this.state.password1} onChange={this.handlePassword1Change}/>
                            </div>
                            <div className={"form-group col-md-6"} align="left">
                                <label htmlFor="kind">User Type</label>
                                <select className={"form-control"} id={"kind"} name={"kind"} value={this.state.kind}
                                        onChange={this.handleKindChange}>
                                    <option value="admin">Admin</option>
                                    <option value="dealer">Dealer</option>
                                    <option value="sub-dealer">Sub Dealer</option>
                                </select>
                            </div>
                            <button type={"submit"} className={"btn btn-primary"}>Signup</button>
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

export default Signup;