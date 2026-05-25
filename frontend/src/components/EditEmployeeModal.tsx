import { useState } from 'react'

type Props = {
	id: number
	login: string
	firstName: string
	lastName: string
	email: string
	phone: string
	role: string
	updateHandler: (
		id: number,
		login: string,
		firstName: string,
		lastName: string,
		email: string,
		phone: string,
		role: string,
	) => Promise<void>
	onUpdate: () => void
}

export default function EditEmployeeModal({
	id,
	login,
	firstName,
	lastName,
	email,
	phone,
	role,
	updateHandler,
	onUpdate,
}: Props) {
	const [editLogin, setEditLogin] = useState(login)
	const [editFirstName, setEditFirstName] = useState(firstName)
	const [editLastName, setEditLastName] = useState(lastName)
	const [editEmail, setEditEmail] = useState(email)
	const [editPhone, setEditPhone] = useState(phone)
	const [editRole, setEditRole] = useState(role)

	return (
		<>
			<button
				type="button"
				className="btn btn-circle btn-text btn-sm"
				aria-haspopup="dialog"
				aria-expanded="false"
				aria-controls={`edit-employee-modal-${id}`}
				data-overlay={`#edit-employee-modal-${id}`}>
				<span className="icon-[tabler--pencil] size-5"></span>
			</button>

			<div
				id={`edit-employee-modal-${id}`}
				className="overlay modal modal-middle overlay-open:opacity-100 overlay-open:duration-300 hidden"
				role="dialog"
				tabIndex={-1}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h3 className="modal-title">Edit employee</h3>
							<button
								type="button"
								className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
								aria-label="Close"
								data-overlay={`#edit-employee-modal-${id}`}>
								<span className="icon-[tabler--x] size-4"></span>
							</button>
						</div>
						<form
							onSubmit={async e => {
								e.preventDefault()
								await updateHandler(id, editLogin, editFirstName, editLastName, editEmail, editPhone, editRole)
								onUpdate()
							}}>
							<div className="modal-body pt-0 flex flex-col gap-4">
								<div className="flex gap-4 max-sm:flex-col">
									<div className="w-full">
										<label className="label-text cursor-text">First name</label>
										<input
											type="text"
											className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											defaultValue={firstName}
											onChange={e => setEditFirstName(e.target.value)}
										/>
									</div>
									<div className="w-full">
										<label className="label-text cursor-text">Last name</label>
										<input
											type="text"
											className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											defaultValue={lastName}
											onChange={e => setEditLastName(e.target.value)}
										/>
									</div>
								</div>
								<div>
									<label className="label-text cursor-text">Login</label>
									<input
										type="text"
										className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										defaultValue={login}
										onChange={e => setEditLogin(e.target.value)}
									/>
								</div>
								<div>
									<label className="label-text cursor-text">Email</label>
									<input
										type="email"
										className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										defaultValue={email}
										onChange={e => setEditEmail(e.target.value)}
									/>
								</div>
								<div>
									<label className="label-text cursor-text">Phone number</label>
									<input
										type="tel"
										className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										defaultValue={phone}
										onChange={e => setEditPhone(e.target.value)}
									/>
								</div>
								<div className="flex gap-4 max-sm:flex-col">
									<div className="w-full">
										<label className="label-text cursor-text">Role</label>
										<select
											className="select w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											value={editRole}
											onChange={e => setEditRole(e.target.value)}>
											<option value="driver">Driver</option>
											<option value="manager">Manager</option>
										</select>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-soft btn-secondary"
									data-overlay={`#edit-employee-modal-${id}`}>
									Cancel
								</button>
								<button type="submit" className="btn btn-accent">
									Save changes
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}
