// =====================================================
// app.js - CONTROLADOR DE LA PÁGINA PRINCIPAL
// =====================================================

// =====================================================
// 1. CONTROL DE MÚSICA (MEJORADO)
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const musicaBtn = document.getElementById('musica-btn');
    const audio = document.getElementById('musica-fondo');
    let musicaActiva = false;
    let reproduciendo = false;
    
    // 📌 VERIFICAR QUE EXISTE EL AUDIO
    if (!audio) {
        console.error('❌ Elemento de audio NO encontrado');
        return;
    }
    
    // 📌 VERIFICAR LA RUTA DEL AUDIO
    const source = audio.querySelector('source');
    if (source) {
        console.log('🎵 Ruta del audio:', source.src);
    }
    
    // 📌 MANEJAR ERRORES DEL AUDIO
    audio.addEventListener('error', function(e) {
        console.error('❌ Error en el audio:', e);
        console.log('💡 Verifica que el archivo existe en:', source?.src);
    });
    
    audio.addEventListener('canplay', function() {
        console.log('✅ Audio listo para reproducir');
        reproduciendo = true;
    });
    
    // 📌 EVENTO DEL BOTÓN (MEJORADO)
    musicaBtn.addEventListener('click', function() {
        console.log('🔄 Click en botón de música');
        
        if (!musicaActiva) {
            // ACTIVAR MÚSICA
            console.log('🎵 Intentando reproducir...');
            
            // Recargar el audio si está pausado
            if (audio.paused) {
                const promesa = audio.play();
                
                if (promesa !== undefined) {
                    promesa
                        .then(() => {
                            console.log('✅ Música activada correctamente');
                            musicaBtn.innerHTML = '🔇 Desactivar Música';
                            musicaBtn.classList.add('activo');
                            musicaActiva = true;
                        })
                        .catch(function(error) {
                            console.error('❌ Error al reproducir:', error);
                            
                            // Si el error es por interrupción, reintentar
                            if (error.name === 'AbortError') {
                                console.log('🔄 Reintentando reproducción...');
                                setTimeout(() => {
                                    audio.play().then(() => {
                                        console.log('✅ Música activada (reintento)');
                                        musicaBtn.innerHTML = '🔇 Desactivar Música';
                                        musicaBtn.classList.add('activo');
                                        musicaActiva = true;
                                    }).catch(err => {
                                        console.error('❌ Error en reintento:', err);
                                        alert('💡 Haz clic en la página primero para activar la música');
                                    });
                                }, 100);
                            } else {
                                alert('💡 Haz clic en la página primero para activar la música');
                            }
                        });
                }
            }
        } else {
            // DESACTIVAR MÚSICA
            audio.pause();
            console.log('🔇 Música desactivada');
            musicaBtn.innerHTML = '🎵 Activar Música';
            musicaBtn.classList.remove('activo');
            musicaActiva = false;
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

console.log('🎀 ¡Bienvenido al sitio de los 15 años de Mariana!');
console.log('📌 Recuerda cambiar las imágenes y textos según tus necesidades.');
console.log('🎵 Para activar la música, haz clic en el botón flotante');
