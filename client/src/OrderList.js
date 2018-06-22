import React from "react";

class FilteredList extends React.Component {

    filterList = (event) => {
        let updatedList = this.state.initialItems;
        updatedList = updatedList.filter(function (item) {
            return item.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
        });
        this.setState({items: updatedList});
    };

    constructor(props) {
        super(props);
        this.state = {
            initialItems: [],
            items: []
        };
    }

    componentDidMount() {
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        const array = this.props.items;
        console.log(this.props);
        this.setState({
            initialItems: array.filter(onlyUnique),
            items: array.filter(onlyUnique)
        });
    }

    // componentWillMount(){
    //     this.setState({ items: this.state.initialItems });
    // };

    render() {
        return (
            <div className="filter-list">
                <form>
                    <fieldset className="form-group">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Search"
                            onChange={this.filterList}
                        />
                    </fieldset>
                </form>
                <List items={this.state.items} click={this.props.click}/>
            </div>
        );
    }
}

class List extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const that = this;
        return (
            <ul className="list-group">
                {this.props.items.map(function (item) {
                    return (
                        <li className="list-group-item" data-category={item} key={item} onClick={that.props.click}>
                            {item}
                        </li>
                    );
                })}
            </ul>
        );
    }
}

class Order extends React.Component {
    deleteOrder = (id) => {
        return (action) => {
            action.preventDefault();
            let errors = new Set(this.state.errors);
            let messages = new Set(this.state.messages);
            document.getElementById(id).remove();
            fetch('/order/' + id, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            }).then(response => {
                return response.json();
            }).then(body => {
                messages.add("Order " + id + " deleted");
                this.setState({
                    messages: messages,
                });
            }).catch((e) => {
                errors.add(JSON.stringify(e.message));
                this.setState({
                    errors: errors,
                });
            });
        };
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const data = this.props.data;
        return (
            <div className={"card bg-light"} style={{display: "inline-block"}} id={data._id} key={data._id}>
                <div className={"card-header bg-info"}>
                    <label>Order ID: {data._id}</label>
                </div>
                <div className={"gap form-control"} align="left">
                    <label>Contact Name: {data.name}</label><br/>
                    <label>Contact Number: {data.contact}</label><br/>
                    <label>Address: {data.address}</label><br/>
                    <label>PIN Code: {data.pincode}</label><br/>
                    {(data.GST) ? <label>GST: {data.GST}</label> : ''}{(data.GST) ? <br/> : ''}
                    <label>Material Type: {data.materialType}</label><br/>
                    <label>Packing Type: {data.packingType}</label><br/>
                    <label>Quantity: {data.quantity}</label><br/>
                    <input type={"button"} className={"btn btn-danger"} onClick={this.deleteOrder(data._id)}
                           value={"Cancel"}/>
                </div>
            </div>);
    }
}


class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            errors: new Set(),
            messages: new Set(),
        };
        let errors = new Set(this.state.errors);
        fetch('/order', {
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

    deleteOrder = (id)=> {
        return (action) => {
            action.preventDefault();
            let errors = new Set(this.state.errors);
            let messages = new Set(this.state.messages);
            document.getElementById(id).remove();
            fetch('/order/' + id, {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            }).then(response => {
                return response.json();
            }).then(body => {
                messages.add("Order "+ id+" deleted");
                this.setState({
                    messages: messages,
                });
            }).catch((e) => {
                errors.add(JSON.stringify(e.message));
                this.setState({
                    errors: errors,
                });
            });
        };
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

        const that = this;
        const list  = this.state.list.map(function (data) {
            return <Order data={data}/>
            // return (
            //     <div className={"card bg-light"}  style={{display: "inline-block"}} id={data._id} key={data._id}>
            //     <div className={"card-header bg-info"}>
            //         <label>Order ID: {data._id}</label>
            //     </div>
            //         <div className={"gap form-control"} align="left">
            //             <label>Contact Name: {data.name}</label><br />
            //             <label>Contact Number: {data.contact}</label><br />
            //             <label>Address: {data.address}</label><br />
            //             <label>PIN Code: {data.pincode}</label><br />
            //             {(data.GST)?<label>GST: {data.GST}</label>:''}{(data.GST)?<br/>:''}
            //             <label>Material Type: {data.materialType}</label><br />
            //             <label>Quantity: {data.quantity}</label><br />
            //         <input type={"button"} className={"btn btn-danger"} onClick={that.deleteOrder(data._id)} value={"Cancel"}/>
            //     </div>
            // </div>);
        });
        let list1 = this.state.list.map(data => data.address);
        console.log(typeof list1);
        console.log(list1.constructor.name);
        console.log(list1);
        return (
            <div align="center" className={"container-fluid gap"}>
                {/*<FilteredList items={list1}/>*/}
                <div className={"card col-xl-12"}>
                    <div className="card-header"><h2>Order List</h2></div>
                    <div className={"card-body"}>
                        <div className={"card-columns"}>
                            {/*<select>*/}
                            {list}
                            {/*</select>*/}
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


export default OrderList;