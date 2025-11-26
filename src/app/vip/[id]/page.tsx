'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api';
import { Product } from '@/models/products';
import { useCart } from '@/context/CartContext';

import styles from './vip.module.css';

export default function VipProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        if (id) {
            api.json<Product>(`/products/${id}`)
                .then(p => {
                    setProduct(p);
                    if (p.imagenes && p.imagenes.length > 0) {
                        setSelectedImage(p.imagenes[0].url_image);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch product", err);
                    api.json<Product[]>('/products')
                        .then(products => {
                            const found = products.find(p => p.id === Number(id));
                            if (found) {
                                setProduct(found);
                                if (found.imagenes && found.imagenes.length > 0) {
                                    setSelectedImage(found.imagenes[0].url_image);
                                }
                            }
                        })
                        .catch(e => console.error("Fallback failed", e));
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className={styles.loading}>Cargando...</div>;
    if (!product) return <div className={styles.notFound}>Producto no encontrado</div>;

    console.log(product);

    return (
        <div className={styles.container}>
            {/* Main Product Section */}
            <div className={styles.mainSection}>

                {/* Column 1: Images */}
                <div className={styles.imageGallery}>
                    {/* Thumbnails (Mock) */}
                    <div className={styles.thumbnails}>
                        {product.imagenes?.map((img, i) => (
                            <div
                                key={img.id || i}
                                className={`${styles.thumbnail} ${selectedImage === img.url_image ? styles.thumbnailActive : ''}`}
                                onClick={() => setSelectedImage(img.url_image)}
                            >
                                <img src={img.url_image} alt="Thumbnail" className={styles.thumbnailImage} />
                            </div>
                        ))}
                    </div>
                    {/* Main Image */}
                    <div className={styles.mainImageContainer}>
                        <img src={selectedImage || product.imagenes?.[0]?.url_image} alt={product.nombre} className={styles.mainImage} />
                    </div>
                </div>

                {/* Column 2: Product Info */}
                <div className={styles.productInfo}>
                    <div className={styles.sku}>SKU: {product.sku}</div>
                    <h1 className={styles.title}>{product.nombre}</h1>

                    <div className={styles.priceContainer}>
                        <span className={styles.price}>${Number(product.price) != null ? Math.round(product.price).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 'N/A'}</span>
                        <span className={styles.priceLabel}>Precio neto</span>
                    </div>

                    <div className={styles.actionsContainer}>

                        <button className={styles.shareButton}>Compartir 🔗</button>
                    </div>
                </div>

                {/* Column 3: Actions */}
                <div className={styles.purchaseCard}>
                    <div className={styles.stockContainer}>
                        <span className={styles.stockLabel}>Stock disponible</span>
                        <div className={styles.quantityControl}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.quantityBtn}>-</button>
                            <span className={styles.quantityValue}>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className={styles.quantityBtn}>+</button>
                        </div>
                    </div>

                    <button
                        className={styles.addToCartBtn}
                        onClick={() => product && addToCart(product, quantity)}
                    >
                        Agregar al carrito 🛒
                    </button>
                    <button className={styles.buyNowBtn}>
                        Comprar ahora →
                    </button>

                    <div className={styles.securityInfo}>
                        <div className={styles.securityItem}>🔒 Transacciones seguras</div>
                        <div className={styles.securityItem}>🚚 Despachamos a todo el país</div>
                    </div>
                </div>
            </div>

            {/* Bottom Sections */}
            <div className={styles.relatedSection}>
                {/* Related Products Mock */}
                <div className={styles.relatedCard}>
                    <h3 className={styles.relatedTitle}>Otros productos en esta línea</h3>
                    <div className={styles.relatedItem}>
                        <div className={styles.relatedImagePlaceholder}></div>
                        <div>
                            <div className={styles.relatedItemName}>Producto Relacionado A</div>
                            <div className={styles.relatedItemPrice}>$150.000</div>
                        </div>
                    </div>
                </div>

                {/* Complementary Products Mock */}
                <div className={styles.relatedCard}>
                    <h3 className={styles.relatedTitle}>Complementa tu compra</h3>
                    <div className={styles.relatedItem}>
                        <div className={styles.relatedImagePlaceholder}></div>
                        <div>
                            <div className={styles.relatedItemName}>Accesorio B</div>
                            <div className={styles.relatedItemPrice}>$25.000</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description & Specs */}
            <div className={styles.detailsSection}>
                <div>
                    <h3 className={styles.detailsTitle}>Información del producto</h3>
                    <p className={styles.detailsText}>
                        {product.descriptions || 'Descripción detallada del producto no disponible.'}
                    </p>
                </div>
                <div>
                    <h3 className={styles.detailsTitle}>Detalles y especificaciones</h3>
                    <ul className={styles.specsList}>
                        <li>SKU: {product.sku}</li>
                        <li>Garantía: 1 año</li>
                        <li>Material: Alta resistencia</li>
                        <li>Origen: Importado</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
