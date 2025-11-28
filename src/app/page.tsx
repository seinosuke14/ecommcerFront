'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import Link from 'next/link';
import { Product } from '@/models/products';

import styles from './page.module.css';
import AddToCartBtn from '@/components/AddToCartBtn/AddToCartBtn';
import HeroCarousel from '@/components/HeroCarousel/HeroCarousel';
import WelcomePopup from '@/components/WelcomePopup/WelcomePopup';

export default function Home() {
  const [status, setStatus] = useState<'offline' | 'online' | 'checking'>('checking');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.json<Product[]>('/products')
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const discountedProducts = products
    .filter(product => product.discount > 0)
    .map(product => {
      const discounts = product.price * (product.discount / 100);
      const finalPrice = Math.round(product.price - discounts);
      return {
        ...product,
        price: finalPrice < 0 ? 0 : finalPrice
      };
    });

  const visibleItems = 4;
  const maxSlide = Math.max(0, discountedProducts.length - visibleItems);

  useEffect(() => {
    api.json<{ status: string }>('/health')
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'));
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (maxSlide === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const step = 4; // visibleItems - 1
        const next = prev + step;
        if (next > maxSlide) {
          return prev === maxSlide ? 0 : maxSlide;
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [maxSlide]);

  return (
    <main>
      <WelcomePopup />
      <HeroCarousel products={discountedProducts.slice(0, 5)} />

      <section>
        <h2 className={styles.sectionTitle}>Ofertas Destacadas</h2>
        <div className={styles.carouselContainer}>
          <div className={styles.carouselSlide} style={{ transform: `translateX(-${currentSlide * 25}%)` }}>
            {discountedProducts.map((p) => (
              <div key={p.id} className={styles.carouselItem}>
                <div className={styles.card}>
                  <div className={styles.carouselImageContainer}>
                    <img width={250} height={250} src={p.imagenes?.[0]?.url_image || 'https://p4-ofp.static.pub//fes/cms/2024/07/17/nlp7hjbit9r7qbqb941hykxjino4f3761364.png'} alt="pc" className={styles.carouselImage} />
                    <div className={styles.discountBadge}>
                      -{p.discount}%
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3>{p.nombre}</h3>
                    <div className={styles.price}>{Number(p.price) > 0 ? `$${Number(p.price).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : 'el producto es gratis'}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <Link href={`/vip/${p.id}`} className={styles.viewOfferBtn}>Detalles</Link>
                      <AddToCartBtn product={p} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.carouselControls}>
            {Array.from({ length: maxSlide + 1 }).map((_, index) => (
              <div
                key={index}
                className={`${styles.carouselDot} ${currentSlide === index ? styles.carouselDotActive : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <p className={styles.apiStatus}>
        API Status: <strong>{status}</strong>
      </p>
    </main>
  );
}
