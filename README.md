eq_module_scafold
=========

A small library which will help to create the sails.js custom hook

## Installation

  npm i eq_module_scafold --save
  npm install

  ## change the connections in api/base/Model.js

  	-> demoServer to the actual connection which is specified in the your main sails app
  	i.e connection name from the youApp/config/connections.js

  	Note: You can use the different connection from your main app

  ## Model/Controller

  		Now write you 
    	module in the  module_name/api/modules     i.e City.js
  	 	controller in module_name/api/controllers  i.e CityController.js 

  ## Route

  	Specify the module route into your Main app

  	i.e in your main app(myApp/config/routes.js) put 
	
	>  	'GET /cities'                 : 'CityController.list'


## Usage

	Now start your app with sails lift 
	your app will start with your module Model and controller
	
## Release History

* 0.0.4 Initial release