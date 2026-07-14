// =====================================================
// formulario.js - LÓGICA DEL FORMULARIO (DEFINITIVO)
// =====================================================

// =====================================================
// 1. GENERAR CAMPOS DINÁMICOS (SOLO ACOMPAÑANTES)
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const cantidadInput = document.getElementById('cantidad');
    const contenedor = document.getElementById('contenedor-invitados');
    
    function generarCamposInvitados(cantidad) {
        contenedor.innerHTML = '';
        
        if (isNaN(cantidad) || cantidad < 1) {
            cantidad = 1;
        }
        
        if (cantidad > 4) {
            alert('⚠️ Máximo 4 personas por grupo (1 líder + 3 acompañantes)');
            cantidad = 4;
            cantidadInput.value = 4;
        }
        
        const numAcompanantes = cantidad - 1;
        
        if (numAcompanantes === 0) {
            contenedor.innerHTML = `
                <div style="background: #F3E8FF; padding: 20px; border-radius: 12px; text-align: center; color: #7C3AED; font-size: 1.1rem;">
                    💫 Solo asistirá el líder. No hay acompañantes.
                </div>
            `;
            return;
        }
        
        for (let i = 1; i <= numAcompanantes; i++) {
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
                    <label for="telefono_acompanante_${i}">Teléfono del acompañante ${i}:</label>
                    <input 
                        type="tel" 
                        id="telefono_acompanante_${i}" 
                        name="telefono_acompanante_${i}" 
                        placeholder="Ej: 3219876543"
                        required
                    >
                    <span class="campo-ayuda">📌 Número de contacto del acompañante</span>
                </div>
            `;
            
            contenedor.appendChild(invitadoDiv);
        }
    }
    
    cantidadInput.addEventListener('change', function() {
        const cantidad = parseInt(this.value) || 1;
        generarCamposInvitados(cantidad);
    });
    
    cantidadInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const cantidad = parseInt(this.value) || 1;
            generarCamposInvitados(cantidad);
        }
    });
    
    generarCamposInvitados(1);
});

// =====================================================
// 2. FUNCIONES DE FIREBASE (DEFINIDAS AQUÍ)
// =====================================================

// ✅ FUNCIÓN PARA VERIFICAR DUPLICADO
async function verificarDuplicado(telefono) {
    try {
        const querySnapshot = await window.db.collection('invitados')
            .where('telefono', '==', telefono)
            .get();
        
        return !querySnapshot.empty;
    } catch (error) {
        console.error('❌ Error al verificar duplicado:', error);
        return false;
    }
}

// ✅ FUNCIÓN PARA GUARDAR UN INVITADO
async function guardarInvitado(datosInvitado) {
    try {
        const existe = await verificarDuplicado(datosInvitado.telefono);
        
        if (existe) {
            return {
                success: false,
                message: `⚠️ El teléfono ${datosInvitado.telefono} ya está registrado`
            };
        }
        
        const docRef = await window.db.collection('invitados').add({
            nombre: datosInvitado.nombre,
            telefono: datosInvitado.telefono,
            lider: datosInvitado.lider,
            telefonoLider: datosInvitado.telefonoLider,
            tipo: datosInvitado.tipo || 'invitado',
            fechaRegistro: datosInvitado.fechaRegistro || new Date().toISOString()
        });
        
        return {
            success: true,
            message: `✅ ${datosInvitado.nombre} registrado exitosamente`,
            id: docRef.id
        };
    } catch (error) {
        console.error('❌ Error al guardar:', error);
        return {
            success: false,
            message: `❌ Error al guardar a ${datosInvitado.nombre}`
        };
    }
}

// ✅ FUNCIÓN PARA GUARDAR MÚLTIPLES INVITADOS
async function guardarMultiplesInvitados(listaInvitados) {
    const resultados = [];
    let errores = [];
    
    for (const invitado of listaInvitados) {
        const resultado = await guardarInvitado(invitado);
        resultados.push(resultado);
        
        if (!resultado.success) {
            errores.push(resultado.message);
        }
    }
    
    return {
        success: errores.length === 0,
        resultados: resultados,
        errores: errores,
        total: listaInvitados.length,
        guardados: resultados.filter(r => r.success).length
    };
}

// =====================================================
// 3. VALIDACIÓN Y GUARDADO (CON FIREBASE)
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
    
    // ✅ FUNCIÓN PRINCIPAL PARA GUARDAR
    async function guardarInvitados() {
        // 🔥 VERIFICAR QUE FIREBASE ESTÁ DISPONIBLE
        if (typeof window.db === 'undefined') {
            mostrarMensaje('error', '❌ Firebase no está disponible. Revisa la conexión.');
            console.error('❌ window.db no está definido');
            return;
        }
        
        console.log('✅ Firebase disponible, procediendo a guardar...');
        
        // Obtener datos del líder
        const nombreLider = document.getElementById('nombreLider').value.trim();
        const telefonoLider = document.getElementById('telefonoLider').value.trim();
        const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
        
        // Validar líder
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
        
        // Recolectar datos
        const invitados = [];
        const numAcompanantes = cantidad - 1;
        let hayError = false;
        
        // 1. Agregar al líder
        invitados.push({
            nombre: nombreLider,
            telefono: telefonoLider,
            lider: nombreLider,
            telefonoLider: telefonoLider,
            tipo: 'líder',
            fechaRegistro: new Date().toISOString()
        });
        
        // 2. Agregar acompañantes
        for (let i = 1; i <= numAcompanantes; i++) {
            const nombre = document.getElementById(`nombre_acompanante_${i}`).value.trim();
            const telefono = document.getElementById(`telefono_acompanante_${i}`).value.trim();
            
            if (!nombre) {
                mostrarMensaje('error', `⚠️ Por favor, ingresa el nombre del acompañante ${i}`);
                document.getElementById(`nombre_acompanante_${i}`).focus();
                hayError = true;
                break;
            }
            
            if (!telefono || telefono.length < 7) {
                mostrarMensaje('error', `⚠️ Por favor, ingresa un teléfono válido para el acompañante ${i}`);
                document.getElementById(`telefono_acompanante_${i}`).focus();
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
        
        // Verificar límite
        if (invitados.length > 4) {
            mostrarMensaje('error', '⚠️ Máximo 4 personas (1 líder + 3 acompañantes)');
            return;
        }
        
        // Guardar en Firebase
        mostrarMensaje('info', '⏳ Guardando datos en la nube...');
        
        try {
            console.log('🔥 Intentando guardar en Firebase...');
            console.log('📊 Datos a guardar:', invitados);
            
            const resultado = await guardarMultiplesInvitados(invitados);
            
            if (resultado.success) {
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
                mostrarMensaje('error', `
                    ⚠️ Se guardaron ${resultado.guardados} de ${resultado.total}
                    <br>
                    <small>${resultado.errores.join('<br>')}</small>
                `);
            }
            
        } catch (error) {
            console.error('❌ Error general:', error);
            mostrarMensaje('error', `
                ❌ Error al guardar: ${error.message}
                <br>
                <small>Revisa la consola para más detalles.</small>
            `);
        }
    }
    
    // Evento del botón
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
            document.getElementById('cantidad').value = 1;
            document.getElementById('cantidad').dispatchEvent(new Event('change'));
            document.getElementById('mensajes').innerHTML = '';
        }
    });
});

console.log('📝 formulario.js cargado correctamente');
console.log('🔥 Firebase disponible:', typeof window.db !== 'undefined' ? '✅ Sí' : '❌ No');
console.log('✅ El líder se pide UNA SOLA VEZ');
console.log('✅ Los campos dinámicos son SOLO para acompañantes');
console.log('👑 1 líder + máximo 3 acompañantes = 4 personas');
