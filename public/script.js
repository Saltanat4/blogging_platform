async function registerUser() {
    const username = document.getElementById("regUser").value;
    const password = document.getElementById("regPass").value;

    if (!username || !password) return alert("Please fill all fields");

    try {
        const res = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (res.ok) {
            alert("Registration successful! Please login.");
            window.location.href = "/login";
        } else {
            alert("User already exists or error occurred");
        }
    } catch (e) { console.error(e); }
}

async function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "/";
    } else alert(data.error);
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("You must be logged in to perform this action!");
        window.location.href = "/login";
        return null;
    }
    return user;
}

async function viewAll() {
    try {
        const res = await fetch("/blogs");
        const data = await res.json();
        const div = document.getElementById("post");
        if (!div) return;

        div.innerHTML = "<h2>Recent Posts</h2>";
        data.forEach(p => {
            div.innerHTML += `
                <div class="post-card">
                    <h3>${p.title}</h3>
                    <p>${p.body.substring(0, 150)}...</p>
                    <div class="meta">👤 ${p.author} | ❤️ ${p.likes} | 💬 ${p.comments ? p.comments.length : 0}</div>
                    <div class="actions">
                        <button onclick="window.location.href='/post?id=${p._id}'">View & Comments</button>
                        <button class="btn-edit" onclick="editPost('${p._id}')">Edit</button>
                        <button class="btn-delete" onclick="deletePost('${p._id}')">Delete</button>
                        <button style="background:none; color:var(--accent); border:1px solid var(--accent)" onclick="likePost('${p._id}')">❤️ Like</button>
                    </div>
                </div>`;
        });
    } catch (e) { console.log("Error loading posts:", e); }
}

async function viewByID(id) {
    try {
        const res = await fetch("/blogs/" + id);
        const p = await res.json();
        const div = document.getElementById("postDetail");
        
        div.innerHTML = `
            <div class="post-card" style="transform:none; box-shadow:none">
                <h1>${p.title}</h1>
                <p style="font-size:1.1rem; margin:20px 0">${p.body}</p>
                <div class="meta">👤 ${p.author} | 🏷️ ${p.tags ? p.tags.join(', ') : ''}</div>
            </div>
            <h3>Comments (${p.comments ? p.comments.length : 0})</h3>
            <div id="commentsList">
                ${p.comments.map(c => `
                    <div style="background:#f1f5f9; padding:10px; border-radius:8px; margin-bottom:10px">
                        <strong>${c.user}:</strong> ${c.text}
                    </div>
                `).join('')}
            </div>`;
    } catch (e) { console.log("Error loading post details:", e); }
}

async function createBlog() {
    const user = checkAuth();
    if (!user) return;

    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const author = user.userId;
    const tags = document.getElementById("tag").value.split(",").map(t => t.trim());

    try {
        await fetch("/blogs", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ title, body, author, tags })
        });
        window.location.href = "/";
    } catch (e) { alert("Create failed"); }
}

async function addComment() {
    const user = checkAuth();
    if (!user) return;
    
    const id = new URLSearchParams(window.location.search).get('id');
    const text = document.getElementById("commentText").value;

    if (!text) return alert("Please write a comment");

    try {
        await fetch(`/blogs/${id}/comment`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ user: user.username, text: text })
        });
        location.reload();
    } catch (e) { alert("Error adding comment"); }
}

async function likePost(id) {
    const user = checkAuth();
    if (!user) return;

    try {
        await fetch(`/blogs/${id}/like`, { method: "PATCH" });
        viewAll();
    } catch (e) { console.log(e); }
}

async function deletePost(id) {
    const user = checkAuth();
    if (!user) return;

    if (confirm("Delete this story?")) {
        try {
            await fetch("/blogs/" + id, { method: "DELETE" });
            viewAll();
        } catch (e) { alert("Delete failed"); }
    }
}

async function editPost(id) {
    const user = checkAuth();
    if (!user) return;

    const t = prompt("New Title:");
    const b = prompt("New Body:");
    if (t && b) {
        try {
            await fetch("/blogs/" + id, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ title: t, body: b })
            });
            viewAll();
        } catch (e) { alert("Update failed"); }
    }
}

async function viewStats() {
    try {
        const res = await fetch("/blogs/stats");
        const stats = await res.json();
        const container = document.getElementById("statsContainer");
        if (!container) return;

        container.innerHTML = "<h3>Tag Distribution</h3>";
        stats.forEach(s => {
            container.innerHTML += `
                <div class="stat-item" style="display:flex; justify-content:space-between; padding:5px; border-bottom:1px solid #eee">
                    <span>#${s._id}</span>
                    <span>${s.count} posts</span>
                </div>`;
        });
    } catch (e) { console.log("Error stats:", e); }
}

async function searchBlog() {
    const q = document.getElementById("searchInput").value;
    if (!q) return viewAll(); 

    try {
        const res = await fetch("/blogs/search?q=" + encodeURIComponent(q));
        const data = await res.json();
        
        const div = document.getElementById("post");
        div.innerHTML = `<h2>Search results for: "${q}"</h2>`;

        if (data.length === 0) {
            div.innerHTML += "<p>No results found. Try another word.</p>";
            return;
        }

        data.forEach(p => {
            div.innerHTML += `
                <div class="post-card">
                    <h3>${p.title}</h3>
                    <p>${p.body.substring(0, 100)}...</p>
                    <div class="actions">
                        <button onclick="window.location.href='/post?id=${p._id}'">Read More</button>
                    </div>
                </div>`;
        });
    } catch (e) {
        console.error("Search error:", e);
    }
}