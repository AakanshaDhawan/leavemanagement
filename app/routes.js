var userSchema = require('../app/models/user');

module.exports = function(app, passport) {

	
	// HOME PAGE 
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// LOGIN
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/request_leave', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// SIGNUP 
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});
        app.get('/approveleaves', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('approveleaves.ejs');
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/request_leave', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/request_leave', isLoggedIn, function(req, res) {
		res.render('request_leave.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// LOGOUT
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
          
        
       

        //all the leaves       
        app.get('/showleaves', function (req, res) {
		userSchema.find({}).exec(function (error, data) {
			if(!error && data)
			{
				res.status(200).send(data);
			}
			else
			{
				res.status(400).send(error);
			}
		});
	});
        //"email": leaveemp.email
        var email=userSchema.email;
        app.get('/showleave', function (req, res,email) {
             //  var email=  req.body.email;
		userSchema.find({"email":email}).exec(function (error, data) {
			if(!error && data)
			{
				res.status(200).send(data);
                               // console.log(req);
                               console.log(email);
                             //  console.log(userSchema.local.email);
			}
			else
			{
				res.status(400).send(error);
			}
		});

	});
       
      
       app.post('/request_leave',function(req, res) {
        
            var leaveem = new userSchema();     
           

           
           leaveem.local.startdate  = req.body.startdate ;
           leaveem.local.enddate  = req.body.enddate;
           leaveem.local.leavetype  = req.body.leavetype ;
           leaveem.local.reason   = req.body.reason  ;
           leaveem.local.approvalstatus   = req.body.approvalstatus ;
           leaveem.local.approvedate   = req.body.approvedate  ;

           console.log(leaveem);


        // save the bear and check for errors
        leaveem.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Leave created!' });
        });
        
    });
   
	app.put('/approveleaves', function (req, res) {
 	            var leaveem = new userSchema();     
     	              leaveem.local.approvalstatus   = req.body.approvalstatus ;
                      leaveem.local.approvedate   = req.body.approvaldtae  ;
                    console.log(leaveem);
	})

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
