import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import TaskList from '../../pages/TaskList'
import { getTasks, deleteTask } from '../../API/taskApi'

// Mock the API calls
jest.mock('../../API/taskApi')

describe('TaskList Page', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const mockTasks = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Description 1',
      userEmail: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: 'Description 2',
      userEmail: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    ;(getTasks as jest.Mock).mockResolvedValue(mockTasks)
  })

  const renderTaskList = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    )
  }

  it('renders task list and displays tasks', async () => {
    renderTaskList()

    // Wait for tasks to be loaded
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    })
  })

  it('opens create task dialog when add button is clicked', () => {
    renderTaskList()

    fireEvent.click(screen.getByTestId('add-task-button'))
    expect(screen.getByTestId('create-task-dialog')).toBeInTheDocument()
  })

  it('deletes a task when delete button is clicked', async () => {
    ;(deleteTask as jest.Mock).mockResolvedValue({})
    renderTaskList()

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    })

    // Click delete button on first task
    fireEvent.click(screen.getAllByTestId('delete-button')[0])

    // Confirm deletion
    fireEvent.click(screen.getByTestId('confirm-delete-button'))

    // Verify delete API was called
    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith('1')
    })
  })

  it('filters tasks based on search input', async () => {
    renderTaskList()

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    })

    // Type in search box
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Task 1' },
    })

    // Verify filtered results
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument()
  })

  it('shows loading state while fetching tasks', () => {
    renderTaskList()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('shows error message when task fetch fails', async () => {
    ;(getTasks as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))
    renderTaskList()

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })
  })
})
