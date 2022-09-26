import {Service} from '../model/service';
import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import {Product} from "../model/product";

export class ExpressService implements Service {
    public readonly name = "Express";
    public readonly environmentVariables = [
        'PORT'
    ];

    private static readonly URL_PREFIX = 'https://fantastiskefroe.dk';
    private static readonly ALL_PRODUCTS_URL = ExpressService.URL_PREFIX + '/collections/all-products';

    private server;

    public init(): Promise<void> {
        const app = express();
        const port = process.env.PORT;

        const corsOptions = {
            origin: ["http://localhost:8080", /\.fantastiskefroe\.dk$/]
        };

        app.use(cors(corsOptions));

        app.get('/', this.getAllProducts.bind(this));

        return new Promise(resolve => {
            this.server = app.listen(port, () => {
                console.log(`Listening on port ${port}`);
                resolve();
            });
        });
    }

    public destruct(): Promise<void> {
        return new Promise(resolve => {
            this.server.close(() => resolve());
        });
    }

    private getAllProducts(_req, res) {
        this.fetchProducts()
            .then(products => res.json(products));
    }

    private async fetchProducts(): Promise<Product[]> {
        const options = {
            method: 'GET'
        };

        return fetch(ExpressService.ALL_PRODUCTS_URL, options)
            .then(response => response.text())
            .then(ExpressService.mapProducts)
            .catch(error => {
                console.error('error', error);
                return [];
            });
    }

    private static mapProducts(input: string): Product[] {
        const parsed: {products: Record<string, { id: string, title: string, handle: string, url: string, image: string, variants }>} = JSON.parse(input);

        const result: Product[] = [];
        for (const value of Object.values(parsed.products)) {
            result.push({
                id: value.id,
                title: value.title,
                handle: value.handle,
                url: ExpressService.URL_PREFIX + value.url,
                imageUrl: value.image,
                variants: value.variants
            });
        }

        return result;
    }
}
