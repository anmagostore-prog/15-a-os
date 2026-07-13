// =====================================================
// app.js - CONTROLADOR DE LA PÁGINA PRINCIPAL
// =====================================================

// =====================================================
// 1. CONTROL DE MÚSICA
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const musicaBtn = document.getElementById('musica-btn');
    const audio = document.getElementById('musica-fondo');
    let musicaActiva = false;
    
    musicaBtn.addEventListener('click', function() {
        if (!musicaActiva) {
            // Activar música
            audio.play().catch(function(error) {
                console.log('Error al reproducir música:', error);
                alert('💡 Haz clic en la página primero para activar la música');
            });
            musicaBtn.innerHTML = '🔇 Desactivar Música';
            musicaBtn.classList.add('activo');
            musicaActiva = true;
        } else {
            // Desactivar música
            audio.pause();
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
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// =====================================================
// 3. CONTADOR DE DÍAS PARA EL EVENTO (opcional)
// =====================================================
function calcularDias() {
    // FECHA DEL EVENTO: 13 DE JULIO DE 2026
    const fechaEvento = new Date('2026-07-13T19:00:00');
    const fechaActual = new Date();
    const diferencia = fechaEvento - fechaActual;
    
    if (diferencia > 0) {
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        
        // Puedes mostrar este contador en algún lugar de la página
        console.log(`🎉 Faltan ${dias} días, ${horas} horas y ${minutos} minutos`);
    }
}

calcularDias();

// =====================================================
// 4. ANIMACIONES ADICIONALES (cuando la página carga)
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

console.log('🎀 ¡Bienvenido al sitio de los 15 años!');
console.log('📌 Recuerda cambiar las imágenes y textos según tus necesidades.');
