import { RouterProvider } from 'react-router';
import { ThemeProvider } from './core/contexts/ThemeContext';
import './core/styles/components/index.css';
import './core/styles/theme.css';
import { router } from './presentation/routes';

export default function App() {
    return (
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}