'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DUMMY_DATA } from '@/lib/dummy-data';
import { getImageUrl, TotenbildRecord } from '@/lib/types';

export default function Home() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [people, setPeople] = useState<TotenbildRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDbConfigured, setIsDbConfigured] = useState(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, location]);

  async function fetchData(targetPage: number) {
    if (targetPage === 1) {
      setIsLoading(true);
      setHasMore(true); // Reset hasMore on new search
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams();
      if (search) params.append('name', search);
      if (location) params.append('location', location);
      params.append('page', targetPage.toString());
      params.append('limit', '20');

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();

      if (res.status === 503 && data.error === "DB_NOT_CONFIGURED") {
        setIsDbConfigured(false);
        // Fallback to filtering dummy data if DB is not ready, for demo purposes
        const filteredDummy = DUMMY_DATA.filter(p => {
          const fullName = `${p.Nachname} ${p.Vorname} ${p.Name}`.toLowerCase();
          const matchName = fullName.includes(search.toLowerCase());
          const matchLoc = (p.Ort || '').toLowerCase().includes(location.toLowerCase());
          return matchName && matchLoc;
        });

        // Simulating pagination for dummy data
        const limit = 20;
        const startIndex = (targetPage - 1) * limit;
        const endIndex = startIndex + limit;

        let resultSlice: TotenbildRecord[] = [];

        // Match API behavior: Only show 20 on initial load (empty search), sorted by death date
        if (!search && !location) {
          const sortedDummy = [...filteredDummy].sort((a, b) => {
            return (b.Sterbejahr || 0) - (a.Sterbejahr || 0);
          });
          resultSlice = sortedDummy.slice(startIndex, endIndex);
        } else {
          // For search, also slice
          resultSlice = filteredDummy.slice(startIndex, endIndex);
        }

        if (targetPage === 1) {
          setPeople(resultSlice);
        } else {
          setPeople(prev => [...prev, ...resultSlice]);
        }

        if (resultSlice.length < limit) setHasMore(false);

      } else if (Array.isArray(data)) {
        if (targetPage === 1) {
          setPeople(data);
        } else {
          // Filter out duplicates just in case, though API should handle it
          setPeople(prev => {
            const newIds = new Set(data.map(p => p.nid));
            return [...prev, ...data.filter(p => !prev.some(existing => existing.nid === p.nid))];
          });
        }

        if (data.length < 20) setHasMore(false);
        setIsDbConfigured(true);
      } else {
        if (targetPage === 1) setPeople([]);
        setHasMore(false);
      }

      setPage(targetPage);

    } catch (e) {
      console.error("Failed to fetch", e);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }

  const handleLoadMore = () => {
    fetchData(page + 1);
  };

  const formatDeathDate = (p: TotenbildRecord) => {
    if (p.Sterbetag && p.Sterbemonat && p.Sterbejahr) {
      return `${p.Sterbetag.toString().padStart(2, '0')}.${p.Sterbemonat.toString().padStart(2, '0')}.${p.Sterbejahr}`;
    }
    // Try to parse Sterbedatum if it's already a string but maybe not formatted correctly?
    // For now, fallback to whatever string is there or just the year
    return p.Sterbedatum || p.Sterbejahr?.toString() || "—";
  };

  return (
    <main className="min-h-screen pb-20 pt-8 w-full px-4 md:px-8">
      {!isDbConfigured && (
        <div className="w-full bg-amber-100 text-amber-800 text-xs text-center py-2 mb-6 rounded border border-amber-200">
          Demo Modus: Keine Datenbankverbindung erkannt. Zeige Beispieldaten.
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-[var(--c-border)] sticky top-4">
            <h3 className="font-serif text-lg mb-4 text-[var(--c-text-primary)]">Suche verfeinern</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--c-text-secondary)] uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Nachname, Vorname..."
                  className="input w-full text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--c-text-secondary)] uppercase tracking-wider mb-2">Ort</label>
                <input
                  type="text"
                  placeholder="z.B. Wien..."
                  className="input w-full text-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  className="btn w-full bg-[var(--c-accent)] hover:brightness-110 text-white justify-center text-sm"
                  onClick={() => fetchData(1)}
                >
                  Suchen
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--c-border)]">
              <p className="text-[11px] text-[var(--c-text-secondary)] leading-relaxed">
                Durchsuchen Sie unsere Datenbank nach Verstorbenen.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="text-center py-20 text-[var(--c-text-secondary)]">Lade Daten...</div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold text-[var(--c-text-secondary)] uppercase tracking-wider">
                  {people.length > 0 ? `${people.length} Ergebnisse` : 'Ergebnisse'}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gallery-grid">
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
                          <div className="grid grid-cols-2 gap-2 text-left">
                            <div>
                              <span className="block text-[10px] uppercase opacity-60">Geboren</span>
                              {person.Geburtsjahr || "—"}
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
                  )
                })}
              </div>

              {/* Load More Button */}
              {hasMore && people.length > 0 && (
                <div className="mt-12 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="btn px-8 py-3 bg-white border border-[var(--c-border)] text-[var(--c-text-primary)] hover:bg-[var(--c-bg-main)] transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? 'Lade mehr...' : 'Mehr laden'}
                  </button>
                </div>
              )}
            </>
          )}

          {!isLoading && people.length === 0 && (
            <div className="text-center py-20 bg-white rounded-lg border border-[var(--c-border)]">
              <p className="text-xl text-[var(--c-text-secondary)] mb-2">Keine Einträge gefunden</p>
              <button
                onClick={() => { setSearch(''); setLocation(''); fetchData(1); }}
                className="text-[var(--c-accent)] hover:underline"
              >
                Filter zurücksetzen
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
