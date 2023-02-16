import {v4} from 'uuid';


export const getRandomId = async (req, res, next) => {
    try {
        req.randomId = v4().replace(/\-/g, "")
        next();
    } catch (error) {
        return res.status(400).json({success: false, message: error.error});
    }
}
