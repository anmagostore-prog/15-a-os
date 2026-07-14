// =====================================================
// app.js - CONTROLADOR DE LA PÁGINA PRINCIPAL (DEFINITIVO)
// =====================================================

// =====================================================
// 1. CONTROL DE MÚSICA (VERSIÓN DEFINITIVA Y ROBUSTA)
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const musicaBtn = document.getElementById('musica-btn');
    const audio = document.getElementById('musica-fondo');
    let musicaActiva = false;
    let audioCargado = false;
    let reintentos = 0;
    const MAX_REINTENTOS = 3;

    // 📌 VERIFICAR QUE EXISTE EL AUDIO
    if (!audio) {
        console.error('❌ Elemento de audio NO encontrado');
        return;
    }

    // 📌 VERIFICAR LA RUTA DEL AUDIO
    const source = audio.querySelector('source');
    if (source) {
        console.log('🎵 Ruta del audio:', source.src);
        console.log('🎵 Tipo de audio:', source.type);
    } else {
        console.warn('⚠️ No se encontró la etiqueta source dentro de audio');
    }

    // 📌 MANEJAR EVENTOS DEL AUDIO
    audio.addEventListener('canplaythrough', function() {
        console.log('✅ Audio completamente cargado');
        audioCargado = true;
        reintentos = 0;
    });

    audio.addEventListener('canplay', function() {
        console.log('✅ Audio listo para reproducir');
        if (!audioCargado) {
            audioCargado = true;
        }
    });

    audio.addEventListener('error', function(e) {
        console.error('❌ Error en el audio:', e);
        console.log('💡 Verifica que el archivo existe en:', source?.src);
        
        // Si hay error, intentar recargar
        if (reintentos < MAX_REINTENTOS) {
            reintentos++;
            console.log(`🔄 Reintentando cargar (${reintentos}/${MAX_REINTENTOS})...`);
            setTimeout(() => {
                audio.load();
            }, 1000);
        } else {
            console.error('❌ No se pudo cargar el audio después de', MAX_REINTENTOS, 'intentos');
            alert('⚠️ No se pudo cargar la música. Verifica la conexión.');
        }
    });

    audio.addEventListener('loadeddata', function() {
        console.log('📊 Duración del audio:', audio.duration, 'segundos');
    });

    // 📌 CARGAR EL AUDIO AL INICIO
    audio.load();

    // 📌 FUNCIÓN PARA REPRODUCIR CON REINTENTO
    function reproducirAudio() {
        return new Promise((resolve, reject) => {
            if (!audioCargado) {
                console.log('⏳ Esperando que el audio cargue...');
                
                // Si no está cargado, esperar a que cargue
                const timeout = setTimeout(() => {
                    reject(new Error('Timeout: El audio no cargó a tiempo'));
                }, 30000); // Esperar 10 segundos máximo

                audio.addEventListener('canplaythrough', function onLoad() {
                    clearTimeout(timeout);
                    audio.removeEventListener('canplaythrough', onLoad);
                    console.log('✅ Audio cargado, reproduciendo...');
                    
                    // Intentar reproducir ahora que está cargado
                    audio.play()
                        .then(() => resolve())
                        .catch((err) => reject(err));
                }, { once: true });
                
                return;
            }
            
            // Si ya está cargado, reproducir directamente
            audio.play()
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    // 📌 EVENTO DEL BOTÓN DE MÚSICA
    musicaBtn.addEventListener('click', function() {
        console.log('🔄 Click en botón de música');
        
        if (!musicaActiva) {
            // ACTIVAR MÚSICA
            console.log('🎵 Intentando activar música...');
            
            reproducirAudio()
                .then(() => {
                    console.log('✅ Música activada correctamente');
                    musicaBtn.innerHTML = '🔇 Desactivar Música';
                    musicaBtn.classList.add('activo');
                    musicaActiva = true;
                })
                .catch(function(error) {
                    console.error('❌ Error al reproducir:', error);
                    
                    // Si es AbortError, significa que se interrumpió
                    if (error.name === 'AbortError') {
                        console.log('🔄 Reproducción interrumpida, reintentando...');
                        setTimeout(() => {
                            audio.play()
                                .then(() => {
                                    console.log('✅ Música activada (reintento)');
                                    musicaBtn.innerHTML = '🔇 Desactivar Música';
                                    musicaBtn.classList.add('activo');
                                    musicaActiva = true;
                                })
                                .catch((err) => {
                                    console.error('❌ Error en reintento:', err);
                                    alert('💡 Haz clic en la página primero para activar la música');
                                });
                        }, 500);
                    } else if (error.message === 'Timeout: El audio no cargó a tiempo') {
                        alert('⏳ La música está tardando en cargar. Intenta nuevamente.');
                        // Recargar el audio
                        audio.load();
                        audioCargado = false;
                    } else {
                        alert('💡 Haz clic en la página primero para activar la música');
                    }
                });
        } else {
            // DESACTIVAR MÚSICA
            audio.pause();
            console.log('🔇 Música desactivada');
            musicaBtn.innerHTML = '🎵 Activar Música';
            musicaBtn.classList.remove('activo');
            musicaActiva = false;
        }
    });

    // 📌 OPCIONAL: Reanudar música si el usuario vuelve a la pestaña
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && musicaActiva) {
            console.log('🔄 Usuario volvió a la página, reanudando música');
            audio.play().catch(() => {});
        }
    });
});

// =====================================================
// 2. EFECTO DE SCROLL SUAVE EN LOS ENLACES
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// =====================================================
// 3. CONTADOR DE DÍAS PARA EL EVENTO
// =====================================================
function calcularDias() {
    // FECHA DEL EVENTO: 23 DE FEBRERO DE 2027
    const fechaEvento = new Date('2027-02-23T19:00:00');
    const fechaActual = new Date();
    const diferencia = fechaEvento - fechaActual;
    
    if (diferencia > 0) {
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        
        console.log(`🎉 Faltan ${dias} días, ${horas} horas y ${minutos} minutos para los 15 años de Mariana`);
        
        // Puedes mostrar el contador en algún lugar de la página si quieres
        // document.getElementById('contador').textContent = `Faltan ${dias} días`;
    } else {
        console.log('🎉 ¡Ya llegó el gran día!');
    }
}

calcularDias();

// =====================================================
// 4. ANIMACIONES ADICIONALES
// =====================================================
window.addEventListener('load', function() {
    // Agregar clase de animación a las tarjetas de normas
    const cards = document.querySelectorAll('.norma-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
});

// =====================================================
// 5. MANEJO DE ERRORES GENERAL
// =====================================================
window.addEventListener('error', function(e) {
    console.error('❌ Error no manejado:', e.message);
});

console.log('🎀 ¡Bienvenido al sitio de los 15 años de Mariana!');
console.log('📌 Recuerda cambiar las imágenes y textos según tus necesidades.');
console.log('🎵 Para activar la música, haz clic en el botón flotante.');
console.log('📌 Si la música no funciona, revisa la consola para más detalles.');
