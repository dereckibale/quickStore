import { Product } from "../utils/types";

export default async function AddProduct(newProduct: Product) {
  try {
    const response = await fetch('http://10.0.0.54:3000/Products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    if (!response.ok) throw new Error('Failed to add product');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Add product error:', error);
    throw error;
  }
}
