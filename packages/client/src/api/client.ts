import axios from "axios";
import { SignupForm } from "../pages/Signup/Signup";
import { reduxStore } from "../store";
import { selectApiKey } from "../store/userReducer";

const client = axios.create({ baseURL: process.env.REACT_APP_SERVER_BASE })

client.interceptors.request.use(function (config) {
    const apiKey = selectApiKey(reduxStore.getState());
    if (config.headers) {
        config.headers['x-internal-api-key'] = apiKey
    }
    return config
});

export function submitSignupForm (form: SignupForm) {
    return client.post('user/signup', form, { headers: { 'Content-Type': 'application/json' }})
}

export function fetchAllUsers () {
    return client.get('user')
}