export type Menu = {
    id: number;
    nombre: string;
    descriptions: string;
    price: number;
    sku: string;
    discount: number;
    precio_total: number;
    precio_con_descuento: number;
    descuento_porcentaje: number;
    disponible: boolean;
    fecha_inicio: string;
    fecha_fin: string;
    imagen: string;
};