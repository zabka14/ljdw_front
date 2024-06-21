const backendUrl = 'https://ljdw-back-zabka14s-projects.vercel.app/api';

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = document.getElementById('text').value;
  const file = document.getElementById('file').files[0];
  const formData = new FormData();
  formData.append('text', text);
  formData.append('file', file);

  try {
    const response = await fetch(`${backendUrl}/posts`, { // Corrected URL
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    displayPost(result);
    
    // Réinitialiser le formulaire
    document.getElementById('uploadForm').reset();
  } catch (error) {
    console.error('Error:', error);
  }
});

async function fetchPosts() {
  try {
    const response = await fetch(`${backendUrl}/posts`); // Corrected URL
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
        ${post.fileUrl.startsWith('data:video') || post.fileUrl.includes('webm') ? 
          `<video src="${post.fileUrl}" class="card-img-top" autoplay loop muted></video>` : 
          `<img src="${post.fileUrl}" class="card-img-top" alt="Image">`}
      </div>
    </div>
  `;
  document.getElementById('posts').appendChild(postElement);
}

fetchPosts();
