
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

import { getImageUrl, TotenbildRecord } from '@/lib/types';

export default function TodayPage() {
    const [people, setPeople] = useState<TotenbildRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateString, setDateString] = useState('');

    useEffect(() => {
        // Set date string for display
        const now = new Date();
        setDateString(now.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' }));

        async function fetchToday() {
            try {
                const res = await fetch('/api/today');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPeople(data);
                }
            } catch (e) {
                console.error("Failed to fetch today's records", e);
            } finally {
                setIsLoading(false);
            }
        }

        fetchToday();
    }, []);

    const formatDeathDate = (p: TotenbildRecord) => {
        if (p.Sterbetag && p.Sterbemonat && p.Sterbejahr) {
            return `${p.Sterbetag.toString().padStart(2, '0')}.${p.Sterbemonat.toString().padStart(2, '0')}.${p.Sterbejahr}`;
        }
        return p.Sterbedatum || p.Sterbejahr?.toString() || "—";
    };

    return (
        <main className="min-h-screen pb-20">


            <div className="container mb-12 relative z-10">
                <div className="text-center">
                    <h2 className="text-3xl font-serif text-[var(--c-text-primary)] mb-2">
                        In Gedenken am {dateString}
                    </h2>
                    <p className="text-[var(--c-text-secondary)]">
                        Wir erinnern an die Verstorbenen dieses Tages.
                    </p>
                </div>
            </div>

            {/* Grid Results */}
            <div className="max-w-7xl mx-auto px-4">
                {isLoading ? (
                    <div className="text-center py-20 text-[var(--c-text-secondary)]">Lade Daten...</div>
                ) : (
                    <>
                        {people.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 gallery-grid">
                                {people.map(person => {
                                    const img = person.images[0];
                                    const isLandscape = img && (img.width || 0) > (img.height || 0);

                                    return (
                                        <Link
                                            href={`/person/${person.nid}`}
                                            key={person.nid}
                                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[var(--c-border)] flex flex-col group cursor-pointer h-full"
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative aspect-[4/5] bg-[var(--c-bg-main)] overflow-hidden border-b border-[var(--c-border)]">
                                                {img ? (
                                                    <img
                                                        src={getImageUrl(img.filename)}
                                                        alt={person.Name}
                                                        className={`w-full h-full transition-transform duration-700 filter sepia-[0.2] group-hover:scale-105 ${isLandscape ? 'object-contain' : 'object-cover'
                                                            }`}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[var(--c-accent)] opacity-20 text-4xl">
                                                        †
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
                                            </div>

                                            {/* Card Details */}
                                            <div className="p-6 flex-1 flex flex-col text-center">
                                                <div className="mb-4">
                                                    <h2 className="text-2xl font-serif text-[var(--c-text-primary)] mb-1 leading-tight">
                                                        {person.Nachname} {person.Vorname}
                                                    </h2>
                                                    {person.Ledigname && (
                                                        <p className="text-sm text-[var(--c-accent)] font-medium italic">geb. {person.Ledigname}</p>
                                                    )}
                                                </div>

                                                <div className="mt-auto space-y-2 text-sm text-[var(--c-text-secondary)] border-t border-[var(--c-border)] pt-4 mx-4">
                                                    <div className="grid grid-cols-2 gap-2 text-left">
                                                        <div>
                                                            <span className="block text-xs uppercase opacity-60">Geboren</span>
                                                            {person.Geburtsjahr || "—"}
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="block text-xs uppercase opacity-60">Gestorben</span>
                                                            {formatDeathDate(person)}
                                                        </div>
                                                    </div>
                                                    {person.Ort && (
                                                        <div className="pt-2 flex justify-center items-center gap-1 opacity-80">
                                                            <span>📍 {person.Ort}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-xl text-[var(--c-text-secondary)]">Keine Gedenktage für heute gefunden.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
