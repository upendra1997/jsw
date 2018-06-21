import React from "react";

function Logout(props) {
    function handleLogout(action) {
        action.preventDefault();
        props.removeUser();
        fetch('/logout', {
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
        });
    }

    return (<div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <form action={"/logout"} method={"post"} onSubmit={handleLogout}>
            <div align="center">
                <div className={"col-xl-2 col-md-4"}><input type={"button"} onClick={handleLogout}
                                                            className={"form-control bg-success"} value={"Logout"}/>
                </div>
            </div>
        </form>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
    </div>);
}

export default Logout;