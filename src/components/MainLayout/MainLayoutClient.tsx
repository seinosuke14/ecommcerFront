'use client';

import { usePathname } from 'next/navigation';

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    // If home, we don't want the constrained 'main-content' class.
    // We just return a plain main element (or one with a different class if needed).
    return (
        <main className={isHome ? '' : 'main-content'}>
            {children}
        </main>
    );
}
