// Carrito de compras
let carrito = [];

// Productos disponibles con su stock
const productos = {
    1: { nombre: "Camiseta", precio: 19.99, stock: 5 },
    2: { nombre: "Pantalón", precio: 39.99, stock: 3 },
    3: { nombre: "Zapatos", precio: 49.99, stock: 2 }
};

// Mostrar/ocultar carrito
function mostrarCarrito() {
    const carritoCompras = document.getElementById('carrito-compras');
    if (carritoCompras.style.display === 'block') {
        carritoCompras.style.display = 'none';
    } else {
        carritoCompras.style.display = 'block';
        actualizarVistaCarrito();
    }
}

// Añadir producto al carrito
function añadirAlCarrito(id, nombre, precio) {
    const stockDisponible = productos[id].stock;
    const productoEnCarrito = carrito.find(item => item.id === id);
    
    // Verificar stock disponible
    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad >= stockDisponible) {
            Swal.fire({
                title: 'Stock insuficiente',
                text: `No hay suficiente stock de ${nombre}. Solo quedan ${stockDisponible} unidades.`,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }
    
    // Actualizar vista y contador
    actualizarContadorCarrito();
    actualizarVistaCarrito();
    
    // Mostrar mensaje de éxito
    Swal.fire({
        title: '¡Producto añadido!',
        text: `${nombre} se ha añadido a tu carrito`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        carrito.splice(index, 1);
        actualizarContadorCarrito();
        actualizarVistaCarrito();
    }
}

// Actualizar cantidad de producto en carrito
function actualizarCantidad(id, nuevaCantidad) {
    const producto = carrito.find(item => item.id === id);
    const stockDisponible = productos[id].stock;
    
    if (producto && nuevaCantidad > 0 && nuevaCantidad <= stockDisponible) {
        producto.cantidad = nuevaCantidad;
        actualizarVistaCarrito();
    } else if (nuevaCantidad > stockDisponible) {
        Swal.fire({
            title: 'Stock insuficiente',
            text: `No puedes añadir más de ${stockDisponible} unidades de este producto.`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.getElementById('contador-carrito').textContent = totalItems;
}

// Actualizar vista del carrito
function actualizarVistaCarrito() {
    const itemsCarrito = document.getElementById('items-carrito');
    itemsCarrito.innerHTML = '';
    
    if (carrito.length === 0) {
        itemsCarrito.innerHTML = '<p>Tu carrito está vacío</p>';
        return;
    }
    
    carrito.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-carrito';
        itemElement.innerHTML = `
            <div class="item-carrito-info">
                <h4>${item.nombre}</h4>
                <p>$${item.precio.toFixed(2)} x ${item.cantidad}</p>
            </div>
            <div class="item-carrito-acciones">
                <input type="number" min="1" max="${productos[item.id].stock}" 
                       value="${item.cantidad}" 
                       onchange="actualizarCantidad(${item.id}, parseInt(this.value))">
                <button onclick="eliminarDelCarrito(${item.id})">🗑️</button>
            </div>
        `;
        itemsCarrito.appendChild(itemElement);
    });
}

// Calcular total del carrito
function calcularTotal() {
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'No hay productos en tu carrito para calcular el total',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    Swal.fire({
        title: 'Total de tu compra',
        html: `
            <p>Productos en carrito: ${carrito.reduce((sum, item) => sum + item.cantidad, 0)}</p>
            <p><strong>Total a pagar: $${total.toFixed(2)}</strong></p>
        `,
        icon: 'info',
        confirmButtonText: 'Aceptar'
    });
}

// Vaciar carrito
function vaciarCarrito() {
    carrito = [];
    actualizarContadorCarrito();
    actualizarVistaCarrito();
    
    Swal.fire({
        title: 'Carrito vaciado',
        text: 'Todos los productos han sido eliminados de tu carrito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
}

// Validación del formulario de registro (se mantiene igual)
function validarRegistro(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor ingresa un correo electrónico válido',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    
    // Validar contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        Swal.fire({
            title: 'Contraseña débil',
            text: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    
    // Si todo está correcto
    Swal.fire({
        title: '¡Registro exitoso!',
        text: `Bienvenido ${nombre}, tu cuenta ha sido creada correctamente`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        // Limpiar formulario
        document.getElementById('formulario-registro').reset();
    });
}
