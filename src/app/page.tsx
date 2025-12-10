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
      params.append('limit', '8');

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
        const limit = 8;
        const startIndex = (targetPage - 1) * limit;
        const endIndex = startIndex + limit;

        let resultSlice: TotenbildRecord[] = [];

        // Match API behavior: Only show 8 on initial load (empty search), sorted by death date
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

        if (data.length < 8) setHasMore(false);
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
    <main className="min-h-screen pb-20">
      {/* Hero */}
      <header className="bg-white border-b border-[var(--c-border)] py-16 mb-12 relative overflow-hidden">
        {!isDbConfigured && (
          <div className="absolute top-0 left-0 w-full bg-amber-100 text-amber-800 text-xs text-center py-1">
            Demo Modus: Keine Datenbankverbindung erkannt. Zeige Beispieldaten.
          </div>
        )}
        <div className="container text-center relative z-10">
          <h1 className="text-5xl md:text-6xl text-[var(--c-text-primary)] mb-6 tracking-tight">Totenbilder Archiv</h1>
          <p className="text-[var(--c-text-secondary)] max-w-2xl mx-auto text-lg font-light">
            Ein würdevolles Gedenken. Bewahrung der Erinnerung an vergangene Generationen.
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="container mb-16 relative z-10 -mt-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-[var(--c-border)] flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="flex-1">
            <label className="block text-xs font-bold text-[var(--c-text-secondary)] uppercase tracking-wider mb-1">Name</label>
            <input
              type="text"
              placeholder="z.B. Müller, Johann..."
              className="input w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-[var(--c-text-secondary)] uppercase tracking-wider mb-1">Ort</label>
            <input
              type="text"
              placeholder="z.B. Wien..."
              className="input w-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button className="btn h-[46px] w-full md:w-auto px-8 bg-[var(--c-accent)] hover:brightness-110 text-white" onClick={() => fetchData(1)}>
              Suchen
            </button>
          </div>
        </div>
      </div>

      {/* Grid Results */}
      <div className="max-w-7xl mx-auto px-4">
        {isLoading ? (
          <div className="text-center py-20 text-[var(--c-text-secondary)]">Lade Daten...</div>
        ) : (
          <>
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
      </div>

      {!isLoading && people.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-[var(--c-text-secondary)]">Keine Einträge für diese Suche gefunden.</p>
        </div>
      )}

    </main>
  );
}
