const {validationResult} = require('express-validator')


// Create a comment
exports.createComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { content, videoId, parentCommentId } = req.body;
      
      // Check if video exists
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      // Create comment object
      const commentFields = {
        content,
        user: req.user.id,
        video: videoId
      };
      
      // If this is a reply to another comment
      if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
          return res.status(404).json({ message: 'Parent comment not found' });
        }
        commentFields.parentComment = parentCommentId;
      }
      
      const comment = new Comment(commentFields);
      await comment.save();
      
      // If it's a reply, add it to the parent comment's replies array
      if (parentCommentId) {
        await Comment.findByIdAndUpdate(
          parentCommentId,
          { $push: { replies: comment._id } }
        );
      }
     // Populate user data
     const populatedComment = await Comment.findById(comment._id)
     .populate('user', 'name username avatar');
   
   res.json(populatedComment);
 } catch (err) {
   console.error(err.message);
   res.status(500).send('Server Error');
 }
};  