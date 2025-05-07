// routes/comments.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const commentController = require('../controllers/commentController');

// @route   POST /api/comments
// @desc    Create a comment
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('content', 'Comment content is required').not().isEmpty(),
      check('videoId', 'Video ID is required').not().isEmpty()
    ]
  ],
  commentController.createComment
);

// @route   GET /api/comments/video/:videoId
// @desc    Get all comments for a video
// @access  Public
router.get('/video/:videoId', commentController.getVideoComments);

// @route   PUT /api/comments/like/:commentId
// @desc    Like a comment
// @access  Private
router.put('/like/:commentId', auth, commentController.likeComment);

// @route   PUT /api/comments/dislike/:commentId
// @desc    Dislike a comment
// @access  Private
router.put('/dislike/:commentId', auth, commentController.dislikeComment);

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment
// @access  Private
router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;