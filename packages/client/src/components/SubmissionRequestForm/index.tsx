import { IPlaylist, ISubmissionRequest } from "@songhaus/server"
import { useState, useEffect } from "react"
import { fetchAllPlaylists, fetchSubmissionRequest } from "../../api/client"
import styles from "./index.module.scss"
import moment from "moment"

export function SubmissionRequestForm ({ requestId, onSubmit }: {requestId?: number, onSubmit: Function}) {
    const [playlists, setPlaylists] = useState<IPlaylist[]>([]) 
    const [existingSubmissionRequest, setExistingSubmissionRequest] = useState<undefined | ISubmissionRequest>() 

    const [requestText, setRequestText] = useState('')
    const [responseText, setResponseText] = useState('')
    const [scheduledFor, setScheduledFor] = useState<Date | undefined>(undefined)
    const [mediaUrl, setMediaUrl] = useState('')
    const [playlistId, setPlaylistId] = useState<number | undefined>()

    useEffect(() => {
        if (requestId) {
            fetchSubmissionRequest(requestId).then(setExistingSubmissionRequest)
        } else {
            setExistingSubmissionRequest(undefined)
        }
    }, [requestId])

    useEffect(() => {
        if (existingSubmissionRequest) {
            setRequestText(existingSubmissionRequest.requestText)
            setResponseText(existingSubmissionRequest.submissionResponse)
            setScheduledFor(existingSubmissionRequest.scheduledFor)
            setMediaUrl(existingSubmissionRequest.mediaUrl || "")
            setPlaylistId(existingSubmissionRequest.playlist.id)
        }
    }, [existingSubmissionRequest])

    useEffect(() => {
        fetchAllPlaylists().then(setPlaylists)
    }, [])

    return <div className={styles.submissionRequestForm}>
        <form>
            <div className={styles.formItem}>
                <label htmlFor="request-text">Request text</label>
                <textarea name="request-text" value={requestText} onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                    setRequestText(e.currentTarget.value)
                }}/>
            </div>
            
            <div className={styles.formItem}>
                <label htmlFor="response-text">Response text</label>
                <textarea name="response-text" value={responseText} onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                    setResponseText(e.currentTarget.value)
                }}/>
            </div>

            <div className={styles.formItem}>
                {/* TODO - Confirm no issues here with TIMEZONE!!! */}
                <label htmlFor="scheduled-for">Scheduled for</label>
                <input type="datetime-local" name="scheduled-for" value={scheduledFor ? moment(scheduledFor).format('yyyy-MM-DDThh:mm') : ""} onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    setScheduledFor(new Date(e.currentTarget.value))
                }}/>
            </div>

            <div className={styles.formItem}>
                <label htmlFor="media-url">Media url</label>
                <input type="url" name="media-url" value={mediaUrl} onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    setMediaUrl(e.currentTarget.value)
                }}/>
            </div>
        </form>
    </div>
}