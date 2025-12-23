import { File } from "../models/file.model.js";

export const fileMiddleware = async(req ,res, next)=>{
    try {
        const userId = req.id
        
        const fileId = req.params.id;

        const file = await File.findById(fileId)

        if(file.ownerId != userId){
            return res.status(401).json({
                message:"Only owner have the right to delete file"
            })
        }
        
        next()
    } catch (error) {
        console.log(`error from fileMiddleware ${error}`)
    }
}