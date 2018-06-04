import React from "react";

class OrderHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list: []};
        fetch('/order/history', {
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
    }

    render() {
        return (
            <div>
                <h1>Order History</h1>
                {this.state.list.map(function (data) {
                    return (<li key={data.date}>{data.date} {data.message}</li>);
                })}
            </div>
        );
    }
}

export default OrderHistory;