import * as fs from 'fs';
import * as path from 'path';

// Manually load .env.local
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                process.env[match[1].trim()] = match[2].trim();
            }
        });
    }
} catch (e) {
    console.error("Could not read .env.local", e);
}

async function debugDb() {
    try {
        // Dynamically import db after env is loaded
        const { query } = await import('./src/lib/db');

        console.log('--- Debugging Database ---');

        // 1. Check a few rows from totenbilder
        console.log('\n1. Sampling totenbilder:');
        const people = await query('SELECT nid, Nachname, Name FROM totenbilder ORDER BY nid DESC LIMIT 3') as any[];
        console.log(people);

        if (Array.isArray(people) && people.length > 0) {
            const nid = people[0].nid;
            console.log(`\n2. Checking images for nid ${nid}:`);

            // 2. Check totenbilder_bilder for one nid using the current JOIN logic
            const images = await query('SELECT * FROM totenbilder_bilder WHERE nid = ?', [nid]);
            console.log('Query: SELECT * FROM totenbilder_bilder WHERE nid = ?');
            console.log(images);

            // 4. Check the results that are ACTUALLY being shown on the homepage
            console.log('\n4. Checking actual homepage query (ORDER BY Sterbejahr DESC...):');
            const sql = `
            SELECT 
              a.nid, a.Name, a.Sterbejahr, b.filename 
            FROM totenbilder a
            LEFT JOIN totenbilder_bilder b ON a.nid = b.nid
            ORDER BY a.Sterbejahr DESC, a.Sterbemonat DESC, a.Sterbetag DESC, a.Nachname ASC, b.delta ASC 
            LIMIT 10
          `;
            const homepageResults = await query(sql);
            console.log(homepageResults);
        }
    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}

debugDb();
