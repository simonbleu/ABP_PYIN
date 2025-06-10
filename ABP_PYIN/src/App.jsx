// Se importa el estilo, el "fetch" y el "hook" (para las API)
import './App.css'
import axios from "axios";
import {useEffect, useState, useRef} from 'react';  
// componentes propios
import Productlist from './components/Productlist';
import StatsPanel from './components/StatsPanel';
import Header from './components/Header';




function App() {
  //Permite actualizar estados sin recargar la pagina
  const [products,setProducts] = useState([]);
  const [search,setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  //referencias
  const containerRef = useRef(null);
  // se llama a la api para obtener los datos de productos
  useEffect(()=>{
    axios.get("https://dummyjson.com/products?limit=100").then((res)=>{
    setProducts(res.data.products);})
  },[]);

// 1. Productos filtrados
const filteredProducts = products.filter((p) =>
  p.title.toLowerCase().includes(search.toLowerCase()));

// 2. Total productos
const totalProducts = filteredProducts.length;

// 3. Precio máximo y producto más caro
const maxPrice = totalProducts > 0 ? Math.max(...filteredProducts.map(p => p.price)) : null;
const maxProduct = totalProducts > 0 ? filteredProducts.find(p => p.price === maxPrice) : null;
const maxName = maxProduct ? maxProduct.title : null;

// 4. Precio mínimo y producto más barato
const minPrice = totalProducts > 0 ? Math.min(...filteredProducts.map(p => p.price)) : null;
const minProduct = totalProducts > 0 ? filteredProducts.find(p => p.price === minPrice) : null;
const minName = minProduct ? minProduct.title : null;

// 5. Cantidad títulos > 20 caracteres
const longTitles = filteredProducts.filter(p => p.title.length > 20).length;

// 6. Precio total
const totalPrice = filteredProducts.reduce((acc, p) => acc + p.price, 0);

// 7. Promedio descuento (discountPercentage)
const avgDiscount =
  totalProducts > 0
    ? filteredProducts.reduce((acc, p) => acc + p.discountPercentage, 0) / totalProducts
    : 0;
// Promedio de precios
const avgPrice = filteredProducts.length > 0 
  ? filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length
  : 0;

// Cantidad de productos con precio mayor al promedio
const countAboveAvg = filteredProducts.filter(p => p.price > avgPrice).length;

// Función para contar vocales en un string
const countVowels = (str) => {
  const vocales = ['a','e','i','o','u'];
  return [...str.toLowerCase()].filter(letra => vocales.includes(letra)).length;
};

// Producto con más vocales en el título
const productMostVowels = filteredProducts.length > 0
  ? filteredProducts.reduce((maxProd, currProd) => {
      return countVowels(currProd.title) > countVowels(maxProd.title) ? currProd : maxProd;
    })
  : null;

// uso del buscador y un timeout para mostrar un gif
useEffect(() => {
  let timeout;
  if (filteredProducts.length === 0) {
    timeout = setTimeout(() => setShowGif(true), 5000);
  } else {
    setShowGif(false);
  }
  return () => clearTimeout(timeout);
}, [filteredProducts]);

const toggleDarkMode = ()=>{
    setDarkMode(!darkMode);
    containerRef.current.classList.toggle("dark-mode"); 
}; 

  return (
    <div ref={containerRef}>
<Header
        search={search}
        setSearch={setSearch}
        show={show}
        setShow={setShow}
        darkMode={darkMode}
        containerRef={containerRef}
        toggleDarkMode={toggleDarkMode}
        statsPanel={
        <StatsPanel
      total={totalProducts}
      max={maxPrice}
      maxName={maxName}
      min={minPrice}
      minName={minName}
      longTitles={longTitles}
      totalPrice={totalPrice}
      avgDiscount={avgDiscount}
      avgPrice={avgPrice.toFixed(2)}
      countAboveAvg={countAboveAvg}
      mostVowelsName={productMostVowels ? productMostVowels.title : "N/A"}
    />
  }
/>
      <Productlist products={filteredProducts} /> 
      {/*renderizacion condicional*/}
      {filteredProducts.length === 0 && <div className="text-center w-full 
      py-4">No se encontraron productos {showGif && (
      <img
  src="https://media3.giphy.com/media/mlvseq9yvZhba/giphy.gif"
  alt="Easter egg gif"
  className="mx-auto mt-4"
  style={{
    opacity: showGif ? 1 : 0,
    transition: "opacity 1s ease-in-out",
  }}
/>
    )}</div>}
    </div>
  )
}

export default App;

