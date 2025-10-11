/* ===================================
   BLOG FUNCTIONALITY
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  let allPosts = [];
  let currentFilter = 'all';
  
  // ========== LOAD BLOG POSTS ==========
  async function loadBlogPosts() {
    try {
      const response = await fetch('blog/posts.json');
      const data = await response.json();
      allPosts = data.posts;
      
      // Hide loading, show posts
      document.getElementById('loading').style.display = 'none';
      displayPosts(allPosts);
      
    } catch (error) {
      console.error('Error loading blog posts:', error);
      document.getElementById('loading').innerHTML = 
        '<i class="fas fa-exclamation-triangle"></i><p>Error loading posts. Please try again later.</p>';
    }
  }
  
  
  // ========== DISPLAY BLOG POSTS ==========
  function displayPosts(posts) {
    const blogGrid = document.getElementById('blog-grid');
    const noResults = document.getElementById('no-results');
    
    // Clear grid
    blogGrid.innerHTML = '';
    
    // Check if there are posts to display
    if (posts.length === 0) {
      blogGrid.style.display = 'none';
      noResults.style.display = 'block';
      return;
    }
    
    blogGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    // Create cards for each post
    posts.forEach(post => {
      const card = createBlogCard(post);
      blogGrid.appendChild(card);
    });
  }
  
  
  // ========== CREATE BLOG CARD ==========
  function createBlogCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.setAttribute('data-category', post.category);
    
    card.innerHTML = `
      <div class="blog-card-image">
        <img src="${post.image}" alt="${post.title}" loading="lazy">
      </div>
      <div class="blog-card-content">
        <div class="blog-card-meta">
          <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
          <span><i class="fas fa-clock"></i> ${post.readingTime}</span>
        </div>
        <h3 class="blog-card-title">
          <a href="blog/post.html?id=${post.id}">${post.title}</a>
        </h3>
        <p class="blog-card-excerpt">${post.excerpt}</p>
        <div class="blog-card-footer">
          <span class="blog-card-category">${post.category}</span>
          <a href="blog/post.html?id=${post.id}" class="blog-card-link">
            Read more <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
    
    return card;
  }
  
  
  // ========== FORMAT DATE ==========
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }
  
  
  // ========== FILTER POSTS BY CATEGORY ==========
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Get selected category
      currentFilter = this.getAttribute('data-category');
      
      // Filter and display posts
      filterPosts();
    });
  });
  
  
  // ========== SEARCH FUNCTIONALITY ==========
  const searchInput = document.getElementById('blog-search');
  
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
      filterPosts();
    }, 300));
  }
  
  
  // ========== FILTER POSTS (combines search and category) ==========
  function filterPosts() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    let filteredPosts = allPosts;
    
    // Filter by category
    if (currentFilter !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === currentFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filteredPosts = filteredPosts.filter(post => {
        return post.title.toLowerCase().includes(searchTerm) ||
               post.excerpt.toLowerCase().includes(searchTerm) ||
               post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      });
    }
    
    displayPosts(filteredPosts);
  }
  
  
  // ========== DEBOUNCE FUNCTION ==========
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  
  // ========== INITIALIZE ==========
  // Only load posts if we're on the blog index page
  if (document.getElementById('blog-grid')) {
    loadBlogPosts();
  }
  
});


// ========== INDIVIDUAL BLOG POST PAGE FUNCTIONALITY ==========

// Load individual post content
async function loadBlogPost() {
  // Get post ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  
  if (!postId) {
    console.error('No post ID provided');
    return;
  }
  
  try {
    // Load posts.json to get post metadata
    const response = await fetch('../blog/posts.json');
    const data = await response.json();
    const post = data.posts.find(p => p.id === postId);
    
    if (!post) {
      console.error('Post not found');
      return;
    }
    
    // Update page title
    document.title = `${post.title} | Azeez Hamzat`;
    
    // Load and parse markdown content
    const contentResponse = await fetch(`../${post.content}`);
    const markdown = await contentResponse.text();
    
    // Convert markdown to HTML (using marked.js library)
    const htmlContent = marked.parse(markdown);
    
    // Populate page elements
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-date').textContent = formatDate(post.date);
    document.getElementById('post-reading-time').textContent = post.readingTime;
    document.getElementById('post-category').textContent = post.category;
    document.getElementById('post-featured-image').src = `../${post.image}`;
    document.getElementById('post-featured-image').alt = post.title;
    document.getElementById('post-content').innerHTML = htmlContent;
    
    // Add tags
    const tagsContainer = document.getElementById('post-tags');
    post.tags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'tag';
      tagSpan.textContent = tag;
      tagsContainer.appendChild(tagSpan);
    });
    
    // Setup share buttons
    setupShareButtons(post.title);
    
    // Load related posts
    loadRelatedPosts(post.category, post.id);
    
  } catch (error) {
    console.error('Error loading blog post:', error);
  }
}

// Format date helper
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

// Setup share buttons
function setupShareButtons(postTitle) {
  const currentUrl = window.location.href;
  
  // Twitter share
  const twitterBtn = document.getElementById('share-twitter');
  if (twitterBtn) {
    twitterBtn.addEventListener('click', () => {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}&via=Azeez_A_Hamzat`;
      window.open(twitterUrl, '_blank', 'width=550,height=420');
    });
  }
  
  // LinkedIn share
  const linkedinBtn = document.getElementById('share-linkedin');
  if (linkedinBtn) {
    linkedinBtn.addEventListener('click', () => {
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
      window.open(linkedinUrl, '_blank', 'width=550,height=420');
    });
  }
  
  // Copy link
  const copyBtn = document.getElementById('share-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(currentUrl).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      });
    });
  }
}

// Load related posts
async function loadRelatedPosts(category, currentPostId) {
  try {
    const response = await fetch('../blog/posts.json');
    const data = await response.json();
    
    // Get posts from same category, excluding current post
    const relatedPosts = data.posts
      .filter(p => p.category === category && p.id !== currentPostId)
      .slice(0, 3);
    
    const relatedGrid = document.getElementById('related-posts-grid');
    
    if (relatedPosts.length === 0) {
      document.getElementById('related-posts-section').style.display = 'none';
      return;
    }
    
    relatedPosts.forEach(post => {
      const card = document.createElement('article');
      card.className = 'blog-card';
      card.innerHTML = `
        <div class="blog-card-image">
          <img src="../${post.image}" alt="${post.title}" loading="lazy">
        </div>
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
          </div>
          <h3 class="blog-card-title">
            <a href="post.html?id=${post.id}">${post.title}</a>
          </h3>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          <a href="post.html?id=${post.id}" class="blog-card-link">
            Read more <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      `;
      relatedGrid.appendChild(card);
    });
    
  } catch (error) {
    console.error('Error loading related posts:', error);
  }
}

// Initialize individual post page if on post page
if (window.location.pathname.includes('post.html')) {
  document.addEventListener('DOMContentLoaded', loadBlogPost);
}


