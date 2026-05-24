import { useState } from 'react'
import type { FormEvent } from 'react'

interface LoginFormProps {
	submitLogin: (login: string, password: string) => Promise<void>
	errorMsg: string
}

export default function LoginForm({ submitLogin, errorMsg }: LoginFormProps) {
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		submitLogin(login, password)
	}

	return (
		<div className="flex flex-col items-center w-full px-4 sm:px-6 sm:mt-32">
			<form onSubmit={handleSubmit} className="w-full max-w-sm space-y-2">
				<div className="form-control w-full">
					<label className="label pt-0 pl-1">
						<span className="label-text font-medium cursor-text">Login</span>
					</label>
					<input
						type="text"
						placeholder="John Doe"
						className="input input-filled input-primary w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
						onChange={e => setLogin(e.target.value)}
					/>
				</div>

				<div className="form-control w-full">
					<label className="label pt-0 pl-1">
						<span className="label-text font-medium cursor-text">Password</span>
					</label>
					<input
						type="password"
						placeholder="Super secret password"
						className="input input-filled input-primary w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
						onChange={e => setPassword(e.target.value)}
					/>
				</div>

				<div className="flex justify-center pt-4">
					<button
						type="submit"
						className="btn btn-accent w-full sm:w-auto px-12 py-6 mt-4 text-white shadow-md hover:bg-primary-focus transition-colors flex items-center justify-center no-underline">
						Sign In
					</button>
				</div>
				{errorMsg && <span className="text-error text-sm md:text-base text-center block mt-8">{errorMsg}</span>}
			</form>
		</div>
	)
}
