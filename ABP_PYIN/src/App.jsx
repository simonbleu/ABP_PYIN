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
  const [page, setPage] = useState(1);
  const [totalAPIProducts, setTotalAPIProducts] = useState(0); // Agregar este estado
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [format, setFormat] = useState('');


  //referencias
  const containerRef = useRef(null);
  const limit = 20
  // se llama a la api para obtener los datos de productos
useEffect(() => {
    axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${(page-1)*limit}`)
      .then((res) => {
        if (res.data && res.data.products) {
          setProducts(res.data.products);
          setTotalAPIProducts(res.data.total);
        }
      })
      .catch(error => {
        console.error("Error:", error);
        setProducts([]);
        setTotalAPIProducts(0);
      });
  }, [page, limit, selectedCategory]); // Cerrar correctamente el useEffect

  // useEffect separado para categorías
useEffect(() => {
    axios.get('https://dummyjson.com/products/categories')
      .then((res) => {
        console.log('Datos crudos:', res.data);
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        }
      })
      .catch(error => {
        console.error("Error al cargar categorías:", error);
        setCategories([]);
      });
  }, []); // Solo un cierre del useEffect porque cuenta para todos los use effect no solo el primero

// 1. Productos filtrados
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
    && (selectedCategory === 'all' || p.category === selectedCategory)
  ).sort((a, b) => {
    switch(sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-asc':
        return a.rating - b.rating;
      case 'rating-desc':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

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

const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    containerRef.current.classList.toggle("dark-mode"); 
}; 


const handleExport = () => {
  if (!format) return;
  
  var blob, headers, url, content;

  if (format === 'json') {
    blob = new Blob([JSON.stringify(filteredProducts, null, 2)], {
      type: "application/json",
    });
    url = URL.createObjectURL(blob);
    triggerDownload(url, 'productos.json');
  } 
  else if (format === 'csv') {
    headers = Object.keys(filteredProducts[0]).join(',');
    var csvRows = filteredProducts.map(product => 
      Object.values(product).join(',')
    );
    content = [headers, ...csvRows].join('\n');
    
    blob = new Blob([content], {
      type: "text/csv;charset=utf-8",
    });
    url = URL.createObjectURL(blob);
    triggerDownload(url, 'productos.csv');
  }
  else if (format === 'excel') {
    headers = Object.keys(filteredProducts[0]).join('\t');
    var excelRows = filteredProducts.map(product => 
      Object.values(product).join('\t')
    );
    content = [headers, ...excelRows].join('\n');
    
    blob = new Blob([content], {
      type: "application/vnd.ms-excel",
    });
    url = URL.createObjectURL(blob);
    triggerDownload(url, 'productos.xls');
  }
};

const triggerDownload = (url, filename) => {
  //crear hipervinculo
  var link = document.createElement('a');
  link.href = url;
  link.download = filename;
  //agregamos anchor tag al DOM
  document.body.appendChild(link);
  // simulamos click en el elelmento
  link.click();
  //eliminar elemento del DOM
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};



  return (
<div ref={containerRef} className="min-h-screen transition-colors duration-300">
      <Header
        search={search}
        setSearch={setSearch}
        show={show}
        setShow={setShow}
        darkMode={darkMode}
        containerRef={containerRef}
        toggleDarkMode={toggleDarkMode}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        statsPanel={
          <StatsPanel
          darkMode={darkMode}
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
    <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
 {/* Primera fila: categorías y ordenamiento */}
    <div className="flex justify-start gap-4 items-center w-full">
    <span className="text-gray-800 dark:text-white font-semibold min-w-[80px]">
      Filtrar por:
    </span>
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="mode-toggle px-4 py-2 font-semibold rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      <option value="all">Todas las categorías</option>
      {Array.isArray(categories) && categories.length > 0 ? (
        categories.map(category => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))
      ) : (
        <option value="" disabled>Cargando categorías...</option>
      )}
    </select>

    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="mode-toggle px-4 py-2 font-semibold rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      <option value="none">Sin ordenar</option>
      <option value="price-asc">Precio: Menor a Mayor</option>
      <option value="price-desc">Precio: Mayor a Menor</option>
      <option value="rating-asc">Rating: Menor a Mayor</option>
      <option value="rating-desc">Rating: Mayor a Menor</option>
    </select>
  </div>

  {/* Segunda fila: exportación */}
      <div className="flex justify-start gap-4 items-center w-full">
          <span className="text-gray-800 dark:text-white font-semibold min-w-[80px]">
      Exportar:
    </span>
    <select 
      onChange={(e)=>setFormat(e.target.value)} 
      value={format}
      className="mode-toggle px-4 py-2 font-semibold rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
    > 
      <option value="">Seleccionar formato</option>
      <option value="json">JSON</option>
      <option value="csv">CSV</option>
      <option value="excel">Excel</option>
    </select>
    <button 
      onClick={handleExport}
      className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
    >
      Exportar archivo
    </button>
  </div>
      </div>
<div className="container mx-auto px-4 py-8">
        <Productlist products={filteredProducts} />
        {filteredProducts.length === 0 && (
          <div className="text-center w-full py-4">
            No se encontraron productos
            {showGif && (
              <img
                src="https://media3.giphy.com/media/mlvseq9yvZhba/giphy.gif"
                alt="Easter egg gif"
                className="mx-auto mt-4"
                style={{
                  opacity: showGif ? 1 : 0,
                  transition: "opacity 1s ease-in-out",
                }}
              />
            )}
          </div>
        )}
      </div>
      {/* Paginación */}
<div className="container mx-auto px-4 py-4 flex flex-col items-end gap-2">
  <div className="flex items-center gap-4">
    <button 
      disabled={page === 1} 
      onClick={() => setPage(page-1)}
      className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
    >
      Anterior
    </button>
    <span className="text-gray-700 dark:text-gray-500 font-semibold">
      Página {page}
    </span>
    <button 
      disabled={page * limit >= totalAPIProducts} 
      onClick={() => setPage(page+1)}
      className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
    >
      Siguiente
    </button>
  </div>
  <span className="text-sm text-gray-600 dark:text-gray-400">
    Mostrando {Math.min((page-1)*limit + 1, totalAPIProducts)} - {Math.min(page*limit, totalAPIProducts)} de {totalAPIProducts} productos
  </span>
  </div>
  </div>
    
  );
}

export default App;

