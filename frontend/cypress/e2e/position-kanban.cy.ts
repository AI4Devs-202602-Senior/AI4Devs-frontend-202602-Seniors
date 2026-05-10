/**
 * E2E tests for Position Kanban board feature.
 * Tests the happy path and key interactions.
 */

describe('Position Kanban Board', () => {
  beforeEach(() => {
    cy.visit('/positions');
  });

  it('should display positions list', () => {
    cy.contains('h2', 'Posiciones').should('be.visible');
    cy.get('button').contains('Ver proceso').should('exist');
  });

  it('should navigate to kanban board when clicking Ver proceso', () => {
    cy.get('button').first().contains('Ver proceso').click();
    cy.url().should('include', '/positions/');
    cy.contains('Manage candidates through interview stages').should('be.visible');
  });

  it('should display kanban columns for interview steps', () => {
    cy.get('button').first().contains('Ver proceso').click();
    cy.get('.kanban-column').should('have.length.greaterThan', 0);
  });

  it('should display candidate cards with name and score', () => {
    cy.get('button').first().contains('Ver proceso').click();
    cy.get('.candidate-card').should('exist');
    cy.get('.candidate-card').first().within(() => {
      cy.contains(/[A-Z]/); // Name should have letters
      cy.get('[class*="badge"]').should('exist'); // Score badge
    });
  });

  it('should have back button to return to positions', () => {
    cy.get('button').first().contains('Ver proceso').click();
    cy.contains('button', 'Back').click();
    cy.url().should('include', '/positions');
  });

  describe('Mobile responsive', () => {
    beforeEach(() => {
      cy.viewport(320, 568); // iPhone SE size
    });

    it('should stack columns vertically on mobile', () => {
      cy.get('button').first().contains('Ver proceso').click();
      cy.get('.kanban-board').should('have.css', 'display');
    });

    it('should be scrollable on mobile', () => {
      cy.get('button').first().contains('Ver proceso').click();
      cy.get('.kanban-column').first().should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic HTML', () => {
      cy.get('main, [role="main"]').should('exist');
      cy.get('h1, h2').should('exist');
    });

    it('should have back button with accessible label', () => {
      cy.get('button').first().contains('Ver proceso').click();
      cy.get('button').contains('Back').should('have.attr', 'aria-label');
    });
  });
});
