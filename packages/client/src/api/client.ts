import axios from "axios";
import { SignupForm } from "../pages/Signup/Signup";

const client = axios.create({ baseURL: process.env.REACT_APP_SERVER_BASE })

export function submitSignupForm (form: SignupForm) {
    return client.post('user/signup', form, { headers: { 'Content-Type': 'application/json' }})
}