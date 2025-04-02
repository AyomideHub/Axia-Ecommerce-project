const multer = require('multer')
const path = require('path')

// set multer storage
const storage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, "uploads/")
	},
	filename: function(req, file, cb){
		cb (null, 
			file.fieldname + "-" + path.extname(file.originalname)
		)
	}

})


// multer middleware
module.exports = multer({
	storage: storage,
})