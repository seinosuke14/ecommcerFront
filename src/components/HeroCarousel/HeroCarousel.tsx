'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/models/products';
import AddToCartBtn from '../AddToCartBtn/AddToCartBtn';
import styles from './HeroCarousel.module.css';
import { Menu } from '@/models/menu';

interface HeroCarouselProps {
    menu: Menu[];
}

export default function HeroCarousel({ menu }: HeroCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    console.log('📊 Menús recibidos:', menu);
    console.log('📊 Cantidad de menús:', menu.length);


    // Auto-rotate
    useEffect(() => {
        if (menu.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % menu.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [menu.length]);

    if (menu.length === 0) return null;

    return (
        <div className={styles.heroContainer}>
            {menu.map((menu, index) => (
                <div
                    key={menu.id}
                    className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                >
                    <div className={styles.imageContainer}>
                        <img
                            src={menu.imagen && menu.imagen !== '' ? menu.imagen : 'https://placehold.co/600x400?text=No+Image'}
                            alt={menu.nombre}
                            className={styles.image}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://placehold.co/600x400?text=Error+Loading';
                            }}
                        />
                    </div>
                    <div className={styles.content}>
                        <h2 className={styles.title}>{menu.nombre}</h2>
                        <p className={styles.description}>
                            {menu.descripcion || 'Disfruta de nuestro delicioso menú del día.'}
                        </p>

                        <div className={styles.priceContainer}>
                            <span className={styles.price}>
                                ${Number(menu.precio_total).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                            {menu.descuento_porcentaje > 0 && (
                                <span className={styles.discount}>
                                    -{menu.descuento_porcentaje}% OFF
                                </span>
                            )}
                        </div>

                        <div className={styles.actions}>
                            <AddToCartBtn product={menu} />
                            <Link href={`/vip/${menu.id}`} className={styles.viewBtn}>
                                Ver Detalles
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            <div className={styles.controls}>
                {menu.map((_, index) => (
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
