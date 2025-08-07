/**
 * Ghost CMS Search Functionality
 * Handles client-side search implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('#search-input');
  const searchResults = document.querySelector('#search-results');

  if (!searchForm || !searchInput || !searchResults) return;

  // =============== FETCH SEARCH INDEX ===============
  const fetchSearchIndex = async () => {
    try {
      const response = await fetch('/ghost/api/content/posts/?key=SEARCH_API_KEY&limit=all&fields=id,title,url,excerpt,published_at');
      if (!response.ok) throw new Error('Failed to fetch search index');
      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      return { posts: [] };
    }
  };

  // =============== PERFORM SEARCH ===============
  const performSearch = (posts, query) => {
    if (!query.trim()) return [];
    
    const searchTerms = query.toLowerCase().split(' ');
    return posts.filter(post => {
      const content = `${post.title} ${post.excerpt}`.toLowerCase();
      return searchTerms.every(term => content.includes(term));
    });
  };

  // =============== DISPLAY RESULTS ===============
  const displayResults = (results) => {
    searchResults.innerHTML = results.length 
      ? results.map(post => `
          <article class="search-result">
            <h3><a href="${post.url}">${post.title}</a></h3>
            <time datetime="${post.published_at}">${new Date(post.published_at).toLocaleDateString()}</time>
            <p>${post.excerpt || ''}</p>
          </article>
        `).join('')
      : '<p class="no-results">No results found</p>';
  };

  // =============== INITIALIZE SEARCH ===============
  (async () => {
    const { posts } = await fetchSearchIndex();
    
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = performSearch(posts, searchInput.value);
      displayResults(results);
    });
    
    searchInput.addEventListener('input', () => {
      if (!searchInput.value.trim()) searchResults.innerHTML = '';
    });
  })();
});