// Import express
var express = require("express");
var app = express();


var formidable = require("express-formidable");
app.use(formidable());

// Import http 
var http = require('http').createServer(app);
var bcrypt  = require("bcrypt");
var fileSystem = require("fs");

// database
var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;

// json 
var jwt = require("jsonwebtoken");
var accessTokenSecret = "myAccessTokenSecret1234567890";

var socketIO = require("socket.io")(http);
var socketID = "";

// URL 
var mainURL = "http://localhost:3000";

socketIO.on("connection", function(socket){
    console.log("user conncected", socket.id);
    socketID = socket.id;
})
// Static Files
app.use(express.static("public"));
app.use('/images', express.static(__dirname + 'public/images'));
app.use('/style', express.static(__dirname + 'public/style'));
app.use('/videos', express.static(__dirname + 'public/videos'));

// Set Views
app.set('views', './views');
app.set('view engine', 'ejs');

// root (home page)
app.get('', (req, res) => {
    res.render('index');
});

// get index2 page 
app.get('/index2', (req, res) => {
    res.render('index2');
});

// get Register page
app.get('/register', (req, res) => {
    res.render('register');
});



// listening
http.listen(3000, function(){
    console.log("Server started at " + mainURL);
     
    mongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, function (error, client){
        //if (error) throw error;
        var database = client.db("our_project");
        console.log("Database connected");
        // get Laureate register
        app.get('/registerLaureate', (req, res) => {
            res.render('registerLaureate');
        });
        app.post("/registerLaureate", function(req, res) {
            var name = req.fields.name;
            var username = req.fields.username;
            var branch = req.fields.branch;
            var pfe_domain = req.fields.pfe_domain;
            var work_domain = req.fields.work_domain;
            var email = req.fields.email;
            var password = req.fields.password;
            var pwd_repeat = req.fields.pwd_repeat;
            var reset_token = "";

            database.collection("users").findOne({
                $or:[{
                    "email": email},
                    {
                    "username": username

                }]
            }, function(error, user){
                if(user == null){
                    bcrypt.hash(password, 10, function (error, hash) {
                        database.collection("users").insertOne({
                            "name": name,
                            "username": username,
							"email": email,
                            "branch": branch,
							"password": hash,
							"reset_token": reset_token,
							"profileAvatar": "",
							"coverPhoto": "",
							"birth_date": "",
							"city": "",
							"country": "",
							"aboutMe": "",
							"friends": [],
							"pages": [],
							"notifications": [],
							"groups": [],
							"posts": []
							
						}),
						database.collection("laureates").insertOne({
							"name": name,
							"email": email,
                            "branch": branch,
                            "work_domain": work_domain,
                            "pfe_domain" : pfe_domain,
							"password": hash,
							"reset_token": reset_token,
							"profileAvatar": "",
							"coverPhoto": "",
							"birth_date": "",
							"city": "",
							"country": "",
							"aboutMe": "",
							"friends": [],
							"pages": [],
							"notifications": [],
							"groups": [],
							"posts": []
						}, function (error, data) {
                            //if(error) throw error;
                            console.log("1 document inserted");
							res.json({
								"status": "success",
								"message": "Signed up successfully. You can login now."
							});
						});
					});
				}else {
					res.json({
						"status": "error",
						"message": "Email or username already exist."
					});
				}                
            });

        });
        // get Student register
        app.get('/registerStudent', (req, res) => {
            res.render('registerStudent');
        });
        app.post("/registerStudent", function(req, res) {
            var name = req.fields.name;
            var username = req.fields.username;
            var branch = req.fields.branch;
            var ine = req.fields.ine;
            var email = req.fields.email;
            var password = req.fields.password;
            var pwd_repeat = req.fields.pwd_repeat;
            var reset_token = "";

            database.collection("users").findOne({
                $or:[{
                    "email": email},
                    {
                    "username": username
                }]
            }, function(error, user){
                if(user == null){
                    
                    bcrypt.hash(password, 10, function (error, hash) {
                        database.collection("users").insertOne({
                            "name": name,
                            "username": username,
							"email": email,
                            "branch": branch,
							"password": hash,
							"reset_token": reset_token,
							"profileAvatar": "",
							"birth_date": "",
							"city": "",
							"country": "",
							"aboutMe": "",
							"friends": [],
							"pages": [],
							"notifications": [],
							"groups": [],
							"posts": []
							
						})
						database.collection("students").insertOne({
							"name": name,
                            "username": username,
							"email": email,
                            "branch": branch,
							"password": hash,
							"reset_token": reset_token,
							"profileAvatar": "",
							"coverPhoto": "",
							"birth_date": "",
							"city": "",
							"country": "",
							"aboutMe": "",
							"friends": [],
							"pages": [],
							"notifications": [],
							"groups": [],
							"posts": []
						}, function (error, data) {
                            console.log("1 document inserted");
							res.json({
								"status": "success",
								"message": "Signed up successfully. You can login now."
							})
						});
					});
				}else {
					res.json({
						"status": "error",
						"message": "Email or username already exist."
					});
				}                
            });

        });
        // get None register
        app.get('/registerNone', (req, res) => {
            res.render('registerNone');
        });

        app.post("/registerNone", function(req, res) {
            var name = req.fields.name;
            var username = req.fields.username;
            var email = req.fields.email;
            var password = req.fields.password;
            var pwd_repeat = req.fields.pwd_repeat;
            var reset_token = "";

            database.collection("users").findOne({
                $or:[{
                    "email": email},
                    {
                    "username": username
                }]
            }, function(error, user){
                if(user == null){
                    check = true;
                    bcrypt.hash(password, 10, function (error, hash) {
                        database.collection("users").insertOne({
                            "name": name,
                            "username": username,
							"email": email,
							"password": hash,
							"reset_token": reset_token,
							"profileAvatar": "",
							"coverPhoto": "",
							"birth_date": "",
							"city": "",
							"country": "",
							"aboutMe": "",
							"friends": [],
							"pages": [],
							"notifications": [],
							"groups": [],
							"posts": []
							
						})
						database.collection("nones").insertOne({
							"name": name,
                            "username": username,
							"email": email,
							"password": hash,
							"reset_token": reset_token,
							"profileAvatar": "",
							"coverPhoto": "",
							"birth_date": "",
							"city": "",
							"country": "",
							"aboutMe": "",
							"friends": [],
							"pages": [],
							"notifications": [],
							"groups": [],
							"posts": []
						}, function (error, data) {
                            console.log("1 document inserted");
							res.json({
								"status": "success",
								"message": "Signed up successfully. You can login now."
							})
						});
					});
				}else {
					res.json({
						"status": "error",
						"message": "Email or username already exist."
					});
				}                
            });

        });

        // get login page
        app.get('/login', (req, res) => {
            res.render('login');
        });

       
        app.post("/login", function (req, res) {
			var email = req.fields.email;
			var password = req.fields.password;
			database.collection("users").findOne({
				"email": email
			}, function (error, user) {
				if (user == null) {
					res.json({
						"status": "error",
						"message": "Email does not exist"
					});
				} else {
					bcrypt.compare(password, user.password, function (error, isVerify) {
						if (isVerify) {
							var accessToken = jwt.sign({ email: email }, accessTokenSecret);
							database.collection("users").findOneAndUpdate({
								"email": email
							}, {
								$set: {
									"accessToken": accessToken
								}
							}, function (error, data) {
								res.json({
									"status": "success",
									"message": "Login successfully",
									"accessToken": accessToken,
									"profileAvatar": user.profileAvatar	
								});
							});
						} else {
							res.json({
								"status": "error",
								"message": "Password is not correct"
							});
						}
					});
				}
			});
		});

		app.get("/user/:username", function (req, res) {
			database.collection("users").findOne({
				"username": req.params.username
			}, function (error, user) {
				if (user == null) {
					res.send({
						"status": "error",
						"message": "User does not exists"
					});
				} else {
					res.render("userProfile", {
						"user": user
					});
				}
			});
		});


        // get updateProfile 
        app.get('/updateProfile', (req, res) => {
            res.render('updateProfile');
        })

		app.post("/getUser", function (req, res) {
			var accessToken = req.fields.accessToken;
			database.collection("users").findOne({
				"accessToken": accessToken
			}, function (error, user) {
				if (user == null) {
					res.json({
						"status": "error",
						"message": "User has been logged out. Please login again."
					});
				} else {
					res.json({
						"status": "success",
						"message": "Record has been fetched."
					});
				}
			});
		});

        app.post("/updateProfile", function (req, res) {
			var accessToken = req.fields.accessToken;
			var name = req.fields.name;
			var birth_date = req.fields.birth_date;
			var city = req.fields.city;
			var country = req.fields.country;
			var aboutMe = req.fields.aboutMe;

			database.collection("users").findOne({
				"accessToken": accessToken
			}, function (error, user) {
				if (user == null) {
					res.json({
						"status": "error",
						"message": "User has been logged out. Please login again."
					});
				} else {
					database.collection("users").updateOne({
						"accessToken": accessToken
					}, {
						$set: {
							"name": name,
							"birth_date": birth_date,
							"city": city,
							"country": country,
							"aboutMe": aboutMe
						}
					}, function (error, data) {
						res.json({
							"status": "status",
							"message": "Profile has been updated."
						});
					});
				}
			});
		});

        app.post("/uploadProfileAvatar", function (req, res) {
			var accessToken = req.fields.accessToken;
			var profileAvatar = "";

			database.collection("users").findOne({
				"accessToken": accessToken
			}, function (error, user) {
				if (user == null) {
					res.json({
						"status": "error",
						"message": "User has been logged out. Please login again."
					});
				} else {

					if (req.files.profileAvatar.size > 0 && req.files.profileAvatar.type.includes("image")) {

						if (user.profileAvatar != "") {
							fileSystem.unlink(user.profileAvatar, function (error) {
								//
							});
						}

						profileAvatar = "public/images/" + new Date().getTime() + "-" + req.files.profileAvatar.name;

						// Read the file
	                    fileSystem.readFile(req.files.profileAvatar.path, function (err, data) {
	                        if (err) throw err;
	                        console.log('File read!');

	                        // Write the file
	                        fileSystem.writeFile(profileAvatar, data, function (err) {
	                            if (err) throw err;
	                            console.log('File written!');

	                            database.collection("users").updateOne({
									"accessToken": accessToken
								}, {
									$set: {
										"profileAvatar": profileAvatar
									}
								}, function (error, data) {
									res.json({
										"status": "status",
										"message": "Profile image has been updated.",
										 data : mainURL + "/" + profileAvatar
									});
								});
	                        });

	                        // Delete the file
	                        fileSystem.unlink(req.files.profileAvatar.path, function (err) {
	                            if (err) throw err;
	                            console.log('File deleted!');
	                        });
	                    });
					} else {
						res.json({
							"status": "error",
							"message": "Please select valid image."
						});
					}
				}
			});
		});



        // login out
        app.get("/logout", function (req, res) {
			res.redirect("/login");
		});

        
        

        // get Cloud(SUD) page
        app.get('/index1', (req, res) => {
            res.render('index1');
        });
		app.get('/aseds', (req, res) => {
            res.render('aseds');
        }); 
		app.get('/iccn', (req, res) => {
            res.render('iccn');
        }); 
		app.get('/ict', (req, res) => {
            res.render('ict');
        }); 
		app.get('/data', (req, res) => {
            res.render('data');
        }); 
		app.get('/senum', (req, res) => {
            res.render('senum');
        }); 
		app.get('/amoa', (req, res) => {
            res.render('amoa');
        });
		

		

		

    });
});