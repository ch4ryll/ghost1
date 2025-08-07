/**
 * Ghost CMS Comment System
 * Supports both native comments and third-party integrations
 */

document.addEventListener('DOMContentLoaded', () => {
  const commentForm = document.querySelector('#comment-form');
  const commentList = document.querySelector('#comment-list');
  const commentCount = document.querySelector('#comment-count');

  // =============== LOAD COMMENTS ===============
  const loadComments = async (postId) => {
    try {
      const response = await fetch(`/ghost/api/content/comments/?key=COMMENTS_API_KEY&post=${postId}`);
      if (!response.ok) throw new Error('Failed to load comments');
      const { comments } = await response.json();
      
      if (commentCount) {
        commentCount.textContent = comments.length;
      }
      
      if (commentList) {
        commentList.innerHTML = comments.length
          ? comments.map(comment => `
              <div class="comment" id="comment-${comment.id}">
                <div class="comment-author">
                  <img src="${comment.author.avatar || '/assets/images/default-avatar.png'}" alt="${comment.author.name}">
                  <strong>${comment.author.name}</strong>
                </div>
                <div class="comment-content">
                  ${comment.html}
                </div>
                <time datetime="${comment.created_at}">${new Date(comment.created_at).toLocaleString()}</time>
              </div>
            `).join('')
          : '<p class="no-comments">No comments yet</p>';
      }
    } catch (error) {
      console.error('Comments error:', error);
    }
  };

  // =============== SUBMIT COMMENT ===============
  if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(commentForm);
      const postId = commentForm.dataset.postId;
      
      try {
        const response = await fetch('/ghost/api/content/comments/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            post: postId,
            author: {
              name: formData.get('name'),
              email: formData.get('email')
            },
            html: formData.get('content')
          })
        });
        
        if (response.ok) {
          commentForm.reset();
          loadComments(postId);
        }
      } catch (error) {
        console.error('Comment submission error:', error);
      }
    });
  }

  // =============== INITIALIZE COMMENTS ===============
  const postElement = document.querySelector('article[data-post-id]');
  if (postElement) {
    loadComments(postElement.dataset.postId);
  }
});