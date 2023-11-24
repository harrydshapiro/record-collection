import clsx from 'clsx'
import emailRegex from 'email-regex'
import react, { useCallback, useState } from 'react'
import { submitSignupForm } from '../../api/client'
import styles from './signup.module.scss'

export interface SignupForm { firstName: string, lastName: string, email: string, phone: string, spotifyProfile: string, reference: string };

function isUrl(string: string) {
    try {
        const url = new URL(string) 
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (err) {
        return false
    }
}

function validateForm ({ firstName, lastName, email, phone, spotifyProfile, reference }: SignupForm) {
    const invalidFields: (keyof SignupForm)[] = []

    if (!firstName) {
        invalidFields.push('firstName')
    }
    if (!lastName) {
        invalidFields.push('lastName')
    }
    if (!email || !emailRegex({exact: true}).test(email)) {
        invalidFields.push('email')
    }
    if (!phone || !phone.match(/^\+(?:[0-9]●?){6,14}[0-9]$/)) {
        invalidFields.push('phone')
    }
    if (!spotifyProfile || !isUrl(spotifyProfile)) {
        invalidFields.push('spotifyProfile')
    }
    if (!reference) {
        invalidFields.push('reference')
    }

    return { valid: invalidFields.length === 0, invalidFields }
}

export function Signup (): JSX.Element {

    const [form, setForm] = useState<SignupForm>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        spotifyProfile: '',
        reference: ''
    })

    const [invalidFields, setInvalidFields] = useState<(keyof SignupForm)[]>([])

    const [signedUp, setSignedUp] = useState(false)

    const handleInputChange = useCallback((field: keyof typeof form, value: string) => {
        const newInvalidFields = invalidFields.filter(f => f !== field)
        setInvalidFields(newInvalidFields)

        setForm({
            ...form,
            [field]: value
        })
    }, [form, setForm, invalidFields])

    const onSubmit = useCallback(async () => {
        const validationResults = validateForm(form)

        setInvalidFields(validationResults.invalidFields)

        if (validationResults.valid) {
            try {
                await submitSignupForm(form)
                setSignedUp(true)
            } catch (err) {
                // TODO: Show error message
                console.error(err)
            }
        } else {

        }
    }, [form])


    return (
        <div id={styles.page}>
            { signedUp ? 
                <p className={styles.thankYouText}>thank u bb we will lyk when ur in<br /><br />promise it will be soon</p> : 
                <div id={styles.signupForm}>
                    <img id={styles.logo} src="/logo.png" alt="logo"/>

                    <div className={styles.header}>
                        <p>we've got a<br/>few spots left...</p>
                        <p>wanna put your<br />name down?</p>
                    </div>

                    <div className={clsx([styles.formLabel, invalidFields.includes("firstName") ? styles.invalid : null])}>
                        <label htmlFor="firstName">first name</label>
                        <input type="text" name="firstName" value={form.firstName} onChange={({ target: { value }}) => handleInputChange('firstName', value)}/>
                    </div>

                    <div className={clsx([styles.formLabel, invalidFields.includes("lastName") ? styles.invalid : null])}>
                        <label htmlFor="lastName">last name</label>
                        <input type="text" name="lastName" value={form.lastName} onChange={({ target: { value }}) => handleInputChange('lastName', value)} />
                    </div>

                    <div className={clsx([styles.formLabel, invalidFields.includes("email") ? styles.invalid : null])}>
                        <label htmlFor="email">email</label>
                        <input type="email" name="email" value={form.email} onChange={({ target: { value }}) => handleInputChange('email', value)} />
                    </div>
                    <div className={clsx([styles.formLabel, invalidFields.includes("phone") ? styles.invalid : null])}>
                        <label htmlFor="phone">phone: <span className={styles.phoneFormat}>+1AAABBBCCCC</span></label>
                        <input type="tel" name="phone" value={form.phone} onChange={({ target: { value }}) => handleInputChange('phone', value)} />
                    </div>
                    <div className={clsx([styles.formLabel, invalidFields.includes("spotifyProfile") ? styles.invalid : null])}>
                        <label htmlFor="spotifyProfile">link to s*otify profile</label>
                        <input type="URL" name="spotifyProfile" value={form.spotifyProfile} onChange={({ target: { value }}) => handleInputChange('spotifyProfile', value)} />
                    </div>
                    <div className={clsx([styles.formLabel, invalidFields.includes("reference") ? styles.invalid : null])}>
                        <label htmlFor="reference">who told ya about us?</label>
                        <input type="text" name="reference" value={form.reference} onChange={({ target: { value }}) => handleInputChange('reference', value)} />
                    </div>
                    <br/>
                    <input type="submit" value="Submit" onClick={onSubmit}/>
                    <br/>
                    <span id={styles.messagingTerms}>By providing your phone number, you agree to receive text messages from song.haus. Message and data rates may apply. Message frequency varies. <a href="https://docs.google.com/document/d/12VZQ3QEI59iEJYctsjPm-YuyWO80e9hE2qzJGvNuECA/edit?usp=sharing" target="_blank" rel="noreferrer">Terms and Conditions</a>. <a href="https://docs.google.com/document/d/1tAIHyhzoYazUdb3kNdEVeZMdvtQ29pCSOmb3o_wsTyM/edit?usp=sharing" target="_blank" rel="noreferrer">Privacy Policy</a></span>
                </div> 
            }
        </div>

    )
}