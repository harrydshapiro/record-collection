import react, { useCallback, useState } from 'react'
import styles from './signin.module.scss'
import clsx from 'clsx'

export function Signin (): JSX.Element {
    const [phoneNumber, setPhoneNumber] = useState('')

    const onSubmit = useCallback(() => {}, [])

    return (
        <div id={styles.page}>
            <div id={styles.signinForm}>
                <img id={styles.logo} src="/logo.png" alt="logo"/>

                <div className={styles.header}>
                    <p>Sign in with your phone number</p>
                </div>

                <div className={clsx([styles.formLabel])}>
                    {/* <label htmlFor="phoneNumber">phone number</label> */}
                    <input type="text" name="phoneNumber" value={phoneNumber} onChange={({ target: { value }}) => setPhoneNumber(value)}/>
                </div>

                <input type="submit" value="Submit" onClick={onSubmit}/>
            </div> 
        </div>

    )
}