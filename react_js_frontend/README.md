# Ocean Tasks – React Frontend

A modern, single-page task management web app with create, view, update, and delete functionality. Designed with the Ocean Professional theme: blue primary accents, amber highlights, subtle gradients, rounded corners, and smooth transitions.

## Features

- Add tasks quickly with an inline composer
- Edit titles inline via double-click or edit button
- Toggle completion with custom checkboxes
- Delete tasks with confirmation action
- Clear all completed tasks
- Local persistence using `localStorage`
- Clean, responsive layout with subtle shadows and gradients
- Light/Dark theme toggle (remembered via `localStorage`)

## Tech

- React 18 (no additional UI library)
- Vanilla CSS (Ocean Professional theme in `src/App.css`)
- State management via `useReducer`
- Persistence via `localStorage`

## Scripts

- `npm start` – Start dev server at http://localhost:3000
- `npm test` – Run tests
- `npm run build` – Production build

## Structure

- `src/App.js` – Main SPA with reducer, components, and UI logic
- `src/App.css` – Ocean Professional theme and component styling
- `src/index.js` – Entry point
- `src/index.css` – Minimal base styles
- `src/App.test.js` – Smoke tests

## Theme

Primary colors (Ocean Professional):
- Primary: `#2563EB`
- Secondary (Accent): `#F59E0B`
- Error: `#EF4444`
- Background: `#f9fafb` (light), surface cards are white
- Text: `#111827`

## Notes

- No backend API is required. Data is stored in the browser using `localStorage`.
- To reset data, clear site data in your browser devtools.

## Accessibility

- Buttons contain accessible names
- Input fields have labels via `aria-label`
- Keyboard support for editing (Enter to save, Esc to cancel)
