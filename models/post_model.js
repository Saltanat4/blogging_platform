const mongoose=require('mongoose');

const postSchema= mongoose.Schema({
    title:{
        type:String, 
        required:true
    },

    body:{
        type:String,
        required:true
    },

    author:{
        type:String,
        required:false,
        default:"Anonymous"
    },

},
 {timestamps:true}
);

const Post=mongoose.model("Posts", postSchema);

module.exports=Post;