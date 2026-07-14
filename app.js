// =====================================================
// app.js - CONTROL DE MÚSICA (CON YOUTUBE - CORREGIDO)
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const musicaBtn = document.getElementById('musica-btn');
    const iframe = document.getElementById('audio-iframe');
    let musicaActiva = false;
    let youtubeListo = false;

    // Verificar que el iframe existe
    if (!iframe) {
        console.error('❌ Iframe de YouTube no encontrado');
        return;
    }

    // Esperar a que el iframe de YouTube esté listo
    iframe.addEventListener('load', function() {
        youtubeListo = true;
        console.log('✅ YouTube cargado y listo');
    });

    // Función para controlar el reproductor de YouTube
    function controlarYouTube(comando) {
        if (!youtubeListo) {
            console.log('⏳ YouTube no está listo aún, esperando...');
            // Intentar de nuevo después de 1 segundo
            setTimeout(() => {
                controlarYouTube(comando);
            }, 1000);
            return;
        }

        try {
            iframe.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: comando, args: [] }),
                '*'
            );
            console.log(`📤 Comando enviado: ${comando}`);
        } catch (error) {
            console.error('❌ Error al enviar comando:', error);
        }
    }

    // Evento del botón (MEJORADO)
    musicaBtn.addEventListener('click', function() {
        console.log('🔄 Click en botón de música');

        if (!musicaActiva) {
            // Activar música
            controlarYouTube('playVideo');
            musicaBtn.innerHTML = '🔇 Desactivar Música';
            musicaBtn.classList.add('activo');
            musicaActiva = true;
            console.log('✅ Música activada');
        } else {
            // Desactivar música
            controlarYouTube('pauseVideo');
            musicaBtn.innerHTML = '🎵 Activar Música';
            musicaBtn.classList.remove('activo');
            musicaActiva = false;
            console.log('🔇 Música desactivada');
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
