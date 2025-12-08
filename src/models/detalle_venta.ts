export type DetalleVenta = {
    id: number;
    venta_id: number;
    producto_id: number;
    nombre_producto: string;
    sku: string;
    cantidad: number;
    precio_unitario: number;
    descuento_unitario: number;
    subtotal: number;
};