import {Types} from 'mongoose';
import UserModel, {user_type, validateUser} from '../db/user';


export default {
    getAllUsers: async (req, res) => {
        try {
            const users = await UserModel.getUsers(req.query.q || '');
            return res.status(200).json({success: true, users});
        } catch (error) {
            return res.status(500).json({success: false, error: error});
        }
    },
    getUserById: async (req, res) => {
        try {
            const user = await UserModel.getUserById(req.params.id);
            return res.status(200).json({success: true, user});
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    },
    getUserByToken: async (req, res) => {
        try {
            const user = await UserModel.getUserById(req.userId);
            return res.status(200).json({success: true, user});
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    },
    deleteUserById: async (req, res) => {
        try {
            const user = await UserModel.deleteUserById(req.params.id);
            return res.status(200).json({
                success: true,
                message: `deleted ${user.deletedCount} users`
            });
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    },
    addFriendById: async (req, res) => {
        try {
            const user = await UserModel.addFriendById(req.userId, req.params.id)
            return res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    },
    deleteFriendById: async (req, res) => {
        try {
            const user = await UserModel.deleteFriendById(req.userId, req.params.id)
            return res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    },
    getMutualFriends: async (req, res) => {
        try {
            const mutualFriends = await UserModel.getMutualFriends(req.userId, req.params.id);
            return res.status(200).json({
                success: true,
                mutualFriends
            });
        } catch (error) {
            return res.status(500).json({success: false, error: error})
        }
    },
    getDraftByRoomId: async (req, res) => {
        try {
            const draft = await UserModel.getDraftByRoomId(req.userId, req.params.roomId);
            return res.status(200).json({
                success: true,
                draft
            });
        } catch (error) {
            return res.status(500).json({success: false, error: error});
        }
    }
}