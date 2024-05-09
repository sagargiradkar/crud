const mongoose=require('mongoose')

const user= new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	age:{
		type:Number,
		required:false
	}
})

module.exports=mongoose.model('user',user)