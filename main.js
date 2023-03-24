const contenedor = document.getElementById('contenedor_cartas');

// Con una funcion asincrona realizo una solicitud a al archivo Json local products.json y al final devuelve el objeto data con los datos de products.json
const obtenerJson = async () => {
	const response = await fetch('../products.json');
	const data = await response.json();
	return data;
};

// Acá uso nuevamente una funcion asincrona donde espero a que obtenerJson se resuelva y almaceno eso en data. busco con find() el producto mediante su id para ver si esta en el array y luego también mediante su id veo si el producto ya está em el carrito, en caso de que ya esté se suma a la cantidad y en caso de que no se encuentre se dibuja un nuevo producto en el modal del carrito con la cantidad de 1. Se actualiza el localstorage y se llama a mostarr carrito y con una alerta de sweetalert le mostramos al usuario que el producto se agregó al carrito.
const agregarProducto = async (id) => {
	const data = await obtenerJson();
	const productoSeleccionado = data.find((producto) => producto.id === id);
	const itemEnCarrito = carrito.find((item) => item.id === id);
	itemEnCarrito ? itemEnCarrito.cantidad++ : carrito.push({ ...productoSeleccionado, cantidad: 1 });
	almacenarStorage(carrito);
	mostrarCarrito();
	Swal.fire({
		icon: 'success',
		title: 'Producto Agregado',
		text: 'El producto ha sido agregado al carrito',
		position: 'bottom-right',
		showConfirmButton: false,
		timer: 2500,
		toast: true,
	});
};

// Aca nuevamente uso una funcion asincrona y como en la función anterior se espera a que obtenerJson se resuelva, se recorre data con un foreach(), realizo una desestructuracion y se dibujan las cards en contenedor_cartas. 
async function obtenerProductos() {
	try {
		const data = await obtenerJson();
		data.forEach((producto) => {
			const { id, marca, precio, categoria, descripcion, img } = producto;
			contenedor_cartas.innerHTML += `
            <div class="col">
            <div class="card">
            <img src="${img}" class="card-img-top object-fit-contain p-4" alt="${marca}">
            <div class="card-body">
            <h5 class="card-title">${marca}</h5>
            <p class="card-text">Categoria: ${categoria}</p>
            <p class="card-text">${descripcion}</p>
            </div>
            <div class="d-flex justify-content-between align-items-center m-3">
            <span class="h6 mb-0 text-gray">$ ${precio}</span>
            <a onclick="agregarProducto('${id}')" class="btn btn-dark" href="#">
            <i class="bi-cart4 mr-2"></i> Añadir al carrito
            </a>
            </div>
            </div>
            </div>`;
		});
	} catch (error) {
		Swal.fire({
			icon:'error',
			title:'Lo siento',
			text:'Ha ocurrido un error:'
		})
	}
}

if(contenedor){
	obtenerProductos();
}


// Acá le damos la funcionalidad al botón de eliminar producto, donde el usuario al hacer click en el botón, se le muestra una alerta usando sweetalert para saber si el usuario confirma la eliminacion del producto o no, de confirmar la eliminación con un findindex() busco si el producto existe en el carrito, de hacerlo se lo elimina usando un splice, y se le muestra un toast de confirmacion al usuario. Luego llamando a almacenarstorage() y mostrarcarrito() actualizamos el estado del carrito tanto en el interfaz como en el localstorage. En caso de que el usuario no confirme la eliminacion del producto (presione cancelar en la primer alaerta de sweetalert) se cierra la alerta y puede seguir navegando.
const eliminarProducto = (id) => {
	Swal.fire({
		icon: 'question',
		title: 'Seguro desea eliminar el producto?',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
		confirmButtonText: 'Si, eliminar',
		cancelButtonText: 'Cancelar',
	}).then((resultado) => {
		if (resultado.isConfirmed) {
			const index = carrito.findIndex((producto) => producto.id === id);
			index !== -1 && carrito.splice(index, 1);
			almacenarStorage(carrito);
			mostrarCarrito();
			Swal.fire({
				icon: 'success',
				title: 'Producto ELiminado',
				text: 'El producto ha sido eliminado del carrito',
				position: 'bottom-left',
				showConfirmButton: false,
				timer: 2500,
				toast: true,
			});
		}
	});
};

// acá calculo el precio total relizando la suma de los productos que el usuario selecciono para que se agreguen al carrito y mostramos el precio total
const actualizarPrecio = (carrito) => {
	const precioFinal = document.querySelector('#precioTotal');
	const precioTotal = carrito.reduce(
		(acc, producto) => acc + producto.precio * producto.cantidad,
		0
	);
	precioFinal.innerHTML = `$ ${precioTotal}`;
};

// selecciono el modal del carrito con un querySelector y recorro el carrito con un foreach (desestructurando para extraer los valores) para dibujar las cards que se agregaran cada vez que un cliente desee agregar algun prdoucto al carrito. posteriormente defino la funcion para eliminar productos del carrito, sigo pasos similares a lo anterior para dibujar las cards de productos en el apartado tienda y darle funcion al boton de agregar carrito. Al final agrego a la estructura del modal con un
const mostrarCarrito = () => {
	const modalBody = document.querySelector('.modal .modal-body');
	modalBody.innerHTML = '';
	carrito.forEach((producto) => {
		const { id, marca, precio, descripcion, img, cantidad } = producto;
		modalBody.innerHTML += `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4 mx-auto">
                    <img src="${img}" class="img-fluid mx-auto rounded-start" alt="${marca}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${marca}</h5>
                        <p class="card-text">${descripcion}</p>
                        <p class="card-text">$ ${precio}</p>
                        <p class="card-text">cantidad: ${cantidad}</p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center m-3">
                        <a onclick="eliminarProducto('${id}')" class="btn btn-danger" href="#">
                            <span class="mr-2"></span> ELiminar Producto
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
	});
	actualizarPrecio(carrito);
};

let carrito = [];
if (localStorage.getItem('carrito')) {
	carrito = JSON.parse(localStorage.getItem('carrito')) || [];
	mostrarCarrito();
}

const almacenarStorage = (carrito) => {
	localStorage.setItem('carrito', JSON.stringify(carrito));
};

// acá con un evento le damos funcionalidad al botón comprar, para que cuando en el carrito no haya ningun producto muesstre el mensaje de que esta vacio y si el carrito tiene productos que nos envie a la página comprar.html.
const modalBody = document.querySelector('.modal-body');
const finalizarCompra = document.querySelector('#Comprar');
finalizarCompra.addEventListener('click', () => {
	if (carrito.length === 0) {
		modalBody.innerHTML = '<p>El carrito está vacío. Agregue un producto para continuar.</p>';
	} else {
        location.href= "comprar.html"
    }
// ahora borramos el contenido del modal del carrito luego de que el usuario preione en comprar y se lo redireccione a comprar.html
	carrito = [];
	actualizarPrecio(carrito);
	mostrarCarrito (carrito);
});