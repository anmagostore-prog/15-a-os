// =====================================================
// formulario.js - LÓGICA DEL FORMULARIO
// =====================================================

// =====================================================
// 1. VARIABLES GLOBALES
// =====================================================
let invitadosRegistrados = [];

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
        
        // ✅ LÍMITE ACTUALIZADO: MÁXIMO 4 PERSONAS
        if (cantidad > 4) {
            alert('⚠️ Máximo 4 personas por grupo familiar');
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
            
            invitados.push({
                nombre: nombre,
                telefono: telefono,
                lider: nombreLider,
                telefonoLider: telefonoLider,
                fechaRegistro: new Date().toISOString()
            });
        }
        
        if (hayError) return;
        
        // ✅ VERIFICAR QUE NO HAYA MÁS DE 4 PERSONAS
        if (invitados.length > 4) {
            mostrarMensaje('error', '⚠️ El grupo no puede tener más de 4 personas');
            return;
        }
        
        // Mostrar mensaje de "Guardando..."
        mostrarMensaje('info', '⏳ Guardando datos en la nube...');
        
        try {
            // Guardar en Firebase usando la función global
            const resultado = await guardarMultiplesInvitados(invitados);
            
            if (resultado.success) {
                // Éxito
                mostrarMensaje('exito', `
                    ✅ ¡${resultado.guardados} de ${resultado.total} invitados registrados!
                    <br>
                    <small>Los datos se guardaron en Firebase correctamente</small>
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
    
    // También guardar con Enter
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'INPUT') {
            guardarInvitados();
        }
    });
});

// =====================================================
// 4. FUNCIONES DE AYUDA
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
console.log('👥 Límite: 4 personas por grupo familiar');
