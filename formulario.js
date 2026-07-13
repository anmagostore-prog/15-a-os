// =====================================================
// formulario.js - LÓGICA DEL FORMULARIO (CORREGIDO)
// =====================================================

// =====================================================
// 1. GENERAR CAMPOS DINÁMICOS (SOLO ACOMPAÑANTES)
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const cantidadInput = document.getElementById('cantidad');
    const contenedor = document.getElementById('contenedor-invitados');
    
    // Función para generar los campos de acompañantes
    function generarCamposInvitados(cantidad) {
        // Limpiar el contenedor
        contenedor.innerHTML = '';
        
        // Validar que la cantidad sea un número válido
        if (isNaN(cantidad) || cantidad < 1) {
            cantidad = 1;
        }
        
        // ✅ LÍMITE: MÁXIMO 4 PERSONAS (1 LÍDER + 3 ACOMPAÑANTES)
        if (cantidad > 4) {
            alert('⚠️ Máximo 4 personas por grupo familiar (1 líder + 3 acompañantes)');
            cantidad = 4;
            cantidadInput.value = 4;
        }
        
        // ✅ EL LÍDER YA SE REGISTRÓ ARRIBA
        // SOLO GENERAMOS CAMPOS PARA LOS ACOMPAÑANTES (del 2 al 4)
        const numAcompanantes = cantidad - 1;
        
        if (numAcompanantes === 0) {
            // Si solo va el líder, mostrar mensaje
            contenedor.innerHTML = `
                <div class="mensaje-info" style="
                    background: #F3E8FF; 
                    padding: 20px; 
                    border-radius: 12px; 
                    text-align: center;
                    color: #7C3AED;
                    font-size: 1.1rem;
                ">
                    💫 Solo asistirá el líder. No hay acompañantes.
                </div>
            `;
            return;
        }
        
        // Generar campos para cada ACOMPAÑANTE
        for (let i = 1; i <= numAcompanantes; i++) {
            // El índice real del invitado es i + 1 (porque el 1 es el líder)
            const idx = i + 1;
            
            // Crear contenedor para cada acompañante
            const invitadoDiv = document.createElement('div');
            invitadoDiv.className = 'invitado-card';
            
            invitadoDiv.innerHTML = `
                <h4 class="invitado-titulo">👤 Acompañante ${i}</h4>
                
                <div class="campo-formulario">
                    <label for="nombre${idx}">Nombre completo del acompañante ${i}:</label>
                    <input 
                        type="text" 
                        id="nombre${idx}" 
                        name="nombre${idx}" 
                        placeholder="Ej: María Pérez"
                        required
                    >
                </div>
                
                <div class="campo-formulario">
                    <label for="telefono${idx}">Teléfono del acompañante ${i}:</label>
                    <input 
                        type="tel" 
                        id="telefono${idx}" 
                        name="telefono${idx}" 
                        placeholder="Ej: 3219876543"
                        required
                    >
                    <span class="campo-ayuda">📌 Número de contacto del acompañante</span>
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
    
    // Generar campos iniciales (con 1 = solo líder, sin acompañantes)
    generarCamposInvitados(1);
});

// =====================================================
// 2. VALIDACIÓN Y GUARDADO
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
            mostrarMensaje('error', '⚠️ Por favor, ingresa un teléfono válido para el líder (mínimo 7 dígitos)');
            document.getElementById('telefonoLider').focus();
            return;
        }
        
        // ✅ RECOLECTAR DATOS: PRIMERO EL LÍDER
        const invitados = [];
        
        // 1. Agregar al líder
        invitados.push({
            nombre: nombreLider,
            telefono: telefonoLider,
            lider: nombreLider,
            telefonoLider: telefonoLider,
            tipo: 'líder',
            fechaRegistro: new Date().toISOString()
        });
        
        // 2. Agregar a los acompañantes
        const numAcompanantes = cantidad - 1;
        let hayError = false;
        
        for (let i = 1; i <= numAcompanantes; i++) {
            const idx = i + 1; // El índice real del acompañante
            const nombre = document.getElementById(`nombre${idx}`).value.trim();
            const telefono = document.getElementById(`telefono${idx}`).value.trim();
            
            if (!nombre) {
                mostrarMensaje('error', `⚠️ Por favor, ingresa el nombre del acompañante ${i}`);
                document.getElementById(`nombre${idx}`).focus();
                hayError = true;
                break;
            }
            
            if (!telefono || telefono.length < 7) {
                mostrarMensaje('error', `⚠️ Por favor, ingresa un teléfono válido para el acompañante ${i} (mínimo 7 dígitos)`);
                document.getElementById(`telefono${idx}`).focus();
                hayError = true;
                break;
            }
            
            invitados.push({
                nombre: nombre,
                telefono: telefono,
                lider: nombreLider,
                telefonoLider: telefonoLider,
                tipo: 'acompañante',
                fechaRegistro: new Date().toISOString()
            });
        }
        
        if (hayError) return;
        
        // ✅ VERIFICAR QUE NO HAYA MÁS DE 4 PERSONAS (1 LÍDER + 3 ACOMPAÑANTES)
        if (invitados.length > 4) {
            mostrarMensaje('error', '⚠️ El grupo no puede tener más de 4 personas (1 líder + 3 acompañantes)');
            return;
        }
        
        // Mostrar mensaje de "Guardando..."
        mostrarMensaje('info', '⏳ Guardando datos en la nube...');
        
        try {
            // Verificar que la función global existe
            if (typeof guardarMultiplesInvitados !== 'function') {
                throw new Error('Firebase no está configurado correctamente');
            }
            
            // Guardar en Firebase
            const resultado = await guardarMultiplesInvitados(invitados);
            
            if (resultado.success) {
                // Éxito
                mostrarMensaje('exito', `
                    ✅ ¡${resultado.guardados} de ${resultado.total} invitados registrados!
                    <br>
                    <small>👑 Líder: ${nombreLider} | 👥 Acompañantes: ${numAcompanantes}</small>
                `);
                
                // Limpiar formulario
                document.getElementById('formulario-invitados').reset();
                document.getElementById('cantidad').value = 1;
                document.getElementById('cantidad').dispatchEvent(new Event('change'));
                
            } else {
                // Algunos errores
                mostrarMensaje('error', `
                    ⚠️ Se guardaron ${resultado.guardados} de ${resultado.total} invitados
                    <br>
                    <small>Errores: ${resultado.errores.join(', ')}</small>
                `);
            }
            
        } catch (error) {
            console.error('❌ Error al guardar:', error);
            mostrarMensaje('error', '❌ Error al guardar los datos. Revisa la conexión a Firebase.');
        }
    }
    
    // Evento del botón guardar
    btnGuardar.addEventListener('click', guardarInvitados);
});

// =====================================================
// 3. FUNCIONES DE AYUDA
// =====================================================
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
console.log('👑 Líder + máximo 3 acompañantes = 4 personas por grupo');
console.log('✅ Sin redundancia - el líder se pide una sola vez');
