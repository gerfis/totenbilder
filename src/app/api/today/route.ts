
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { TotenbildRecord } from '@/lib/types';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const today = new Date();

    // Allow overriding via query params for testing or different timezone handling if needed
    // Default to server current day/month
    let day = parseInt(searchParams.get('day') || today.getDate().toString());
    let month = parseInt(searchParams.get('month') || (today.getMonth() + 1).toString());

    try {
        if (!process.env.DB_HOST) {
            throw new Error("DB_NOT_CONFIGURED");
        }

        // We only fetch who died on this day/month. Year doesn't matter for "jahrtag".
        // We probably don't need pagination for this specific list unless it's huge. 
        // Let's assume it fits in one load or maybe limit to 50?

        const sql = `
            SELECT 
              a.nid, a.alias, a.Name, a.Vorname, a.Nachname, a.Ledigname, 
              a.Ort, a.Strasse, a.Geschlecht, a.Bekenntnis, 
              a.Beruf1, a.Beruf2, a.Geburtsjahr, 
              a.Sterbedatum, a.Sterbetag, a.Sterbemonat, a.Sterbejahr, a.Sterbealter, 
              a.Bemerkung,
              b.filename, b.filesize, b.height, b.width, b.filemime
            FROM totenbilder a
            LEFT JOIN totenbilder_bilder b ON a.nid = b.nid
            WHERE a.Sterbemonat = ? AND a.Sterbetag = ?
            ORDER BY a.Sterbejahr DESC
        `;

        const rows = await query(sql, [month, day]) as any[];

        // Grouping logic (same as search/route.ts)
        const peopleMap = new Map<number, TotenbildRecord>();

        for (const row of rows) {
            if (!peopleMap.has(row.nid)) {
                peopleMap.set(row.nid, {
                    nid: row.nid,
                    alias: row.alias,
                    Name: row.Name,
                    Vorname: row.Vorname,
                    Nachname: row.Nachname,
                    Ledigname: row.Ledigname,
                    Ort: row.Ort,
                    Strasse: row.Strasse,
                    Geschlecht: row.Geschlecht,
                    Bekenntnis: row.Bekenntnis,
                    Beruf1: row.Beruf1,
                    Beruf2: row.Beruf2,
                    Geburtsjahr: row.Geburtsjahr,
                    Sterbedatum: row.Sterbedatum,
                    Sterbetag: row.Sterbetag,
                    Sterbemonat: row.Sterbemonat,
                    Sterbejahr: row.Sterbejahr,
                    Sterbealter: row.Sterbealter,
                    Bemerkung: row.Bemerkung,
                    images: []
                });
            }

            const person = peopleMap.get(row.nid)!;

            if (row.filename) {
                person.images.push({
                    filename: row.filename,
                    width: row.width,
                    height: row.height,
                    filemime: row.filemime
                });
            }
        }

        const people = Array.from(peopleMap.values());
        return NextResponse.json({ data: people, total: people.length });

    } catch (error: any) {
        console.error("Database Error:", error);
        if (error.message === "DB_NOT_CONFIGURED") {
            return NextResponse.json({ error: "DB_NOT_CONFIGURED" }, { status: 503 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
