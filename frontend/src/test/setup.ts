import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('flyonui/flyonui', () => ({
	HSOverlay: {
		autoInit: vi.fn(),
		close: vi.fn(),
	},
}))
