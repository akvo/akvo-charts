// These styles apply to every route in the application
import './globals.css';

export const metadata = {
  title: 'Akvo Charts',
  description:
    'A React component library for ECharts, enabling easy integration and customization of interactive, high-performance charts in React applications.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
