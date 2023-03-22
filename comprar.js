// Acá selecciono contenedor_compras de la página comprar.html. traigo del localstorage lo que se encuentra en el carrtio y lo dibujo en el contenedor.
const contenedorCompras= document.getElementById ('contenedor_compras')

const obtenerStorage=()=>{
    const productoEnLS= localStorage.getItem('carrito')
    if(productoEnLS){
        const carrito= JSON.parse(productoEnLS)
        let listaProductos = '';
		carrito.forEach(function (producto) {
			const { marca, precio, cantidad, descripcion, img } = producto;
			listaProductos += `
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${img}" class="img-fluid rounded-start" alt="${marca}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${marca}</h5>
                            <p class="card-text">${descripcion}</p>
                            <p class="card-text">Precio: $${precio}</p>
                            <p class="card-text">Cantidad: ${cantidad}</p>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        contenedorCompras.innerHTML= listaProductos;
        return listaProductos;
    }
}

obtenerStorage()

const precioPagComprar =(carrito) =>{
    const precioFinalCompra= document.getElementById ('precioFinal')
    precioFinalCompra.innerHTML= carrito.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
);
}
precioPagComprar(carrito)


// Acá le doy funcionalidad al botón finalizar commpra para que al apretarlo muestre dos alerts, una preguntando si desea finalizar la compra y la otra confirmando la compra en caso de que el usuario presione en el boton para continuar.
const FinalizarCompraBtn= document.getElementById('finalizarCompra');
FinalizarCompraBtn.addEventListener ('click',()=>{
    formularioCompra()
    Swal.fire({
        icon: 'question',
        title: '¿Seguro que desea finalizar su compra?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, finalizar compra',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
        Swal.fire({
            icon: 'success',
            title:'¡Gracias por su compra!',
            text:'Su compra ha sido procesada correctamente',
        })
        }
    })
// ahora borramos el contenido del carrito luego de que el usuario realice la compra
	carrito = [];
    obtenerStorage(carrito)
	almacenarStorage(carrito);
	precioPagComprar(carrito);
});




