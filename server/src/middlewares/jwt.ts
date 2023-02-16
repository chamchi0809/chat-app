import jwt from 'jsonwebtoken';

import UserModel, {IUser, IUserModel} from '../db/user';

const {JWT_KEY: SECRET_KEY} = process.env;

interface JwtPayload {
    userId,
    type
}

export const encode = async (req, res, next) => {
    try {
        const {username, password} = req.body;

        let user: IUser;
        user = await UserModel.getUserByUsernameAndPassword(username, password);

        const payload = {
            userId: user._id,
            userType: user.type,
        };

        const authToken = jwt.sign(payload, SECRET_KEY, {
            algorithm: 'HS256',
            expiresIn: '7d'
        });
        req.authToken = authToken;
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({success: false, message: error.error});
    }
}

export const decode = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(400).json({success: false, message: 'No access token provided'});
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY) as JwtPayload;
        ``
        req.userId = decoded.userId;
        req.userType = decoded.type;
        return next();
    } catch (error) {

        return res.status(401).json({success: false, message: error.message});
    }
}