async function createBlog() {
  const title = document.querySelector("input[name='title']").value;
  const body = document.querySelector("textarea[name='body']").value;
  const author = document.querySelector("input[name='author']").value;

  await fetch("/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, author })
  });

  viewAll();
}

async function viewAll(){
    const response=await fetch("/blogs");
    const blogs=await response.json();

    const container=document.getElementById("post");
    container.innerHTML="";

    blogs.forEach(blogs=>{
        container.innerHTML+=`<div>
        <h4>Title: ${blogs.title}</h4>
        <p>Body: ${blogs.body}</p>
        <p>Author: ${blogs.author}</p>
        </div>`;
    });
}

async function viewByID(){
    const id=document.getElementById("viewid").value;

    const response=await fetch("/blogs/${id}")
    const blog=await response.json();

    const container=document.getElementById("post");
    container.innerHTML=`<h3>Title: ${blog.title}</h3>
    <p>Body: ${blog.body}</p>
    <p>Author: ${blog.author}</p>`;
}

async function update(){
    const id=document.getElementById("updateid");

    const title=document.querySelector("input[placeholder='New title']").value;
    const body=document.querySelector("input[placeholder='New content']").value;

    await fetch("/blogs/${id}", {
        method:"PUT",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({title, body})
    });

    viewAll();
}

async function deleteBlog(){
    const id=document.getElementById("deleteid").value;

    await fetch("blogs/${id}",{
        method:"DELETE"
    });
    viewAll();

}