// =====================================================
// formulario.js - VERSIÓN CON MEJOR MANEJO DE ERRORES
// =====================================================

// =====================================================
// 1. VERIFICAR CONEXIÓN A FIREBASE AL CARGAR
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Iniciando formulario...');
    
    // Verificar Firebase
    if (typeof window.db === 'undefined') {
        console.error('❌ Firebase no está disponible');
        mostrarErrorGlobal('⚠️ Error de conexión: Firebase no está disponible. Recarga la página.');
        return;
    }

    // Verificar conexión
    window.db.collection('grupos').where('telefonoLider', '==', '__test__').limit(1).get()
        .then(() => {
            console.log('✅ Conexión a Firebase exitosa');
            document.getElementById('mensajes').innerHTML = '';
        })
        .catch(error => {
            console.error('❌ Error de conexión a Firestore:', error);
            mostrarErrorGlobal('⚠️ No se pudo conectar a la base de datos. Verifica tu conexión a internet.');
        });
});

// =====================================================
// 2. FUNCIÓN PARA MOSTRAR ERRORES GLOBALES
// =====================================================
function mostrarErrorGlobal(mensaje) {
    const mensajesDiv = document.getElementById('mensajes');
    if (mensajesDiv) {
        mensajesDiv.innerHTML = `
            <div class="mensaje error" style="background: #FEE2E2; border: 2px solid #EF4444; padding: 15px; border-radius: 10px; color: #991B1B;">
                <strong>⚠️ ${mensaje}</strong>
            </div>
        `;
    }
}

// =====================================================
// 3. GENERAR CAMPOS DINÁMICOS (SOLO ACOMPAÑANTES)
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const cantidadInput = document.getElementById('cantidad');
    const contenedor = document.getElementById('contenedor-invitados');
    
    function generarCamposInvitados(cantidad) {
        contenedor.innerHTML = '';
        
        if (isNaN(cantidad) || cantidad < 0) {
            cantidad = 0;
        }
        
        if (cantidad > 3) {
            alert('⚠️ Máximo 3 acompañantes por grupo');
            cantidad = 3;
            cantidadInput.value = 3;
        }
        
        if (cantidad === 0) {
            contenedor.innerHTML = `
                <div style="background: #F3E8FF; padding: 20px; border-radius: 12px; text-align: center; color: #7C3AED; font-size: 1.1rem;">
                    💫 No hay acompañantes. Solo asistirá el líder.
                </div>
            `;
            return;
        }
        
        for (let i = 1; i <= cantidad; i++) {
            const invitadoDiv = document.createElement('div');
            invitadoDiv.className = 'invitado-card';
            
            invitadoDiv.innerHTML = `
                <h4 class="invitado-titulo">👤 Acompañante ${i}</h4>
                
                <div class="campo-formulario">
                    <label for="nombre_acompanante_${i}">Nombre completo del acompañante ${i}:</label>
                    <input 
                        type="text" 
                        id="nombre_acompanante_${i}" 
                        name="nombre_acompanante_${i}" 
                        placeholder="Ej: María Pérez"
                        required
                    >
                </div>
                
                <div class="campo-formulario">
                    <label for="parentesco_${i}">Parentesco con el líder:</label>
                    <select id="parentesco_${i}" name="parentesco_${i}" required>
                        <option value="">Selecciona...</option>
                        <option value="Esposo/Esposa">Esposo/Esposa</option>
                        <option value="Hijo/Hija">Hijo/Hija</option>
                        <option value="Hermano/Hermana">Hermano/Hermana</option>
                        <option value="Padre/Madre">Padre/Madre</option>
                        <option value="Abuelo/Abuela">Abuelo/Abuela</option>
                        <option value="Tío/Tía">Tío/Tía</option>
                        <option value="Primo/Prima">Primo/Prima</option>
                        <option value="Sobrino/Sobrina">Sobrino/Sobrina</option>
                        <option value="Amigo/Amiga">Amigo/Amiga</option>
                        <option value="Otro">Otro</option>
                    </select>
                    <span class="campo-ayuda">📌 Relación con el líder del grupo</span>
                </div>
            `;
            
            contenedor.appendChild(invitadoDiv);
        }
    }
    
    cantidadInput.addEventListener('change', function() {
        const cantidad = parseInt(this.value) || 0;
        generarCamposInvitados(cantidad);
    });
    
    cantidadInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const cantidad = parseInt(this.value) || 0;
            generarCamposInvitados(cantidad);
        }
    });
    
    generarCamposInvitados(0);
});

// =====================================================
// 4. VALIDACIÓN EN TIEMPO REAL DEL TELÉFONO (MEJORADA)
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const telefonoInput = document.getElementById('telefonoLider');
    const validacionDiv = document.getElementById('validacion-lider');
    
    // ✅ INICIALIZAR VARIABLES GLOBALES
    window.telefonoVerificado = false;
    window.telefonoRegistrado = false;
    window.telefonoActual = '';

    // Función para verificar teléfono
    async function verificarTelefono(telefono) {
        try {
            if (!window.db) {
                throw new Error('Firebase no disponible');
            }

            validacionDiv.innerHTML = `
                <span style="color: #60A5FA;">⏳ Verificando teléfono...</span>
            `;

            // Limpiar el teléfono (solo números)
            const telefonoLimpio = telefono.replace(/\D/g, '');
            
            if (telefonoLimpio.length < 7) {
                validacionDiv.innerHTML = `
                    <span style="color: #F59E0B;">⏳ Ingresa al menos 7 dígitos...</span>
                `;
                window.telefonoVerificado = false;
                window.telefonoRegistrado = false;
                return;
            }

            console.log(`🔍 Verificando teléfono: ${telefonoLimpio}`);

            const querySnapshot = await window.db.collection('grupos')
    .where('telefonoLider', '==', telefonoLimpio)
    .limit(1)
    .get();

            console.log(`📊 Resultado: ${querySnapshot.empty ? 'No existe' : 'Ya registrado'}`);

            if (!querySnapshot.empty) {
                validacionDiv.innerHTML = `
                    <span style="color: #EF4444;">❌ Este número ya está registrado</span>
                `;
                window.telefonoVerificado = false;
                window.telefonoRegistrado = true;
            } else {
                validacionDiv.innerHTML = `
                    <span style="color: #10B981;">✅ Teléfono disponible</span>
                `;
                window.telefonoVerificado = true;
                window.telefonoRegistrado = false;
                window.telefonoActual = telefonoLimpio;
            }
        } catch (error) {
            console.error('❌ Error al verificar teléfono:', error);
            validacionDiv.innerHTML = `
                <span style="color: #EF4444;">❌ Error al verificar. Intenta nuevamente.</span>
                <br>
                <small style="color: #6B7280;">${error.message}</small>
            `;
            window.telefonoVerificado = false;
            window.telefonoRegistrado = false;
        }
    }

    // Evento con debounce para evitar muchas llamadas
    let timeoutId;
    telefonoInput.addEventListener('input', function() {
        const telefono = this.value.trim();
        window.telefonoActual = telefono;
        
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            verificarTelefono(telefono);
        }, 500);
    });
});

// =====================================================
// 5. GUARDAR EN FIREBASE (MEJORADO)
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const btnGuardar = document.getElementById('btn-guardar');
    const mensajesDiv = document.getElementById('mensajes');
    
    function mostrarMensaje(tipo, texto) {
        mensajesDiv.innerHTML = `
            <div class="mensaje ${tipo}" style="padding: 15px; border-radius: 10px; margin: 10px 0; ${tipo === 'error' ? 'background: #FEE2E2; border: 2px solid #EF4444; color: #991B1B;' : tipo === 'exito' ? 'background: #D1FAE5; border: 2px solid #10B981; color: #065F46;' : 'background: #DBEAFE; border: 2px solid #3B82F6; color: #1E3A8A;'}">
                ${texto}
            </div>
        `;
        
        setTimeout(() => {
            mensajesDiv.innerHTML = '';
        }, 8000);
    }
    
    async function guardarInvitados() {
        // 🔥 Verificar Firebase
        if (typeof window.db === 'undefined') {
            mostrarMensaje('error', '❌ Firebase no está disponible. Recarga la página.');
            return;
        }

        // Verificar conexión primero
        try {
            await window.db.collection('grupos').where('telefonoLider', '==', '__test__').limit(1).get();
        } catch (error) {
            console.error('❌ Error de conexión:', error);
            mostrarMensaje('error', '❌ No se puede conectar a la base de datos. Verifica tu conexión a internet.');
            return;
        }

        // Obtener datos del líder
        const nombreLider = document.getElementById('nombreLider').value.trim();
        let telefonoLider = document.getElementById('telefonoLider').value.trim();
        const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
        
        // Limpiar teléfono (solo números)
        telefonoLider = telefonoLider.replace(/\D/g, '');
        
        // ✅ VALIDACIÓN DEL TELÉFONO
        if (!telefonoLider || telefonoLider.length < 7) {
            mostrarMensaje('error', '⚠️ El teléfono debe tener al menos 7 dígitos');
            document.getElementById('telefonoLider').focus();
            return;
        }

        // 🔥 VALIDACIÓN EN TIEMPO REAL
        if (window.telefonoRegistrado) {
            mostrarMensaje('error', '⚠️ Este teléfono ya está registrado. Usa otro número.');
            document.getElementById('telefonoLider').focus();
            return;
        }

        if (!window.telefonoVerificado) {
            mostrarMensaje('error', '⚠️ Verifica el teléfono antes de guardar');
            document.getElementById('telefonoLider').focus();
            return;
        }
        
        // Validar líder
        if (!nombreLider) {
            mostrarMensaje('error', '⚠️ Ingresa el nombre del líder');
            document.getElementById('nombreLider').focus();
            return;
        }
        
        // Recolectar acompañantes
        const acompanantes = [];
        let hayError = false;
        
        for (let i = 1; i <= cantidad; i++) {
            const nombre = document.getElementById(`nombre_acompanante_${i}`).value.trim();
            const parentesco = document.getElementById(`parentesco_${i}`).value;
            
            if (!nombre) {
                mostrarMensaje('error', `⚠️ Ingresa el nombre del acompañante ${i}`);
                document.getElementById(`nombre_acompanante_${i}`).focus();
                hayError = true;
                break;
            }
            
            if (!parentesco) {
                mostrarMensaje('error', `⚠️ Selecciona el parentesco del acompañante ${i}`);
                document.getElementById(`parentesco_${i}`).focus();
                hayError = true;
                break;
            }
            
            acompanantes.push({
                nombre: nombre,
                parentesco: parentesco
            });
        }
        
        if (hayError) return;
        
        // Guardar en Firebase
        mostrarMensaje('info', '⏳ Guardando datos en la nube...');
        
        try {
            const grupoData = {
                lider: nombreLider,
                telefonoLider: telefonoLider,
                acompanantes: acompanantes,
                totalPersonas: 1 + acompanantes.length,
                fechaRegistro: new Date().toISOString()
            };

            console.log('📊 Datos a guardar:', grupoData);

            const docRef = await window.db.collection('grupos').add(grupoData);
            
            console.log('✅ Documento guardado con ID:', docRef.id);
            
            mostrarMensaje('exito', `
                ✅ ¡Grupo familiar registrado exitosamente!
                <br>
                <small>👑 Líder: ${nombreLider} | 👥 Acompañantes: ${acompanantes.length}</small>
                <br>
                <small>📁 ID: ${docRef.id}</small>
            `);
            
            // Limpiar formulario
            document.getElementById('formulario-invitados').reset();
            document.getElementById('cantidad').value = 0;
            document.getElementById('cantidad').dispatchEvent(new Event('change'));
            document.getElementById('validacion-lider').innerHTML = '';
            
            // ✅ RESETEAR VARIABLES GLOBALES
            window.telefonoVerificado = false;
            window.telefonoRegistrado = false;
            window.telefonoActual = '';
            
        } catch (error) {
            console.error('❌ Error al guardar:', error);
            mostrarMensaje('error', `❌ Error al guardar: ${error.message}`);
        }
    }
    
    btnGuardar.addEventListener('click', guardarInvitados);
});

// =====================================================
// 6. LIMPIAR FORMULARIO
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const btnLimpiar = document.getElementById('btn-limpiar');
    
    btnLimpiar.addEventListener('click', function() {
        if (confirm('¿Limpiar el formulario?')) {
            document.getElementById('formulario-invitados').reset();
            document.getElementById('cantidad').value = 0;
            document.getElementById('cantidad').dispatchEvent(new Event('change'));
            document.getElementById('validacion-lider').innerHTML = '';
            document.getElementById('mensajes').innerHTML = '';
            
            // ✅ RESETEAR VARIABLES GLOBALES
            window.telefonoVerificado = false;
            window.telefonoRegistrado = false;
            window.telefonoActual = '';
        }
    });
});

console.log('📝 Formulario cargado correctamente');
console.log('✅ Validación de teléfono en tiempo real (con debounce)');
console.log('✅ Manejo de errores mejorado');
console.log('👑 1 líder + máximo 3 acompañantes = 4 personas');
