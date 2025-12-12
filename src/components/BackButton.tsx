'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-[var(--c-text-secondary)] hover:text-[var(--c-accent)] transition-colors group text-sm uppercase tracking-wide font-medium"
        >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Zurück zur Übersicht
        </button>
    );
}
