const Post=require("../models/post_model.js");

const getPosts= async(req, res)=>{
    try{
        const posts= await Post.find();
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

const getPost=async(req, res)=>{
    try{
        const id=req.params.id;
        const post=await Post.findById(id);

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        res.status(200).json(post);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

const createPost=async(req, res)=>{
    try{
        const{title, body, author}=req.body;
        const post= await Post.create({title, body, author});
        res.status(201).json(post);
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

const updatePost=async(req, res)=>{
    try{
        const id=req.params.id;
        const post=await Post.findByIdAndUpdate(id, req.body);
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        const updated_post=await Post.findById(id);
        
        res.status(200).json(updated_post);

    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

const deletePost=async(req, res)=>{
    try{
        const id=req.params.id;
        const post=await Post.findByIdAndDelete(id);
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        res.status(200).json({message:"Post deleted"});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}

module.exports={getPosts, getPost, createPost, updatePost, deletePost};