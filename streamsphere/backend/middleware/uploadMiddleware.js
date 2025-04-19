const multer = require('multer')
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');



// Ensure the uploads directory exists



try {
    // Ensure the full path exists, creating intermediate directories if needed
    fs.mkdirSync(uploadsDir, { recursive: true });
    
    // Verify directory exists and is writable
    fs.accessSync(uploadsDir, fs.constants.W_OK);
    
    
  } catch (error) {
    console.error('Error with uploads directory:', error.message);
  }

//Configure multer storage
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        console.log("Uploads Directory:", uploadsDir);
        cb(null,uploadsDir);
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null,uniqueSuffix)
        
    }
})

//File filter for video uploads

const videoFilter = (req,file,cb)=>{
    const filetypes = /mp4|avi|mov|mkv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype);

    if(extname && mimetype){
        return cb(null,true)
    }else{
        cb('Error, Video files only!');
    }
}

//Creating multer upload instance

const upload = multer({
    storage:storage,
    fileFilter:videoFilter,
    limits:{
        fileSize:1024*1024*50  // 50 mb file size limit
    }
})

// Log the directory to ensure it’s correct



module.exports = upload