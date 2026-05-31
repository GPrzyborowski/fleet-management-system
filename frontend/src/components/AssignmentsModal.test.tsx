import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import AssignmentsModal from './AssignmentsModal'
import type { Assignment } from './AssignmentsModal'

const mockDownloadHandler = vi.fn()

const mockAssignment: Assignment = {
	id: 1,
	vehicle_id: 10,
	driver_id: 5,
	start_time: '2024-01-01T08:00:00',
	end_time: '2024-01-01T16:00:00',
	start_mileage: 10000,
	end_mileage: 10200,
	start_fuel_level: 80,
	end_fuel_level: 60,
	dashboard_image_url: 'https://example.com/dashboard.jpg',
	status: 'completed',
	users: {
		first_name: 'Gabriel',
		last_name: 'Przyborowski',
	},
}

const defaultProps = {
	assignments: [mockAssignment],
	vehicleId: '10',
	downloadHandler: mockDownloadHandler,
}

describe('AssignmentsModal', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders the trigger button', () => {
		render(<AssignmentsModal {...defaultProps} />)
		expect(screen.getByRole('button', { name: /view assignments/i })).toBeInTheDocument()
	})

	it('modal is not visible before opening', () => {
		const { container } = render(<AssignmentsModal {...defaultProps} />)
		const modal = container.querySelector('.fixed.inset-0.z-50')
		expect(modal).toHaveClass('opacity-0', 'invisible')
	})

	it('opens modal on trigger button click', () => {
		const { container } = render(<AssignmentsModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /view assignments/i }))
		const modal = container.querySelector('.fixed.inset-0.z-50')
		expect(modal).toHaveClass('opacity-100', 'visible')
	})

	it('renders modal heading when open', () => {
		render(<AssignmentsModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /view assignments/i }))
		expect(screen.getByText('Assignment Log')).toBeInTheDocument()
	})

	it('renders all table headers when open', () => {
		render(<AssignmentsModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /view assignments/i }))
		expect(screen.getByText('Employee')).toBeInTheDocument()
		expect(screen.getByText('From')).toBeInTheDocument()
		expect(screen.getByText('To')).toBeInTheDocument()
		expect(screen.getByText('Start mileage')).toBeInTheDocument()
		expect(screen.getByText('End mileage')).toBeInTheDocument()
		expect(screen.getByText('Start fuel level')).toBeInTheDocument()
		expect(screen.getByText('End fuel level')).toBeInTheDocument()
		expect(screen.getByText('Dashboard')).toBeInTheDocument()
		expect(screen.getByText('Status')).toBeInTheDocument()
	})

	it('closes modal on X button click', () => {
		const { container } = render(<AssignmentsModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /view assignments/i }))
		const closeIconButton = screen.getAllByRole('button').find(btn => btn.querySelector('.icon-\\[tabler--x\\]'))
		fireEvent.click(closeIconButton!)
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('closes modal on backdrop click', () => {
		const { container } = render(<AssignmentsModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /view assignments/i }))
		fireEvent.click(container.querySelector('.fixed.inset-0.bg-black\\/50')!)
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('closes modal on Close button click', () => {
		const { container } = render(<AssignmentsModal {...defaultProps} />)
		fireEvent.click(screen.getByRole('button', { name: /view assignments/i }))
		fireEvent.click(screen.getByRole('button', { name: /^close$/i }))
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('renders correct number of rows', () => {
		const second: Assignment = {
			...mockAssignment,
			id: 2,
			driver_id: 6,
			users: { first_name: 'Anna', last_name: 'Nowak' },
		}
		render(<AssignmentsModal {...defaultProps} assignments={[mockAssignment, second]} />)
		fireEvent.click(screen.getByRole('button', { name: /view assignments/i }))
		expect(screen.getAllByRole('row')).toHaveLength(3)
	})

	it('renders empty table when no assignments', () => {
		render(<AssignmentsModal {...defaultProps} assignments={[]} />)
		fireEvent.click(screen.getByRole('button', { name: /view assignments/i }))
		expect(screen.getAllByRole('row')).toHaveLength(1)
	})

	it('renders trigger button icon', () => {
		const { container } = render(<AssignmentsModal {...defaultProps} />)
		expect(container.querySelector('.icon-\\[tabler--users\\]')).toBeInTheDocument()
	})
})
