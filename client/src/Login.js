import React from "react";
import validator from "validator";

class Login extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            email: '',
            password: '',
            errors: new Set(),
            messages: new Set(),
        };
    }

    handleLogin = (action)=> {
        action.preventDefault();
        if(!(this.state.email && this.state.password) || this.state.errors.size)
            return;
        let messages = new Set(this.state.messages);
        fetch('/login', {
            body: JSON.stringify(this.state),
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        }).then(response => {
            return response.json();
        }).then(body => {
            if (body.error)
                messages.add(body.error)
            if (body.message)
                messages.add(body.message);
            this.setState({messages: messages});
        }).catch(e => {
            messages.add("Please fill details properly.");
            messages.add(e);
            this.setState({messages: messages});
        });
    }

    handlePasswordChange = (evt)=>{
        const message = "Password is not valid";
        let errors = new Set(this.state.errors);
        if(evt.target.value.length<8){
            errors.add(message);
        }else{
            errors.delete(message);
        }
        this.setState({
            password: evt.target.value,
            errors: errors,
        });
    }

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
                <div className="card-header"><h2>Login</h2></div>
                <div className={"card-body"}>
                    <form action={"/login"} method={"post"} onSubmit={this.handleLogin}>
                        <div className={"form-group col-md-6"} align="left">
                            <label htmlFor="email">Email</label>
                            <input type={"email"} className={"form-control"} id="email" placeholder={"Email"} name={"email"} value={this.state.email} onChange={this.handleEmailChange}/>
                        </div>
                        <div className={"form-group col-md-6"} align="left">
                            <label htmlFor="password">password</label>
                            <input type={"password"} className={"form-control"} id={"password"} placeholder={"Password"} name={"password"} minLength={8} value={this.state.password} onChange={this.handlePasswordChange}/>
                        </div>
                        <button type={"submit"} className={"btn btn-primary"}>Login</button>
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

export default Login;