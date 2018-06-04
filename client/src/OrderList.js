import React from "react";

class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
        this.node = {};
        fetch('/order', {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        }).then(response => {
            return response.json();
        }).then(body => {
            const data = body;
            if (body.error) {
                console.log(body.error);
            }
            else {
                console.log(data);
                this.setState({list: data});
            }
        }).catch(e => {
            console.log(e);
        });
        this.deleteOrder = this.deleteOrder.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.attachHandler = this.attachHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    deleteOrder(id) {
        return (action) => {
            document.getElementById(id).remove();
            action.preventDefault();
            fetch('/order/' + id, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            }).then(response => {
                return response.json();
            }).then(body => {
                console.log("printi");
                this.setState({list: body});
            }).catch((e) => {
                console.log(e);
            });
            alert('order deleted');
        };
    }

    handleInput(node) {
        this.node[node.target.name] = node.target.value;
        const a = this.node;
        this.setState(a);
        console.log(this.node);
    }

    attachHandler(node) {
        this.node[node.name] = node.value.length ? node.value : node.placeholder;
        node.onchange = this.handleInput
    }

    handleSubmit(action, id) {
        action.preventDefault();
        const data = this.state;
        delete data.list;
        console.log(data);
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
    }

    render() {
        console.log(this.state.list);
        const that = this;
        return (
            <div>
                <h1>Order List</h1>
                {this.state.list.map(function (data) {
                    console.log(data);
                    return (<li id={data._id} key={data._id}>
                        {data.address} {data.materialType} {data.quantity}
                        <form onSubmit={(action) => that.handleSubmit(action, data._id)}>
                            <input type={'text'} placeholder={data['status'] || 'Status'} name={"status"}
                                   ref={that.attachHandler}/>
                            <input type={'text'} placeholder={data['location'] || 'Location'} name={"location"}
                                   ref={that.attachHandler}/>
                            <input type={'text'} placeholder={data['driver'] ? data['driver']['name'] : 'Driver Name'}
                                   name={'driver.name'} ref={that.attachHandler}/>
                            <input type={'text'}
                                   placeholder={data['driver'] ? data['driver']['contact'] : 'driver Contact'}
                                   name={'driver.contact'} ref={that.attachHandler}/>
                            <input type={'submit'} value={"Update"}/>
                        </form>
                        <input type={"button"} onClick={that.deleteOrder(data._id)} value={"Cancel"}/>
                    </li>);
                })}
            </div>
        );
    }
}


export default OrderList;