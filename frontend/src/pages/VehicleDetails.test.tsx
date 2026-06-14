import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

vi.mock('../components/IncidentHistoryModal', () => ({
	default: () => <div>IncidentHistoryModal</div>,
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

const mockIncident = {
	id: 1,
	ai_description: 'Scratch detected.',
	status: 'pending',
	created_at: '2025-01-10T10:00:00',
	vehicle_incident_images: [{ id: 1, side: 'front', image_url: 'https://example.com/front.jpg', image_type: 'new' }],
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

function renderWithIncidents() {
	mockFetch.mockImplementation(async (url: string) => {
		if (String(url).includes('/incidents') && !String(url).includes('/all')) {
			return { ok: true, json: async () => [mockIncident] }
		}
		return { ok: true, json: async () => ({ assignments: [], assigned: null }) }
	})

	return render(
		<MemoryRouter initialEntries={[{ pathname: '/vehicles/1', state: vehicleState }]}>
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

	it('renders IncidentHistoryModal', () => {
		renderVehicleDetails()
		expect(screen.getByText('IncidentHistoryModal')).toBeInTheDocument()
	})

	it('renders Everything OK badge when no incidents', async () => {
		renderVehicleDetails()
		await waitFor(() => {
			expect(screen.getByText('Everything OK')).toBeInTheDocument()
		})
	})

	it('renders Damage detected button when incidents exist', async () => {
		renderWithIncidents()
		await waitFor(() => {
			expect(screen.getByRole('button', { name: /damage detected/i })).toBeInTheDocument()
		})
	})

	it('opens damage report modal on Damage detected click', async () => {
		renderWithIncidents()
		await waitFor(() => {
			expect(screen.getByRole('button', { name: /damage detected/i })).toBeInTheDocument()
		})
		fireEvent.click(screen.getByRole('button', { name: /damage detected/i }))
		expect(screen.getByText('Damage Report')).toBeInTheDocument()
		expect(screen.getByText('Scratch detected.')).toBeInTheDocument()
	})

	it('closes damage report modal on X click', async () => {
		renderWithIncidents()
		await waitFor(() => {
			expect(screen.getByRole('button', { name: /damage detected/i })).toBeInTheDocument()
		})
		fireEvent.click(screen.getByRole('button', { name: /damage detected/i }))
		expect(screen.getByText('Damage Report')).toBeInTheDocument()
		fireEvent.click(screen.getAllByRole('button').find(btn => btn.querySelector('.icon-\\[tabler--x\\]'))!)
		expect(screen.queryByText('Damage Report')).not.toBeInTheDocument()
	})

	it('renders assigned driver when assigned', async () => {
		mockFetch.mockImplementation(async (url: string) => {
			if (String(url).includes('/assignments-vehicle')) {
				return {
					ok: true,
					json: async () => ({
						assignments: [],
						assigned: { id: 1, users: { first_name: 'Jan', last_name: 'Kowalski' } },
					}),
				}
			}
			return { ok: true, json: async () => [] }
		})

		render(
			<MemoryRouter initialEntries={[{ pathname: '/vehicles/1', state: vehicleState }]}>
				<Routes>
					<Route path="/vehicles/:id" element={<VehicleDetails />} />
				</Routes>
			</MemoryRouter>,
		)

		await waitFor(() => {
			expect(screen.getByText(/Jan/)).toBeInTheDocument()
		})
	})

	it('renders Not assigned when no assigned driver', async () => {
		renderVehicleDetails()
		await waitFor(() => {
			expect(screen.getByText('Not assigned')).toBeInTheDocument()
		})
	})

	it('calls withdraw from fleet on button click', async () => {
		renderVehicleDetails()
		fireEvent.click(screen.getByRole('button', { name: /withdraw from fleet/i }))
		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining('/vehicles/1/withdraw'),
				expect.objectContaining({ method: 'PATCH' }),
			)
		})
	})

	it('calls return to fleet on button click', async () => {
		renderVehicleDetails({ ...vehicleState, status: 'unavailable' })
		fireEvent.click(screen.getByRole('button', { name: /return to fleet/i }))
		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining('/vehicles/1/return'),
				expect.objectContaining({ method: 'PATCH' }),
			)
		})
	})
})
