const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const net = require('net');
const expressValidator = require('express-validator')
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const randomstring = require("randomstring");
const SqlString = require('sqlstring');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
//authentication
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MySQLStore = require('express-mysql-session')(session);


const app = express();

/*
var logger = function(req, res, next){
	console.log('logging');
	next();
}
app.use(logger);

*/


//view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// set static path
app.use(express.static(__dirname + '/public'));

var options = {
	host     : 'localhost',
	user     : 'root',
	password : '123456',
	database : 'nodemysql'
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'vajndjacnjdancjj',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//Global vars
app.use(function(req,res,next){
	res.locals.errors = null;
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
});
//expressvalidator middleware
app.use(expressValidator());



// create connection
const db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '123456',
	database : 'nodemysql'
});

//connect

db.connect(function(err){
	if(err){
		throw err;
	}
	console.log("Mysql connected...")
});


/* create database
app.get('/createdb',function(req,res){
	let sql = 'CREATE DATABASE nodemysql';
	db.query(sql,function(err,result){
		if(err) throw err;
		console.log(result);
		res.send('Database created...')
	});
});

/* sessions tables
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB

let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, username VARCHAR(255), password VARCHAR(255), email VARCHAR(255), PRIMARY KEY(id))';
let sql = 'CREATE TABLE device(DeviceID int NOT NULL,CloudKey VARCHAR(255) NOT NULL,id int,PRIMARY KEY (DeviceID),FOREIGN KEY (id) REFERENCES users(id))';
let sql = 'CREATE TABLE mapgroup(groupid int AUTO_INCREMENT,id int, PRIMARY KEY (groupid),FOREIGN KEY (id) REFERENCES users(id))';
*/

//create table


// Generate SMTP service account from ethereal.email


    // NB! Store the account object values somewhere if you want
    // to re-use the same account for future mail deliveries

    // Create a SMTP transporter object
    /*
    let transporter = nodemailer.createTransport({
    	service: 'gmail',
		auth: {
		    type: 'OAuth2',
		    user: 'testingcf123@gmail.com',
		    clientId: '48647185518-lo5tcpibratqg6dse31hnoc16trnb07u.apps.googleusercontent.com',
		    clientSecret: '4_W7RNUoXraOKxyDtzySrJ0_',
		    refreshToken: '1/C8P6HxzWVPUAnE7_A8MiS3WZWrE7i3GDFMUujCicubU',
		    accessToken: 'ya29.Glt_BqdNTSekyKBHRnGkQtRNUKj1gOu9KX22Xb5P1RgPJvQA6dewioZG2YcbZNu25jgWScw7ziqdjaKd_QOsqq2FXC6LAf9QxYx7eJwygo21uR-wYbsMS4AFvZg4',
		  },

        });
        password: !Password123
    */


        /* An array of attachments
        attachments: [
            // String attachment
            {
                filename: 'notes.txt',
                content: 'Some notes about this e-mail',
                contentType: 'text/plain' // optional, would be detected from the filename
            },

            // Binary Buffer attachment
            {
                filename: 'image.png',
                content: Buffer.from(
                    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                        '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                        'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
                    'base64'
                ),

                cid: 'note@example.com' // should be as unique as possible
            },

            // File Stream attachment
            {
                filename: 'nyan cat ✔.gif',
                path: __dirname + '/assets/nyan.gif',
                cid: 'nyan@example.com' // should be as unique as possible
            }
        ],

        list: {
            // List-Help: <mailto:admin@example.com?subject=help>
            help: 'admin@example.com?subject=help',

            // List-Unsubscribe: <http://example.com> (Comment)
            unsubscribe: [
                {
                    url: 'http://example.com/unsubscribe',
                    comment: 'A short note about this url'
                },
                'unsubscribe@example.com'
            ],

            // List-ID: "comment" <example.com>
            id: {
                url: 'mylist.example.com',
                comment: 'This is my awesome list'
            }
            
        }
        */
const transporter = nodemailer.createTransport({
  	host: 'smtp.gmail.com',
	port: 465,
  	secure: true, // use SSL
  	auth: {
    	type: 'OAuth2',
    	user: 'testingcf123@gmail.com',
    	clientId: '48647185518-lo5tcpibratqg6dse31hnoc16trnb07u.apps.googleusercontent.com',
    	clientSecret: '4_W7RNUoXraOKxyDtzySrJ0_',
    	refreshToken: '1/c1PdXAFursJI_a0hdQhypEQWPNVgdobNz2F1oM7Z_DM',
  	},
});   


app.get('/createuserstable',function(req,res){
	let sql = 'CREATE TABLE device_mapgroup(gid int AUTO_INCREMENT,groupid int,DeviceID int,id int,CloudKey VARCHAR(255),groupname VARCHAR(255), PRIMARY KEY(gid),FOREIGN KEY (groupid) REFERENCES mapgroup(groupid),FOREIGN KEY (DeviceID) REFERENCES device(DeviceID),FOREIGN KEY (id) REFERENCES users(id))';
	db.query(sql,function(err,result){
		if(err) throw err;
		console.log(result);
		res.send('users table created')
	});
});

app.get('/',function(req,res){
	console.log(req.user);
	console.log(req.isAuthenticated())
	if(req.isAuthenticated()){
		db.query(SqlString.format('SELECT username FROM users WHERE id = ?',[req.user]),
	  		function(err,results,fields){
	  			if(err) throw err;
	  			console.log(results[0].username)
	  		});
	}
	res.render('home');

});

/*
app.get('/db',function(req,res){
	console.log(req.user);
	console.log(req.isAuthenticated())
	if(req.isAuthenticated()){
		db.query('SELECT username FROM users WHERE id = ?',[req.user],
	  		function(err,results,fields){
	  			if(err) throw err;
	  			console.log(results[0].username)
	  		});
	}
	res.render('dashboard');

});
*/
app.get('/groupdevices', authenticationMiddleware(), function(req,res){

	db.query(SqlString.format('SELECT groupid, groupname from mapgroup WHERE id = ?',[req.user]),function(error,results){
		if(error) throw error;


		res.render('groupdevices',{data:results});
	})
});

app.get('/groupdevices/info/:id', authenticationMiddleware(), function(req,res){

	db.query(SqlString.format('SELECT deviceid, groupid, groupname,devicename from device_mapgroup WHERE groupid = ?',[req.params.id]),function(error,results){
		if(error) throw error;


		res.render('groupdevicesinfo',{data:results});
	})
});

app.get('/login',function(req,res){
	res.render('login');
});

app.post('/login', passport.authenticate(
	'local',{
	successRedirect: '/index2',
	failureRedirect: '/login'
}));

passport.use(new LocalStrategy(
  function(username, password, done) {
  	console.log(username);
  	console.log(password);
  	db.query(SqlString.format('SELECT id, password,verify FROM users WHERE username = ?',[username]),
  		function(err,results,fields){
  			if (err) {done(err)};

  			if(results.length === 0){
  				done(null,false);
  			}else{
  				if(!results[0].verify){
  					done(null,false);
  				}
  				else{
		  			const hash = results[0].password.toString();

		  			bcrypt.compare(password, hash, function(err, response){
		  				if(response === true){

		  					return done(null, results[0].id);
		  				} else{
		  					return done(null,false);
		  				}
		  			});
		  		}
  			}


  			
  		})
      
  }
));

app.get('/logout',function(req,res){
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

app.get('/register',function(req,res){
	res.render('register',{
		complete: ''
	});
});

app.post('/register',function(req,res){

	req.checkBody('username', 'Username field cannot be empty.').notEmpty();
	req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
	req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
	req.checkBody('email', 'Email field cannot be empty').notEmpty();
	req.checkBody('password', 'Password must be at 8-16 character').len(8, 16);
	//req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
	//req.checkBody('passwordMatch', 'Re-enter Password must be notEmpty').notEmpty();
	req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);
 

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors: errors,
			complete: ''
		});
	} else {
		
		var username = req.body.username
		var password = req.body.password
		var email =  req.body.email
		var nck = randomstring.generate(6);
		  // Store hash in your password DB.
		var sql1 = SqlString.format('SELECT COUNT(*) AS countuser FROM users WHERE username = ?',[username]);
		db.query(sql1,
			function(error,result){
				console.log(result[0].countuser);
				if(result[0].countuser > 0){
					res.render('register',{complete: 'username already in use'});	
				} 
				else{

					bcrypt.hash(password, saltRounds, function(err, hash) {
						
						db.query(SqlString.format('INSERT INTO users(username,password,email,Cloudkey,verify) VALUES(?,?,?,?,?)',[username,hash,email,nck,false]),
							function(error,results,fields){
								if(error){
									res.render('register',{complete: 'Email already in use'});	
								}
								else{
									var current_date = (new Date()).valueOf().toString();
									var random = Math.random().toString();
									var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
									var link = "http://"+req.get('host')+"/verify/"+hash;

									    // Message object
									    let message = {
									    	from: 'cf <testingcf123@gmail.com>',
									        // Comma separated list of recipients
									        to: email,

									        // Subject of the message
									        subject: 'Please confirm your Email account',

									        // plaintext body
									        text: 'Hello to myself!',

									        // HTML body
									        html:
									            'Hello '+username+',<br> Please Click on the link to verify your email.<br><a href='+link+'>Click here to verify</a>'
									        };
									        transporter.sendMail(message, (error, info) => {
										        if (error) {
										            console.log('Error occurred');
										            console.log(error.message);
										            return process.exit(1);
										        }

										        console.log('Message sent successfully!');
										        console.log(nodemailer.getTestMessageUrl(info));

										        // only needed when using pooled connections
										        transporter.close();
										    });	

								    db.query(SqlString.format('SELECT id,email FROM users WHERE Username = ?',[username]),function(error,results,fields){
								    	if(error) throw error;


								    	db.query(SqlString.format('INSERT INTO email(id,email,hash) VALUES(?,?,?)',[results[0].id,results[0].email,hash]),
								    		function(error,results,fields){
								    			if(error) throw error;
								    			res.render('register',{complete: 'Please verify you email'});
								    		})
										
								    })
									

								}


							});
					});
				}
			});
	}


});

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
 
});

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}

app.get('/verify/:id',function(req,res){
	db.query(SqlString.format('SELECT id,hash FROM email WHERE hash = ?',[req.params.id]),
		function(error,results,fields){
			if(error) throw error;

			if(results.length == 0){
				res.redirect('/404');
			}
			else{
				var sql = SqlString.format('UPDATE users SET verify = ? WHERE id = ?',[true,results[0].id]);
				var sql2 = SqlString.format('DELETE FROM email WHERE hash = ?',[req.params.id]);
				db.query(sql,function(error,results,fields){
					if(error) throw	error;

					if(results.affectedRows){
						db.query(sql2,function(error,results,fields){
							if(error) throw error;
							res.render('verified');
						})
					}
		
				})
			}
		})
});

app.get('/adddevice',authenticationMiddleware(),function(req,res){
	var sql1 = SqlString.format('SELECT Cloudkey FROM users WHERE id = ?',[req.user]);
	db.query(sql1,function(err,results){
		if(err) throw err;
		res.render('adddevice',{error: '',uck:results[0].Cloudkey});
	})
	
});

app.post('/adddevice',function(req,res){
	//req.checkBody('deviceid', 'Device ID field cannot be empty.').notEmpty();
	//req.checkBody('deviceid', 'Device ID field can only be numeric').isInt();
	//req.checkBody('deviceid', 'Device ID must be between 10 characters long.').len(10);
	req.checkBody('cloudkey', 'cloudkey field cannot be empty.').notEmpty();
	req.checkBody('cloudkey', 'cloudkey must be between 6 characters long.').len(6);
	req.checkBody('devicename', 'devicename field cannot be empty.').notEmpty();
	req.checkBody('devicename', 'devicename must be between 4-15 characters long.').len(4, 15);

	var errors = req.validationErrors();

	if(errors){
		res.render('adddevice',{
			errors: errors,
			error: "Please check for errors"
		});
	} else {

		//var deviceid = req.body.deviceid
		var cloudkey = req.body.cloudkey
		var username = req.body.devicename
		var userid = req.user

		var sql1 = SqlString.format('SELECT COUNT(*) AS countdevice FROM device WHERE devicename = ? AND id = ?',[username,userid]);
		db.query(sql1,
			function(error,result){
				console.log(result[0].countdevice);
				if(result[0].countdevice > 0){
					console.log(result[0].countdevice);
					var sql3 = SqlString.format('SELECT Cloudkey FROM users WHERE id = ?',[req.user])
						db.query(sql3,function(err,results3){
							if(err) throw err;
							res.render('adddevice',{
								error: "DeviceName already exist",uck:results3[0].Cloudkey
							});
						})
					
				} 
				else{
					var sql = SqlString.format('INSERT INTO device(CloudKey,devicename,id) VALUES(?,?,?)',[cloudkey,username,userid]);
					db.query(sql,
						function(error,results,fields){
							if(error){
								res.render('adddevice',{error: 'insert error'});	
							}
							else{
								res.redirect('/devices')	
								console.log("success")
							}
					})
				}
			})

	}

});
/*
					if(cloudkey.length == 0){
						var sql2 = 'SELECT Cloudkey FROM users WHERE id = ?'
						db.query(sql2,[userid],function(error,results1){
								var sql = 'INSERT INTO device(CloudKey,devicename,id) VALUES(?,?,?)'
									db.query(sql,[results1[0].Cloudkey,username,userid],
										function(error,results,fields){
											if(error){
												res.render('adddevice',{error: 'insert error'});	
											}
											else{
												res.render('adddevice',{error: 'success'});	
												console.log("success")
											}
							})
						})

					}
*/


app.get('/device/edit/:id',authenticationMiddleware(),function(req,res){
	
	db.query(SqlString.format('SELECT * from device WHERE DeviceID = ?',[req.params.id]),function(error,results){
		if(error) throw error;
		res.render('editdevice',{data:results,error:''});
	})
	
});

app.post('/device/edit/:id',authenticationMiddleware(),function(req,res){

	var editdn = req.body.Editdevicename
	var editck = req.body.Editcloudkey
	var sql = SqlString.format('UPDATE device SET Cloudkey = ?, devicename = ? WHERE	DeviceID = ?',[editck,editdn,req.params.id]);
	var sql2 = SqlString.format('UPDATE device_mapgroup SET Cloudkey = ?, devicename = ? WHERE	DeviceID = ?',[editck,editdn,req.params.id]);
	db.query(sql,async function(error,results){
		if(error) throw error;
		if(results.affectedRows)
		{
			res.redirect('/devices')
		}
	})
	db.query(sql2,async function(error,results){
		if(error) throw error;
		if(results.affectedRows)
		{
			res.redirect('/devices')
		}
	})
	
});

app.get('/device/delete/:id',authenticationMiddleware(),function(req,res){
	var sql = SqlString.format('DELETE FROM device WHERE DeviceID = ?',[req.params.id]);
	db.query(sql,function(error,results){
		if(error){
			res.redirect('/devices')
		}
		else if(results.affectedRows)
		{
			res.redirect('/devices')
		}
	})
});

app.get('/mapdevice',authenticationMiddleware(),function(req,res){

	db.query(SqlString.format('SELECT * from device WHERE id = ?',[req.user]),function(error,results){
		if(error) throw error;


		res.render('mapdevice',{data:results,error:''});


	})
});

app.post('/mapdevice', authenticationMiddleware(),function(req,res){
	console.log(req.body.checkbox)

	var groupname = req.body.groupname
	var userid = req.user
	var devices = req.body.checkbox;
	if(devices == undefined || devices.length == 1){
		res.render('mapdevice',{data:results,error:'check at least 2 check box'});
		
	}
	else{
		db.query(SqlString.format('INSERT INTO mapgroup(id,groupname) VALUES(?,?)',[userid,groupname]),
			function(error,results,fields){
				if(error) throw	error;
				console.log("inserted into group")

		})

		db.query(SqlString.format('SELECT groupid, groupname FROM mapgroup WHERE groupname = ? AND id = ?',[groupname,userid]),
			function(error,results,fields){
				if(error) throw error;
				var gid = results[0].groupid
				var gn = results[0].groupname

				for(i =0;i < devices.length; i++){
					db.query(SqlString.format('SELECT CloudKey,devicename,DeviceID FROM device WHERE DeviceID = ?',[devices[i]]),
						function(error,result,fields){
							if(error) throw error;
							var ck = result[0].CloudKey
							console.log(gid,gn)
							console.log(ck)
							
							db.query(SqlString.format('INSERT INTO device_mapgroup(groupid,DeviceID,id,CloudKey,groupname,devicename) VALUES(?,?,?,?,?,?)',[gid,result[0].DeviceID,userid,ck,gn,result[0].devicename]),
								function(error,results,fields){
									if(error) throw error;
									
									console.log(' success')
								})
						
					})
				}
				
		})
		res.redirect('/groupdevices')
		
	}
	
});

app.get('/groupdevice/delete/:id',authenticationMiddleware(),function(req,res){
	var sql = SqlString.format('DELETE FROM device_mapgroup WHERE groupid = ?',[req.params.id]);
	var sql1 = SqlString.format('DELETE FROM mapgroup WHERE groupid = ?',[req.params.id]);
	var sql2 = SqlString.format('DELETE FROM rules WHERE groupid = ?',[req.params.id]);
	var sql3 = SqlString.format('SELECT COUNT(*) AS countuser FROM rules WHERE groupid= ?',[req.params.id]);

	db.query(sql,function(error,results){
		if(error) throw error;
			db.query(sql3,function(error,results){
			if(results[0].countuser > 0 ){
				db.query(sql2,function(error,results){
					if(error) throw error;
					db.query(sql1,function(error,results){
						if(error) throw error;
						if(results.affectedRows)
							{
								res.redirect('/groupdevices')
							}
						})
					})
				}
				else{
					db.query(sql1,function(error,results){
						if(error) throw error;
						if(results.affectedRows)
							{
								res.redirect('/groupdevices')
							}
						})
					
				}
			})
			
		
	})
	

});

app.get('/groupdevice/edit/:id',authenticationMiddleware(),function(req,res){
	db.query(SqlString.format('SELECT deviceid, groupid, groupname,devicename from device_mapgroup WHERE groupid = ?',[req.params.id]),function(error,results2){
		if(error) throw error;

		db.query(SqlString.format('SELECT * from device WHERE id = ?',[req.user]),function(error,results){
		if(error) throw error;


		res.render('editmapdevice',{data:results,data2:results2,error:''});


		})

	})
	
	
});

app.post('/groupdevice/edit/:id', authenticationMiddleware(),function(req,res){
	console.log(req.body.checkbox)

	var userid = req.user
	var devices = req.body.checkbox;
	if(devices == undefined || devices.length == 1){
		res.render('mapdevice',{data:results,error:'check at least 2 check box'});
		
	}
	else{
		var sql = SqlString.format('DELETE FROM device_mapgroup WHERE groupid = ?',[req.params.id]);

		db.query(sql,function(error,result){
			if(error) throw error;
		})

		db.query(SqlString.format('SELECT groupid, groupname FROM mapgroup WHERE groupid = ? AND id = ?',[req.params.id,userid]),
			function(error,results,fields){
				if(error) throw error;
				var gid = results[0].groupid
				var gn = results[0].groupname
				db.query(SqlString.format('SELECT CloudKey,devicename FROM device WHERE id = ?',[userid]),
					function(error,result,fields){
						if(error) throw error;
						var ck = result[0].CloudKey
						console.log(gid,gn)
						console.log(ck)
						for(i =0;i < devices.length; i++){
							db.query(SqlString.format('INSERT INTO device_mapgroup(groupid,DeviceID,id,CloudKey,groupname,devicename) VALUES(?,?,?,?,?,?)',[gid,devices[i],userid,ck,gn,result[i].devicename]),
								function(error,results,fields){
									if(error) throw error;
									
									console.log(' success')
								})
						}
				})
				
		})
		res.redirect('/groupdevices')
	}
	
});

app.get('/devices',authenticationMiddleware(),function(req,res){

	db.query(SqlString.format('SELECT * from device WHERE id = ?',[req.user]),function(error,results){
		if(error) throw error;


		res.render('devices',{data:results,error:''});


	})
});

app.get('/api/devices',authenticationMiddleware(),function(req,res){
	db.query(SqlString.format('SELECT * from device_mapgroup WHERE id = ?',[req.user]),function(error,results,fields){
		if(error) throw error;


		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));


	})
});

app.get('/index2',authenticationMiddleware(),function(req,res){
	db.query(SqlString.format('SELECT * from device WHERE id = ?',[req.user]),function(error,results){
		if(error) throw error;


		res.render('index2',{data:results});


	})
});
app.get('/profile',authenticationMiddleware(),function(req,res){
	var sql = SqlString.format('SELECT COUNT(*) AS countuser FROM profile WHERE id = ?',[req.user]);
	db.query(sql,function(error,results){
		if(results[0].countuser < 1){
			res.redirect('/createnewprofile')
		}
		else{
			var sql1 = SqlString.format('SELECT * FROM profile WHERE id = ?',[req.user]);
			db.query(sql1,function(err,results1){	
				res.render("profile",{fname: results1[0].FIRST_NAME,lname: results1[0].LAST_NAME,uemail: results1[0].email ,ucompany: results1[0].company})
			})
		}
	})
});

app.post('/updateprofile',authenticationMiddleware(),function(req,res){
	var first_name = req.body.firstname
	var last_name = req.body.lastname
	var email = req.body.email
	var company = req.body.company
	var sql = SqlString.format('UPDATE profile SET FIRST_NAME = ? ,LAST_NAME = ? , email = ? , company = ? WHERE id = ?',[first_name,last_name,email,company,req.user]);
	var sql1 = SqlString.format('UPDATE users SET email = ? WHERE id = ?',[email,req.user]);
	db.query(sql,async function(err,result){
		if(err) throw err;

	});
	db.query(sql1,async function(err,results1){
		if(err) throw err;

		res.redirect('/profile')
	});
});

app.get('/createnewprofile',authenticationMiddleware(),function(req,res){
	res.render('createnewprofile')
});

app.post('/createnewprofile',function(req,res){
	var first_name = req.body.firstname
	var last_name = req.body.lastname
	var company = req.body.company

	sql = SqlString.format('SELECT email FROM users WHERE id = ?',[req.user]);
	db.query(sql,function(err,result){
		if(err) throw err;
		sql1 = SqlString.format('INSERT INTO profile(FIRST_NAME,LAST_NAME,email,company,id) VALUES(?,?,?,?,?)',[first_name,last_name,result[0].email,company,req.user]);

		db.query(sql1,function(err,result){
			if(err) throw err;

			res.redirect('/profile');

		});
	})
	

});

app.get('/rulestable',authenticationMiddleware(),function(req,res){
	sql  = SqlString.format('SELECT * FROM rules WHERE id = ?',[req.user]);

	db.query(sql,function(err,results){
		if(err) throw error;

		res.render('rulestable',{data:results})
	})
})

app.get('/rules',authenticationMiddleware(),function(req,res){
	db.query(SqlString.format('SELECT groupid, groupname from mapgroup WHERE id = ?',[req.user]),function(error,results){
			if(error) throw error;
			//db.query(SqlString.format('SELECT deviceid from '))
			res.render('rules',{data:results,error: ''});
	})


});

app.post('/rules',authenticationMiddleware(),function(req,res){
	req.checkBody('input', 'cloudkey field cannot be empty.').notEmpty();
	req.checkBody('output', 'devicename field cannot be empty.').notEmpty();
	req.checkBody('time', 'time field cannot be empty.').notEmpty();

	var errors = req.validationErrors();

	if(errors){
			db.query(SqlString.format('SELECT groupid, groupname from mapgroup WHERE id = ?',[req.user]),function(error,results){
			if(error) throw error;
			res.render('rules',{
				errors: errors,
				error: "Please check for errors",
				data:results
			});
		})
		
	} else {
		var rulename = req.body.rulename;
		var selectpick = req.body.selectpicker;
		var myselect = req.body.mySelect;
		var input = req.body.input;
		var output = req.body.output;
		var time = req.body.time;
		var sendemail = req.body.email;

		sqlfalse = SqlString.format('INSERT INTO rules(rulename,deviceid,input,output,time,email,groupid,id) VALUES(?,?,?,?,?,?,?,?)',[rulename,myselect,input,output,time,false,selectpick,req.user]);
		sqltrue = SqlString.format('INSERT INTO rules(rulename,deviceid,input,output,time,email,groupid,id) VALUES(?,?,?,?,?,?,?,?)',[rulename,myselect,input,output,time,true,selectpick,req.user]);
		if(sendemail == undefined){
			db.query(sqlfalse,function(err,result){
			if(err) throw err;

			res.redirect('/rulestable');
			});
		}
		else{
			db.query(sqltrue,function(err,result){
			if(err) throw err;

			res.redirect('/rulestable');
			});
			console.log('check');
		}
		
	}
})

app.get('/rules/edit/:id',authenticationMiddleware(),function(req,res){
	console.log(req.query);
	console.log(req.params.id)
	db.query(SqlString.format('SELECT groupid, groupname from mapgroup WHERE id = ?',[req.user]),function(error,results){
			if(error) throw error;
			//db.query(SqlString.format('SELECT deviceid from '))
			db.query(SqlString.format('SELECT rulename, ruleid, input, output ,time, email from rules WHERE ruleid = ?',[req.params.id]),function(error,results2){
			if(error) throw error;
			//db.query(SqlString.format('SELECT deviceid from '))
			res.render('editrules',{data:results,data2:results2,error: ''});
		})
	})

	
});



app.post('/rules/edit/:id',authenticationMiddleware(),function(req,res){
	var rulename = req.body.rulename;
	var group = req.body.selectpicker;
	var deviceid = req.body.mySelect;
	var input = req.body.input;
	var output = req.body.output;
	var time = req.body.time
	var email = req.body.email;
	var sqlfalse = SqlString.format('UPDATE rules SET rulename = ?, deviceid = ?, input = ?, output = ?, time = ?, groupid = ?, email = ? WHERE ruleid = ?',[rulename,deviceid,input,output,time,group,false,req.params.id]);
	var sqltrue = SqlString.format('UPDATE rules SET rulename = ?, deviceid = ?, input = ?, output = ?, time = ?, groupid = ?, email = ? WHERE ruleid = ?',[rulename,deviceid,input,output,time,group,true,req.params.id]);
	console.log(email,rulename)
	if(email == undefined){
			db.query(sqlfalse,function(err,result){
			if(err) throw err;

			res.redirect('/rulestable');
			});
		}
		else{
			db.query(sqltrue,function(err,result){
			if(err) throw err;

			res.redirect('/rulestable');
			});
			console.log('check');
		}
	
});

app.get('/rules/delete/:id',authenticationMiddleware(),function(req,res){
	var sql = SqlString.format('DELETE FROM rules WHERE ruleid = ?',[req.params.id]);
	db.query(sql,function(error,results){
		if(error){
			res.redirect('/rulestable')
		}
		else if(results.affectedRows)
		{
			res.redirect('/rulestable')
		}
	})
})

app.get('/changepassword',authenticationMiddleware(),function(req,res){
	res.render('changepassword',{error: ''});
})

app.post('/changepassword',function(req,res){
	var oldpassword = req.body.oldpassword;
	var newpassword = req.body.newpassword

	var sql = SqlString.format('SELECT password FROM users WHERE id = ?',[req.user]);

	db.query(sql,function(err,results,fields){
		if(err) throw err;

		if(results.length == 0) {
			res.render('changepassword',{error: 'No such user'})
		}
		else{
			const hash = results[0].password.toString();

  			bcrypt.compare(oldpassword, hash, function(err, response){
  				if(response === true){
  					bcrypt.hash(newpassword, saltRounds, function(err, hash) {
  						var sql2 = SqlString.format('UPDATE users SET password = ? WHERE id = ?',[hash,req.user]);
  						db.query(sql2,function(err,results){
  							if(err) throw err;
  							res.render('changepassword',{error: 'successfully change password'})
  						});

  					});
  					
					
  				} else{
  					res.render('changepassword',{error: 'wrong old password'})
  				}
  			});
		}
	})

})

app.get('/forgetpassword',function(req,res){
	res.render('forgetpassword',{error: ''})
});


app.post('/forgetpassword',function(req,res){
	var email = req.body.email;

	var sql = SqlString.format('SELECT id,email FROM users WHERE email = ?',[email]);

	db.query(sql,function(err,results){
		if(err) throw err;
		if(results.length == 0){
			res.render('forgetpassword',{error:'There is no such email'})
		}
		else{
			var current_date = (new Date()).valueOf().toString();
			var random = Math.random().toString();
			var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
			var link = "http://"+req.get('host')+"/forgetpassword/"+hash;

			    // Message object
			    let message = {
			    	from: 'cf <no-reply@gmail.com>',
			        // Comma separated list of recipients
			        to: email,

			        // Subject of the message
			        subject: 'Change of password for Commfront',

			        // plaintext body
			        text: 'Hello to myself!',

			        // HTML body
			        html:
			            'Hello ,<br> Please Click on the link to change your password.<br><a href='+link+'>Click here to verify</a>'
			        };
			        transporter.sendMail(message, (error, info) => {
				        if (error) {
				            console.log('Error occurred');
				            console.log(error.message);
				            return process.exit(1);
				        }

				        console.log('Message sent successfully!');
				        console.log(nodemailer.getTestMessageUrl(info));

				        // only needed when using pooled connections
				        transporter.close();
				    });	




		    	db.query(SqlString.format('INSERT INTO forgetpassword(id,email,hash) VALUES(?,?,?)',[results[0].id,results[0].email,hash]),
		    		function(error,results,fields){
		    			if(error) throw error;
		    			res.render('forgetpassword',{error: 'Please Check your email to change password.'});
		    		})

		}
	});
});

app.get('/forgetpassword/:id',function(req,res){
	var sql = SqlString.format('SELECT * FROM forgetpassword WHERE hash = ?',[req.params.id])
	db.query(sql,function(err,results){
		if(err) throw err;
		if(results.length == 0){
			res.render('404')
		}
		else{
			res.render('newpassword',{hash: req.params.id,error: ''})
		}
	})
	

});

app.post('/forgetpassword/:id',function(req,res){
	var password = req.body.password;
	req.checkBody('password', 'Password must be at 8-16 character').len(8, 16);
	req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);
 

	var errors = req.validationErrors();

	if(errors){
		res.render('newpassword',{
			errors : errors,
			hash: req.params.id
		});
	} 
	else{
		bcrypt.hash(password, saltRounds, function(err, hash) {
		var sql  = SqlString.format('SELECT id FROM forgetpassword WHERE hash = ?',[req.params.id])
		
		var sql3 = SqlString.format('DELETE FROM forgetpassword WHERE hash = ?',[req.params.id]);
		db.query(sql,function(error,results,fields){
			if(error){
				res.render('404');
			}

			db.query(SqlString.format('UPDATE users SET password = ? WHERE id = ?',[hash,results[0].id]),function(error,results,fields){
				if(error){
				res.render('404');
				}

				if(results.affectedRows){
					db.query(sql3,function(error,results,fields){
						if(error) throw error;
						res.render('finishpasswordchange');
					})
				}

			})
		})
		})
	}
});

app.get('/changeemail',authenticationMiddleware(),function(req,res){
	res.render('changeemail',{error: ''});

});

app.post('/changeemail',authenticationMiddleware(),function(req,res){
	var newemail = req.body.newemail;


	 var sql = SqlString.format('SELECT email FROM users WHERE email = ?',[newemail])

	 db.query(sql,function(err,results){
	 	if(err) throw err;

	 	if(results == 0){

			var current_date = (new Date()).valueOf().toString();
			var random = Math.random().toString();
			var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
			var link = "http://"+req.get('host')+"/changeemail/"+hash;

			    // Message object
		    let message = {
		    	from: 'cf <no-reply@gmail.com>',
		        // Comma separated list of recipients
		        to: newemail,

		        // Subject of the message
		        subject: 'Change of email from CommFront',

		        // plaintext body
		        text: 'Hello to myself!',

		        // HTML body
		        html:
		            'Hello ,<br> Please Click on the link to change your email.<br><a href='+link+'>Click here to verify</a>'
		        };
		        transporter.sendMail(message, (error, info) => {
			        if (error) {
			            console.log('Error occurred');
			            console.log(error.message);
			            return process.exit(1);
			        }

			        console.log('Message sent successfully!');
			        console.log(nodemailer.getTestMessageUrl(info));

			        // only needed when using pooled connections
			        transporter.close();
			    });	
			    var sql1 = SqlString.format("INSERT INTO email(id,email,hash) VALUES(?,?,?)",[req.user,newemail,hash]);
			    db.query(sql1,function(err,results){
			    	if(err) throw err;
			    })
			    res.render('changeemail',{error: 'Check your new email to verify'})
	 	}else{
	 		res.render('changeemail',{error: 'Email is already is use'});
	 	}
	 })
});

app.get('/changeemail/:id',function(req,res){
	var sql = SqlString.format('SELECT id,email FROM email WHERE hash = ?',[req.params.id]);
	
	var sql2 = SqlString.format('DELETE FROM email WHERE hash = ?',[req.params.id]);
	db.query(sql,function(err,results){
		if(err) throw err;
		if(results.length == 0){
			res.render('404')
		}
		else{
		db.query(SqlString.format('UPDATE users SET email = ? WHERE id =?',[results[0].email,results[0].id]),function(err,results1){
			if(err) throw err;
			db.query(SqlString.format('UPDATE profile SET email = ? WHERE id =?',[results[0].email,results[0].id]),function(err,results1){
			if(err) throw err;
			db.query(sql2,function(err,results3){
					if(err) throw err;
					res.render('emailchangeddone')
			})
		})
		})
		}
	})
});

app.get('/basictable',function(req,res){
	res.render('basic-table');
});
app.get('/fontawesome',function(req,res){
	res.render('fontawesome');
});
app.get('/mapgoogle',function(req,res){
	res.render('map-google');
});
app.get('/blank',function(req,res){
	res.render('blank');
});
app.get('/404',function(req,res){
	res.render('404');
});
app.get('/gmap',function(req,res){
	res.render('gmap');
});



app.listen(3000,function(){
	console.log('Server started on port 3000....')
})

app.use(function (req, res) {
    res.render('404');
});