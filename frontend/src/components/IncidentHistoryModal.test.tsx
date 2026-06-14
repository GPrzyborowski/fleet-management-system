import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import IncidentHistoryModal from './IncidentHistoryModal'
import { type IncidentData } from './IncidentRow'

vi.mock('./IncidentRow', () => ({
	default: ({ id, ai_description, onView }: IncidentData & { onView: (incident: IncidentData) => void }) => (
		<tr data-testid={`incident-row-${id}`}>
			<td>{ai_description}</td>
			<td>
				<button
					onClick={() =>
						onView({
							id,
							ai_description,
							status: 'pending',
							created_at: '2025-01-10T10:00:00',
							vehicle_incident_images: [],
						})
					}>
					View
				</button>
			</td>
		</tr>
	),
}))

const mockIncident: IncidentData = {
	id: 1,
	ai_description: 'Scratch detected on left door.',
	status: 'pending',
	created_at: '2025-01-10T10:00:00',
	vehicle_incident_images: [
		{ id: 1, side: 'left', image_url: 'https://example.com/left.jpg', image_type: 'new' },
		{ id: 2, side: 'left', image_url: 'https://example.com/base.jpg', image_type: 'base' },
	],
}

describe('IncidentHistoryModal', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders View History button', () => {
		render(<IncidentHistoryModal incidents={[]} />)
		expect(screen.getByRole('button', { name: /view history/i })).toBeInTheDocument()
	})

	it('modal is not visible before opening', () => {
		const { container } = render(<IncidentHistoryModal incidents={[]} />)
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('opens modal on View History click', () => {
		const { container } = render(<IncidentHistoryModal incidents={[]} />)
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-100', 'visible')
	})

	it('renders Incident History heading when open', () => {
		render(<IncidentHistoryModal incidents={[]} />)
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		expect(screen.getByText('Incident History')).toBeInTheDocument()
	})

	it('renders No incidents recorded when list is empty', () => {
		render(<IncidentHistoryModal incidents={[]} />)
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		expect(screen.getByText('No incidents recorded.')).toBeInTheDocument()
	})

	it('renders table headers when incidents exist', () => {
		render(<IncidentHistoryModal incidents={[mockIncident]} />)
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		expect(screen.getByText('Date')).toBeInTheDocument()
		expect(screen.getByText('Description')).toBeInTheDocument()
		expect(screen.getByText('Status')).toBeInTheDocument()
		expect(screen.getByText('Details')).toBeInTheDocument()
	})

	it('renders incident row for each incident', () => {
		render(<IncidentHistoryModal incidents={[mockIncident]} />)
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		expect(screen.getByTestId('incident-row-1')).toBeInTheDocument()
	})

	it('closes modal on X button click', () => {
		const { container } = render(<IncidentHistoryModal incidents={[]} />)
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		const closeButton = screen.getAllByRole('button').find(btn => btn.querySelector('.icon-\\[tabler--x\\]'))
		fireEvent.click(closeButton!)
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('closes modal on Close button click', () => {
		const { container } = render(<IncidentHistoryModal incidents={[]} />)
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		fireEvent.click(screen.getByRole('button', { name: /^close$/i }))
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('closes modal on backdrop click', () => {
		const { container } = render(<IncidentHistoryModal incidents={[]} />)
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		fireEvent.click(container.querySelector('.fixed.inset-0.bg-black\\/50')!)
		expect(container.querySelector('.fixed.inset-0.z-50')).toHaveClass('opacity-0', 'invisible')
	})

	it('shows incident details view on View button click', () => {
		render(<IncidentHistoryModal incidents={[mockIncident]} />)
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		fireEvent.click(screen.getByRole('button', { name: /^view$/i }))
		expect(screen.getByText('Incident Details')).toBeInTheDocument()
	})

	it('shows Back button in details view', () => {
		render(<IncidentHistoryModal incidents={[mockIncident]} />)
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		fireEvent.click(screen.getByRole('button', { name: /^view$/i }))
		expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
	})

	it('returns to list on Back button click', () => {
		render(<IncidentHistoryModal incidents={[mockIncident]} />)
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		fireEvent.click(screen.getByRole('button', { name: /^view$/i }))
		fireEvent.click(screen.getByRole('button', { name: /back/i }))
		expect(screen.getByText('Incident History')).toBeInTheDocument()
	})

	it('resets selected incident when modal is closed', () => {
		render(<IncidentHistoryModal incidents={[mockIncident]} />)
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		fireEvent.click(screen.getByRole('button', { name: /^view$/i }))
		fireEvent.click(screen.getByRole('button', { name: /^close$/i }))
		fireEvent.click(screen.getByRole('button', { name: /view history/i }))
		expect(screen.getByText('Incident History')).toBeInTheDocument()
	})
})
