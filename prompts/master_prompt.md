# Objetivo
Crear la minima estructura necesaria de ficheros y contenido para que un conjunto de agentes y subagentes IA, skills y commands actúen como expertos en estos roles:
1. Analista OpenSpec
2. Diseñador gráfico
3. Desarrollador frontend
4. Ciberseguridad y vulnerabilidades OWASP
5. Pentester SAST
6. DevOps
7. Desarrollador SQL
8. Tester
para la ejecución de las siguientes fases: 
1. En caso de que el proyecto no incorpore OpenSpec, debe instalarse y ejecutarse para Claude Code lo indicado en https://github.com/Fission-AI/OpenSpec/#quick-start, obteniéndose un fichero `config.yaml` que recoja una información similar a la indicada en https://github.com/Fission-AI/OpenSpec/blob/main/docs/customization.md#quick-setup, pero ampliándola a la realidad del proyecto e incorporando el testing. Se proporciona un ejemplo descriptivo
```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  # Project Context

  ## Tech Stack
  - Runtime: Node.js 24.14.0
  - Package Manager: npm
  - Testing: Jest + React Testing Library + Cypress
  - Database: PostgreSQL 14+
  - SDD: OpenSpec

  ## API Standards
  - RESTful API with JSON responses
  - Error responses in standard format: { error, code, message }
  - All endpoints versioned under /api/v1/
  - Authentication via JWT tokens in Authorization header

  ## Coding Conventions
  - Use ES6+ syntax
  - Snake_case for database columns
  - camelCase for JavaScript variables
  - Descriptive names for functions and variables
  - Write tests for all new features (minimum 80% coverage)
  - Document public APIs with JSDoc comments

  ## Project Structure
  - src/: Application source code
  - tests/: Unit and integration tests
  - specs/: System specifications (source of truth)
  - changes/: Proposed changes and features in development

  ## Development Workflow
  - Create proposals before implementation
  - Keep specs updated with current system behavior
  - All changes go through code review
  - Tests must pass before merge

  ## Testing conventions
  - Backend: Jest unit tests
  - Frontend: Cypress E2E tests
  - Coverage: >80%
  - All new functionality must define a testing strategy by layer 

rules:
  proposal:
    - Include clear problem statement
    - Specify scope and timeline
    - Outline benefits and trade-offs
    - Explain what type of tests will be added: unit tests in backend with Jest, E2E in frontend with Cypress 

  design:
    - Document all API endpoints with examples
    - Include database schema changes
    - Specify new dependencies needed
    - Outline implementation steps
    - Document the planned location of the tests
    - Specify required mocks, fixtures, and test data
    - Define how the contract between React frontend and Node.js backend will be validated

  spec:
    - Use clear, declarative language
    - Document all features and behaviors
    - Include examples where relevant
    - Keep version history with dates
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
    - When applicable, separate backend coverage (Jest) and frontend E2E (Cypress)

  tasks:
    - Break down into atomic, testable units
    - Include estimated effort for each task
    - Mark dependencies between tasks
    - Include QA and documentation tasks
    - Each new feature must include unit and integration tests
    - Before start, define test cases in desing.md
    - Include explicit Jest backend unit test tasks 
    - Include explicit Cypress frontend E2E test tasks
```
2. Análisis del codebase para determinar el propósito de negocio, la estructura de carpetas (obviando los ficheros incluidos en `.gitignore`), los design tokens, las tecnologías usadas y la arquitectura de frontend y backend, almacenándola en `AGENTS.md`
3. Creación de `CLAUDE.md`, cuyo único contenido es la ruta relativa a `AGENTS.md`
4. Utilización de DDD y Arquitectura Hexagonal, junto co los patrones de diseño que aporten valor evitando sobre-patronear: YAGNI primero.
   · Backend: Factory, Strategy, Observer, Repository, Decorator, Result / Either type, Unit of Work, CQRS, Saga / Process Manager, etc.
   · Frontend: Custom hooks para lógica reusable, compound components para APIs componibles, render props puntualmente, y provider pattern para estado compartido, etc. 
5. Inclusión de JSDoc / TSDoc en funciones públicas para dar contexto al copiloto IA.
6. Cumplimiento de los Core Web Vitals
  · LCP (Largest Contentful Paint) — tiempo hasta el elemento visible más grande. Objetivo: < 2.5s.
  · INP (Interaction to Next Paint) — responsividad ante clics/teclas. Objetivo: < 200ms.
  · CLS (Cumulative Layout Shift) — estabilidad visual (saltos inesperados). Objetivo: < 0.1.
7. Utilización de Lazy Loading
  · Carga diferida de componentes pesados (React.lazy, next/dynamic), rutas (code-splitting automático con Next.js / Vite) e imágenes con loading="lazy". 
  · Para la imagen LCP, lo opuesto: fetchpriority="high" y preload.
8. Bundlers con minificación usando Vite. Posible fijarlo explícitamente en vite.config.js o vite.config.ts. Ejemplo de uso:
```yaml
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'oxc'
  }
})
```
9. Adición de ciberseguridad
  · Librerías maduras DOMPurify para HTML
  · Validación con Zod / Valibot para inputs de formularios
  · Escape automático de React/JSX para variables (nunca uses dangerouslySetInnerHTML sin sanitizar)
  · Analisis SAST
  · API keys, tokens y credenciales: jamás en variables que terminen en el bundle.
  · Revisión de OWASP Top 10. 
  · XSS, CSRF, clickjacking, dependencias inseguras (npm audit, Dependabot)
  · Security headers 
       1. CSP (Content Security Policy) para bloquear scripts no autorizados.
       2. SRI (Subresource Integrity) para assets de CDN externos.
       3. Cabeceras Strict-Transport-Security, X-Frame-Options, Referrer-Policy
10.  Mejora de la experiencia del usuario
  · Diseño responsivo + Container Queries
  · Tailwind CSS v4 lo expone como @container y variantes @md:, @lg:, etc.
  · Mobile First
11.  Accesibilidad (a11y)
  · WCAG 2.2 nivel AA como mínimo legal.
  · Semántica HTML antes que ARIA. ARIA solo cuando no exista elemento nativo equivalente.
  · Contraste mínimo 4.5:1 para texto normal.
  · Navegación completa por teclado y foco visible.
  · Labels en formularios, alt en imágenes, landmarks (`<nav>`, `<main>`, `<aside>`).
  · Testing automatizado: axe-core, eslint-plugin-jsx-a11y, Lighthouse a11y. También puedes lanzar npx @axe-core/cli <https://localhost:3000>
12.  Navegación intuitiva
  · Jerarquía visible
  · Enlaces descriptivos
  · Breadcrumbs en flujos largos
  · Skip-links para teclado
13.  Feedback visual
  · Hover/focus states
  · Loading skeletons
  · Optimistic UI
  · Toasts no intrusivos 
  · Respeta prefers-reduced-motion para usuarios sensibles al movimiento.
14.  En caso de que sea necesario hacer debug del frontend, instalar y ejecutar https://github.com/ChromeDevTools/chrome-devtools-mcp/#mcp-client-configuration para Claude Code -> Install via CLI (MCP only)
15.   Uso de OpenSpec para la creación de las specs que aparecen a continuación. El flujo debe ser /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive, generando en cada paso los ficheros según las mejores prácticas posibles y ejecutando la fase de sync con el apoyo de los agentes, subagentes, skills y comandos relacionados.
```yaml
Spec 1
En LTI ya tenemos la funcionalidad para listar las diferentes posiciones requeridas por la empresa. Está disponible en una pagina 'positions' que muestra una lista de tarjetas que describen cada posición. Cuenta con filtros para poder buscar por texto, fecha límite, estado y manager responsable tal como aparece en `@docs/positions.avif`, captura de pantalla de `http://localhost:3000/positions`. El ojetivo es que al hacer clic en el botón "Ver proceso" de cualquiera de las posiciones, nos lleve a la vista de detalle de cada posición, denominada 'position' que debe incorporar estas funcionalidades:
  • Página en la que poder visualizar y gestionar los diferentes candidatos de una posición específica.
  • Interfaz tipo kanban, mostrando los candidatos como tarjetas en diferentes columnas que representan las fases del proceso de contratación, pudiendo actualizar la fase en la que se encuentra un candidato solo arrastrando su tarjeta. En `@docs/position.avif` se muestra la interfaz a conseguir siguiendo la técnica Pixel-perfect, utilizando los mismos componentes visuales del proyecto actual.
Algunos de los requerimientos del equipo de diseño que se pueden ver en el ejemplo son:
  • Se debe mostrar el título de la posición en la parte superior, para dar contexto
  • Añadir una flecha a la izquierda del título que permita volver al listado de posiciones
  • Deben mostrarse tantas columnas como fases haya en el proceso
  • La tarjeta de cada candidato/a debe situarse en la fase correspondiente, y debe mostrar su nombre completo y su puntuación media
  • Si es posible, debe mostrarse adecuadamente en móvil (las fases en vertical ocupando todo el ancho)
Algunas observaciones:
  • Asume que la página de posiciones la encuentras
  • Asume que existe la estructura global de la página, la cual incluye los elementos comunes como menú superior y footer. Lo que estás creando es el contenido interno de la página.
Para implementar la funcionalidad de la página cuentas con diversos endpoints API:
  • GET /positions/:id/interviewFlow
    Este endpoint devuelve información sobre el proceso de contratación para una determinada posición:
    • positionName: Título de la posición
    • interviewSteps: id y nombre de las diferentes fases de las que consta el proceso de contratación
    • Ejemplo de respuesta:
    {
      "positionName": "Senior backend engineer",
      "interviewFlow": {
        "id": 1,
        "description": "Standard development interview process",
        "interviewSteps": [
          {
            "id": 1,
            "interviewFlowId": 1,
            "interviewTypeId": 1,
            "name": "Initial Screening",
            "orderIndex": 1
          },
          {
            "id": 2,
            "interviewFlowId": 1,
            "interviewTypeId": 2,
            "name": "Technical Interview",
            "orderIndex": 2
          },
          {
            "id": 3,
            "interviewFlowId": 1,
            "interviewTypeId": 3,
            "name": "Manager Interview",
            "orderIndex": 2
          }
        ]
      }
    }

  • GET /positions/:id/candidates
    Este endpoint devuelve todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado  positionID. Proporciona la siguiente información:
    • name: Nombre completo del candidato
    • current_interview_step: en qué fase del proceso está el candidato.
    • score: La puntuación media del candidato
    • Ejemplo de respuesta:
    [
      {
        "fullName": "Jane Smith",
        "currentInterviewStep": "Technical Interview",
        "averageScore": 4
      },
      {
        "fullName": "Carlos García",
        "currentInterviewStep": "Initial Screening",
        "averageScore": 0
      },
      {
        "fullName": "John Doe",
        "currentInterviewStep": "Manager Interview",
        "averageScore": 5
      }
    ]

  • PUT /candidates/:id/stage
    Este endpoint actualiza la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico, a través del parámetro "new_interview_step" y proporionando el interview_step_id correspondiente a la columna en la cual se encuentra ahora el candidato.
    • Ejemplo de petición:
    {
      "applicationId": "1",
      "currentInterviewStep": "3"
    }
    • Ejemplo de respuesta:
    {
      "message": "Candidate stage updated successfully",
      "data": {
        "id": 1,
        "positionId": 1,
        "candidateId": 1,
        "applicationDate": "2024-06-04T13:34:58.304Z",
        "currentInterviewStep": 3,
        "notes": null,
        "interviews": []
      }
    }
```
16. Creación de un informe en @docs/report.md que recoja (en inglés) el resultado de la ejecución de `openspec view`para comprobación del resultado final

# Contexto
Codebase y base de datos dockerizada existentes en el proyecto actual 