import { useState, useEffect } from 'react'
import PageTransition from '../components/PageTransition'
import Header from '../components/Header'
import EmployeeRow from '../components/EmployeeRow'
import NewEmployeeModal from '../components/NewEmployeeModal'
import { API_URL } from '../config/api'

type Employee = {
	id: number
	login: string
	first_name: string
	last_name: string
	email: string
	phone_number: string
	role: string
	is_active: boolean
	created_at: string
}

export default function Employees() {
	const token = localStorage.getItem('token')
	const [employees, setEmployees] = useState<Employee[]>([])
	const [pending, setPending] = useState(true)
	const [refreshTrigger, setRefreshTrigger] = useState(0)

	const addEmployee = async (
		login: string,
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		phone: string,
		role: string,
	) => {
		try {
			const res = await fetch(`${API_URL}/employees`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ login, firstName, lastName, email, password, phone, role }),
			})
			if (res.ok) {
				const { HSOverlay } = await import('flyonui/flyonui')
				HSOverlay.close('#new-employee-modal')
			}
		} catch (err) {
			console.error(err)
		}
	}

	const updateEmployee = async (
		id: number,
		login: string,
		firstName: string,
		lastName: string,
		email: string,
		phone: string,
		role: string,
	) => {
		try {
			const res = await fetch(`${API_URL}/employees/${id}`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ login, firstName, lastName, email, phone, role }),
			})
			if (res.ok) {
				const { HSOverlay } = await import('flyonui/flyonui')
				HSOverlay.close(`#edit-employee-modal-${id}`)
			}
		} catch (err) {
			console.error(err)
		}
	}

	const removeEmployee = async (id: number) => {
		try {
			const res = await fetch(`${API_URL}/employees/${id}/remove`, {
				method: 'PATCH',
				headers: { Authorization: `Bearer ${token}` },
			})
			if (res.ok) {
				setEmployees(prev => prev.filter(emp => emp.id != id))
			}
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		const getEmployees = async () => {
			try {
				const res = await fetch(`${API_URL}/employees`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				const data = await res.json()
				setEmployees(res.ok ? data : [])
				setPending(false)
			} catch (err) {
				console.error(err)
				setPending(false)
			}
		}
		getEmployees()
	}, [refreshTrigger, token])

	return (
		<PageTransition>
			<Header text="Employees" />
			<div className="w-full px-4 sm:px-12 lg:px-24 xl:px-32 overflow-x-auto flex flex-col justify-center">
				{pending ? (
					<div className="flex justify-center">
						<span className="loading loading-spinner loading-xl"></span>
					</div>
				) : (
					<>
						<NewEmployeeModal addHandler={addEmployee} onUpdate={() => setRefreshTrigger(prev => prev + 1)} />
						<table className="table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									<th>Role</th>
									<th>Login</th>
									<th>Phone</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{employees.map(employee => {
									return (
										<EmployeeRow
											key={employee.id}
											id={employee.id}
											firstName={employee.first_name}
											lastName={employee.last_name}
											email={employee.email}
											role={employee.role}
											login={employee.login}
											phone={employee.phone_number}
											isActive={employee.is_active}
											removeHandler={removeEmployee}
											updateHandler={updateEmployee}
											onUpdate={() => setRefreshTrigger(prev => prev + 1)}
										/>
									)
								})}
							</tbody>
						</table>
					</>
				)}
			</div>
		</PageTransition>
	)
}
