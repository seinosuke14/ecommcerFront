'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/models/products';
import styles from './products.module.css';
import AddToCartBtn from '@/components/AddToCartBtn/AddToCartBtn';

export const dynamic = 'force-dynamic'

export default function ProductsPage() {


    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState<{ min: number, max: number }>({ min: 0, max: 10000000 });
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);

    const searchParams = useSearchParams();
    const urlCategory = searchParams.get('category');

    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Initialize selected categories from URL
    useEffect(() => {
        if (urlCategory) {
            setSelectedCategories([normalize(urlCategory)]);
        } else {
            setSelectedCategories([]);
        }
    }, [urlCategory]);

    useEffect(() => {
        api.json<Product[]>('/products')
            .then(setProducts)
            .catch(() => setProducts([]));
    }, []);

    // Derive available categories from products
    const availableCategories = Array.from(new Set(
        products.flatMap(p => p.categorias?.map(c => c.vch_nombre) || [])
    )).sort();

    const toggleCategory = (cat: string) => {
        const normalizedCat = normalize(cat);
        setSelectedCategories(prev =>
            prev.includes(normalizedCat)
                ? prev.filter(c => c !== normalizedCat)
                : [...prev, normalizedCat]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSearchTerm('');
        setPriceRange({ min: 0, max: 10000000 });
    };

    const filteredProducts = products.filter(p => {
        // Category Filter
        const matchesCategory = selectedCategories.length === 0 ||
            p.categorias?.some(c => selectedCategories.includes(normalize(c.vch_nombre)));

        // Search Filter
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());

        // Price Filter
        const matchesPrice = (p.price || 0) >= priceRange.min && (p.price || 0) <= priceRange.max;

        return matchesCategory && matchesSearch && matchesPrice;
    });
    console.log(products)
    return (
        <div className={styles.container}>
            {/* Filter Sidebar */}
            <aside className={styles.sidebar}>
                {/* Header */}
                <div className={styles.sidebarHeader}>
                    <h3 className={styles.sidebarTitle}>Filtros</h3>
                    <button
                        onClick={clearFilters}
                        className={styles.clearFiltersBtn}
                    >
                        Borrar Filtros
                    </button>
                </div>

                {/* Results Count */}
                <div className={styles.resultsCount}>
                    {filteredProducts.length} resultados
                </div>

                {/* Search */}
                <div className={styles.sidebarSection}>
                    <input
                        type="text"
                        placeholder="Palabras clave"
                        className={styles.filterInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Price Range */}
                <div className={styles.sidebarSection}>
                    <label className={styles.filterLabel}>Precio oferta</label>
                    <div className={styles.filterRangeContainer}>
                        <input
                            type="number"
                            className={styles.filterInput}
                            placeholder="Min"
                            value={priceRange.min === 0 ? '' : priceRange.min}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        />
                        <span className={styles.rangeSeparator}>-</span>
                        <input
                            type="number"
                            className={styles.filterInput}
                            placeholder="Max"
                            value={priceRange.max === 10000000 ? '' : priceRange.max}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        />
                    </div>
                </div>

                {/* Categories Accordion */}
                <div className={styles.sidebarSection}>
                    <div
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className={styles.categoryHeader}
                    >
                        <span className={styles.categoryTitle}>Categorías</span>
                        <span style={{ transform: isCategoryOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>⌄</span>
                    </div>

                    {isCategoryOpen && (
                        <div className={styles.categoryList}>
                            {availableCategories.map(cat => {
                                const isSelected = selectedCategories.includes(normalize(cat));
                                return (
                                    <label key={cat} className={styles.categoryLabel}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleCategory(cat)}
                                            className={styles.checkbox}
                                        />
                                        {cat}
                                    </label>
                                );
                            })}
                            {availableCategories.length === 0 && <p className={styles.noCategories}>No hay categorías disponibles</p>}
                        </div>
                    )}
                </div>
            </aside>

            {/* Product Grid */}
            <section className={styles.mainContent}>
                {filteredProducts.length === 0 ?
                    <div className={styles.noResults}>
                        <p>No se encontraron productos que coincidan con los filtros.</p>
                    </div>
                    :
                    <div className={styles.productsGrid}>
                        {filteredProducts.map(p => (
                            <Link key={p.id} href={`/vip/${p.id}`}>
                                <div className={styles.card}>
                                    <h3 className={styles.cardTitle}>{p.nombre}</h3>
                                    <img width={250} height={250} src={p.imagenes?.[0]?.url_image} alt={p.nombre} className={styles.cardImage} />
                                    <div className={styles.price}>
                                        {p.price != null ? `$${Number(p.price).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : 'N/A'}</div>
                                    <p className={styles.description}>
                                        <strong className={styles.descriptionLabel}>Descripción:</strong> {p.descriptions || 'Sin descripción'}
                                    </p>
                                    <div className={styles.sku}>SKU: {p.sku}</div>
                                    <div style={{ marginTop: '1rem' }}>
                                        <AddToCartBtn product={p} className={styles.addToCartBtn} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                }
            </section>
        </div>
    );
}
