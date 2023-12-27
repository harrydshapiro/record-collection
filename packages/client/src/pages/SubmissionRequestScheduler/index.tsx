import React, { useCallback, useEffect, useState } from 'react'
import styles from "./index.module.scss"
import { fetchAllSubmissionRequests } from '../../api/client'
import { SubmissionRequestListItem } from './SubmissionRequestListItem'
import { SubmissionRequestForm } from '../../components/SubmissionRequestForm'
import { ISubmissionRequest } from '@songhaus/server'


/**
 * Just the fields necessary for creating and editing submission requests on the frontend
 */
export type SubmissionRequestForEditing = Pick<ISubmissionRequest, 'requestText' | 'submissionResponse' | 'mediaUrl' | 'scheduledFor'> & { playlistId: number, id?: ISubmissionRequest['id'] }

function createSubmissionRequestForEditing (existingSubmissionRequest?: ISubmissionRequest): SubmissionRequestForEditing {
    if (!existingSubmissionRequest) {
        return {
            requestText: "",
            submissionResponse: "",
            playlistId: 0,
        }
    }
    return {
        requestText: existingSubmissionRequest.requestText,
        submissionResponse: existingSubmissionRequest.submissionResponse,
        mediaUrl: existingSubmissionRequest.mediaUrl,
        scheduledFor: existingSubmissionRequest.scheduledFor,
        playlistId: existingSubmissionRequest.playlist.id,
        id: existingSubmissionRequest.id
    }
}

/**
 * Need to give the ability to:
 * - create a submission request
 * - view the submission requests schedule
 * - change an existing submission requests' date, time, request text, response text, playlist
 * - delete an existing submission request (?)
 */

export function SubmissionRequestScheduler () {
    const [allSubmissionRequests, setSubmissionRequests] = useState<Array<ISubmissionRequest>>([])
    const [currentlyEditingSubmissionRequest, setCurrentlyEditingSubmissionRequest] = useState<SubmissionRequestForEditing>(createSubmissionRequestForEditing())

    useEffect(() => {
        fetchAllSubmissionRequests().then(setSubmissionRequests)
    }, [])

    const onFormSubmit = useCallback((editedSubmissionRequest: SubmissionRequestForEditing) => {
        if (currentlyEditingSubmissionRequest.id) {
            // update
        } else {
            // create
        }
    }, [currentlyEditingSubmissionRequest])

    return <div id={styles.page}>
        <button onClick={() => {
            const newValue = createSubmissionRequestForEditing(undefined)
            debugger
            setCurrentlyEditingSubmissionRequest(newValue)
        }}>NEW</button>
        <div id={styles.pageBody}>
            <div id={styles.existingRequests}>
                {allSubmissionRequests.map((sr) => <SubmissionRequestListItem onEditClick={(subRequest: ISubmissionRequest) => setCurrentlyEditingSubmissionRequest(createSubmissionRequestForEditing(subRequest))} submissionRequest={sr} key={sr.id}/>)}
            </div>
            <div id={styles.createUpdateForm}>
                {currentlyEditingSubmissionRequest && <SubmissionRequestForm initialValues={currentlyEditingSubmissionRequest} onSubmit={() => {}}/>}
            </div>
        </div>
    </div>
}