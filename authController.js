const bcrypt = require("bcryptjs")

const chats = []

module.exports = {
    createMovie: (req, res) => {
        const { pin, message } = req.body
        let foundExistingChat = false

        chats.forEach(chatObj => {

            const existing = bcrypt.compareSync(pin, chatObj.pinHash)

            if (existing) {
                chatObj.messages.push(message)
                const messagesToReturn = { ...chatObj }
                delete messagesToReturn.pinHash
                res.status(200).send(messagesToReturn)
                foundExistingChat = true
            }
        })

        if (!foundExistingChat) {
            let salt = bcrypt.genSaltSync(5)
            // console.log(salt)
            let pinHash = bcrypt.hashSync(pin, salt)
            // console.log(pinHash)

            const newChatObj = {
                pinHash,
                messages: [message]
            }

            chats.push(newChatObj)

            const messagesToReturn = { ...newChatObj }
            delete messagesToReturn.pinHash
            res.status(200).send(messagesToReturn)
        }
    }
}
