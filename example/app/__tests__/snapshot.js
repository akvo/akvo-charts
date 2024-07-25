import { render, waitFor } from '@testing-library/react';
import Home from '../page';
import ChartContextProvider from '../../context/ChartContextProvider';

it('renders homepage unchanged', async () => {
  const { container } = render(
    <ChartContextProvider>
      <Home />
    </ChartContextProvider>
  );
  await waitFor(() => {
    expect(container).toMatchSnapshot();
  });
});
