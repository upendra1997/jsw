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
      "database_port":"27017"
  	}
    ```
    change secret and other variables accordingly.
3. install [node](https://nodejs.org) and run `npm install` 
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

## Install on heroku

1. Go to [heroku](https://www.heroku.com/) and signup and get [herku client](https://devcenter.heroku.com/articles/heroku-cli).
2. Go to project folder and run `heroku create` and enter login id.
3. run `heroku addons:create mongolab`.
4. run `git push heroku master`.
    
    
    
    
  