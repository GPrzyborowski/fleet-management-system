import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import VehicleDetails from './VehicleDetails'

vi.mock('../components/AssignmentsModal', () => ({
	default: () => <div>AssignmentsModal</div>,
}))

vi.mock('../components/Header', () => ({
	default: ({ text }: { text: string }) => <h1>{text}</h1>,
}))

vi.mock('../components/PageTransition', () => ({
	default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

const vehicleState = {
	brand: 'Volvo',
	model: 'FH16',
	licensePlate: 'GD 12345',
	year: 2020,
	mileage: 150000,
	fuelLevel: 80,
	status: 'available',
}

function renderVehicleDetails(state = vehicleState) {
	mockFetch.mockResolvedValue({
		ok: true,
		json: async () => ({ assignments: [], assigned: null }),
	})

	return render(
		<MemoryRouter initialEntries={[{ pathname: '/vehicles/1', state }]}>
			<Routes>
				<Route path="/vehicles/:id" element={<VehicleDetails />} />
			</Routes>
		</MemoryRouter>,
	)
}

describe('VehicleDetails', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		localStorage.setItem('token', 'mock-token')
	})

	it('renders header', () => {
		renderVehicleDetails()
		expect(screen.getByText('Vehicle details')).toBeInTheDocument()
	})

	it('renders brand and model', () => {
		renderVehicleDetails()
		expect(screen.getByText('Volvo FH16')).toBeInTheDocument()
	})

	it('renders license plate', () => {
		renderVehicleDetails()
		expect(screen.getByText('GD 12345')).toBeInTheDocument()
	})

	it('renders year', () => {
		renderVehicleDetails()
		expect(screen.getByText('2020')).toBeInTheDocument()
	})

	it('renders mileage', () => {
		renderVehicleDetails()
		expect(screen.getByText('150000 km')).toBeInTheDocument()
	})

	it('renders fuel level', () => {
		renderVehicleDetails()
		expect(screen.getByText('80%')).toBeInTheDocument()
	})

	it('renders In fleet status for available vehicle', () => {
		renderVehicleDetails()
		expect(screen.getByText('In fleet')).toBeInTheDocument()
	})

	it('renders Withdrawn status for unavailable vehicle', () => {
		renderVehicleDetails({ ...vehicleState, status: 'unavailable' })
		expect(screen.getByText('Withdrawn')).toBeInTheDocument()
	})

	it('renders Withdraw from Fleet button when available', () => {
		renderVehicleDetails()
		expect(screen.getByRole('button', { name: /withdraw from fleet/i })).toBeInTheDocument()
	})

	it('renders Return to Fleet button when unavailable', () => {
		renderVehicleDetails({ ...vehicleState, status: 'unavailable' })
		expect(screen.getByRole('button', { name: /return to fleet/i })).toBeInTheDocument()
	})

	it('renders AssignmentsModal', () => {
		renderVehicleDetails()
		expect(screen.getByText('AssignmentsModal')).toBeInTheDocument()
	})
})
