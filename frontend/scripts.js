const backendUrl = 'https://ljdw-back-zabka14s-projects.vercel.app/api';

// Test de la route CORS
fetch(`${backendUrl}/test`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Le reste de votre code pour gérer les posts...
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = document.getElementById('text').value;
  const file = document.getElementById('file').files[0];
  const formData = new FormData();
  formData.append('text', text);
  formData.append('file', file);

  try {
    const response = await fetch(`${backendUrl}/posts.js`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    displayPost(result);
  } catch (error) {
    console.error('Error:', error);
  }
});

async function fetchPosts() {
  try {
    const response = await fetch(`${backendUrl}/posts.js`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();
    posts.forEach(displayPost);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayPost(post) {
  const postElement = document.createElement('div');
  postElement.className = 'col-md-4 post';
  postElement.innerHTML = `
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <p class="card-text">${post.text}</p>
        ${post.fileUrl.startsWith('data:video') ? 
          `<video src="${post.fileUrl}" controls class="card-img-top"></video>` : 
          `<img src="${post.fileUrl}" class="card-img-top" alt="Image">`}
      </div>
    </div>
  `;
  document.getElementById('posts').appendChild(postElement);
}

fetchPosts();
