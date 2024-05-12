import axios from "axios";
import { SignupForm } from "../pages/Signup/Signup";
import { reduxStore } from "../store";
import { selectApiKey } from "../store/userReducer";
import { CreateSubmissionRequestInput } from "@songhaus/server"

const client = axios.create({ baseURL: process.env.REACT_APP_SERVER_BASE })

client.interceptors.request.use(function (config) {
    const apiKey = selectApiKey(reduxStore.getState());
    if (config.headers) {
        config.headers['x-internal-api-key'] = apiKey
    }
    return config
});

export function fetchAllUsers () {
    return client.get('user')
}

export function submitSignupForm (form: SignupForm) {
    return client.post('user/signup', form, { headers: { 'Content-Type': 'application/json' }})
}

export function fetchUserMessages (phoneNumber: string) {
    return client.get(`sms/${phoneNumber}`)
}

export function sendMessage (toNumber: string, messageBody: string) {
    return client.post(`sms/outgoing`, { toNumber, messageBody }, { headers: { 'Content-Type': 'application/json' }})
}

export function createSubmissionRequest (input: CreateSubmissionRequestInput) {
    return client.post(`submission-request`, { input }, { headers: { 'Content-Type': 'application/json' }})
}

export async function fetchAllSubmissionRequests () {
    const response = await client.get(`submission-request`, { headers: { 'Content-Type': 'application/json' }})
    return response.data
}

export async function fetchSubmissionRequest (id: number) {
    const response = await client.get(`submission-request/${id}`, { headers: { 'Content-Type': 'application/json' }})
    return response.data
}

export async function fetchAllPlaylists () {
    const response = await client.get(`playlists`, { headers: { 'Content-Type': 'application/json' }})
    return response.data
}