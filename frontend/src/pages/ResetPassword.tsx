import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import ResetPasswordForm from '../components/ResetPasswordForm'
import PageTransition from '../components/PageTransition'
import { API_URL } from '../config/api'

export default function ResetPassword() {
	const [pending, setPending] = useState(false)
	const [errorMsg, setErrorMsg] = useState('')
	const [successMsg, setSuccessMsg] = useState('')
	const [searchParams] = useSearchParams()
	const token = searchParams.get('token')
	const navigate = useNavigate()

	const submitPassword = async (token: string, newPassword: string): Promise<void> => {
		try {
			setPending(true)
			const res = await fetch(`${API_URL}/reset-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, newPassword }),
			})
			const data = await res.json()
			if (res.ok) {
				setSuccessMsg(data.message)
				setTimeout(() => navigate('/login'), 1500)
			} else {
				setErrorMsg('Server error occured.')
			}
		} catch (err) {
			console.error(err)
		} finally {
			setPending(false)
		}
	}

	return !token ? (
		<PageTransition>
			<Header text="Invalid reset link" />
		</PageTransition>
	) : (
		<PageTransition>
			<Header text="Set new password" />
			<ResetPasswordForm
				submitPassword={submitPassword}
				token={token}
				successMsg={successMsg}
				errorMsg={errorMsg}
				pending={pending}
			/>
		</PageTransition>
	)
}
