import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Product } from "../utils/types";

type ProductsContextType = {
  products: Product[] | null;
  reload: () => void;
};
const ProductsContext = createContext<ProductsContextType | null>(null);

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used within FetchData");
  return context;
}

type FetchDataProps = {
  children: ReactNode;
};

export default function FetchData({ children }: FetchDataProps) {
  const [products, setProducts] = useState<Product[] | null>(null);

  const fetchProducts = ()=>{
    fetch('http://10.0.0.51:3000/')
    .then(res => res.json())
    .then((data: Product[])=> setProducts(data))
    .catch(console.error)
  }
  useEffect(() => {
    fetchProducts()
  }, []);

  return (
    <ProductsContext.Provider value={{products, reload: fetchProducts}}>
      {children}
    </ProductsContext.Provider>
  );
}
