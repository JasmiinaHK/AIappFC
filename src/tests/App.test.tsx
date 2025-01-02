import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider } from '@mui/material/styles'
import App from '../App'
import theme from '../theme'

describe('App Component', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const renderApp = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    )
  }

  it('renders without crashing', () => {
    renderApp()
    expect(screen.getByTestId('app-container')).toBeInTheDocument()
  })

  it('renders the header with correct title', () => {
    renderApp()
    expect(screen.getByTestId('app-header')).toBeInTheDocument()
    expect(screen.getByText(/Task Management/i)).toBeInTheDocument()
  })

  it('renders the main navigation', () => {
    renderApp()
    expect(screen.getByTestId('main-nav')).toBeInTheDocument()
  })

  it('applies correct theme', () => {
    renderApp()
    const appContainer = screen.getByTestId('app-container')
    expect(appContainer).toHaveStyle({
      backgroundColor: theme.palette.background.default,
    })
  })

  it('renders task list component', () => {
    renderApp()
    expect(screen.getByTestId('task-list')).toBeInTheDocument()
  })

  it('shows loading state on initial render', () => {
    renderApp()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders error boundary', () => {
    const ErrorComponent = () => {
      throw new Error('Test error')
    }

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <ErrorComponent />
        </ThemeProvider>
      </QueryClientProvider>
    )

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
  })
})
