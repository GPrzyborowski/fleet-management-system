import { useState, useEffect } from 'react'
import PageTransition from '../components/PageTransition'
import Header from '../components/Header'
import EmployeeRow from '../components/EmployeeRow'
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

	const capitalizeFirstLetter = (word: string) => {
		return String(word).charAt(0).toUpperCase() + String(word).slice(1)
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
	}, [])

	return (
		<PageTransition>
			<Header text="Employees" />
			<div className="w-full px-4 sm:px-12 lg:px-24 xl:px-32 overflow-x-auto flex justify-center">
				{pending ? (
					<span className="loading loading-spinner loading-xl"></span>
				) : (
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
										role={capitalizeFirstLetter(employee.role)}
										login={employee.login}
										phone={employee.phone_number}
										isActive={employee.is_active}
										removeHandler={removeEmployee}
									/>
								)
							})}
						</tbody>
					</table>
				)}
			</div>
		</PageTransition>
	)
}
