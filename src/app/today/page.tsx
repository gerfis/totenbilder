
'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import SortToolbar from '@/components/SortToolbar';
import { getImageUrl, TotenbildRecord } from '@/lib/types';

function TodayContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [people, setPeople] = useState<TotenbildRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateString, setDateString] = useState('');

    // Sort state
    const [sort, setSort] = useState<'name' | 'deathDate' | 'birthYear' | ''>(searchParams.get('sort') as any || '');
    const [order, setOrder] = useState<'asc' | 'desc'>((searchParams.get('order') as any) || 'asc');

    // Grid Zoom state
    const [gridSize, setGridSize] = useState(0);

    useEffect(() => {
        // Set date string for display
        const now = new Date();
        setDateString(now.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' }));

        async function fetchToday() {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (sort) {
                    params.append('sort', sort);
                    params.append('order', order);
                }

                const res = await fetch(`/api/today?${params.toString()}`);
                const data = await res.json();
                if (data.data && Array.isArray(data.data)) {
                    setPeople(data.data);
                } else if (Array.isArray(data)) {
                    // Fallback for old format
                    setPeople(data);
                }
            } catch (e) {
                console.error("Failed to fetch today's records", e);
            } finally {
                setIsLoading(false);
            }
        }

        fetchToday();
    }, [sort, order]);

    const handleSortChange = (newSort: 'name' | 'deathDate' | 'birthYear' | '', newOrder: 'asc' | 'desc') => {
        setSort(newSort);
        setOrder(newOrder);

        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        if (newSort) {
            params.set('sort', newSort);
            params.set('order', newOrder);
        } else {
            params.delete('sort');
            params.delete('order');
        }
        router.replace(`/today?${params.toString()}`, { scroll: false });
    };

    const formatDeathDate = (p: TotenbildRecord) => {
        if (p.Sterbetag && p.Sterbemonat && p.Sterbejahr) {
            return `${p.Sterbetag.toString().padStart(2, '0')}.${p.Sterbemonat.toString().padStart(2, '0')}.${p.Sterbejahr}`;
        }
        return p.Sterbedatum || p.Sterbejahr?.toString() || "—";
    };

    const getGridClass = (size: number) => {
        switch (size) {
            case 2: return "grid-cols-1 sm:grid-cols-1 lg:grid-cols-2"; // XXL
            case 1: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"; // XL
            case 0: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"; // Default
            case -1: return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"; // XS
            case -2: return "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6"; // XXS
            default: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
        }
    };

    return (
        <main className="min-h-screen pb-20">


            <div className="container mb-6 relative z-10">
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
                            <>
                                <div className="flex justify-center mb-6">
                                    <div className="bg-white p-2 rounded-lg border border-[var(--c-border)] inline-block w-full max-w-4xl">
                                        <SortToolbar
                                            currentSort={sort as any}
                                            currentOrder={order}
                                            onSortChange={handleSortChange}
                                            gridSize={gridSize}
                                            onGridSizeChange={setGridSize}
                                        />
                                    </div>
                                </div>

                                <div className={`grid ${getGridClass(gridSize)} gap-8 gallery-grid transition-all duration-300`}>
                                    {people.map(person => {
                                        const img = person.images[0];
                                        const isLandscape = img && (img.width || 0) > (img.height || 0);

                                        return (
                                            <Link
                                                href={person.alias ? `/totenbild/${person.alias}` : `/person/${person.nid}`}
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
                            </>
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

export default function TodayPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-8 px-4 text-center">Laden...</div>}>
            <TodayContent />
        </Suspense>
    );
}
