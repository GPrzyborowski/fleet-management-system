import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi, type Mock } from 'vitest'
import Vehicles from './Vehicles'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../config/api', () => ({
	API_URL: 'http://localhost:3000',
}))

vi.mock('../components/Header', () => ({
	default: ({ text }: { text: string }) => <div>{text}</div>,
}))

vi.mock('../components/PageTransition', () => ({
	default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('../components/NewVehicleModal', () => ({
	default: ({ onUpdate }: { onUpdate: () => void }) => <button onClick={onUpdate}>New vehicle modal</button>,
}))

vi.mock('../components/VehicleRow', () => ({
	default: ({
		licensePlate,
		brand,
		model,
		removeHandler,
		id,
	}: {
		licensePlate: string
		brand: string
		model: string
		removeHandler: (id: number) => void
		id: number
	}) => (
		<tr>
			<td>{licensePlate}</td>
			<td>
				{brand} {model}
			</td>
			<td>
				<button onClick={() => removeHandler(id)}>Remove</button>
			</td>
		</tr>
	),
}))

const mockVehicles = [
	{
		id: 1,
		license_plate: 'GD 12345',
		brand: 'Volvo',
		model: 'FH16',
		year_of_manufacture: 2020,
		current_mileage: 150000,
		status: 'available',
	},
	{
		id: 2,
		license_plate: 'GD 67890',
		brand: 'Mercedes',
		model: 'Actros',
		year_of_manufacture: 2019,
		current_mileage: 230000,
		status: 'available',
	},
]

describe('Vehicles page', () => {
	beforeEach(() => {
		localStorage.setItem('token', 'mocked token')
		globalThis.fetch = vi.fn(
			async () =>
				({
					ok: true,
					json: async () => mockVehicles,
				}) as Response,
		)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('renders vehicles page title', async () => {
		render(
			<MemoryRouter>
				<Vehicles />
			</MemoryRouter>,
		)
		expect(screen.getByText('Vehicles')).toBeInTheDocument()
	})

	it('shows loading spinner initially', () => {
		render(
			<MemoryRouter>
				<Vehicles />
			</MemoryRouter>,
		)
		expect(document.querySelector('.loading-spinner')).toBeInTheDocument()
	})

	it('renders fetched vehicle data', async () => {
		render(
			<MemoryRouter>
				<Vehicles />
			</MemoryRouter>,
		)
		await waitFor(() => {
			expect(screen.getByText('GD 12345')).toBeInTheDocument()
			expect(screen.getByText('Volvo FH16')).toBeInTheDocument()
			expect(screen.getByText('GD 67890')).toBeInTheDocument()
			expect(screen.getByText('Mercedes Actros')).toBeInTheDocument()
		})
	})

	it('renders new vehicle modal', async () => {
		render(
			<MemoryRouter>
				<Vehicles />
			</MemoryRouter>,
		)
		await waitFor(() => {
			expect(screen.getByText('New vehicle modal')).toBeInTheDocument()
		})
	})

	it('calls fetch with authorization header', async () => {
		render(
			<MemoryRouter>
				<Vehicles />
			</MemoryRouter>,
		)
		await waitFor(() => {
			expect(globalThis.fetch).toHaveBeenCalledWith(
				'http://localhost:3000/vehicles',
				expect.objectContaining({
					headers: { Authorization: 'Bearer mocked token' },
				}),
			)
		})
	})

	it('renders empty table when fetch fails', async () => {
		globalThis.fetch = vi.fn(async () => ({ ok: false, json: async () => [] }) as Response)
		render(
			<MemoryRouter>
				<Vehicles />
			</MemoryRouter>,
		)
		await waitFor(() => {
			expect(screen.queryByText('GD 12345')).not.toBeInTheDocument()
		})
	})

	it('removes vehicle from list after delete', async () => {
		globalThis.fetch = vi.fn(async (url: string, options?: RequestInit) => {
			if (options?.method === 'DELETE') {
				return { ok: true, json: async () => ({}) } as Response
			}
			return { ok: true, json: async () => mockVehicles } as Response
		}) as Mock

		render(
			<MemoryRouter>
				<Vehicles />
			</MemoryRouter>,
		)

		await waitFor(() => {
			expect(screen.getByText('GD 12345')).toBeInTheDocument()
		})

		fireEvent.click(screen.getAllByText('Remove')[0])

		await waitFor(() => {
			expect(screen.queryByText('GD 12345')).not.toBeInTheDocument()
		})
	})

	it('refreshes list when new vehicle modal triggers onUpdate', async () => {
		render(
			<MemoryRouter>
				<Vehicles />
			</MemoryRouter>,
		)

		await waitFor(() => {
			expect(screen.getByText('New vehicle modal')).toBeInTheDocument()
		})

		fireEvent.click(screen.getByText('New vehicle modal'))

		await waitFor(() => {
			expect(globalThis.fetch).toHaveBeenCalledTimes(2)
		})
	})
})
