document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const text = document.getElementById('text').value;
    const image = document.getElementById('image').files[0];
    const formData = new FormData();
    formData.append('text', text);
    formData.append('image', image);

    const response = await fetch('https://ljdw-back-5sj59lx2y-zabka14s-projects.vercel.app/api/posts.js', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    displayPost(result);
});

async function fetchPosts() {
    const response = await fetch('https://ljdw-back-5sj59lx2y-zabka14s-projects.vercel.app/api/posts.js');
    const posts = await response.json();
    posts.forEach(displayPost);
}

function displayPost(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
        <p>${post.text}</p>
        <img src="${post.imageUrl}" alt="Image" width="300">
    `;
    document.getElementById('posts').appendChild(postElement);
}

fetchPosts();
