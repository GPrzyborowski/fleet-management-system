import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import IncidentRow, { type IncidentData } from './IncidentRow'

const mockOnView = vi.fn()

const defaultProps: IncidentData & { onView: (incident: IncidentData) => void } = {
    id: 1,
    ai_description: 'Scratch detected on left door.',
    status: 'pending',
    created_at: '2025-01-10T10:00:00',
    vehicle_incident_images: [
        { id: 1, side: 'left', azure_blob_url: 'https://example.com/left.jpg', image_type: 'new' },
        { id: 2, side: 'left', azure_blob_url: 'https://example.com/left-base.jpg', image_type: 'base' },
    ],
    onView: mockOnView,
}

type RenderRowProps = Partial<typeof defaultProps>

const renderRow = (props?: RenderRowProps) =>
    render(
        <table>
            <tbody>
                <IncidentRow {...defaultProps} {...props} />
            </tbody>
        </table>
    )

describe('IncidentRow', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders formatted date', () => {
        renderRow()
        expect(screen.getByText(/10\.01\.2025/)).toBeInTheDocument()
    })

    it('renders ai description', () => {
        renderRow()
        expect(screen.getByText('Scratch detected on left door.')).toBeInTheDocument()
    })

    it('renders status', () => {
        renderRow()
        expect(screen.getByText('pending')).toBeInTheDocument()
    })

    it('renders View button', () => {
        renderRow()
        expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument()
    })

    it('calls onView with correct incident data on View button click', () => {
        renderRow()
        fireEvent.click(screen.getByRole('button', { name: /view/i }))
        expect(mockOnView).toHaveBeenCalledWith({
            id: 1,
            ai_description: 'Scratch detected on left door.',
            status: 'pending',
            created_at: '2025-01-10T10:00:00',
            vehicle_incident_images: defaultProps.vehicle_incident_images,
        })
    })

    it('renders four table cells', () => {
        const { container } = renderRow()
        expect(container.querySelectorAll('td')).toHaveLength(4)
    })

    it('renders resolved status', () => {
        renderRow({ status: 'resolved' })
        expect(screen.getByText('resolved')).toBeInTheDocument()
    })

    it('renders different description', () => {
        renderRow({ ai_description: 'Dent on front bumper.' })
        expect(screen.getByText('Dent on front bumper.')).toBeInTheDocument()
    })
})