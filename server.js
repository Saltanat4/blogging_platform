const express=require('express');
const mongoose=require('mongoose');
const postsRouter=require('./routes/post_route');
const dotenv=require('dotenv');

const port=3000;
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/blogs", postsRouter);
app.use(express.static('public'));

app.set('view engine', 'ejs');


dotenv.config();
const mongoUrl=process.env.MONGO_URL;

mongoose.connect(mongoUrl).then(()=>{
    console.log("Connected to MongoDB!");
}).catch((err)=>{
    console.error(err);
});

app.get("/", (req, res)=>{
   res.render("page.ejs");
});

    
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});