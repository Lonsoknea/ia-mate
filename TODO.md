#  TODO LIST — IA MATE

## Phase 1 — Setup
- [ ] Init Git repo with /frontend + /backend folders
- [ ] Create README.md, .gitignore, .env.example
- [ ] Add root docs: SPECIFICATION.md, TODO.md

## Phase 2 — Backend Scaffold
- [ ] Init backend (Express + Node.js + dotenv + cors + nodemon)
- [ ] Setup routes: /api/analyze, /api/generate, /api/diagram, /api/refine
- [ ] Add OpenAI service wrapper
- [ ] Add prompt templates file (/backend/prompts/promptTemplates.js)
- [ ] Health endpoint /api/health

## Phase 3 — Frontend Scaffold
- [ ] Init frontend (React + Vite + TailwindCSS)
- [ ] Setup base components: InputForm, IAOutline, IADiagram
- [ ] Layout with TailwindCSS

## Phase 4 — AI Integration
- [ ] Implement ANALYZER_PROMPT → /api/analyze
- [ ] Implement GENERATOR_PROMPT → /api/generate
- [ ] Implement DIAGRAM_PROMPT → /api/diagram
- [ ] Implement REFINEMENT_PROMPT → /api/refine

## Phase 5 — Frontend ↔ Backend Wiring
- [ ] Connect InputForm → backend APIs
- [ ] Display analysis in IAOutline
- [ ] Render diagram with react-flow
- [ ] Add regenerate + refine buttons

## Phase 6 — Diagram Editing
- [ ] Interactive diagram (drag/drop, edit node, delete node)
- [ ] Add legend for node types
- [ ] Add IA type selector (Tree/Box/Hybrid)

## Phase 7 — Export & Persistence
- [ ] JSON export (structure.json)
- [ ] PNG export (diagram image)
- [ ] Copy outline text to clipboard
- [ ] Save/load projects to backend (filesystem JSON)

## Phase 8 — Quality
- [ ] Add ESLint + Prettier
- [ ] Add basic backend + frontend tests
- [ ] Add GitHub Actions CI pipeline

## Phase 9 — Documentation & Deployment
- [ ] Complete SPECIFICATION.md
- [ ] Add demo data (sample IA JSONs)
- [ ] Add screenshots in /docs
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Deploy backend (Render/Heroku)
