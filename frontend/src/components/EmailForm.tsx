import { useState } from 'react'
import type { FormEvent } from 'react'

interface EmailFormProps {
	submitEmail: (email: string) => Promise<void>
	successMsg: string
	errorMsg: string
	pending: boolean
}

export default function EmailForm({ submitEmail, successMsg, errorMsg, pending }: EmailFormProps) {
	const [email, setEmail] = useState('')

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		await submitEmail(email)
		setEmail('')
	}

	return (
		<div className="flex flex-col items-center w-full px-6">
			<form onSubmit={handleSubmit} className="w-full max-w-sm space-y-2">
				<div className="form-control w-full">
					<label className="label pt-0 pl-1">
						<span className="label-text font-medium cursor-text">Email</span>
					</label>
					<input
						type="email"
						value={email}
						placeholder="user@example.com"
						className="input input-filled input-primary w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
						onChange={e => setEmail(e.target.value)}
					/>
				</div>

				<div className="flex justify-center pt-4">
					<button
						type="submit"
						className={`btn btn-accent ${pending == true ? 'btn-disabled' : ''} w-full sm:w-auto min-w-[160px] px-12 py-6 mt-4 text-white shadow-md hover:bg-primary-focus transition-colors flex items-center justify-center no-underline`}>
						{pending == true ? <span className="loading loading-spinner loading-lg"></span> : 'Send reset link'}
					</button>
				</div>
				{successMsg && (
					<span className="text-success text-sm md:text-base text-center block mt-8 whitespace-nowrap">
						{successMsg}
					</span>
				)}
				{errorMsg && <span className="text-error text-sm md:text-base text-center block mt-8">{errorMsg}</span>}
			</form>
		</div>
	)
}
