'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { ASSETS_BASE_PATH } from '../constants/constants'


interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const baseUrl = ASSETS_BASE_PATH

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`${baseUrl}/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <LayoutProvider>{children}</LayoutProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
