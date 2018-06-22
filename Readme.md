# JSW Dealer and Sub-Dealer

In the trade segment of cement distribution the cement is sold through several dealers and sub-dealers across different states. During the course of business dealers and sub-dealers engage in multiple business activities with cement. Dealers and sub-dealers need to track their orders, their account status and often contact the sales team to get this information. This wastes significant time of sales team. To improve the customer experience, a dealer portal web app is made that can be used by dealers and sub-dealers to access the required information on demand.


## Install on localhost
1. get source files of the project by using [git](https://git-scm.com/).

	`git clone https://github.com/upendra1997/jsw.git`
2. create a file `jsw` in folder as `config.json` with content
    ```
    {
      "secret":"abc123",
      "host":"localhost",
      "PORT": "5000",
      "MONGODB_URI":"mongodb://localhost/Test",
      "database_port":"27017",
      "username": "upendra.upadhyay.97@gmail.com",
      "password": "xxxxxxxxxxxxxxx"
  	}
    ```
    Here username is your google mail username and password is google password(Do not push this file on internet) and
    change secret and other variables accordingly. If you do not want to write these information in a file, then create environment variables of all these keys.
3. install [node](https://nodejs.org) and run
    ```
    npm install
    cd client
    npm install
    ``` 
4. set up admin username and password by creating file admin.json with content
    ```
    {
        "email": "upendra.upadhyay.97@gmail.com",
        "password": "up123456789"
    }
    ```
    Here email must be email of the admin and password should be more than 8 characters.
5. To run this project on localhost with [mongodb](https://www.mongodb.com/) installed:
	```
	npm run database 
    ```
    and if you are on windows
    ```
    npm run devstart-windows
    ```
    and if on linux
    ```
    npm run devstart-linux
    ```
6. Thats it :)

## Running on heroku

1. Go to [heroku](https://www.heroku.com/) and signup and get [herku client](https://devcenter.heroku.com/articles/heroku-cli).
2. Go to project folder and run `heroku create` and enter login id.
3. run `heroku addons:create mongolab`.
4. run `git push heroku master`.

## Documentation

### File structure
```
    .
    |-- Readme.md                   --this file
    |-- app.js                      --App routes handler
    |-- bin
    |   `-- www                     --Entry point for express server
    |-- client                      --React Client created using react-create-app
    |   |-- README.md
    |   |-- package-lock.json
    |   |-- package.json
    |   |-- public
    |   |   |-- favicon.ico
    |   |   |-- favicon.png
    |   |   |-- index.html      
    |   |   `-- manifest.json
    |   `-- src
    |       |-- App.css             --Styles for website
    |       |-- App.js              --React Entry point
    |       |-- App.test.js
    |       |-- Login.js            --Login view
    |       |-- Logout.js           --Logout view
    |       |-- OrderForm.js        --Order Form view
    |       |-- OrderHistory.js     --Order History view
    |       |-- OrderList.js        --Order List view
    |       |-- OrderRequest.js     --Order Request view
    |       |-- Profile.js          --Profile view
    |       |-- Signup.js           --Signup View
    |       |-- UserRequest.js      --User Request view
    |       |-- Welcome.js          --Welcome Screen view
    |       |-- index.css           
    |       |-- index.js            
    |       |-- logo.svg
    |       |-- registerServiceWorker.js
    |       |-- routes.js           --React Router routes
    |       `-- track.js            --Track view
    |-- config.js                   --Load environmnt variables from config.json
    |-- config.json                 --have environment variables for local developement
    |-- middleware
    |   |-- authenticate.js         --authentication middleware for login logout
    |   `-- loghistory.js           --middleware to log history
    |-- package-lock.json
    |-- package.json
    |-- routes
    |   |-- auth.js                 --API endpoint for signup login logout and information of user
    |   |-- orders.js               --API endpoint for creation, removal, update of orders
    |   `-- users.js                --API endpoints for information of user, members, owners and maintaining hierarchy
    |-- schema
        |-- models.js               --database connectivity
        |-- order.js                --Order Schema
        `-- user.js                 --User Schema

```
### API Architecture
#### Auth API `/`
##### Signup `POST /signup`
Request JSON with kind in {admin, dealer, sub-dealer}
```
{
    name: "Upendra Upadhyay",
    email: "upendra.upadhyay.97@gmail.com",
    contact: "9460979571",
    password: "up123456789",
    address: "Here",
    kind: "Admin",
}    
```
If user is created then it sends response, create verify token and sends email with content to verify the user 
```
please go to http://localhost:5000/verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjJiOTQyZmNkOWJhMzViM2I5YjVhYjIiLCJhY2Nlc3MiOiJ2ZXJpZnkiLCJpYXQiOjE1Mjk1ODI2NDB9.pGCDJojSOFguW7dBgd3h1dUzurEJtVtQ4LwpciqdNGg
```
Here localhost is your hostname, 5000 is a port number and Response with status `200' is`
```
{
    message: "User Created"
}
```
Otherwise it sends error like `duplicate key` with status `409`
```
{
    error: "ERROR MESSAGE"
}
```
##### Login `POST /login`
Request JSON
```
{
    email: "upendra.upadhyay.97@gmail.com"
    password: "up123456789",
}    
```
If credentials are correct then it sends response with status `200` and create auth token.
```
{
    user: {
        name: "Upendra Upadhyay",
        email: "upendra.upadhyay.97@gmail.com",
        contact: "9460979571",
        password: "$2a$10$86xiF/zyvpG8zOWVXV1OCu1doVt8xq4gkoQNJ4b25E.uEjqLigQNC",
        address: "Here",
        kind: "Admin",
        owner: "",
        members: []
    },
    message: "User Logged in."
}    
```
Otherwise it sends error like `Error generating Tokens`, `User Not Verified` with status `500`,`404`,`401` etc.
```
{
    error: "User not found."
}
```
##### Check `POST /check`
Request JSON
```
{
    email: "upendra.upadhyay.97@gmail.com"
    password: "up12345678",
}
```
if user exists then it sends response and status `200`
```
{
    message: "user exists"
}
```
otherwise it sends error like `User Not Verified` and status `401`
```
{
    error: "User not found."
}
```
##### Change Password `POST /changepassword`
Request JSON
```
{
    email: "upendra.upadhyay.97@gmail.com"
    password: "up12345678",
}    
```
If user found and password is valid then it change the password and send Response JSON with status `200`
```
{
    message: "Password Changed"
}
```
Otherwise send error
```
{
    error: "User not found."
}
``` 
##### Logout `POST /logout`
It removes auth token and cookie. If successful it sends response with status `200`
```
{
    message: "user logged out"
}
```
and if there is error it sends response with status `500`
```
{
    error: "Cannot logout"
}
``` 
##### Information `GET /info/:id`
If id of user is valid then it sends info with status `200`
```
{
    name: "Upendra Upadhyay",
    email: "upendra.upadhyay.97@gmail.com",
    contact: "9460979571",
    password: "up123456789",
    address: "Here",
    kind: "Admin",
    owner: "",
    members: []
}
```
else it sends error like `User not found.` and status `404`
```
{
    error: "ERROR MESSAGE"
}
```
##### Reset `POST /reset`
If email is correct then it generate reset token and sends new password and link to reset password like
```
please go to http://localhost:5000/reset/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjJiODlhZjI0MjhlNzU0YmRhMWQ4Y2MiLCJhY2Nlc3MiOiJyZXNldCIsImlhdCI6MTUyOTU4MTY1M30.f7_umVhHThvlzk77617H1X-zFy8rQXrp_FLwomC3uUI/Z108qfdg for new password Z108qfdg
```
Here `localhost` is your hostname, `5000` is a port number, `Z108qfdg` is the new randomly generated 8 character password and Response with status `200`
```
{
    message: "Mail sent with token"
}
```
and if failed then it sends response with status `401`
```
{
    error: "user not found "
}
```
##### Reset Password `GET /reset/:id/:password `
If id of user is valid then password is changed, reset token is removed and sends response
```
{
    message: "Password reset done"
}
```
and if there is an error then it sends response with status `404`
```
{
    error: "Token invalid"
}
```
##### Verify `GET /verify/:id`
If id of user is valid then user is verified, verify token is removed and sends response
```
{
    message: "User Verified"
}
```
and if there is a error it sends response with status `404`
```
{
    error: "Token removal failed"
}
``` 
#### Order API `/order`
##### History `GET /history`
if user is logged in then it sends an object
```
[  
    {
       "location" : "there",
       "status" : "Verified",
       "driver" : {
           "name" : "xyz",
           "contact" : "9460979571"
       },
       "_id" : "5b1fb314da803c5778012339",
       "message" : "Order Updated",
       "date" : "Tue Jun 12 2018 17:20:44 GMT+0530 (IST)"
    }, 
    {
       "message" : "Order Deleted",
       "_id" : "5b1fb314da803c5778012339",
       "date" : "Tue Jun 12 2018 17:29:41 GMT+0530 (IST)"
    }
] 
```
otherwise sends empty object
```
{

}
```
##### Order Requests `GET /request/verify`
It gets all the order requests of members(like sub-dealers) of logged in user which needed to be verified.
if user is authenticated then it sends response
```
[
    {
        "_id" : ObjectId("5b2c81749c5bf0186a7db4fa"),
        "materialType" : "GBS_SLAG",
        "packingType" : "2Side Lamination",
        "status" : "NotVerified",
        "address" : "room number 525, nirwana boys hostel, skit college",
        "quantity" : "26",
        "contact" : "09460979571",
        "pincode" : 302017,
        "GST" : "",
        "name" : "Upendra Upadhyay",
        "userId" : "5b2b942fcd9ba35b3b9b5ab2",
        "__v" : 0,
        "driver" : {
            "name" : "",
            "contact" : ""
        },
        "location" : ""
    },
    {
        "_id" : ObjectId("5b2c81749c5bf0186a7db4fb"),
        "materialType" : "GBS_SLAG",
        "packingType" : "Loose",
        "status" : "Delivered",
        "address" : "room number 525, nirwana boys hostel, skit college",
        "quantity" : "27",
        "contact" : "09470979571",
        "pincode" : 302017,
        "GST" : "",
        "name" : "Upendra Upadhyay",
        "userId" : "5b2b942fcd9ba35b3b9b5ab2",
        "__v" : 0,
        "driver" : {
            "name" : "",
            "contact" : ""
        },
        "location" : ""
    }
]

```
and if there is error the it sends error response
```
{
    error: "ERROR MESSAGE"
}
``` 
##### Order List `GET /`
It gets list of order which are not verified of the user logged in and it sends response
```
[
    {
        "_id" : ObjectId("5b2c9cdd8564c71e65403850"),
        "materialType" : "CLINKER",
        "packingType" : "Loose",
        "status" : "NotVerified",
        "address" : "room number 525, nirwana boys hostel, skit college",
        "quantity" : "26",
        "contact" : "09460979571",
        "pincode" : 302017,
        "GST" : "",
        "name" : "Upendra Upadhyay",
        "userId" : "5b2b942fcd9ba35b3b9b5ab2",
        "__v" : 0
    },
    {
            "_id" : ObjectId("5b2c9cdd8564c71e65403851"),
            "materialType" : "CLINKER",
            "packingType" : "Loose",
            "status" : "NotVerified",
            "address" : "room number 525, nirwana boys hostel, skit college",
            "quantity" : "26",
            "contact" : "09460979572",
            "pincode" : 302017,
            "GST" : "",
            "name" : "Upendra",
            "userId" : "5b2b942fcd9ba35b3b9b5ab2",
            "__v" : 0
        }
]
```
and if there is an error then it sends error response with status `505`
```
{
    error: "ERROR MESSAGE"
}
``` 
##### Create Order `POST /`
it create order to the user logged in and accept request JSON and log the order to history
```
{
    "materialType" : "CLINKER",
    "packingType" : "Loose",
    "status" : "NotVerified",
    "address" : "room number 525, nirwana boys hostel, skit college",
    "quantity" : "26",
    "contact" : "09460979572",
    "pincode" : 302017,
    "GST" : "",
    "name" : "Upendra",
}
```
and if order is successfully created it sends response with message
```
{
    message: "Order Created"
}
``` 
otherwise if there is an error then it sends error response with status `500`
```
{
    error: "ERROR MESSAGE"
}
``` 
##### Update Order `PUT /:id`
It update the order with status, location and driver details of members by accepting a request json and log the updated order to history
```
{
    "location" : "There",
    "driver" : {
        "name" : "Upendra Upadhyay",
        "contact" : "9460979571"
    },
    "status" : "Delivered",
}
```
and if order is successfully updated it sends response with message
```
{
    message: 'Order 5b2c81749c5bf0186a7db4fa updated'
}
```
otherwise if there is an error then it sends error response with status `500`
```
{
    error: "ERROR MESSAGE"
}
```
##### Delete Order `DELETE /:id`
It deletes the order with id of members or user logged in and if successful it sends message response with status `200` and log the deleted order to history
```
{
    message: 'Order 5b2c81749c5bf0186a7db4fa deleted'
}
```
otherwise if there is an error then it sends error response with status `505`
```
{
    error: "ERROR MESSAGE"
}
```
##### Track Order `GET /track`
It gets list of order which are verified of the user logged in and it sends response
```
[
    {
        "_id" : ObjectId("5b2c9cdd8564c71e65403850"),
        "materialType" : "CLINKER",
        "packingType" : "Loose",
        "status" : "Delivered",
        "address" : "room number 525, nirwana boys hostel, skit college",
        "quantity" : "26",
        "contact" : "09460979571",
        "pincode" : 302017,
        "GST" : "",
        "name" : "Upendra Upadhyay",
        "userId" : "5b2b942fcd9ba35b3b9b5ab2",
        "__v" : 0
    },
    {
            "_id" : ObjectId("5b2c9cdd8564c71e65403851"),
            "materialType" : "CLINKER",
            "packingType" : "Loose",
            "status" : "Verified",
            "address" : "room number 525, nirwana boys hostel, skit college",
            "quantity" : "26",
            "contact" : "09460979572",
            "pincode" : 302017,
            "GST" : "",
            "name" : "Upendra",
            "userId" : "5b2b942fcd9ba35b3b9b5ab2",
            "__v" : 0
        }
]
```
otherwise if there is an error then it sends error response with status `505`
```
{
    error: "ERROR MESSAGE"
}
```
##### Download `GET /download`
It gets all the order requests of members(like sub-dealers) of logged in user which needed to be verified and create a download to a CSV file and send it.
and if there is an error, it sends error response message
```
{
    error: "ERROR MESSAGE"
}
```
#### User API `/user`
##### User Information `GET /`
It sends the info about logged in user and sends JSON response
```
{
    _id: ObjectId("5b2b89af2428e754bda1d8cc")
    name: "Upendra Upadhyay",
    email: "upendra.upadhyay.97@gmail.com",
    contact: "9460979571",
    password: "up123456789",
    address: "Here",
    kind: "Admin",
    owner: "",
    members: []
}
``` 
##### User Requests `GET /request
If a sends all the members which do not have any superior to user logged in.
```
[
    {
        _id: ObjectId("5b2b89af2428e754bda1d8cc")
        name: "Upendra Upadhyay",
        email: "upendra.upadhyay.97@gmail.com",
        contact: "9460979571",
        password: "$2a$10$86xiF/zyvpG8zOWVXV1OCu1doVt8xq4gkoQNJ4b25E.uEjqLigQNC",
        address: "Here",
        kind: "dealer",
        owner: "",
        members: []
    },
    {
            _id: ObjectId("5b2b89af2428e754bda1d8cc")
            name: "Upendra",
            email: "upendra.97@gmail.com",
            contact: "9460979572",
            password: "$2a$10$86xiF/zyvpG8zOWVXV1OCu1doVt8xq4gkoQNJ4b25E.uEjqLigQNC",
            address: "Here",
            kind: "Admin",
            owner: "",
            members: []
    }
]
````
##### User Requests `GET /request/accept/:id`
It make the user with id a member of logged in user and sends empty object
```
{
    
}
```
### Database Architecture
#### User Database
