export default function ImpressumPage() {
    return (
        <main className="min-h-screen px-4 py-12 md:py-20 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-serif)] text-[var(--c-text-primary)] mb-8 md:mb-12">
                Impressum
            </h1>

            <div className="space-y-8 text-[var(--c-text-secondary)] font-[family-name:var(--font-sans)] leading-relaxed text-lg">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--c-text-primary)] mb-2">Angaben gemäß § 5 TMG</h2>
                    <p>
                        Max Mustermann<br />
                        Musterstraße 1<br />
                        12345 Musterstadt
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-[var(--c-text-primary)] mb-2">Kontakt</h2>
                    <p>
                        Telefon: +49 (0) 123 44 55 66<br />
                        E-Mail: muster@beispiel.de
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-[var(--c-text-primary)] mb-2">Haftung für Inhalte</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-[var(--c-text-primary)] mb-2">Haftung für Links</h2>
                    <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-[var(--c-text-primary)] mb-2">Urheberrecht</h2>
                    <p>
                        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
                    </p>
                </div>
            </div>
        </main>
    );
}
