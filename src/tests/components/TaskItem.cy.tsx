import React from 'react'
import Task from '../../components/Task'
import { mount } from '@cypress/react'

describe('Task Component', () => {
  const mockTask = {
    id: '1',
    subject: 'Test Task',
    completed: false,
    userEmail: 'test@example.com',
    createdAt: '2025-01-03T17:32:12Z',
    updatedAt: '2025-01-03T17:32:12Z'
  }

  const mockHandlers = {
    onToggle: cy.spy().as('onToggle'),
    onDelete: cy.spy().as('onDelete')
  }

  beforeEach(() => {
    mount(
      <Task
        task={mockTask}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
      />
    )
  })

  it('renders task subject', () => {
    cy.contains(mockTask.subject)
  })

  it('handles toggle action', () => {
    cy.get('input[type="checkbox"]').click()
    cy.get('@onToggle').should('have.been.calledWith', mockTask.id)
  })

  it('handles delete action', () => {
    cy.get('button[aria-label="delete"]').click()
    cy.get('@onDelete').should('have.been.calledWith', mockTask.id)
  })

  it('displays user email', () => {
    cy.get('[data-testid="task-email"]').should('contain', mockTask.userEmail)
  })

  it('has correct styling classes', () => {
    cy.get('[data-testid="task-item"]')
      .should('have.class', 'task-item')
      .and('have.css', 'border-radius', '8px')
  })

  it('shows hover state on mouse over', () => {
    cy.get('[data-testid="task-item"]')
      .trigger('mouseover')
      .should('have.class', 'hover')
  })

  it('shows task creation date in correct format', () => {
    cy.get('[data-testid="task-date"]').should('exist')
    // Verify date format using regex
    cy.get('[data-testid="task-date"]')
      .invoke('text')
      .should('match', /\d{2}\/\d{2}\/\d{4}/)
  })
})
