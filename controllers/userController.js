const router = require("express").Router();
const User = require("./../models/user");

const authMiddleware = require("./../middlewares/authMiddleware")

//Get the details of the logged in user
router.get('/get-logged-user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })

        res.status(200).send({
            message: 'user fetched successfully',
            success: true,
            data: user
        })
    } catch (err) {
        res.status(400).send({
            message: err.message,
            success: false
        })
    }
})


//Get the details of all users except the logged in user
router.get('/get-all-users', authMiddleware, async (req, res) => {
    try {
        const allUsers = await User.find({ _id: { $ne: req.body.userId } })

        res.status(200).send({
            message: 'all users fetched successfully',
            success: true,
            data: allUsers
        })
    } catch (err) {
        res.status(400).send({
            message: err.message,
            success: false
        })
    }
})


module.exports = router