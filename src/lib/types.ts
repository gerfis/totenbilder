export interface TotenbildRecord {
    nid: number;
    Name: string; // Often "Nachname Vorname" or similar
    Vorname: string | null;
    Nachname: string | null;
    Ledigname: string | null;
    Ort: string | null;
    Strasse: string | null;
    Geschlecht: string | null;
    Bekenntnis: string | null;
    Beruf1: string | null;
    Beruf2: string | null;
    Geburtsjahr: number | null;
    Sterbedatum: string | null;
    Sterbetag: number | null;
    Sterbemonat: number | null;
    Sterbejahr: number | null;
    Sterbealter: number | null;
    Bemerkung: string | null;
    images: TotenbildImage[];
}

export interface TotenbildImage {
    filename: string;
    width: number | null;
    height: number | null;
    filemime: string;
}

// Helper to construct the full image URL
export const IMAGE_BASE_URL = "https://totenbilder.at/sites/default/files/totenbilder/";

export function getImageUrl(filename: string): string {
    if (filename.startsWith('dummy_')) {
        // Generate a consistent seeded placeholder based on filename length or content
        // simple sepia-ish colored placeholder
        return `https://placehold.co/400x600/eee/555?text=${filename}`;
    }
    return `${IMAGE_BASE_URL}${filename}`;
}
