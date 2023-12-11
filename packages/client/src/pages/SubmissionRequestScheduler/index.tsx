import React, { useCallback, useEffect, useState } from 'react'
import styles from "./index.module.scss"
import { fetchAllSubmissionRequests } from '../../api/client'
import { SubmissionRequestListItem } from './SubmissionRequestListItem'
import { SubmissionRequestForm } from '../../components/SubmissionRequestForm'
import { ISubmissionRequest } from '@songhaus/server'

/**
 * Need to give the ability to:
 * - create a submission request
 * - view the submission requests schedule
 * - change an existing submission requests' date, time, request text, response text, playlist
 * - delete an existing submission request (?)
 */

export function SubmissionRequestScheduler () {
    const [allSubmissionRequests, setSubmissionRequests] = useState<Array<ISubmissionRequest>>([])
    const [currentlyEditingSubmissionRequest, setCurrentlyEditingSubmissionRequest] = useState<undefined | number>()

    useEffect(() => {
        fetchAllSubmissionRequests().then(setSubmissionRequests)
    }, [])

    const onFormSubmit = useCallback(() => {}, [])

    useEffect(() => {
        console.log(currentlyEditingSubmissionRequest)
    }, [currentlyEditingSubmissionRequest])

    return <div id={styles.page}>
        <div id={styles.existingRequests}>
            {allSubmissionRequests.map((sr) => <SubmissionRequestListItem onEditClick={setCurrentlyEditingSubmissionRequest} submissionRequest={sr} key={sr.id}/>)}
        </div>
        <div id={styles.createUpdateForm}>
            <SubmissionRequestForm requestId={currentlyEditingSubmissionRequest} onSubmit={() => {}}/>
        </div>
    </div>
}