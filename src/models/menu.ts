export type Menu = {
    id: number;
    nombre: string;
    descripcion: string;
    precio_total: number;
    precio_con_descuento: number;
    descuento_porcentaje: number;
    disponible: boolean;
    fecha_inicio: string;
    fecha_fin: string;
    imagen: string;
    sku: string;
};