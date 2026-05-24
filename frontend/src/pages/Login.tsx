import PageTransition from '../components/PageTransition'
import Header from '../components/Header'
import LoginForm from '../components/LoginForm'
import { API_URL } from '../config/api'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
	const [errorMsg, setErrorMsg] = useState('')
	const navigate = useNavigate()
	const submitLogin = async (login: string, password: string): Promise<void> => {
		try {
			const res = await fetch(`${API_URL}/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ login, password }),
			})
			const data = await res.json()
			if (res.ok) {
				localStorage.setItem('token', data.token)
				navigate('/dashboard')
			} else {
				setErrorMsg('Invalid login or password.')
			}
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<PageTransition>
			<Header text="Log in to your account" />
			<LoginForm submitLogin={submitLogin} errorMsg={errorMsg} />
		</PageTransition>
	)
}
