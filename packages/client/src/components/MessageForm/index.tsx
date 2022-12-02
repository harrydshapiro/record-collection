import react, { useCallback, useState } from 'react'
import { sendMessage } from '../../api/client'

import styles from './index.module.scss'

export function MessageForm({ toNumber }: { toNumber: string }) {
    const [message, setMessage] = useState<string>('')

    const onSubmit = useCallback(() => {
        sendMessage(toNumber, message).then(() => {
            setMessage('')
        })
    }, [message, toNumber])

    return (
        <div className={styles.messageFormWrapper}>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className={styles.formInput}/>
            <button className={styles.submitButton} onClick={onSubmit}>Submit</button>
        </div>
    )
}