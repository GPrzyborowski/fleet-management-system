import { useState, useEffect } from 'react'

type Props = {
	addHandler: (
		login: string,
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		phone: string,
		role: string,
	) => Promise<void>
	onUpdate: () => void
}

export default function NewEmployeeModal({ addHandler, onUpdate }: Props) {
	const [login, setLogin] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [phone, setPhone] = useState('')
	const [role, setRole] = useState('driver')

	useEffect(() => {
		const init = async () => {
			const flyonui = await import('flyonui/flyonui')
			if (typeof flyonui.HSStaticMethods?.autoInit === 'function') {
				flyonui.HSStaticMethods.autoInit()
			}
		}
		init()
	}, [])

	return (
		<>
			<button
				type="button"
				className="btn btn-accent w-fit self-end py-6 mb-4 text-white shadow-md hover:bg-primary-focus transition-colors"
				aria-haspopup="dialog"
				aria-expanded="false"
				aria-controls="new-employee-modal"
				data-overlay="#new-employee-modal">
				<span className="icon-[tabler--plus] size-6"></span>
			</button>

			<div
				id="new-employee-modal"
				className="overlay modal modal-middle overlay-open:opacity-100 overlay-open:duration-300 hidden"
				role="dialog"
				tabIndex={-1}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h3 className="modal-title">New employee</h3>

							<button
								type="button"
								className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
								aria-label="Close"
								data-overlay="#new-employee-modal">
								<span className="icon-[tabler--x] size-4"></span>
							</button>
						</div>

						<form
							onSubmit={async e => {
								e.preventDefault()
								await addHandler(login, firstName, lastName, email, password, phone, role)
								onUpdate()
							}}>
							<div className="modal-body pt-0 flex flex-col gap-4">
								<div className="flex gap-4 max-sm:flex-col">
									<div className="w-full">
										<label className="label-text cursor-text">First name</label>

										<input
											type="text"
											className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											value={firstName}
											onChange={e => setFirstName(e.target.value)}
										/>
									</div>

									<div className="w-full">
										<label className="label-text cursor-text">Last name</label>

										<input
											type="text"
											className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											value={lastName}
											onChange={e => setLastName(e.target.value)}
										/>
									</div>
								</div>

								<div>
									<label className="label-text cursor-text">Login</label>

									<input
										type="text"
										className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										value={login}
										onChange={e => setLogin(e.target.value)}
									/>
								</div>

								<div>
									<label className="label-text cursor-text">Email</label>

									<input
										type="email"
										className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										value={email}
										onChange={e => setEmail(e.target.value)}
									/>
								</div>

								<div>
									<label className="label-text cursor-text">Password</label>

									<input
										type="password"
										className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										value={password}
										onChange={e => setPassword(e.target.value)}
									/>
								</div>

								<div>
									<label className="label-text cursor-text">Phone number</label>

									<input
										type="tel"
										className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										value={phone}
										onChange={e => setPhone(e.target.value)}
									/>
								</div>

								<div className="flex gap-4 max-sm:flex-col">
									<div className="w-full">
										<label className="label-text cursor-text">Role</label>

										<select
											className="select w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											value={role}
											onChange={e => setRole(e.target.value)}>
											<option value="DRIVER">Driver</option>
											<option value="MANAGER">Manager</option>
										</select>
									</div>
								</div>
							</div>

							<div className="modal-footer">
								<button type="button" className="btn btn-soft btn-secondary" data-overlay="#new-employee-modal">
									Cancel
								</button>

								<button type="submit" className="btn btn-accent">
									Save employee
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}
