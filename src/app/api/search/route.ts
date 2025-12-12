import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { TotenbildRecord, TotenbildImage } from '@/lib/types';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const nameQuery = searchParams.get('name');
    const locationQuery = searchParams.get('location');
    const birthYearQuery = searchParams.get('birthYear');
    const deathYearQuery = searchParams.get('deathYear');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const offset = (page - 1) * limit;

    // Common WHERE clause
    let whereClause = `WHERE 1=1`;
    const params: any[] = [];
    let isSearch = false;

    if (nameQuery) {
        whereClause += ` AND (a.Nachname LIKE ? OR a.Vorname LIKE ? OR a.Ledigname LIKE ? OR a.Name LIKE ?)`;
        const like = `%${nameQuery}%`;
        params.push(like, like, like, like);
        isSearch = true;
    }

    if (locationQuery) {
        whereClause += ` AND (a.Ort LIKE ? OR a.Strasse LIKE ?)`;
        const like = `%${locationQuery}%`;
        params.push(like, like);
        isSearch = true;
    }

    if (birthYearQuery) {
        whereClause += ` AND a.Geburtsjahr = ?`;
        params.push(birthYearQuery);
        isSearch = true;
    }

    if (deathYearQuery) {
        whereClause += ` AND a.Sterbejahr = ?`;
        params.push(deathYearQuery);
        isSearch = true;
    }

    // Determine Order
    let orderBy = '';
    if (isSearch) {
        orderBy = `ORDER BY a.Sterbejahr DESC, a.Nachname ASC`;
    } else {
        // Default homepage view
        orderBy = `ORDER BY a.Sterbejahr DESC, a.Sterbemonat DESC, a.Sterbetag DESC, a.Nachname ASC`;
    }

    try {
        if (!process.env.DB_HOST) {
            throw new Error("DB_NOT_CONFIGURED");
        }

        // Step 0: Get total count of matching records
        const countSql = `
            SELECT COUNT(DISTINCT a.nid) as total
            FROM totenbilder a 
            ${whereClause}
        `;
        const countRows = await query(countSql, params) as any[];
        const totalCount = countRows[0]?.total || 0;

        // Step 1: Get IDs for the current page
        // We use string interpolation for LIMIT/OFFSET because param substitution can sometimes be tricky with types in mysql2 wrapper, 
        // but let's try to use params for limit/offset for safety if the wrapper supports it. 
        // If query() wrapper expects array, it should be fine.
        const idParams = [...params, limit.toString(), offset.toString()];
        // Note: casting to string for mysql2/promise execute sometimes helps if it expects everything as string/buffer, 
        // but numbers usually work. Let's send them as is, but in 'params' array.
        // Actually, let's keep them as numbers in the array.

        const idSql = `
            SELECT a.nid 
            FROM totenbilder a 
            ${whereClause} 
            ${orderBy} 
            LIMIT ${limit} OFFSET ${offset}
        `;
        // Using template literals for limit/offset is safe here because we parsed them as Ints above.

        const idRows = await query(idSql, params) as any[];

        if (idRows.length === 0) {
            return NextResponse.json({ data: [], total: totalCount });
        }

        const ids = idRows.map(r => r.nid);

        // Step 2: Get full details for these IDs
        // We re-sort in SQL to ensure consistent order, or we can just Sort in JS. 
        // Sorting in SQL with `IN` doesn't guarantee order unless we use manual sort or FIELD().
        // Simplest is to just fetch and use the map order or re-sort.
        // However, since we already have the IDs in correct order from Step 1, we can enforce that order in JS.

        const dataSql = `
            SELECT 
              a.nid, a.Name, a.Vorname, a.Nachname, a.Ledigname, 
              a.Ort, a.Strasse, a.Geschlecht, a.Bekenntnis, 
              a.Beruf1, a.Beruf2, a.Geburtsjahr, 
              a.Sterbedatum, a.Sterbetag, a.Sterbemonat, a.Sterbejahr, a.Sterbealter, 
              a.Bemerkung,
              b.filename, b.filesize, b.height, b.width, b.filemime, b.delta
            FROM totenbilder a
            LEFT JOIN totenbilder_bilder b ON a.nid = b.nid
            WHERE a.nid IN (${ids.join(',')})
            ORDER BY FIELD(a.nid, ${ids.join(',')}), b.delta ASC
        `;

        const rows = await query(dataSql) as any[];

        // Grouping logic
        const peopleMap = new Map<number, TotenbildRecord>();

        // Initialize map based on IDs order to preserve sort
        ids.forEach(id => {
            // We'll fill this in the loop... wait, dataSql rows might be missing if something is weird, 
            // but 'ids' came from the table so they exist. 
            // We don't have the data yet.
            // Better to just iterate rows.
        });

        for (const row of rows) {
            if (!peopleMap.has(row.nid)) {
                peopleMap.set(row.nid, {
                    nid: row.nid,
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

        // Return array in the correct order (map iterates in insertion order, and we processed rows ordered by FIELD(nid))
        const people = Array.from(peopleMap.values());

        return NextResponse.json({ data: people, total: totalCount });

    } catch (error: any) {
        console.error("Database Error:", error);
        if (error.message === "DB_NOT_CONFIGURED") {
            return NextResponse.json({ error: "DB_NOT_CONFIGURED" }, { status: 503 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
