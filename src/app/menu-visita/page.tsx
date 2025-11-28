export default function MenuVisita() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Menú Visita</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Bienvenido al área de visitas. Aquí podrás ver nuestro catálogo público.
            </p>
            {/* Placeholder content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 border rounded-xl shadow-sm bg-white dark:bg-gray-800">
                        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                        <h3 className="text-lg font-semibold mb-2">Producto Ejemplo {i}</h3>
                        <p className="text-gray-500">Descripción breve del producto para visitantes.</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
