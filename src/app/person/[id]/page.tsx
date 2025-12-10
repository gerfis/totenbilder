
import { query } from '@/lib/db';
import { TotenbildRecord, getImageUrl } from '@/lib/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DUMMY_DATA } from '@/lib/dummy-data';

// Helper to reliably format death date (reused from homepage logic)
const formatDeathDate = (p: TotenbildRecord) => {
    if (p.Sterbetag && p.Sterbemonat && p.Sterbejahr) {
        return `${p.Sterbetag.toString().padStart(2, '0')}.${p.Sterbemonat.toString().padStart(2, '0')}.${p.Sterbejahr}`;
    }
    return p.Sterbedatum || p.Sterbejahr?.toString() || "—";
};

// Force dynamic behavior since we query DB directly
export const dynamic = 'force-dynamic';

export default async function PersonPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const idValue = parseInt(params.id, 10);

    if (isNaN(idValue)) {
        notFound();
    }

    let person: TotenbildRecord | null = null;

    try {
        // 1. Try fetching from DB
        if (process.env.DB_HOST) {
            const sql = `
            SELECT 
              a.nid, a.Name, a.Vorname, a.Nachname, a.Ledigname, 
              a.Ort, a.Strasse, a.Geschlecht, a.Bekenntnis, 
              a.Beruf1, a.Beruf2, a.Geburtsjahr, 
              a.Sterbedatum, a.Sterbetag, a.Sterbemonat, a.Sterbejahr, a.Sterbealter, 
              a.Bemerkung,
              b.filename, b.filesize, b.height, b.width, b.filemime
            FROM totenbilder a
            LEFT JOIN totenbilder_bilder b ON a.nid = b.nid
            WHERE a.nid = ?
          `;

            const rows = await query(sql, [idValue]) as any[];

            if (rows.length > 0) {
                // Group logic tailored for single record
                const first = rows[0];
                person = {
                    nid: first.nid,
                    Name: first.Name,
                    Vorname: first.Vorname,
                    Nachname: first.Nachname,
                    Ledigname: first.Ledigname,
                    Ort: first.Ort,
                    Strasse: first.Strasse,
                    Geschlecht: first.Geschlecht,
                    Bekenntnis: first.Bekenntnis,
                    Beruf1: first.Beruf1,
                    Beruf2: first.Beruf2,
                    Geburtsjahr: first.Geburtsjahr,
                    Sterbedatum: first.Sterbedatum,
                    Sterbetag: first.Sterbetag,
                    Sterbemonat: first.Sterbemonat,
                    Sterbejahr: first.Sterbejahr,
                    Sterbealter: first.Sterbealter,
                    Bemerkung: first.Bemerkung,
                    images: []
                };

                rows.forEach(r => {
                    if (r.filename) {
                        person!.images.push({
                            filename: r.filename,
                            width: r.width,
                            height: r.height,
                            filemime: r.filemime
                        });
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error fetching person:", error);
    }

    // 2. Fallback to dummy data
    if (!person) {
        const dummy = DUMMY_DATA.find(p => p.nid === idValue);
        if (dummy) {
            person = dummy;
        }
    }

    if (!person) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[var(--c-bg-main)]">

            {/* Navigation / Header */}
            <nav className="border-b border-[var(--c-border)] bg-white sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2 text-[var(--c-text-secondary)] hover:text-[var(--c-accent)] transition-colors">
                        <span className="text-xl">←</span>
                        <span className="text-sm font-medium uppercase tracking-wider">Zurück zur Übersicht</span>
                    </Link>
                    <div className="text-sm text-[var(--c-text-secondary)] hidden md:block">
                        Totenbilder Archiv
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden border border-[var(--c-border)] flex flex-col lg:flex-row">

                    {/* Left Column: Images */}
                    <div className="lg:w-1/2 bg-[var(--c-bg-main)] p-8 border-b lg:border-b-0 lg:border-r border-[var(--c-border)]">
                        <div className="space-y-8">
                            {person.images.map((img, idx) => (
                                <div key={idx} className="relative shadow-lg rounded-sm overflow-hidden bg-white">
                                    <img
                                        src={getImageUrl(img.filename)}
                                        alt={`${person?.Name} - Bild ${idx + 1}`}
                                        className="w-full h-auto object-contain max-h-[80vh] mx-auto filter sepia-[0.1]"
                                    />
                                </div>
                            ))}
                            {person.images.length === 0 && (
                                <div className="h-64 flex items-center justify-center text-[var(--c-text-secondary)] italic border border-dashed border-[var(--c-border)]">
                                    Kein Bild verfügbar
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Information */}
                    <div className="lg:w-1/2 p-8 lg:p-12">
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl font-serif text-[var(--c-text-primary)] mb-2 leading-tight">
                                {person.Nachname} {person.Vorname}
                            </h1>
                            {person.Ledigname && (
                                <p className="text-lg text-[var(--c-accent)] font-medium italic">geb. {person.Ledigname}</p>
                            )}
                        </div>

                        <div className="space-y-6 text-[var(--c-text-primary)]">

                            {/* Section: Lebensdaten */}
                            <div className="pb-6 border-b border-[var(--c-border)]">
                                <h2 className="text-xs font-bold text-[var(--c-text-secondary)] uppercase tracking-wider mb-4">Lebensdaten</h2>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <div>
                                        <span className="block text-sm text-[var(--c-text-secondary)] mb-1">Geboren</span>
                                        <span className="text-xl font-serif">{person.Geburtsjahr || "—"}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-[var(--c-text-secondary)] mb-1">Gestorben</span>
                                        <span className="text-xl font-serif">{formatDeathDate(person)}</span>
                                    </div>
                                    {person.Sterbealter && (
                                        <div className="col-span-2">
                                            <span className="block text-sm text-[var(--c-text-secondary)] mb-1">Alter</span>
                                            <span>{person.Sterbealter} Jahre</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section: Persönliches & Ort */}
                            <div className="pb-6 border-b border-[var(--c-border)]">
                                <h2 className="text-xs font-bold text-[var(--c-text-secondary)] uppercase tracking-wider mb-4">Details</h2>
                                <div className="space-y-4">
                                    {(person.Ort || person.Strasse) && (
                                        <div className="flex gap-3">
                                            <span className="text-[var(--c-text-secondary)] w-24 shrink-0">Wohnort</span>
                                            <div>
                                                {person.Strasse && <div>{person.Strasse}</div>}
                                                {person.Ort && <div>{person.Ort}</div>}
                                            </div>
                                        </div>
                                    )}

                                    {(person.Beruf1 || person.Beruf2) && (
                                        <div className="flex gap-3">
                                            <span className="text-[var(--c-text-secondary)] w-24 shrink-0">Beruf</span>
                                            <div>
                                                {person.Beruf1 && <div className="font-medium">{person.Beruf1}</div>}
                                                {person.Beruf2 && <div>{person.Beruf2}</div>}
                                            </div>
                                        </div>
                                    )}

                                    {person.Bekenntnis && (
                                        <div className="flex gap-3">
                                            <span className="text-[var(--c-text-secondary)] w-24 shrink-0">Religion</span>
                                            <div>{person.Bekenntnis}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section: Bemerkung/Spruch */}
                            {person.Bemerkung && (
                                <div className="pt-4 bg-[var(--c-bg-main)] p-6 rounded-md border border-[var(--c-border)]">
                                    <h3 className="text-xs font-bold text-[var(--c-text-secondary)] uppercase tracking-wider mb-3">Gedenktext / Bemerkung</h3>
                                    <p className="italic text-lg text-[var(--c-text-primary)] leading-relaxed font-serif">
                                        "{person.Bemerkung}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
