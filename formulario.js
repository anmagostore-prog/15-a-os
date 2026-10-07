// =====================================================
// formulario.js - VERSIÓN FINAL SIN VALIDACIÓN DE TELÉFONO
// =====================================================

// =====================================================
// 1. GENERAR CAMPOS DINÁMICOS (SOLO ACOMPAÑANTES)
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Iniciando formulario...');

    const cantidadInput = document.getElementById('cantidad');
    const contenedor = document.getElementById('contenedor-invitados');
    
    function generarCamposInvitados(cantidad) {
        if (!contenedor) return;
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
    
    if (cantidadInput) {
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
    }
});

// =====================================================
// 2. GUARDAR EN FIREBASE
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const btnGuardar = document.getElementById('btn-guardar');
    const mensajesDiv = document.getElementById('mensajes');
    
    function mostrarMensaje(tipo, texto) {
        if (!mensajesDiv) return;
        mensajesDiv.innerHTML = `
            <div class="mensaje ${tipo}" style="padding: 15px; border-radius: 10px; margin: 10px 0; ${
                tipo === 'error' ? 'background: #FEE2E2; border: 2px solid #EF4444; color: #991B1B;' 
                : tipo === 'exito' ? 'background: #D1FAE5; border: 2px solid #10B981; color: #065F46;' 
                : 'background: #DBEAFE; border: 2px solid #3B82F6; color: #1E3A8A;'
            }">
                ${texto}
            </div>
        `;
        
        if (tipo === 'exito' || tipo === 'error') {
            setTimeout(() => {
                mensajesDiv.innerHTML = '';
            }, 8000);
        }
    }
    
    async function guardarInvitados() {
        // Verificar Firebase disponible
        if (typeof window.db === 'undefined') {
            mostrarMensaje('error', '❌ Firebase no está disponible. Recarga la página.');
            return;
        }

        // Obtener datos del líder
        const nombreLider = document.getElementById('nombreLider').value.trim();
        let telefonoLider = document.getElementById('telefonoLider').value.trim();
        const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
        
        // Limpiar teléfono (solo números)
        telefonoLider = telefonoLider.replace(/\D/g, '');
        
        // Validar teléfono
        if (!telefonoLider || telefonoLider.length < 7) {
            mostrarMensaje('error', '⚠️ El teléfono debe tener al menos 7 dígitos');
            document.getElementById('telefonoLider').focus();
            return;
        }
        
        // Validar nombre del líder
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
            
        } catch (error) {
            console.error('❌ Error al guardar:', error);
            mostrarMensaje('error', `❌ Error al guardar: ${error.message}`);
        }
    }
    
    if (btnGuardar) {
        btnGuardar.addEventListener('click', guardarInvitados);
    }
});

// =====================================================
// 3. LIMPIAR FORMULARIO
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const btnLimpiar = document.getElementById('btn-limpiar');
    
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function() {
            if (confirm('¿Limpiar el formulario?')) {
                document.getElementById('formulario-invitados').reset();
                document.getElementById('cantidad').value = 0;
                document.getElementById('cantidad').dispatchEvent(new Event('change'));
                document.getElementById('mensajes').innerHTML = '';
            }
        });
    }
});

console.log('📝 Formulario cargado correctamente');
console.log('👑 1 líder + máximo 3 acompañantes = 4 personas');
