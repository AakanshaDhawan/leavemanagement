var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
        
     local:{   name1 : {
        	type:String,
        	required:true,
	},
	user_name: {
		type:String
	},
	role : {
		type : String,
		enum : ["employee", "manager"]
	},
	email : {
		type : String,
		required : true,
		unique:true
	},
	password : {
		type : String,
	},
        phone : {
		type : Number,
		
	}, 
        
	startdate : {
	             type: String,
	            },
	enddate   :{
                    type:String,
                   },
         leavetype  :{ 
                      type : String,
                      enum :["sabbatical","casual","sick"]
                     },
         createdat  :{
                        type : Date,
                         default:Date.now,
                     },
         createdby  :{   
                        type  : String,
                      },
        reason     :{
                     type  : String,
                    },
        approvedstatus:{
                         type :String,
                          default:"requested",
                          enum : ["requested","approved","rejected"],
                        },
        approvedat  :{
                       type:String,
                     },
     
	
},
});


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('user', userSchema);
