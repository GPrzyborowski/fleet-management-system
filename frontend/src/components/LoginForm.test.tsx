import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import LoginForm from './LoginForm'
import { MemoryRouter } from 'react-router-dom'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async importOriginal => {
	const actual = (await importOriginal()) as Record<string, unknown>
	return {
		...actual,
		useNavigate: () => mockNavigate,
	}
})

describe('LoginForm', () => {
	it('renders inputs and button', () => {
		render(
			<MemoryRouter>
				<LoginForm submitLogin={vi.fn()} errorMsg="" pending={false} />
			</MemoryRouter>,
		)
		expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Super secret password')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
	})
	it('calls submitLogin with entered values', async () => {
		const mockSubmit = vi.fn()
		render(
			<MemoryRouter>
				<LoginForm submitLogin={mockSubmit} errorMsg="" pending={false} />
			</MemoryRouter>,
		)
		fireEvent.change(screen.getByPlaceholderText('John Doe'), {
			target: { value: 'admin' },
		})
		fireEvent.change(screen.getByPlaceholderText('Super secret password'), {
			target: { value: 'password123' },
		})
		fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
		expect(mockSubmit).toHaveBeenCalledTimes(1)
		expect(mockSubmit).toHaveBeenCalledWith('admin', 'password123')
	})

	it('renders error message', () => {
		render(
			<MemoryRouter>
				<LoginForm submitLogin={vi.fn()} errorMsg="Invalid login or password." pending={false} />
			</MemoryRouter>,
		)
		expect(screen.getByText('Invalid login or password.')).toBeInTheDocument()
	})
	it('shows loading spinner when pending', () => {
		render(
			<MemoryRouter>
				<LoginForm submitLogin={vi.fn()} errorMsg="" pending={true} />
			</MemoryRouter>,
		)
		const button = screen.getByRole('button')
		expect(button).toHaveClass('btn-disabled')
		expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument()
	})
})
