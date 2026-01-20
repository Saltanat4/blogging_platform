async function createBlog() {
  const title = document.querySelector("input[name='title']").value;
  const body = document.querySelector("textarea[name='body']").value;
  const author = document.querySelector("input[name='author']").value;

  const response = await fetch("/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, author })
  });

  const blog = await response.json();

  document.getElementById("post").innerHTML = `
    <div>
      <h4>Created post</h4>
      <p>Title: ${blog.title}</p>
      <p>Body: ${blog.body}</p>
      <p>Author: ${blog.author}</p>
      <p>ID: ${blog._id}</p>
    </div>
  `;
}

async function viewAll() {
  const response = await fetch("/blogs");
  const blogs = await response.json();

  const container = document.getElementById("post");
  container.innerHTML = "<h4>All posts</h4>";

  blogs.forEach(blog => {
    container.innerHTML += `
      <div>
        <p><b>${blog.title}</b></p>
        <p>${blog.body}</p>
        <p>${blog.author}</p>
        <p>ID: ${blog._id}</p>
      </div>
    `;
  });
}

async function viewByID() {
  const id = document.getElementById("viewid").value;

  const response = await fetch(`/blogs/${id}`);
  const blog = await response.json();

  document.getElementById("post").innerHTML = `
    <div>
      <h4>Post by ID</h4>
      <p>Title: ${blog.title}</p>
      <p>Body: ${blog.body}</p>
      <p>Author: ${blog.author}</p>
      <p>ID: ${blog._id}</p>
    </div>
  `;
}

async function update() {
  const id = document.getElementById("updateid").value;
  const title = document.querySelector("input[placeholder='New title']").value;
  const body = document.querySelector("textarea[placeholder='New content']").value;

  const response = await fetch(`/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body })
  });

  const blog = await response.json();

  document.getElementById("post").innerHTML = `
    <div>
      <h4>Updated post</h4>
      <p>Title: ${blog.title}</p>
      <p>Body: ${blog.body}</p>
      <p>Author: ${blog.author}</p>
      <p>ID: ${blog._id}</p>
    </div>
  `;
}

async function deleteBlog() {
  const id = document.getElementById("deleteid").value;

  const response = await fetch(`/blogs/${id}`, {
    method: "DELETE"
  });

  const result = await response.json();

  document.getElementById("post").innerHTML = `
    <div>
      <h4>${result.message}</h4>
      <p>ID:${id}</p>
    </div>
  `;
}
