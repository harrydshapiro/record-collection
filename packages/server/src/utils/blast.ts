import { findAllActiveUsers } from "orm/repositories/user.repository"
import { sendMessageToPhoneNumber } from "./phone"

export async function sendBlast () {
    const message = ``
    const medialUrl = ``
    const users = await findAllActiveUsers()
    if (message || medialUrl) {
        users.forEach(u => {
            sendMessageToPhoneNumber(message, u.phoneNumber, medialUrl)
        })
    }
}