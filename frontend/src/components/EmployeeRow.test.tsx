import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import EmployeeRow from './EmployeeRow'

vi.mock('flyonui/flyonui', () => ({
	HSOverlay: {
		autoInit: vi.fn(),
		close: vi.fn(),
	},
}))

describe('EmployeeRow', () => {
	const props = {
		id: 1,
		firstName: 'Gabriel',
		lastName: 'Przyborowski',
		email: 'gprzyborowski@example.com',
		login: 'gprzyborowski',
		phone: '123456789',
		role: 'driver',
		isActive: true,
		removeHandler: vi.fn(),
		updateHandler: vi.fn().mockResolvedValue(undefined),
		onUpdate: vi.fn(),
	}

	it('renders employee data', () => {
		render(
			<table>
				<tbody>
					<EmployeeRow {...props} />
				</tbody>
			</table>,
		)
		expect(screen.getByText('Gabriel Przyborowski')).toBeInTheDocument()
		expect(screen.getByText('gprzyborowski@example.com')).toBeInTheDocument()
		expect(screen.getByText('gprzyborowski')).toBeInTheDocument()
		expect(screen.getByText('123456789')).toBeInTheDocument()
	})

	it('renders driver badge', () => {
		render(
			<table>
				<tbody>
					<EmployeeRow {...props} />
				</tbody>
			</table>,
		)
		const badge = screen.getAllByText('Driver')[0]
		expect(badge).toHaveClass('badge-accent')
	})

	it('renders active status badge', () => {
		render(
			<table>
				<tbody>
					<EmployeeRow {...props} />
				</tbody>
			</table>,
		)
		expect(screen.getByText('Driving')).toBeInTheDocument()
	})

	it('calls removehandler when trash button clicked', () => {
		render(
			<table>
				<tbody>
					<EmployeeRow {...props} />
				</tbody>
			</table>,
		)
		fireEvent.click(screen.getByLabelText('Remove employee'))
		expect(props.removeHandler).toHaveBeenCalledWith(1)
	})

	it('renders manager badge', () => {
		render(
			<table>
				<tbody>
					<EmployeeRow {...props} role="manager" />
				</tbody>
			</table>,
		)
		const badge = screen.getAllByText('Manager')[0]
		expect(badge).toHaveClass('badge-default')
	})
})
