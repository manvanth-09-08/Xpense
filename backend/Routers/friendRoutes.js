import express from 'express';
import User from "../models/UserSchema.js"

const router = express.Router();

// Send Friend Request
router.post('/send-request', async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        // Add the receiver to the sender's friendRequestsSent array
        await User.findByIdAndUpdate(senderId, {
            $addToSet: { friendRequestsSent: receiverId }
        });

        // Add the sender to the receiver's friendRequestsReceived array
        await User.findByIdAndUpdate(receiverId, {
            $addToSet: { friendRequestsReceived: senderId }
        });

        res.json({ success:true, message: 'Friend request sent successfully.' });
    } catch (error) {
        res.status(500).json({ success:false, message: 'Error sending friend request', error });
    }
});

router.post('/delete-friend', async(req,res)=>{
    const {userId,friendId} = req.body;
    try{
        await User.findByIdAndUpdate(userId, {            
            $pull: { friends: friendId }
        });

        await User.findByIdAndUpdate(friendId, {            
            $pull: { friends: userId }
        });

        res.json({ success:true,message: 'Friend Deleted successfully.' });
    }catch(err){
        res.status(500).json({success:false, message: 'Error accepting friend request', error });
    }
})

// Accept Friend Request
router.post('/accept-request', async (req, res) => {
    const { receiverId, senderId } = req.body;

    try {
        await User.findByIdAndUpdate(receiverId, {
            $addToSet: { friends: senderId },
        });
        await User.findByIdAndUpdate(receiverId, {            
            $pull: { friendRequestsReceived: senderId }
        });

        await User.findByIdAndUpdate(senderId, {
            $addToSet: { friends: receiverId },
        });
        await User.findByIdAndUpdate(senderId, {            
            $pull: { friendRequestsReceived: receiverId }
        });


        res.json({ success:true,message: 'Friend request accepted.' });
    } catch (error) {
        res.status(500).json({success:false, message: 'Error accepting friend request', error });
    }
});

// Reject Friend Request
router.post('/reject-request', async (req, res) => {
    const { receiverId, senderId } = req.body;

    try {
        await User.findByIdAndUpdate(receiverId, {
            $pull: { friendRequestsReceived: senderId }
        });
        await User.findByIdAndUpdate(senderId, {
            $pull: { friendRequestsSent: receiverId }
        });

        res.json({ success:true,message: 'Friend request rejected.' });
    } catch (error) {
        res.status(500).json({success:false, message: 'Error rejecting friend request', error });
    }
});

router.get('/search', async (req, res) => {
    const query = req.query.query;
    try {
        const friends = await User.find({
            name: { $regex: query, $options: 'i' } // Case-insensitive search
        }).limit(10); // Limit results to avoid excessive data

        res.json(friends);
    } catch (error) {
        res.status(500).json({ success:false, message: 'Error fetching friends' });
    }
});

export default router;
