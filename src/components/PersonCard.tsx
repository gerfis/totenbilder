import Link from 'next/link';
import { getImageUrl, TotenbildRecord } from '@/lib/types';

interface PersonCardProps {
    person: TotenbildRecord;
}

export default function PersonCard({ person }: PersonCardProps) {
    const img = person.images[0];
    const isLandscape = img && (img.width || 0) > (img.height || 0);

    const formatDeathDate = (p: TotenbildRecord) => {
        if (p.Sterbetag && p.Sterbemonat && p.Sterbejahr) {
            return `${p.Sterbetag.toString().padStart(2, '0')}.${p.Sterbemonat.toString().padStart(2, '0')}.${p.Sterbejahr}`;
        }
        return p.Sterbedatum || p.Sterbejahr?.toString() || "—";
    };

    const calculateAge = (p: TotenbildRecord): string => {
        if (p.Sterbealter) {
            return `${p.Sterbealter}`;
        }
        if (p.Geburtsjahr && p.Sterbejahr) {
            const age = p.Sterbejahr - p.Geburtsjahr;
            return `${age}`;
        }
        return "—";
    };

    return (
        <Link
            href={person.alias ? `/totenbild/${person.alias}` : `/person/${person.nid}`}
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
            <div className="p-4 flex-1 flex flex-col text-center">
                <div className="mb-3">
                    <h2 className="text-xl font-serif text-[var(--c-text-primary)] mb-1 leading-tight">
                        {person.Nachname} {person.Vorname}
                    </h2>
                    {person.Ledigname && (
                        <p className="text-xs text-[var(--c-accent)] font-medium italic">geb. {person.Ledigname}</p>
                    )}
                </div>

                <div className="mt-auto space-y-2 text-xs text-[var(--c-text-secondary)] border-t border-[var(--c-border)] pt-3 mx-2">
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="text-left">
                            <span className="block text-[10px] uppercase opacity-60">Geboren</span>
                            {person.Geburtsjahr || "—"}
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase opacity-60">Alter</span>
                            <span className="font-medium text-[var(--c-text-primary)]">{calculateAge(person)}</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] uppercase opacity-60">Gestorben</span>
                            {formatDeathDate(person)}
                        </div>
                    </div>
                    {person.Ort && (
                        <div className="pt-1 flex justify-center items-center gap-1 opacity-80">
                            <span>📍 {person.Ort}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
