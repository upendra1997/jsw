import React from "react";

class Login extends React.Component {
    constructor(prop) {
        super(prop);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.node = {};
        this.attachHandler = this.attachHandler.bind(this);
    }

    handleLogin(action) {
        action.preventDefault();
        fetch('/login', {
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
                <form action={"/login"} method={"post"} onSubmit={this.handleLogin}>
                    <input type={"text"} placeholder={"Email"} name={"email"} ref={this.attachHandler}/>
                    <br/>
                    <input type={"password"} placeholder={"Password"} name={"password"} ref={this.attachHandler}/>
                    <br/>
                    <input type={"submit"} value={"Login"}/>
                </form>
            </div>
        );
    }
}

export default Login;