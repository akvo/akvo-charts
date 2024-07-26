// These styles apply to every route in the application
import { DisplayContextProvider, ChartContextProvider } from '../context';
import './globals.css';

export const metadata = {
  title: 'Akvo Charts',
  description:
    'A React component library for ECharts, enabling easy integration and customization of interactive, high-performance charts in React applications.'
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full bg-white"
    >
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <body>
        <DisplayContextProvider>
          <ChartContextProvider>
            <main>{children}</main>
          </ChartContextProvider>
        </DisplayContextProvider>
      </body>
    </html>
  );
}
