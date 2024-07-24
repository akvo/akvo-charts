import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('renders a chart', () => {
    render(<Home />);
    const chartText = screen.getByText(
      'Example Component: Create Chart Library'
    );
    expect(chartText).toBeInTheDocument();
  });
});
