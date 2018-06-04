import React from "react";

class OrdersForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleCreateOrder = this.handleCreateOrder.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.node = {};
        this.attachHandler = this.attachHandler.bind(this);
    }

    handleCreateOrder(action) {
        action.preventDefault();
        fetch('/order', {
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
                <form action={"/order"} method={"post"} onSubmit={this.handleCreateOrder}>
                    <input type={"text"} placeholder={"Address"} name={"address"} ref={this.attachHandler}/>
                    <br/>
                    <input type={"text"} placeholder={"Material Type"} name={"materialType"} ref={this.attachHandler}/>
                    <br/>
                    <input type={"text"} placeholder={"Quantity"} name={"quantity"} ref={this.attachHandler}/>
                    <br/>
                    <input type={"submit"} value={"Create Order"}/>
                </form>
            </div>
        );
    }
}

export default OrdersForm;