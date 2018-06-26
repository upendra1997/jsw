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
            <h1>Welcome {this.props.user.name}</h1>
            <h2>to JSW Dealer and Sub-Dealer Portal</h2>
            <img src={window.location.origin + '/favicon.png'} height={200} width={200} alt={"JSW logo"}/>
            <br/>
            <br/>
            <div className={"card col-md-8 col-xl-11 bg-dark"} style={{color: 'white'}} align="left">
                <h3>Contact Us:</h3>
                <h5>
                    <label>Name:</label> <label>Upendra Upadhyay</label><br/>
                    <label>Contact:</label> <label>9460979571</label><br/>
                    <label>Email:</label> <label>upendra.upadhyay.97@gmail.com</label><br/>
                    <label>Website:</label> <label><a href="www.jswcement.in">www.jswcement.in</a></label><br/>
                </h5>
            </div>
            <br/>
            <div align="right">
                <div className={"card col-md-8 col-xl-11 bg-dark"} style={{color: 'white'}} align="left">
                    <h3>Address:</h3>
                    <h5>
                        <label>
                            <div>Babukhan Millenium Center, 6-3-1099/1100, No.702, 7th Floor, Block 'A', Somajiguuda,
                                Hyderabad - 500082
                            </div>
                        </label><br/>
                    </h5>
                </div>
            </div>
            <br />
            {errors}
            <br />
            <br />
            {messages}
        </div>);
    }
}

export default Welcome;