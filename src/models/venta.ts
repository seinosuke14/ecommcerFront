import { DetalleVenta } from "./detalle_venta";

export type Venta = {
    id: number;
    usuario_id: number;
    nombre_cliente: string;
    fecha_venta: string;
    subtotal: number;
    descuento: number;
    total: number;
    metodo_pago: string;
    estado: string;
    notas: string | null;
    detalle_venta?: DetalleVenta[];
};

export const ESTADOS_VENTA = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_preparacion', label: 'En Preparación' },
    { value: 'lista', label: 'Lista' },
    { value: 'completada', label: 'Completada' },
    { value: 'cancelada', label: 'Cancelada' }
];