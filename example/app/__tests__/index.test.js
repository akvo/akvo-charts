import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../page';
import ChartContextProvider from '../../context/ChartContextProvider';
import DisplayContextProvider from '../../context/DisplayContextProvider';

describe('Home', () => {
  it('renders a chart', async () => {
    render(
      <DisplayContextProvider>
        <ChartContextProvider>
          <Home />
        </ChartContextProvider>
      </DisplayContextProvider>
    );
    await waitFor(() => {
      const chartText = screen.getByText('Example Component: Akvo Chart');
      expect(chartText).toBeInTheDocument();
    });
  });
});
