type Product = {
  id: number;
  name: string;
  Selling_price: number;
  Wholesale_price: number;
  Barcode: string; // assuming Barcode is string now
  description: string;
};

export async function addProduct(newProduct: Product) {
  try {
    const response = await fetch('http://192.168.100.69:3000/Products', {
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
