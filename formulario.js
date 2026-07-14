// =====================================================
// formulario.js - VERSIÓN DEFINITIVA (CON WINDOW)
// =====================================================

// =====================================================
// 1. GENERAR CAMPOS DINÁMICOS (SOLO ACOMPAÑANTES)
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
// 2. VALIDACIÓN EN TIEMPO REAL DEL TELÉFONO
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const telefonoInput = document.getElementById('telefonoLider');
    const validacionDiv = document.getElementById('validacion-lider');
    
    // ✅ INICIALIZAR VARIABLES GLOBALES
    window.telefonoVerificado = false;
    window.telefonoRegistrado = false;
    window.telefonoActual = '';

    telefonoInput.addEventListener('input', async function() {
        const telefono = this.value.trim();
        window.telefonoActual = telefono;
        
        // Validar formato (mínimo 7 dígitos)
        if (telefono.length < 7) {
            validacionDiv.innerHTML = `
                <span style="color: #F59E0B;">⏳ Ingresa al menos 7 dígitos...</span>
            `;
            window.telefonoVerificado = false;
            window.telefonoRegistrado = false;
            return;
        }

        // Verificar en Firebase si ya existe
        try {
            validacionDiv.innerHTML = `
                <span style="color: #60A5FA;">⏳ Verificando teléfono...</span>
            `;

            const querySnapshot = await window.db.collection('grupos')
                .where('telefonoLider', '==', telefono)
                .get();

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
            }
        } catch (error) {
            console.error('❌ Error al verificar:', error);
            validacionDiv.innerHTML = `
                <span style="color: #EF4444;">❌ Error al verificar. Intenta nuevamente.</span>
            `;
            window.telefonoVerificado = false;
            window.telefonoRegistrado = false;
        }
    });
});

// =====================================================
// 3. GUARDAR EN FIREBASE
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const btnGuardar = document.getElementById('btn-guardar');
    const mensajesDiv = document.getElementById('mensajes');
    
    function mostrarMensaje(tipo, texto) {
        mensajesDiv.innerHTML = `
            <div class="mensaje ${tipo}">
                ${texto}
            </div>
        `;
        
        setTimeout(() => {
            mensajesDiv.innerHTML = '';
        }, 6000);
    }
    
    async function guardarInvitados() {
        // 🔥 Verificar Firebase
        if (typeof window.db === 'undefined') {
            mostrarMensaje('error', '❌ Firebase no está disponible.');
            return;
        }

        // Obtener datos del líder
        const nombreLider = document.getElementById('nombreLider').value.trim();
        const telefonoLider = document.getElementById('telefonoLider').value.trim();
        const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
        
        // ✅ VALIDACIÓN DEL TELÉFONO
        if (!telefonoLider || telefonoLider.length < 7) {
            mostrarMensaje('error', '⚠️ El teléfono debe tener al menos 7 dígitos');
            document.getElementById('telefonoLider').focus();
            return;
        }

        // 🔥 VALIDACIÓN EN TIEMPO REAL (USANDO window.)
        if (window.telefonoRegistrado) {
            mostrarMensaje('error', '⚠️ Este teléfono ya está registrado. Usa otro número.');
            document.getElementById('telefonoLider').focus();
            return;
        }

        if (!window.telefonoVerificado) {
            mostrarMensaje('error', '⚠️ Verifica el teléfono antes de guardar (espera a que aparezca "✅ Teléfono disponible")');
            document.getElementById('telefonoLider').focus();
            return;
        }
        
        // ✅ Validar que el teléfono actual coincida con el verificado
        if (telefonoLider !== window.telefonoActual) {
            mostrarMensaje('error', '⚠️ El teléfono ha cambiado. Verifica nuevamente.');
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
            console.error('❌ Error:', error);
            mostrarMensaje('error', `❌ Error al guardar: ${error.message}`);
        }
    }
    
    btnGuardar.addEventListener('click', guardarInvitados);
});

// =====================================================
// 4. LIMPIAR FORMULARIO
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
console.log('✅ Validación de teléfono en tiempo real (con window.)');
console.log('✅ Líder + acompañantes con parentesco');
