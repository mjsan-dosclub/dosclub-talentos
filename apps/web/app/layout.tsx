import type { Metadata, Viewport } from 'next';
import './globals.css';
import './workspace.css';
import { PwaRegistration } from './pwa-registration';
export const metadata: Metadata = { title:'TalentOS — A journey worth showing', description:'The student growth platform from Descience Open Source Club. Learn, build and make your progress visible.',applicationName:'DOS Club TalentOS'};
export const viewport: Viewport = {themeColor:'#f4f1e9'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}<PwaRegistration/></body></html>}
