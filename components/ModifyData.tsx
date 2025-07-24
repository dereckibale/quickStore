import { Product } from "../utils/types";

export default async function AddProduct(newProduct: Product) {
  try {
    const response = await fetch('http://10.0.0.51:3000/add', {
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

export async function UpdateProduct(updatedProduct: Product) {
  try {
    const response = await fetch(`http://10.0.0.51:3000/Products/${updatedProduct.id}`, {
      method: 'PUT', // or 'PATCH', depending on your backend
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });
    if (!response.ok) throw new Error('Failed to update product');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Update product error:', error);
    throw error;
  }
}