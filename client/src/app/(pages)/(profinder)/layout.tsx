import Navbar from '@/components/Navbar/page';
import Footer from '@/components/Footer';
import '../../globals.css';

export default function ProfinderLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
