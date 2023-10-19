const multer = require('multer');
module.exports = multer({
    storage:multer.diskStorage({ 
        
    destination: function (req, file, cb) {
        cb(null, "images");
      }, 
      filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
      },
    }),
    fileFilter: (req, file, cb)=> {

        // The function should call `cb` with a boolean
        // to indicate if the file should be accepted
        if(!file.mimetype.match(/png||jpg||jpeg||gif$i/))
        {   
            cb(new Error('File not supported'),false);
        }
        //If file is not supported then false is returned and below code does not run
        
        // To accept the file pass `true`, like so:
        cb(null, true)
      
        // You can always pass an error if something goes wrong:
      }
});