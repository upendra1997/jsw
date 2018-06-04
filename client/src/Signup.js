import React from "react";


class Signup extends React.Component {
    constructor(prop) {
        super(prop);
        this.handleSignup = this.handleSignup.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.node = {};
        this.attachHandler = this.attachHandler.bind(this);
    }

    handleSignup(action) {
        action.preventDefault();
        fetch('/signup', {
            body: JSON.stringify(this.state),
            method: 'post',
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
    }

    handleInput(node) {
        this.node[node.target.name] = node.target.value;
        const a = this.node;
        this.setState(a);
        console.log(this.node);
    }

    attachHandler(node) {
        this.node[node.name] = node.value;
        node.onchange = this.handleInput
    }

    render() {
        return (
            <div>
                <form action={"/signup"} method={"post"} onSubmit={this.handleSignup}>
                    <input type={"text"} placeholder={"Name"} name={"name"} ref={this.attachHandler}/>
                    <br/>
                    <input type={"text"} placeholder={"Email"} name={"email"} ref={this.attachHandler}/>
                    <br/>
                    <input type={"text"} placeholder={"Address"} name={"address"} ref={this.attachHandler}/>
                    <br/>
                    <input type={"text"} placeholder={"Contact"} name={"contact"} ref={this.attachHandler}/>
                    <br/>
                    <input type={"password"} placeholder={"Password"} name={"password"} ref={this.attachHandler}/>
                    <br/>
                    <input type={"password"} placeholder={"Retype Password"} name={"password1"}/>
                    <br/>
                    <input type={"submit"} value={"Signup"}/>
                </form>
            </div>
        );
    }

}

export default Signup;