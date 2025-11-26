'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/models/products';
import AddToCartBtn from '../AddToCartBtn/AddToCartBtn';
import styles from './HeroCarousel.module.css';

interface HeroCarouselProps {
    products: Product[];
}

export default function HeroCarousel({ products }: HeroCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-rotate
    useEffect(() => {
        if (products.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % products.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [products.length]);

    if (products.length === 0) return null;

    return (
        <div className={styles.heroContainer}>
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                >
                    <div className={styles.imageContainer}>
                        <img
                            src={product.imagenes?.[0]?.url_image || 'https://placehold.co/600x400'}
                            alt={product.nombre}
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.content}>
                        <h2 className={styles.title}>{product.nombre}</h2>
                        <p className={styles.description}>
                            {product.descriptions || 'Sin descripción disponible.'}
                        </p>

                        <div className={styles.priceContainer}>
                            <span className={styles.price}>
                                ${product.price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                            {product.discount > 0 && (
                                <span className={styles.discount}>
                                    -{product.discount}% OFF
                                </span>
                            )}
                        </div>

                        <div className={styles.actions}>
                            <AddToCartBtn product={product} />
                            <Link href={`/vip/${product.id}`} className={styles.viewBtn}>
                                Ver Detalles
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            <div className={styles.controls}>
                {products.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
