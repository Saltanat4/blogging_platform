

function isAuthenticated() {
    return localStorage.getItem("userId") !== null;
}

function checkAuth() {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    if (!userId || !username) {
        alert("You must be logged in!");
        window.location.href = "/login";
        return null;
    }
    return { userId, username };
}

async function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    try {
        const res = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("userId", data.userId); 
            localStorage.setItem("username", data.username);
            window.location.href = "/";
        } else { alert(data.error); }
    } catch (e) { console.error(e); }
}

async function registerUser() {
    const username = document.getElementById("regUser").value;
    const password = document.getElementById("regPass").value;
    
    console.log("Sending data:", { username, password }); 

    try {
        const response = await fetch("/auth/register", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) { 
            alert("Success!"); 
            window.location.href = "/login"; 
        } else {
            const errorData = await response.json();
            alert(errorData.error);
        }
    } catch (e) { 
        console.error("Connection error:", e); 
    }
}

async function viewAll() {
    try {
        const res = await fetch('/blogs');
        const posts = await res.json();
        const div = document.getElementById("post");
        if (!div) return;
        div.innerHTML = posts.map(p => `
            <div class="post-card">
                <h3>${p.title}</h3>
                <p>Author: ${p.author?.username || 'Unknown'}</p>
                <button onclick="location.href='/post?id=${p._id}'">Read More</button>
                <button onclick="handleLike('${p._id}')">❤️ ${p.likes || 0}</button>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

async function viewByID(id) {
    try {
        const res = await fetch("/blogs/" + id);
        const p = await res.json();
        const div = document.getElementById("postDetail");
        if (!div) return;
        div.innerHTML = `
            <div class="post-card">
                <h2>${p.title}</h2>
                <p>${p.body}</p>
                <p><strong>Author:</strong> ${p.author?.username || 'Anonymous'}</p>
                <button onclick="handleLike('${p._id}')">❤️ ${p.likes || 0}</button>
            </div>
            <div class="comments-list">
                <h3>Comments</h3>
                ${(p.comments || []).map(c => `
                    <div class="comment"><strong>${c.user}:</strong> ${c.text}</div>
                `).join('')}
            </div>`;
    } catch (e) { console.error(e); }
}

async function createBlog() {
    const user = checkAuth(); 
    if (!user) return;

    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const tags = document.getElementById("tag").value.split(",").map(t => t.trim());

    try {
        const res = await fetch("/blogs", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                title, 
                body, 
                tags, 
                author: user.userId 
            })
        });

        if (res.ok) {
            alert("Published!");
            window.location.href = "/my-posts";
        }
    } catch (e) {
        console.error(e);
    }
}
async function handleLike(postId) {
    if (!isAuthenticated()) return alert("Login first!");
    const key = `liked_${postId}`;
    const action = localStorage.getItem(key) ? 'decrement' : 'increment';
    const res = await fetch(`/blogs/${postId}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
    });
    if (res.ok) {
        action === 'increment' ? localStorage.setItem(key, 'true') : localStorage.removeItem(key);
        const id = new URLSearchParams(window.location.search).get('id');
        id ? viewByID(id) : viewAll();
    }
}

async function loadStats() {
    try {
        const res = await fetch('/blogs/stats');
        const stats = await res.json();
        const div = document.getElementById("statsContainer");
        if (!div) return;

        div.innerHTML = `<h3>Tag Popularity</h3>` + stats.map(s => `
            <div class="stat-item">
                <strong>#${s._id}</strong>: ${s.count} posts
            </div>
        `).join('');
    } catch (e) { console.error("Stats error:", e); }
}

async function searchBlogs() {
    const query = document.getElementById("searchInput").value;
    try {
        const res = await fetch(`/blogs/search?q=${query}`);
        const posts = await res.json();
        const div = document.getElementById("post");
        div.innerHTML = posts.map(p => `
            <div class="post-card">
                <h3>${p.title}</h3>
                <p>Author: ${p.author?.username || 'Unknown'}</p>
                <button onclick="location.href='/post?id=${p._id}'">Read More</button>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

async function viewStats() {
  const res = await fetch("/blogs/stats");
  const data = await res.json();

  document.getElementById("statsContainer").innerHTML =
    data.map(t => `<p>#${t._id}: ${t.count}</p>`).join("");
}

async function loadMyPosts() {
    const user = checkAuth(); 
    if (!user) return;

    try {
        const res = await fetch(`/blogs/user/${user.userId}`);
        const posts = await res.json();
        
        const listDiv = document.getElementById("myPostsList");
        if (!listDiv) return;

        if (posts.length === 0) {
            listDiv.innerHTML = "<p>You haven't published anything yet.</p>";
            return;
        }

        listDiv.innerHTML = posts.map(p => `
            <div class="post-card">
                <h3>${p.title}</h3>
                <p>${p.body.substring(0, 100)}...</p>
                <div class="actions">
                    <button class="btn-edit" onclick="location.href='/edit?id=${p._id}'">Edit</button>
                    <button class="btn-delete" onclick="deletePost('${p._id}')">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error("Error loading my posts:", e);
    }
}

async function deletePost(id) {
    if (!confirm("Are you sure?")) return;
    const user = checkAuth();
    
    const res = await fetch(`/blogs/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId })
    });

    if (res.ok) {
        alert("Deleted!");
        loadMyPosts(); 
    }
}