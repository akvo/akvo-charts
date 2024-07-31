import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../page';
import ChartContextProvider from '../../context/ChartContextProvider';
import DisplayContextProvider from '../../context/DisplayContextProvider';

describe('Home', () => {
  it('renders a homepage completely', async () => {
    render(
      <DisplayContextProvider>
        <ChartContextProvider>
          <Home />
        </ChartContextProvider>
      </DisplayContextProvider>
    );
    await waitFor(() => {
      const chartEl = screen.getByTestId('link-rtd');
      expect(chartEl).toBeInTheDocument();
    });
  });
});
