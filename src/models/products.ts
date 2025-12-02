import { Categorias } from "./categorias";
import { ProductImg } from "./productimg";

export type Product = {
    id: number;
    nombre: string;
    price: number;
    sku: string;
    descriptions: string;
    discount: number;
    categorias?: Categorias[];
    imagenes?: ProductImg[];
};


