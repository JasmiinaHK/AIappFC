import React from 'react'
import TaskItem from '../../components/TaskItem'
import { mount } from '@cypress/react'

describe('TaskItem Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    userEmail: 'test@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const mockHandlers = {
    onEdit: cy.stub().as('editHandler'),
    onDelete: cy.stub().as('deleteHandler'),
    onSelect: cy.stub().as('selectHandler')
  }

  beforeEach(() => {
    mount(
      <TaskItem
        task={mockTask}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onSelect={mockHandlers.onSelect}
      />
    )
  })

  it('displays task title and description', () => {
    cy.get('[data-testid="task-title"]').should('contain', mockTask.title)
    cy.get('[data-testid="task-description"]').should('contain', mockTask.description)
  })

  it('calls edit handler when edit button is clicked', () => {
    cy.get('[data-testid="edit-button"]').click()
    cy.get('@editHandler').should('have.been.calledWith', mockTask)
  })

  it('calls delete handler when delete button is clicked', () => {
    cy.get('[data-testid="delete-button"]').click()
    cy.get('@deleteHandler').should('have.been.calledWith', mockTask.id)
  })

  it('calls select handler when task is clicked', () => {
    cy.get('[data-testid="task-item"]').click()
    cy.get('@selectHandler').should('have.been.calledWith', mockTask)
  })

  it('shows task creation date in correct format', () => {
    cy.get('[data-testid="task-date"]').should('exist')
    // Verify date format using regex
    cy.get('[data-testid="task-date"]')
      .invoke('text')
      .should('match', /\d{2}\/\d{2}\/\d{4}/)
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
})
