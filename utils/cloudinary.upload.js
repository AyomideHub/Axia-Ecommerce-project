const cloudinary = require('../configs/cloudinary.config')

const uploadToCloudinary = async (filePath) =>{
	try {
		const uploadResult = await cloudinary.uploader.upload(filePath) 
		return{
			url: uploadResult.secure_url,
			publicId: uploadResult.public_id
		}
	} catch (error) {
		console.log(error);
		throw new Error('something went wrong, try again later') 
	}
	
}

//uploader.destroy(image.publicId) to delete

module.exports = {uploadToCloudinary}