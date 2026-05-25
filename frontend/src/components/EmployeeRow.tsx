import EditEmployeeModal from './EditEmployeeModal'
import { useEffect } from 'react'

type Props = {
	id: number
	firstName: string
	lastName: string
	email: string
	login: string
	phone: string
	role: string
	isActive: boolean
	removeHandler: (id: number) => void
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

export default function EmployeeRow({
	id,
	firstName,
	lastName,
	email,
	login,
	phone,
	role,
	isActive,
	removeHandler,
	updateHandler,
	onUpdate,
}: Props) {
	useEffect(() => {
		const init = async () => {
			const { HSOverlay } = await import('flyonui/flyonui')
			HSOverlay.autoInit()
		}
		init()
	}, [])

	return (
		<tr>
			<td>{`${firstName} ${lastName}`}</td>
			<td>{email}</td>
			<td>
				<span className={`badge badge-soft ${role == 'Driver' ? 'badge-accent' : 'badge-default'} text-xs`}>
					{role}
				</span>
			</td>
			<td>{login}</td>
			<td>{phone}</td>
			<td>
				<span className={`badge badge-soft ${isActive ? 'badge-success' : 'badge-error'} text-xs`}>
					{isActive ? 'Working' : 'Not working'}
				</span>
			</td>
			<td>
				<EditEmployeeModal
					id={id}
					login={login}
					firstName={firstName}
					lastName={lastName}
					email={email}
					phone={phone}
					role={role}
					updateHandler={updateHandler}
					onUpdate={onUpdate}
				/>
				<button className="btn btn-circle btn-text btn-sm" aria-label="Action button" onClick={() => removeHandler(id)}>
					<span className="icon-[tabler--trash] size-5"></span>
				</button>
				<button className="btn btn-circle btn-text btn-sm" aria-label="Action button">
					<span className="icon-[tabler--logs] size-5"></span>
				</button>
			</td>
		</tr>
	)
}
