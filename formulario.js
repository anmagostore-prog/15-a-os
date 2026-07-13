// =====================================================
// formulario.js - LÓGICA DEL FORMULARIO
// =====================================================

// =====================================================
// 1. VARIABLES GLOBALES
// =====================================================
let invitadosRegistrados = []; // Para controlar duplicados

// =====================================================
// 2. GENERAR CAMPOS DINÁMICOS
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const cantidadInput = document.getElementById('cantidad');
    const contenedor = document.getElementById('contenedor-invitados');
    
    // Función para generar los campos de invitados
    function generarCamposInvitados(cantidad) {
        // Limpiar el contenedor
        contenedor.innerHTML = '';
        
        // Validar que la cantidad sea un número válido
        if (isNaN(cantidad) || cantidad < 1) {
            cantidad = 1;
        }
        
        if (cantidad > 4) {
            alert('⚠️ Máximo 20 personas por grupo');
            cantidad = 4;
            cantidadInput.value = 4;
        }
        
        // Generar campos para cada invitado
        for (let i = 1; i <= cantidad; i++) {
            // Crear contenedor para cada invitado
            const invitadoDiv = document.createElement('div');
            invitadoDiv.className = 'invitado-card';
            
            // Si es el primer invitado, asumimos que es el líder
            const esLider = (i === 1);
            const titulo = esLider ? '👑 Líder del Grupo' : `👤 Invitado ${i}`;
            
            invitadoDiv.innerHTML = `
                <h4 class="invitado-titulo">${titulo}</h4>
                
                <div class="campo-formulario">
                    <label for="nombre${i}">Nombre completo:</label>
                    <input 
                        type="text" 
                        id="nombre${i}" 
                        name="nombre${i}" 
                        placeholder="Ej: ${esLider ? 'Carlos Gómez' : 'María Pérez'}"
                        required
                    >
                </div>
                
                <div class="campo-formulario">
                    <label for="telefono${i}">Teléfono:</label>
                    <input 
                        type="tel" 
                        id="telefono${i}" 
                        name="telefono${i}" 
                        placeholder="Ej: ${esLider ? '3101234567' : '3219876543'}"
                        required
                    >
                    <span class="campo-ayuda">📌 Número de contacto del invitado</span>
                </div>
            `;
            
            contenedor.appendChild(invitadoDiv);
        }
    }
    
    // Escuchar cambios en la cantidad
    cantidadInput.addEventListener('change', function() {
        const cantidad = parseInt(this.value) || 1;
        generarCamposInvitados(cantidad);
    });
    
    // Escuchar cuando se presiona Enter en el campo cantidad
    cantidadInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const cantidad = parseInt(this.value) || 1;
            generarCamposInvitados(cantidad);
        }
    });
    
    // Generar campos iniciales (con 1 invitado = líder)
    generarCamposInvitados(1);
});

// =====================================================
// 3. VALIDACIÓN Y GUARDADO
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const btnGuardar = document.getElementById('btn-guardar');
    const mensajesDiv = document.getElementById('mensajes');
    
    // Función para mostrar mensajes
    function mostrarMensaje(tipo, texto) {
        mensajesDiv.innerHTML = `
            <div class="mensaje ${tipo}">
                ${texto}
            </div>
        `;
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            mensajesDiv.innerHTML = '';
        }, 5000);
    }
    
    // Función principal para guardar
    async function guardarInvitados() {
        // Obtener datos del líder
        const nombreLider = document.getElementById('nombreLider').value.trim();
        const telefonoLider = document.getElementById('telefonoLider').value.trim();
        const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
        
        // Validar datos del líder
        if (!nombreLider) {
            mostrarMensaje('error', '⚠️ Por favor, ingresa el nombre del líder');
            document.getElementById('nombreLider').focus();
            return;
        }
        
        if (!telefonoLider || telefonoLider.length < 7) {
            mostrarMensaje('error', '⚠️ Por favor, ingresa un teléfono válido para el líder');
            document.getElementById('telefonoLider').focus();
            return;
        }
        
        // Recolectar datos de los invitados
        const invitados = [];
        let hayError = false;
        
        for (let i = 1; i <= cantidad; i++) {
            const nombre = document.getElementById(`nombre${i}`).value.trim();
            const telefono = document.getElementById(`telefono${i}`).value.trim();
            
            if (!nombre) {
                mostrarMensaje('error', `⚠️ Por favor, ingresa el nombre del invitado ${i}`);
                document.getElementById(`nombre${i}`).focus();
                hayError = true;
                break;
            }
            
            if (!telefono || telefono.length < 7) {
                mostrarMensaje('error', `⚠️ Por favor, ingresa un teléfono válido para el invitado ${i}`);
                document.getElementById(`telefono${i}`).focus();
                hayError = true;
                break;
            }
            
            // Verificar si el teléfono ya está registrado (solo en Firebase)
            // Por ahora, solo recolectamos los datos
            invitados.push({
                nombre: nombre,
                telefono: telefono,
                lider: nombreLider,
                telefonoLider: telefonoLider,
                fechaRegistro: new Date().toISOString()
            });
        }
        
        if (hayError) return;
        
        // Si no hay errores, mostrar los datos (por ahora)
        console.log('✅ Datos a guardar:', invitados);
        
        // ============================================ -->
        // AQUÍ CONECTAREMOS CON FIREBASE              -->
        // Por ahora, solo mostramos los datos          -->
        // ============================================ -->
        
        // Mostrar mensaje de éxito (temporal)
        mostrarMensaje('exito', `
            ✅ ¡Datos guardados exitosamente!
            <br>
            <small>Se registraron ${invitados.length} invitados</small>
        `);
        
        // Limpiar el formulario después de guardar (opcional)
        // document.getElementById('formulario-invitados').reset();
    }
    
    // Evento del botón guardar
    btnGuardar.addEventListener('click', guardarInvitados);
    
    // También guardar con Enter (solo si no estamos en un campo de texto)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'INPUT') {
            guardarInvitados();
        }
    });
});

// =====================================================
// 4. FUNCIONES DE AYUDA
// =====================================================

// Función para limpiar el formulario
document.addEventListener('DOMContentLoaded', function() {
    const btnLimpiar = document.getElementById('btn-limpiar');
    
    btnLimpiar.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres limpiar el formulario?')) {
            document.getElementById('formulario-invitados').reset();
            // Regenerar campos de invitados (con 1)
            const cantidadInput = document.getElementById('cantidad');
            cantidadInput.value = 1;
            cantidadInput.dispatchEvent(new Event('change'));
            document.getElementById('mensajes').innerHTML = '';
        }
    });
});

console.log('📝 Formulario cargado correctamente');
console.log('💡 Recuerda: Próximamente conectaremos con Firebase');
