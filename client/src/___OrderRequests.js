import React from 'react';

class OrderRequests extends React.component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            messages: new Set(),
            errors: new Set(),
        }
    }

    render() {
        const that = this;
        const list = this.state.list.map((data, index) => {
            return (
                <form onSubmit={(action) => that.handleSubmit(action, data._id)}>
                    <input type={"text"} value={data.status} placeholder={"Status"} name={"status"} onChange={this.handleStatusChange(index)} />
                    <input type={"text"} value={data.location} placeholder={"Location"} name={"location"} onChange={this.handleLocationChange(index)} />
                    <input type={"text"} value={data.driver.name} placeholder={"Driver Name"} name={"driver.name"} onChange={this.handleDriverNameChange(index)} />
                    <input type={"text"} value={data.driver.contact} placeholder={"Driver Contatc"} name={"driver.contact"} onChange={this.handleDriverContactChange(index)} />
                    <input type={'submit'} value={"Update"}/>
                </form>
            );
        });
    }



}







// (<form onSubmit={(action) => that.handleSubmit(action, data._id)}>
//     <input type={'text'} placeholder={data['status'] || 'Status'} name={"status"}
//            ref={that.attachHandler}/>
//     <input type={'text'} placeholder={data['location'] || 'Location'} name={"location"}
//            ref={that.attachHandler}/>
//     <input type={'text'} placeholder={data['driver'] ? data['driver']['name'] : 'Driver Name'}
//            name={'driver.name'} ref={that.attachHandler}/>
//     <input type={'text'}
//            placeholder={data['driver'] ? data['driver']['contact'] : 'driver Contact'}
//            name={'driver.contact'} ref={that.attachHandler}/>
//     <input type={'submit'} value={"Update"}/>
// </form>)