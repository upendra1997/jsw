import React from "react";

function Logout(props) {
    function handleLogout(action) {
        action.preventDefault();
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
        <form action={"/logout"} method={"post"} onSubmit={handleLogout}>
            <input type={"submit"} value={"Logout"}/>
        </form>
    </div>);
}

export default Logout;