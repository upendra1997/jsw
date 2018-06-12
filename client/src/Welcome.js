import React from "react";

class Welcome extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            email: '',
            contact: '',
            status: '',
            address: '',
            members: [],
            kind: '',
            errors: new Set(),
            messages: new Set(),
        };
        let errors = new Set(this.state.errors);
        fetch('/user', {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            if (data.error) {
                errors.add(data.error);
            }
            else {
                this.setState({
                    name: data.name
                });
            }
        }).catch(e => {
            errors.add(e);
            this.setState({
                errors: errors,
            });
        });
    }

    render(){
        const errors = [];
        this.state.errors.forEach((error)=>{
            errors.push((<li key={error}>{error}</li>));
        });

        const messages = [];
        this.state.messages.forEach((error)=>{
            messages.push((<li key={error}>{error}</li>));
        });

        return (<div>
            Welcome {this.state.name}
            <br />
            {errors}
            <br />
            <br />
            {messages}
        </div>);
    }
};

export default Welcome;