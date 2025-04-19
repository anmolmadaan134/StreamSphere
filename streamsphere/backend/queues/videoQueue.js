const Queue = require('bull');
const {processVideo} = require('../utils/videoProcessor')
const Video = require('../models/Video')
const {uploadToCloudinary,generateThumbnail} = require('../utils/cloudinaryUpload')
const fs = require('fs');
const path = require('path');

const videoQueue = new Queue('video processing',{
    redis:{
        host:'localhost',
        port:6379
    }
})

videoQueue.process(async (job) => {
    const { videoId, inputPath } = job.data;
    const outputDir = path.join(__dirname, '../processed-videos');

    return new Promise((resolve, reject) => {
        // Update status to processing
        Video.findByIdAndUpdate(videoId, {
            processingStatus: 'processing'
        }).then(() => {
            // Process the video into multiple resolutions
            processVideo(inputPath, outputDir, videoId, async (err, outputPaths) => {
                if (err) {
                    await Video.findByIdAndUpdate(videoId, {
                        processingStatus: 'failed',
                        processingError: err.message
                    });
                    return reject(err);
                }

                try {
                    // Upload each processed video to Cloudinary
                    const resolutionVersions = [];
                    
                    for (const video of outputPaths) {
                        const uploadResult = await uploadToCloudinary(video.path, 'videos');
                        
                        resolutionVersions.push({
                            resolution: video.resolution,
                            url: uploadResult.url,
                            publicId: uploadResult.publicId
                        });
                        
                        // Delete local file after upload
                        fs.unlinkSync(video.path);
                    }
                    
                    // Update video with processed versions
                    await Video.findByIdAndUpdate(videoId, {
                        processingStatus: 'completed',
                        resolutions: resolutionVersions
                    });
                    
                    // Clean up original uploaded file
                    if (fs.existsSync(inputPath)) {
                        fs.unlinkSync(inputPath);
                    }
                    
                    resolve({ videoId, resolutionVersions });
                } catch (uploadError) {
                    await Video.findByIdAndUpdate(videoId, {
                        processingStatus: 'failed',
                        processingError: uploadError.message
                    });
                    reject(uploadError);
                }
            });
        }).catch(updateError => {
            reject(updateError);
        });
    });
});

videoQueue.on('completed',(job,result)=>{
    console.log(`Video ${result.videoId} processing completed with ${result.resolutionVersions.length} versions`);
})

videoQueue.on('failed',(job,err)=>{
    console.error(`Video ${job.data.videoId} processing failed: ${err.message}`)
})


module.exports = {videoQueue}