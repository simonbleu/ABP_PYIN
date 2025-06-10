function Header(props) {
  return (
    <header className="text-gray-600 bg-white dark:bg-gray-800 dark:text-gray-200 body-font shadow-md">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center relative">
        <a className="flex title-font font-medium items-center text-gray-900 dark:text-white mb-4 md:mb-0" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
            strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="ml-3 text-xl">Evidencia Proyecto Integrador</span>
        </a>

        <div className="md:ml-auto md:mr-auto w-full md:w-1/2 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Buscar producto"
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-600 focus:outline-none py-2 px-4 text-base dark:text-gray-200 dark:placeholder-gray-400"
          />
        </div>

        <div className="relative ml-auto flex gap-2">
          <button
            onClick={props.toggleDarkMode}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Modo {props.darkMode ? 'Claro' : 'Oscuro'}
          </button>

          <button
            onClick={() => props.setShow(!props.show)}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {props.show ? "Ocultar  ▲" : "Estadisticas  ▼"}
          </button>
          
          {props.show && (
            <div className="absolute top-full mt-2 right-0 z-10 bg-white dark:bg-gray-800 shadow-lg rounded w-80 p-4 border border-gray-300 dark:border-gray-600">
              {props.statsPanel}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;