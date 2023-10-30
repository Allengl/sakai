import { Demo } from '../../types/types';
const baseUrl = '/portal/apps/com.awspaas.user.apps.app20231017165850'

export const ProductService = {

    getProductsSmall() {
        return fetch(`${baseUrl}/demo/data/products-small.json`, { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    getProducts() {
        return fetch(`${baseUrl}/demo/data/products.json`, { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    getProductsWithOrdersSmall() {
        return fetch(`${baseUrl}/demo/data/products-orders-small.json`, { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    }
};
