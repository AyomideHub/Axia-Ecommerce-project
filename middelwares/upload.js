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

//set filter function
// const checkFileFilter = (req, file, cb) => {
// 	if (file.mimetype.startWith('image')){
// 		cb(null, true)
// 	}else{
// 		cb(new Error(''))
// 	}
// }

// multer middleware
module.exports = multer({
	storage: storage,
	//fileFilter: checkFileFilter,
	// limits:{
	// 	fileSize: 5 * 1024 * 1024, //5MB file size limit	
	// 	 }
})