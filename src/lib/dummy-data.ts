import { TotenbildRecord } from './types';

export const DUMMY_DATA: TotenbildRecord[] = [
    {
        nid: 101,
        alias: 'huber-maria',
        Name: 'Huber Maria',
        Vorname: 'Maria',
        Nachname: 'Huber',
        Ledigname: 'Schmidt',
        Ort: 'Salzburg',
        Strasse: 'Getreidegasse 9',
        Geschlecht: 'w',
        Bekenntnis: 'rk',
        Beruf1: 'Hausfrau',
        Beruf2: null,
        Geburtsjahr: 1905,
        Sterbedatum: '23.11.1985',
        Sterbetag: 23,
        Sterbemonat: 11,
        Sterbejahr: 1985,
        Sterbealter: 80,
        Bemerkung: 'Ruhe in Frieden.',
        images: [
            { filename: 'dummy_1.jpg', width: 600, height: 800, filemime: 'image/jpeg' },
            { filename: 'dummy_1_back.jpg', width: 600, height: 800, filemime: 'image/jpeg' }
        ]
    },
    {
        nid: 102,
        alias: 'hofer-franz',
        Name: 'Hofer Franz',
        Vorname: 'Franz',
        Nachname: 'Hofer',
        Ledigname: null,
        Ort: 'Tirol',
        Strasse: 'Bergweg 2',
        Geschlecht: 'm',
        Bekenntnis: 'rk',
        Beruf1: 'Bauer',
        Beruf2: 'Holzknecht',
        Geburtsjahr: 1888,
        Sterbedatum: '15.02.1955',
        Sterbetag: 15,
        Sterbemonat: 2,
        Sterbejahr: 1955,
        Sterbealter: 67,
        Bemerkung: null,
        images: [
            { filename: 'dummy_2.jpg', width: 500, height: 700, filemime: 'image/jpeg' }
        ]
    },
    {
        nid: 103,
        alias: 'weber-anna',
        Name: 'Weber Anna',
        Vorname: 'Anna',
        Nachname: 'Weber',
        Ledigname: 'Kaufmann',
        Ort: 'Graz',
        Strasse: 'Herrengasse 1',
        Geschlecht: 'w',
        Bekenntnis: 'ev',
        Beruf1: 'Lehrerin',
        Beruf2: null,
        Geburtsjahr: 1920,
        Sterbedatum: '10.04.2001',
        Sterbetag: 10,
        Sterbemonat: 4,
        Sterbejahr: 2001,
        Sterbealter: 81,
        Bemerkung: 'Beliebte Lehrerin der Volksschule.',
        images: [
            { filename: 'dummy_3.jpg', width: 550, height: 750, filemime: 'image/jpeg' }
        ]
    },
    {
        nid: 104,
        alias: 'wagner-johann',
        Name: 'Wagner Johann',
        Vorname: 'Johann',
        Nachname: 'Wagner',
        Ledigname: null,
        Ort: 'Linz',
        Strasse: 'Landstraße 55',
        Geschlecht: 'm',
        Bekenntnis: 'rk',
        Beruf1: 'Schmied',
        Beruf2: null,
        Geburtsjahr: 1875,
        Sterbedatum: '01.09.1944',
        Sterbetag: 1,
        Sterbemonat: 9,
        Sterbejahr: 1944,
        Sterbealter: 69,
        Bemerkung: null,
        images: [
            { filename: 'dummy_4.jpg', width: 600, height: 900, filemime: 'image/jpeg' }
        ]
    }
];
