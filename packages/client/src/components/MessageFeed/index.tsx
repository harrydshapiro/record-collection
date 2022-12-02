import { IMessage, IUser } from "@songhaus/server";
import { useEffect, useState } from "react";
import { fetchUserMessages } from "../../api/client";

import styles from './index.module.scss'

export function MessageFeed ({ user }: { user: IUser }) {
    const [messages, setMessages] = useState<IMessage[]>([])
    useEffect(() => {
        if (user) {
            fetchUserMessages(user.phoneNumber).then((res) => setMessages(res.data.messages))
        }
    }, [user])

    return (
        <div className={styles.messageFeedWrapper}>
            {
                messages.map((m, index) => (
                    <div key={index} className={styles.messageFeedItem}>
                        <p>{m.body}</p>
                    </div>
                ))
            }
        </div>
    )
}