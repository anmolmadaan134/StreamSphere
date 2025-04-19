const ffmpeg = require('fluent-ffmpeg')
const path = require('path');
const fs = require('fs');
const ffmpegPath = require('ffmpeg-static');

// Set FFmpeg binary path from ffmpeg-static
ffmpeg.setFfmpegPath(ffmpegPath);

function processVideo(inputPath,outputDir,videoId,callback){
    const outputPath = path.join(outputDir,`${videoId}.mp4`)

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const resolutions = [
        {name:'720P',width:1280, height:720},
        {name:'480P',width:854, height:480},
        {name:'360P',width:640, height:360},
    ]

    const outputPaths = [];
    let completedCount = 0;
    let hasError = false;

    resolutions.forEach(resolution=>{
        const outputPath = path.join(outputDir, `${videoId}-${resolution.name}.mp4`);

    ffmpeg(inputPath)
    .size(`${resolution.width}x${resolution.height}`)
    .outputOptions([
        '-c:v libx264',         //video codec
        '-crf 22',              // quality
        '-c:a aac',             // audio codec
        '-b:a 128k'             // audio bitrate
    ])
    .on('end',()=>{
        outputPaths.push({
            path:outputPath,
            resolution:resolution.name,
            width:resolution.width,
            height:resolution.height
        })

        completedCount++;
        if(completedCount===resolutions.length && !hasError){
        callback(null,outputPaths)}
    })
    .on('error',(err)=>{
        if(!hasError){
            hasError=true;
        callback(err)
    }
    })
    .save(outputPath)
})
}

module.exports = {processVideo}

