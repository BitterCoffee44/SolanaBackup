import { render, screen } from '@testing-library/react';
import App from './App';

test('pleaseeee worrkkkkkkk', () => {
  render(<App />);
  const linkElement = screen.getByText(/hey it workkksssss/i);
  expect(linkElement).toBeInTheDocument();
});
