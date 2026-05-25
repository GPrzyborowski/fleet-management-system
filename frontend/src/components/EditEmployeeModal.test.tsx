import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import EditEmployeeModal from './EditEmployeeModal'

describe('EditEmployeeModal', () => {
	const props = {
		id: 1,
		login: 'gprzyborowski',
		firstName: 'Gabriel',
		lastName: 'Przyborowski',
		email: 'gprzyborowski@example.com',
		phone: '123456789',
		role: 'driver',
		updateHandler: vi.fn().mockResolvedValue(undefined),
		onUpdate: vi.fn(),
	}

	it('renders edit button', () => {
		render(<EditEmployeeModal {...props} />)
		expect(
			screen.getByRole('button', {
				name: '',
			}),
		).toBeInTheDocument()
	})

	it('renders form fields with default values', () => {
		render(<EditEmployeeModal {...props} />)
		expect(screen.getByDisplayValue('Gabriel')).toBeInTheDocument()
		expect(screen.getByDisplayValue('Przyborowski')).toBeInTheDocument()
		expect(screen.getByDisplayValue('gprzyborowski')).toBeInTheDocument()
		expect(screen.getByDisplayValue('gprzyborowski@example.com')).toBeInTheDocument()
		expect(screen.getByDisplayValue('123456789')).toBeInTheDocument()
	})

	it('calls updatehandler with updated values', async () => {
		render(<EditEmployeeModal {...props} />)
		fireEvent.change(screen.getByDisplayValue('Gabriel'), {
			target: { value: 'Gabriel' },
		})
		fireEvent.change(screen.getByDisplayValue('Przyborowski'), {
			target: { value: 'Przyborowski' },
		})
		fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
		expect(props.updateHandler).toHaveBeenCalledTimes(1)
		expect(props.updateHandler).toHaveBeenCalledWith(
			1,
			'gprzyborowski',
			'Gabriel',
			'Przyborowski',
			'gprzyborowski@example.com',
			'123456789',
			'driver',
		)
	})

	it('calls onupdate after submit', async () => {
		render(<EditEmployeeModal {...props} />)
		fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
		expect(props.onUpdate).toHaveBeenCalled()
	})
})
