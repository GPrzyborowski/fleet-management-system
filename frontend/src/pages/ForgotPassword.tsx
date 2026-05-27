import Header from '../components/Header'
import EmailForm from '../components/EmailForm'
import PageTransition from '../components/PageTransition'
import { useState } from 'react'
import { API_URL } from '../config/api'

export default function ForgotPassword() {
	const [pending, setPending] = useState(false)
	const [successMsg, setSuccessMsg] = useState('')
	const [errorMsg, setErrorMsg] = useState('')

	const submitEmail = async (email: string): Promise<void> => {
		try {
			setPending(true)
			const res = await fetch(`${API_URL}/forgot-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			})
			const data = await res.json()
			if (res.ok) {
				setSuccessMsg(data.message)
			} else {
				setErrorMsg('Server error occured.')
			}
		} catch (err) {
			console.error(err)
		} finally {
			setPending(false)
		}
	}

	return (
		<PageTransition>
			<Header text="Forgot password" />
			<EmailForm submitEmail={submitEmail} successMsg={successMsg} errorMsg={errorMsg} pending={pending} />
			<img className="mt-10 mx-auto md:max-w-1/3 h-auto px-4" src="/hero_reset.png" alt="" />
		</PageTransition>
	)
}
