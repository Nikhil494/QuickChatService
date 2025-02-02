const router = require("express").Router()
const authMiddleware = require("./../middlewares/authMiddleware")
const Message = require("./../models/message")
const Chat = require("./../models/chat")
const message = require("./../models/message")

router.post('/new-message', authMiddleware, async (req, res) => {
    try {
        const newMessage = new Message(req.body)
        const savedMesaage = await newMessage.save()

        // const currentChat = await Chat.findById(req.body.chatId)
        // currentChat.lastMessage = savedMesaage._id

        // await currentChat.save()

        await Chat.findOneAndUpdate(
            { _id: req.body.chatId },
            {
                lastMessage: savedMesaage._id,
                $inc: { unreadMessageCount: 1 }
            }
        )

        res.status(201).send({
            message: "Message sent successfully",
            success: true,
            data: savedMesaage
        })


    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})


router.get('/get-all-messages/:chatId', authMiddleware, async (req, res) => {
    try {
        const allMessages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 })

        res.status(200).send({
            message: "Messages fetched successfully",
            success: true,
            data: allMessages
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
})


module.exports = router