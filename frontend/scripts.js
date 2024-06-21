const backendUrl = 'https://ljdw-back-zabka14s-projects.vercel.app/api';
let currentPage = 1;
const limit = 6;

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = document.getElementById('text').value;
  const file = document.getElementById('file').files[0];
  const url = document.getElementById('url').value;
  const formData = new FormData();
  formData.append('text', text);

  if (file) {
    formData.append('file', file);
  } else if (url) {
    formData.append('url', url);
  } else {
    alert('Please select a file or enter a URL.');
    return;
  }

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

    // Réinitialiser le formulaire et fermer la modal
    document.getElementById('uploadForm').reset();
    $('#uploadModal').modal('hide');

    // Forcer le rafraîchissement de la page
    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
  }
});

async function fetchPosts(page = 1) {
  try {
    const response = await fetch(`${backendUrl}/posts.js?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { posts, totalPages } = await response.json();
    displayPosts(posts);
    setupPagination(totalPages, page);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayPosts(posts) {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';
  posts.forEach(post => displayPost(post));
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
        <div class="d-flex justify-content-between align-items-center mt-2">
          <button class="btn btn-sm btn-outline-primary like-button" data-id="${post._id}">Like</button>
          <span class="likes-count">${post.likes} likes</span>
        </div>
      </div>
    </div>
  `;
  document.getElementById('posts').appendChild(postElement);

  // Ajouter un gestionnaire d'événements pour le bouton like
  postElement.querySelector('.like-button').addEventListener('click', () => likePost(post._id));
}

async function likePost(postId) {
  try {
    const response = await fetch(`${backendUrl}/posts.js/${postId}/like`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedPost = await response.json();
    const postElement = document.querySelector(`.like-button[data-id="${postId}"]`).closest('.post');
    postElement.querySelector('.likes-count').textContent = `${updatedPost.likes} likes`;
  } catch (error) {
    console.error('Error:', error);
  }
}

function setupPagination(totalPages, currentPage) {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
    pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    pageItem.addEventListener('click', (event) => {
      event.preventDefault();
      fetchPosts(i);
    });
    paginationContainer.appendChild(pageItem);
  }
}

fetchPosts();
