const express = require('express')
const router = express.Router()
const videoController = require('../controllers/video.controller')
const {protect} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

//Upload video
router.post('/upload', protect,upload.single('video'),videoController.uploadVideo)

//Getting user's video
router.get('/my-videos',protect,videoController.getUserVideos)

//Listing videos
router.get('/',videoController.listVideos)

//get video
router.get('/:id', protect, videoController.getVideo);

//Update Video
router.patch('/:id',protect,videoController.updateVideo)

//Delete video
router.delete('/:id',protect,videoController.deleteVideo)

router.get('/:id/status',protect,videoController.getVideoStatus)

module.exports = router