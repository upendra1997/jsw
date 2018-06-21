import React from "react";

class Members extends React.Component {
    f = (id) => {
        return fetch('/info/' + id).then((user) => user.json());
    };
    data = (user) => {
        if (!user || user.error) {
            console.log(user);
            return <div></div>
        }
        return (
            <li className={"list-group-item "}>
                Name: {user.name}<br/>
                Email: {user.email}<br/>
                Phone: {user.contact}<br/>
                Address: {user.address}<br/>
                kind: {user.kind}<br/>
            </li>
        );
    };

    constructor(props) {
        super(props);
        this.state = {user: '', jsx: ''};
        const id = this.props.id;
        this.f(id).then((user) => {
            // console.log(user);
            const jsx = <ul>{user && user.members && user.members.map(id => <Members id={id}/>)}</ul>;
            this.setState({
                user: this.data(user),
                jsx: jsx,
            });
        });
    };

    render() {
        return (
            <ul className={"list-group"}>
                {this.state.user}
                {this.state.jsx}
            </ul>
        )
    }
}

class Profile extends React.Component {
    handleOldPasswordChange = (evt) => {
        const message = "Password is not valid";
        let errors = new Set(this.state.errors);
        if (evt.target.value.length < 8) {
            errors.add(message);
        } else {
            errors.delete(message);
        }

        this.setState({
            oldpassword: evt.target.value,
            errors: errors,
        });
    };
    handlePasswordChange = (evt) => {
        const message = "Password is not valid";
        let errors = new Set(this.state.errors);
        if (evt.target.value !== this.state.password1 || evt.target.value.length < 8) {
            errors.add(message);
        } else {
            errors.delete(message);
        }

        this.setState({
            password: evt.target.value,
            errors: errors,
        });
    };
    handlePassword1Change = (evt) => {
        const message = "Password is not valid";
        let errors = new Set(this.state.errors);
        if (evt.target.value !== this.state.password || evt.target.value.length < 8) {
            errors.add(message);
        } else {
            errors.delete(message);
        }
        this.setState({
            password1: evt.target.value,
            errors: errors,
        });
    };
    handleChangePassword = (evt) => {
        evt.preventDefault();
        const message = "Old password not valid";
        if (!(this.state.oldpassword && this.state.password && this.state.password1) || this.state.errors.size)
            return;
        let errors = new Set(this.state.errors);
        let messages = new Set(this.state.messages);
        fetch('/check', {
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.oldpassword,
            }),
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        }).then((data) => {
            if (data.status == 200) {
                console.log(this.state.password);
                errors.delete(message);
                fetch('/changepassword', {
                    body: JSON.stringify(this.state),
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                }).then((data) => {
                    messages.add("Password Changed");
                })
            } else {
                errors.add(message);
            }
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.user.name,
            email: this.props.user.email,
            address: this.props.user.address,
            contact: this.props.user.contact,
            oldpassword: '',
            password: '',
            password1: '',
            errors: new Set(),
            messages: new Set(),
        };
    }

    render() {
        const that = this;
        const errors = [];
        this.state.errors.forEach((error) => {
            errors.push((<div className={"alert alert-danger"}>{error}</div>));
        });

        const messages = [];
        this.state.messages.forEach((error) => {
            messages.push((<div className={"alert alert-info"}>{error}</div>));
        });

        function f(id) {
            return fetch('/info/' + id).then((user) => user.json()).then((data) => data);
        }

        //
        function recursive(id) {
            const data = f(id);
            return (
                <div>
                    Name: {data.name}<br/>
                    Email: {data.email}<br/>
                    Phone: {data.contact}<br/>
                    Address: {data.address}<br/>
                    kind: {data.kind}<br/>
                </div>
            );
        }

        // function print(){
        //     const admin = that.props.user.members((admin)=>{
        //         let dealer=f(admin).members.map((dealer)=>{
        //             let subdealer=f(dealer).members.map((subdealer)=>{
        //                 return recursive(subdealer);
        //             });
        //             return (<div>{recursive(dealer)}{subdealer}</div>);
        //         });
        //         return (<div>{recursive(admin)}{dealer}</div>);
        //     });
        //     return admin;
        // };
        // console.log(recursive(this.props.user._id));
        //
        // function members(id){
        //     const user = f(id);
        //     if(!user.members) return recursive(id);
        //     const mem = user.members.map((m)=>{
        //         return members(m);
        //     });
        //     return (<div>{mem}</div>);
        // }

        return (
            <div align="center" className={"container-fluid gap"}>
                <div className={"card col-xl-12"}>
                    <div className="card-header"><h2>Profile</h2></div>
                    <div className={"card-body"}>
                        <div align={"left"}>
                            Name: {this.state.name}<br/>
                            Email: {this.state.email}<br/>
                            Contact: {this.state.contact}<br/>
                            address: {this.state.address}<br/>
                            <div align={"left"}>
                                <input type={"password"} className={"form-control col-md-3 col-lg-2 d-inline"}
                                       placeholder={"Old Password"} onChange={this.handleOldPasswordChange}
                                       value={this.state.oldpassword}/>
                                <input type={"password"} className={"form-control col-md-3 col-lg-2 d-inline"}
                                       placeholder={"New Password"} onChange={this.handlePasswordChange}
                                       value={this.state.password}/>
                                <input type={"password"} className={"form-control col-md-3 col-lg-2 d-inline"}
                                       placeholder={"Retype Password"} onChange={this.handlePassword1Change}
                                       value={this.state.password1}/>
                                <input type={"button"} className={"form-control col-md-3 col-lg-2 d-inline bg-success"}
                                       value={"Change Password"} onClick={this.handleChangePassword}/>
                            </div>
                            <br/>
                            <div className={"card"}>
                                <div className="card-header"><h5>Members</h5></div>
                                <div className={"card-body"}><Members id={this.props.user._id}/></div>
                            </div>
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

export default Profile;