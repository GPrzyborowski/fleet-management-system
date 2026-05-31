import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import AssignmentRow from './AssignmentRow'

const mockDownloadHandler = vi.fn()

const defaultProps = {
	id: 1,
	vehicle_id: 1,
	driver_id: 2,
	start_time: '2025-01-10T08:00:00',
	end_time: '2025-01-10T16:00:00',
	start_mileage: 149000,
	end_mileage: 150000,
	start_fuel_level: 90,
	end_fuel_level: 80,
	dashboard_image_url:
		'https://www.racv.com.au/royalauto/transport/cars/what-do-the-car-dashboard-symbols-mean-and-warning-lights/_jcr_content/root/container/articlepagecontent/image.coreimg.jpeg/1745367448392/1400x600-car-dashboard-lights-gettyimages-519216518.jpeg',
	status: 'completed',
	users: { first_name: 'Gabriel', last_name: 'Przyborowski' },
	downloadHandler: mockDownloadHandler,
}

describe('AssignmentRow', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders driver full name', () => {
		render(
			<table>
				<tbody>
					<AssignmentRow {...defaultProps} />
				</tbody>
			</table>,
		)
		expect(screen.getByText('Gabriel Przyborowski')).toBeInTheDocument()
	})

	it('renders start and end mileage', () => {
		render(
			<table>
				<tbody>
					<AssignmentRow {...defaultProps} />
				</tbody>
			</table>,
		)
		expect(screen.getByText('149000 km')).toBeInTheDocument()
		expect(screen.getByText('150000 km')).toBeInTheDocument()
	})

	it('renders start and end fuel level', () => {
		render(
			<table>
				<tbody>
					<AssignmentRow {...defaultProps} />
				</tbody>
			</table>,
		)
		expect(screen.getByText('90%')).toBeInTheDocument()
		expect(screen.getByText('80%')).toBeInTheDocument()
	})

	it('renders status', () => {
		render(
			<table>
				<tbody>
					<AssignmentRow {...defaultProps} />
				</tbody>
			</table>,
		)
		expect(screen.getByText('completed')).toBeInTheDocument()
	})

	it('renders download button when dashboard_image_url is set', () => {
		render(
			<table>
				<tbody>
					<AssignmentRow {...defaultProps} />
				</tbody>
			</table>,
		)
		expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
	})

	it('calls downloadHandler with url on download button click', () => {
		render(
			<table>
				<tbody>
					<AssignmentRow {...defaultProps} />
				</tbody>
			</table>,
		)
		fireEvent.click(screen.getByRole('button', { name: /download/i }))
		expect(mockDownloadHandler).toHaveBeenCalledWith(defaultProps.dashboard_image_url)
	})

	it('renders Not available when dashboard_image_url is null', () => {
		render(
			<table>
				<tbody>
					<AssignmentRow {...defaultProps} dashboard_image_url={null} />
				</tbody>
			</table>,
		)
		expect(screen.getByText('Not available')).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: /download/i })).not.toBeInTheDocument()
	})

	it('renders dash when end_mileage is null', () => {
		render(
			<table>
				<tbody>
					<AssignmentRow {...defaultProps} end_mileage={null} />
				</tbody>
			</table>,
		)
		expect(screen.getAllByText('-').length).toBeGreaterThan(0)
	})

	it('renders dash when end_fuel_level is null', () => {
		render(
			<table>
				<tbody>
					<AssignmentRow {...defaultProps} end_fuel_level={null} />
				</tbody>
			</table>,
		)
		expect(screen.getAllByText('-').length).toBeGreaterThan(0)
	})

	it('renders dash when end_time is null', () => {
		render(
			<table>
				<tbody>
					<AssignmentRow {...defaultProps} end_time={null} />
				</tbody>
			</table>,
		)
		expect(screen.getAllByText('-').length).toBeGreaterThan(0)
	})
})
