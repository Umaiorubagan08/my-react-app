//Rest api with node js

var express = require("express");
var app = express(); //express js need to install in the terminal (npm install express)
var bodyParser = require('body-parser');
var fs = require("fs");


// GET method to get all the user data
app.get('/', function(req,res){
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err,data){
    res.end(data);
  });
});
 


// To get a particular user by ID
app.get('/:id', function(req,res){
  fs.readFile(__dirname + '/' + "users.json", "utf8", function(err,data){
    var users = JSON.parse(data);
    var user = users["user" + req.params.id]
    res.end(JSON.stringify(user));

  });
});


// POST method to add new users
// Middleware to parse JSON body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', function (req, res) {
   fs.readFile(__dirname + "/users.json", 'utf8', function (err, data) {
      var users = JSON.parse(data);
      var newUser = req.body; // Get the new user from the request body

      users["user" + newUser.id] = newUser; // Add new user with ID as the key

      fs.writeFile(__dirname + "/users.json", JSON.stringify(users, null, 2), function () {
         res.json(users); // Return updated users from the json data
      });
   });
});

// DELETE method to delete particular user by ID.
app.delete('/:id', function (req,res){
  fs.readFile(__dirname + '/' + 'users.json', 'utf8', function(err,data){
    data = JSON.parse(data);
    var id = "user" + req.params.id;
    var user = data[id];
    delete data["user" + req.params.id];
    res.end(JSON.stringify(data));
  })
})


// PUT method to update the existing user data resource
app.put("/:id", function(req, res){
  fs.readFile(__dirname + '/' + 'users.json', 'utf-8', function(err,data){
    var users = JSON.parse(data);
    var id = "user" + req.params.id;
    users[id] = req.body;
    res.end(JSON.stringify(users));
  })
})

// server and ports, we can use any ports
var server = app.listen(5000, function(){
  console.log("Express App is running at http://127.0.0.1:5000/")
})

