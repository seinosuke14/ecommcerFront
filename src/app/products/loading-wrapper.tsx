'use client';

import { Suspense } from 'react';
import ProductsPage from './product-page';

export default function ProductsPageWrapper() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ProductsPage />
        </Suspense>
    );
}