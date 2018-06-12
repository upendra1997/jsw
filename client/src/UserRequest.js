import React from "react";

class UserRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            errors: new Set(),
            messages: new Set(),
        };
        let errors = new Set(this.state.errors);
        fetch('/user/request', {
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

    acceptRequest = (id, index)=> {
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

            return (<li id={data._id} key={data._id}>
                <div>
                    <label>Order ID:</label> {data._id}<br />
                    <label>Address:</label> {data.address}<br />
                    <label>Material Type:</label> {data.materialType}<br />
                    <label>Quantity:</label> {data.quantity}<br />
                    <form onSubmit={(action) => that.handleSubmit(action, data._id)}>
                        <input type={"text"} value={data.status} placeholder={"Status"} name={"status"} onChange={that.handleStatusChange(index)} />
                        <input type={"text"} value={data.location} placeholder={"Location"} name={"location"} onChange={that.handleLocationChange(index)} />
                        <input type={"text"} value={data.driver.name} placeholder={"Driver Name"} name={"driver.name"} onChange={that.handleDriverNameChange(index)} />
                        <input type={"text"} value={data.driver.contact} placeholder={"Driver Contact"} name={"driver.contact"} onChange={that.handleDriverContactChange(index)} />
                        <input type={"button"} onClick={that.acceptRequest(data._id, index)} value={"Update"}/>
                    </form>
                </div>
            </li>);
        });

        return (
            <div>
                <h1>User Request</h1>
                <ul style={{"listStyleType":"none"}}>
                    { list }
                    <br />
                </ul>
                <br />
                {errors}
                <br />
                <br />
                {messages}
            </div>
        );
    }
}


export default UserRequest;