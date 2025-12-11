import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full py-12 mt-16 border-t border-[var(--c-border)] bg-[var(--c-bg-paper)] text-[var(--c-text-secondary)]">
            <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-sm font-[family-name:var(--font-sans)] opacity-80">
                    &copy; {new Date().getFullYear()} Totenbilder Archiv. Ein würdevolles Gedenken.
                </div>
                <nav className="flex flex-wrap justify-center gap-8 text-sm font-[family-name:var(--font-sans)] font-medium">
                    <Link href="/impressum" className="hover:text-[var(--c-accent)] transition-colors duration-300">
                        Impressum
                    </Link>
                    <Link href="/datenschutz" className="hover:text-[var(--c-accent)] transition-colors duration-300">
                        Datenschutz
                    </Link>
                    <Link href="/agb" className="hover:text-[var(--c-accent)] transition-colors duration-300">
                        AGB
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
