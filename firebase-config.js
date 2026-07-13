// =====================================================
// firebase-config.js - CONFIGURACIÓN DE FIREBASE
// =====================================================

// =====================================================
// 1. TU CONFIGURACIÓN DE FIREBASE
// =====================================================
// 📌 OBTÉN ESTOS DATOS DE: Firebase Console > Configuración del proyecto

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// =====================================================
// 2. INICIALIZAR FIREBASE
// =====================================================
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// =====================================================
// 3. FUNCIONES PARA GUARDAR Y VERIFICAR
// =====================================================

// Función para verificar si un teléfono ya está registrado
async function verificarDuplicado(telefono) {
    try {
        const querySnapshot = await db.collection('invitados')
            .where('telefono', '==', telefono)
            .get();
        
        return !querySnapshot.empty;
    } catch (error) {
        console.error('❌ Error al verificar duplicado:', error);
        return false;
    }
}

// Función para guardar un invitado
async function guardarInvitado(datosInvitado) {
    try {
        // Verificar duplicado
        const existe = await verificarDuplicado(datosInvitado.telefono);
        
        if (existe) {
            return {
                success: false,
                message: `⚠️ El teléfono ${datosInvitado.telefono} ya está registrado`
            };
        }
        
        // Guardar en Firebase
        const docRef = await db.collection('invitados').add({
            nombre: datosInvitado.nombre,
            telefono: datosInvitado.telefono,
            lider: datosInvitado.lider,
            telefonoLider: datosInvitado.telefonoLider,
            fechaRegistro: datosInvitado.fechaRegistro,
            confirmado: true
        });
        
        return {
            success: true,
            message: `✅ ${datosInvitado.nombre} registrado exitosamente`,
            id: docRef.id
        };
    } catch (error) {
        console.error('❌ Error al guardar en Firebase:', error);
        return {
            success: false,
            message: '❌ Error al guardar. Intenta nuevamente.'
        };
    }
}

// Función para guardar múltiples invitados
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
// 4. EXPORTAR FUNCIONES (para usar en formulario.js)
// =====================================================
console.log('🔥 Firebase configurado correctamente');
console.log('📁 Colección: "invitados"');
console.log('💡 Los datos se crearán automáticamente al guardar');
