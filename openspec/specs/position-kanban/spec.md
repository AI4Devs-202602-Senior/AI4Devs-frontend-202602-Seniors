# position-kanban Specification

## Purpose
Detail view of a position with a drag-and-drop kanban of its candidates. Recruiters reach it from the `/positions` list via "Ver proceso", view candidates grouped by interview step, and move them across steps with optimistic UI backed by the existing `/positions/:id/interviewFlow`, `/positions/:id/candidates`, and `PUT /candidates/:id/stage` endpoints.
## Requirements
### Requirement: Position detail route
The application SHALL expose a route at `/positions/:id` that lazy-loads a Position detail page rendering a kanban board for the matching position id.

#### Scenario: Navigate from the positions list
- **WHEN** a user clicks the "Ver proceso" button on a position card on the `/positions` list page
- **THEN** the browser navigates to `/positions/:id` and the Position detail page loads via React.lazy

#### Scenario: Direct deep-link to a position
- **WHEN** a user opens `/positions/:id` directly
- **THEN** the page fetches `GET /positions/:id/interviewFlow` and `GET /positions/:id/candidates` in parallel and renders the kanban once both resolve

### Requirement: Kanban columns from interview flow
The page SHALL render one column per interview step returned by `GET /positions/:id/interviewFlow`, ordered by the step's `orderIndex`.

#### Scenario: Render columns
- **WHEN** the interview flow returns N steps
- **THEN** the kanban renders N columns, each labeled with `step.name`, sorted ascending by `orderIndex`

### Requirement: Candidate cards
Each candidate from `GET /positions/:id/candidates` SHALL appear as a card in the column whose `id` matches the candidate's `currentInterviewStep`.

#### Scenario: Card content
- **WHEN** a candidate has `fullName = "John Doe"` and `averageScore = 3`
- **THEN** the card displays the full name and exactly 3 filled green dots out of 5 total dots
- **AND** the card is keyboard-focusable

### Requirement: Drag-and-drop stage updates
Dragging a candidate card from one column to another SHALL trigger `PUT /candidates/:id/stage` with the target step id, applied optimistically.

#### Scenario: Successful move
- **GIVEN** a candidate is in column A
- **WHEN** the user drops the card on column B
- **THEN** the card appears in column B immediately
- **AND** the API request `PUT /candidates/:id/stage` is sent with `{ applicationId, currentInterviewStep: <B id> }`
- **AND** on 200 response, the card stays in column B and a success toast appears

#### Scenario: Failed move rolls back
- **GIVEN** a candidate is in column A and the next PUT will fail
- **WHEN** the user drops the card on column B
- **THEN** the card returns to column A
- **AND** an error toast is displayed

### Requirement: Title and back navigation
The page SHALL render a header containing an inline chevron-left back button and a title in the format `<Position Name> Position`.

#### Scenario: Heading composition
- **WHEN** `GET /positions/:id/interviewFlow` returns `positionName = "Senior Backend Engineer"`
- **THEN** the page heading reads `Senior Backend Engineer Position`
- **AND** clicking the chevron-left button navigates back to `/positions`

### Requirement: Responsive layout
The board SHALL adapt to viewport width.

#### Scenario: Desktop
- **WHEN** the viewport width is ≥ 768px
- **THEN** columns render side by side with horizontal scroll if they overflow the viewport

#### Scenario: Mobile
- **WHEN** the viewport width is < 768px
- **THEN** columns stack vertically and each takes the full available width

### Requirement: Accessibility
The kanban SHALL be operable via keyboard and announce its state to assistive tech.

#### Scenario: Keyboard drag
- **WHEN** a card has focus and the user presses Space then the arrow keys
- **THEN** the card moves between columns following `@dnd-kit` keyboard sensor semantics

#### Scenario: Reduced motion
- **WHEN** the user has `prefers-reduced-motion: reduce`
- **THEN** card hover and drag transitions are disabled

