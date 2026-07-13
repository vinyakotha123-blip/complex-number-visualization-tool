import type { Metadata } from 'next';
import { Sora, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ComplexProvider } from '@/components/providers/complex-provider';
import { Toaster } from '@/components/ui/toaster';

const sora = Sora({ subsets: ['latin'], variable: '--font-display', weight: ['600', '700', '800'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'CNVT — Complex Number Visualization Tool',
  description: 'A Desmos-style dashboard for visualizing, exploring and understanding complex numbers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${sora.variable} ${inter.variable} ${jetbrains.variable} min-h-screen font-sans`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ThemeProvider>
          <ComplexProvider>
            {children}
            <Toaster />
          </ComplexProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
