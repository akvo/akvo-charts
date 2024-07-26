import { render, waitFor } from '@testing-library/react';
import Home from '../page';
import ChartContextProvider from '../../context/ChartContextProvider';
import DisplayContextProvider from '../../context/DisplayContextProvider';

it('renders homepage unchanged', async () => {
  const { container } = render(
    <DisplayContextProvider>
      <ChartContextProvider>
        <Home />
      </ChartContextProvider>
    </DisplayContextProvider>
  );
  await waitFor(() => {
    expect(container).toMatchSnapshot();
  });
});
