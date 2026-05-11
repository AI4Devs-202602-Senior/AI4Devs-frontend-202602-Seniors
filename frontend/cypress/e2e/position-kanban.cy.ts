/**
 * E2E tests for the Position Kanban board.
 *
 * Targets the seeded position id (default `4`, override with
 * `CYPRESS_positionId=N npx cypress run` or `--env positionId=N`).
 *
 * The list page at `/positions` is intentionally not used as the entry point
 * because it renders hardcoded mock cards whose ids (1, 2, 3) are not in the
 * database — clicking "Ver proceso" from there lands on a position with no
 * data. These specs visit the kanban URL directly.
 */

const positionId = Cypress.env('positionId') as number;
const kanbanUrl = `/positions/${positionId}`;

describe('Position Kanban Board', () => {
  beforeEach(() => {
    cy.visit(kanbanUrl);
  });

  it('renders the heading with `<Position Name> Position` and a back button', () => {
    cy.get('h1.position-page__title')
      .should('be.visible')
      .invoke('text')
      .should('match', /.+ Position$/);

    cy.get('button.position-page__back')
      .should('have.attr', 'aria-label')
      .and('match', /back/i);
  });

  it('renders one kanban column per interview step from the API', () => {
    cy.request(`http://localhost:3010/positions/${positionId}/interviewFlow`)
      .its('body.interviewFlow.interviewSteps')
      .then((steps: Array<{ name: string }>) => {
        cy.get('.kanban-column').should('have.length', steps.length);
        steps.forEach((step) => {
          cy.get('.kanban-column__title').should('contain.text', step.name);
        });
      });
  });

  it('renders one candidate card per candidate returned by the API', () => {
    cy.request<Array<{ fullName: string; averageScore: number }>>(
      `http://localhost:3010/positions/${positionId}/candidates`
    )
      .its('body')
      .then((candidates) => {
        cy.get('.candidate-card').should('have.length', candidates.length);
        candidates.forEach((c) => {
          cy.contains('.candidate-card__name', c.fullName).should('exist');
        });
      });
  });

  it('renders N green dots per card matching round(averageScore)', () => {
    cy.request<Array<{ fullName: string; averageScore: number }>>(
      `http://localhost:3010/positions/${positionId}/candidates`
    )
      .its('body')
      .then((candidates) => {
        candidates.forEach((c) => {
          const expected = Math.max(0, Math.min(5, Math.round(c.averageScore)));
          cy.contains('.candidate-card__name', c.fullName)
            .parents('.candidate-card')
            .find('.score-dot')
            .should('have.length', expected);
        });
      });
  });

  it('moves a candidate across columns via PUT /candidates/:id/stage', () => {
    cy.intercept('PUT', '/candidates/*/stage').as('moveStage');

    cy.request<Array<{ fullName: string; applicationId: number; currentInterviewStep: number }>>(
      `http://localhost:3010/positions/${positionId}/candidates`
    )
      .its('body')
      .then((candidates) => {
        const movable = candidates[0];
        // Pick any column whose step id is different from the candidate's current step.
        cy.request(`http://localhost:3010/positions/${positionId}/interviewFlow`)
          .its('body.interviewFlow.interviewSteps')
          .then((steps: Array<{ id: number; name: string }>) => {
            const target = steps.find((s) => s.id !== movable.currentInterviewStep);
            expect(target, 'a different target column exists').to.exist;

            const source = cy
              .contains('.candidate-card__name', movable.fullName)
              .parents('.candidate-card');
            const destination = cy.contains('.kanban-column__title', target!.name).parents(
              '.kanban-column'
            );

            // Native HTML5 drag-and-drop is not what @dnd-kit uses; trigger
            // pointer events directly per @dnd-kit's PointerSensor expectations.
            source
              .trigger('pointerdown', { button: 0, force: true })
              .trigger('pointermove', { clientX: 10, clientY: 10, force: true });
            destination.trigger('pointermove', { force: true }).trigger('pointerup', { force: true });

            cy.wait('@moveStage').its('response.statusCode').should('eq', 200);
          });
      });
  });

  describe('Mobile viewport', () => {
    beforeEach(() => {
      cy.viewport(375, 812);
    });

    it('stacks columns vertically below 768px', () => {
      cy.get('.kanban-board').then(($board) => {
        // flex-direction column on the board element when stacked.
        expect(getComputedStyle($board[0]).flexDirection).to.eq('column');
      });
    });
  });
});
