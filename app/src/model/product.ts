export interface Product {
    id: string;
    title: string;
    handle: string;
    url: string;
    imageUrl: string;
    variants: {
        id: string,
        title: string,
        sku: string,
        inventory: number,
        price: number
    };
}
