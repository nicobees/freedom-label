
import { render, screen, fireEvent } from '@testing-library/react'
import { App } from './App'
import { describe, it, expect, vi } from 'vitest'

// Mock fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ status: 'ok' }),
  }),
) as any;

describe('App', () => {
  it('renders the form', () => {
    render(<App />)
    expect(screen.getByText(/Freedom Label/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Patient Name:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/PWR:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Due Date:/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Print/i })).toBeInTheDocument()
  })

  it('shows validation errors', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Print/i }))

    expect(await screen.findByText(/Patient name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/PWR is required/i)).toBeInTheDocument()
    expect(screen.getByText(/Due date is required/i)).toBeInTheDocument()
  })

  it('submits the form successfully', async () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText(/Patient Name:/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/PWR:/i), { target: { value: '12345' } })
    fireEvent.change(screen.getByLabelText(/Due Date:/i), { target: { value: '01/01/25' } })

    fireEvent.click(screen.getByRole('button', { name: /Print/i }))

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/print-label',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          patient_name: 'John Doe',
          pwr: '12345',
          due_date: '01/01/25',
        }),
      }),
    )
    expect(screen.getByRole('button', { name: /Printing.../i })).toBeInTheDocument()
  })
})
