
import Link from 'next/link';

interface HeaderProps {
    showDemoBanner?: boolean;
}

export default function Header({ showDemoBanner = false }: HeaderProps) {
    return (
        <header className="bg-white border-b border-[var(--c-border)] mb-8 relative overflow-hidden">
            {showDemoBanner && (
                <div className="absolute top-0 left-0 w-full bg-amber-100 text-amber-800 text-xs text-center py-1 z-20">
                    Demo Modus: Keine Datenbankverbindung erkannt. Zeige Beispieldaten.
                </div>
            )}
            <div className="w-full px-4 md:px-8 py-4 md:py-6 text-center relative z-10">
                <Link href="/" className="inline-block">
                    <h1 className="text-3xl md:text-4xl font-serif text-[var(--c-text-primary)] mb-2 tracking-tight hover:opacity-80 transition-opacity">
                        Totenbilder Archiv
                    </h1>
                </Link>
                <p className="text-[var(--c-text-secondary)] max-w-2xl mx-auto text-base font-light mb-4">
                    Ein würdevolles Gedenken. Bewahrung der Erinnerung an vergangene Generationen.
                </p>

                <nav className="flex justify-center gap-6 text-sm font-medium uppercase tracking-wider text-[var(--c-text-secondary)]">
                    <Link href="/" className="hover:text-[var(--c-accent)] transition-colors border-b-2 border-transparent hover:border-[var(--c-accent)] pb-1">
                        Archiv Suche
                    </Link>
                    <Link href="/today" className="hover:text-[var(--c-accent)] transition-colors border-b-2 border-transparent hover:border-[var(--c-accent)] pb-1">
                        Heute im Gedenken
                    </Link>
                </nav>
            </div>
        </header>
    );
}
