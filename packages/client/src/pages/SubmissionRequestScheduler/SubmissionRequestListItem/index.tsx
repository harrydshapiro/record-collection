import react, { useMemo } from 'react'
import styles from "./index.module.scss"
import clsx from 'clsx'
import { ISubmissionRequest } from '@songhaus/server'

export function SubmissionRequestListItem ({ submissionRequest, onEditClick } : { submissionRequest: ISubmissionRequest, onEditClick: React.Dispatch<React.SetStateAction<number | undefined>>
}) {
    if (!submissionRequest) {
        debugger
    }
    const scheduledFor = useMemo(() => {
        return submissionRequest.scheduledFor ? `${new Date(submissionRequest.scheduledFor).toLocaleDateString()} ${new Date(submissionRequest.scheduledFor).toLocaleTimeString()}` : "Unscheduled"
    }, [submissionRequest.scheduledFor])

    const isPast = useMemo(() => {
        return submissionRequest.scheduledFor ? new Date() > new Date(submissionRequest.scheduledFor) : false
    }, [submissionRequest.scheduledFor])

    return <div className={clsx({ [styles.submissionRequestItem]: true, [styles.isPast]: isPast })}>
        { !isPast && <span className={styles.editButton} onClick={() => onEditClick(submissionRequest.id)}>EDIT</span> }
        <table>
            <tr>
                <th>PLAYLIST NAME</th>
                <td>{submissionRequest.playlist?.name || "Playlist name not found"}</td>
            </tr>
            <tr>
                <th>SCHEDULED FOR</th>
                <td>{scheduledFor}</td>
            </tr>
            <tr>
                <th>REQUEST TEXT</th>
                <td>{submissionRequest.requestText}</td>
            </tr>
            <tr>
                <th>RESPONSE TEXT</th>
                <td>{submissionRequest.submissionResponse}</td>
            </tr>
        </table>
    </div>
}