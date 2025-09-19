import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Ocean Tasks header and add button', () => {
  render(<App />);
  expect(screen.getByText(/Ocean Tasks/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
});
