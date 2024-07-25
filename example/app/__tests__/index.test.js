import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../page';
import ChartContextProvider from '../../context/ChartContextProvider';

describe('Home', () => {
  it('renders a chart', async () => {
    render(
      <ChartContextProvider>
        <Home />
      </ChartContextProvider>
    );
    await waitFor(() => {
      const chartText = screen.getByText(
        'Example Component: Akvo Chart'
      );
      expect(chartText).toBeInTheDocument();
    });
  });
});
