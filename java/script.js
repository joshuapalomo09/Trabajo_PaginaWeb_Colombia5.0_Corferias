document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CONTROL DE NAVBAR ACTIVO POR SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', 
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (activeId.startsWith('detalle-conf') && link.getAttribute('href') === '#conferencias') {
                        link.classList.add('active');
                    } else if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));


    // ==========================================
    // 2. NAVEGACIÓN EN TARJETAS DE CONFERENCIAS
    // ==========================================
    const conferenceCards = document.querySelectorAll('#conferencias .card');
    
    conferenceCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ==========================================
    // 3. SISTEMA GLOBAL DE MODALES (GALERÍA, VIDEO Y REFLEXIÓN)
    // ==========================================
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const modalCloseButtons = document.querySelectorAll('#modalClose, #videoModalClose, #reflectionModalClose, .modal-close-btn');
    let currentLang = 'es'; 

    // Elementos específicos de Modales
    const modalGallery = document.getElementById('modalGallery');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const galleryItems = document.querySelectorAll('.gallery-item');

    const modalVideoPlayer = document.getElementById('modalVideoPlayer');
    const videoLaunchCard = document.getElementById('videoLaunchCard');
    const html5VideoPlayer = document.getElementById('html5VideoPlayer');

    const modalReflection = document.getElementById('modalReflection');
    const btnCta = document.querySelector('.btn-cta');

    // Funciones Universales de Modales
    const openModal = (modalElement) => {
        if (modalElement) {
            modalElement.classList.add('open');
            document.body.style.overflow = 'hidden'; 
        }
    };

    const closeAllModals = () => {
        modalOverlays.forEach(modal => modal.classList.remove('open'));
        document.body.style.overflow = ''; 

        if (html5VideoPlayer) {
            html5VideoPlayer.pause();
            html5VideoPlayer.currentTime = 0; 
        }
    };

    // Evento: Modal Galería
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            if (modalGallery && modalImg) {
                const innerImg = item.querySelector('.card-img');
                if (innerImg) {
                    modalImg.src = innerImg.src;
                    const currentTitle = item.getAttribute('data-current-title') || item.getAttribute(currentLang === 'es' ? 'data-title-es' : 'data-title-en');
                    if (modalTitle) modalTitle.textContent = currentTitle;
                    openModal(modalGallery);
                }
            }
        });
    });

    // Evento: Modal Video
    if (videoLaunchCard && modalVideoPlayer) {
        videoLaunchCard.addEventListener('click', () => {
            openModal(modalVideoPlayer);
            if (html5VideoPlayer) {
                html5VideoPlayer.play().catch(err => console.log("Autoplay bloqueado por el navegador: ", err));
            }
        });
    }

    // Evento: Modal Reflexión
    if (btnCta && modalReflection) {
        btnCta.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modalReflection);
        });
    }

    // Manejadores de cierre para todos los Modales
    modalCloseButtons.forEach(btn => btn.addEventListener('click', closeAllModals));

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeAllModals();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });


    // ==========================================
    // 4. FILTRADO DINÁMICO Y REVEAL POR SCROLL (CONCEPTOS)
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const conceptCards = document.querySelectorAll('.concept-card-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            conceptCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hidden-filter');
                    card.classList.remove('revealed');
                    void card.offsetWidth; // Truco de reflow para reiniciar animación CSS
                    card.classList.add('revealed');
                } else {
                    card.classList.add('hidden-filter');
                }
            });
        });
    });

    const conceptsObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', 
        threshold: 0.05
    };

    const conceptsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                conceptsObserver.unobserve(entry.target);
            }
        });
    }, conceptsObserverOptions);

    conceptCards.forEach(card => conceptsObserver.observe(card));


    // ==========================================
    // 5. CONTROL DEL PANEL LATERAL DE CONFIGURACIÓN
    // ==========================================
    const configToggleBtn = document.getElementById('configToggleBtn');
    const accessibilityPanel = document.getElementById('accessibilityPanel');

    if (configToggleBtn && accessibilityPanel) {
        configToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accessibilityPanel.classList.toggle('open');
            accessibilityPanel.classList.toggle('active'); // Soporte para ambas clases usadas en tus versiones
        });

        document.addEventListener('click', (e) => {
            if (!accessibilityPanel.contains(e.target) && e.target !== configToggleBtn) {
                accessibilityPanel.classList.remove('open');
                accessibilityPanel.classList.remove('active');
            }
        });
    }


    // ==========================================
    // 6. MODO CLARO / OSCURO (FUSIÓN DE COMPORTAMIENTOS)
    // ==========================================
    const themeThemeToggle = document.getElementById('themeThemeToggle');

    if (themeThemeToggle) {
        themeThemeToggle.addEventListener('change', () => {
            if (themeThemeToggle.checked) {
                // Comportamiento del Bloque 1
                document.body.classList.add('light-theme'); 
                // Comportamiento del Bloque 2 (Variables CSS de Colombia 5.0)
                document.documentElement.setAttribute('data-theme', 'light');
                document.documentElement.style.setProperty('--bg-primary', '#040505');
                document.documentElement.style.setProperty('--bg-secondary', '#ffffff');
                document.documentElement.style.setProperty('--bg-dark', '#e2e8f0');
                document.documentElement.style.setProperty('--text-main', '#0f172a');
                document.documentElement.style.setProperty('--text-muted', '#475569');
                document.documentElement.style.setProperty('--neon-purple-glow', 'rgba(129, 0, 255, 0.1)');
                document.documentElement.style.setProperty('--neon-green-glow', 'rgba(0, 255, 102, 0.1)');
            } else {
                // Comportamiento del Bloque 1
                document.body.classList.remove('light-theme'); 
                // Comportamiento del Bloque 2
                document.documentElement.removeAttribute('data-theme');
                document.documentElement.style.setProperty('--bg-primary', '#0a0a0c');
                document.documentElement.style.setProperty('--bg-secondary', '#121216');
                document.documentElement.style.setProperty('--bg-dark', '#060608');
                document.documentElement.style.setProperty('--text-main', '#ffffff');
                document.documentElement.style.setProperty('--text-muted', '#a0a0ab');
                document.documentElement.style.setProperty('--neon-purple-glow', 'rgba(129, 0, 255, 0.4)');
                document.documentElement.style.setProperty('--neon-green-glow', 'rgba(0, 255, 102, 0.3)');
            }
        });
    }


    // ==========================================
    // 7. INTERCAMBIO DE IDIOMAS DINÁMICO (ESPAÑOL / INGLÉS)
    // ==========================================
    const languageSelect = document.getElementById('languageSelect');
    const dropdownLabel = document.getElementById('dropdownLabel');

    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            currentLang = e.target.value;
            
            if (dropdownLabel) {
                dropdownLabel.textContent = languageSelect.options[languageSelect.selectedIndex].text;
            }

            document.querySelectorAll('[data-es], [data-en]').forEach(element => {
                const textToInject = element.getAttribute(`data-${currentLang}`);
                if (textToInject) {
                    if (element.classList.contains('gallery-item')) {
                        element.setAttribute('data-current-title', textToInject);
                    } else {
                        element.textContent = textToInject;
                    }
                }
            });
        });
    }


    // ==========================================
    // 8. ROTACIÓN AUTOMÁTICA EN INFORMACIÓN (Cada 5 segundos)
    // ==========================================
    const detailLargeCards = document.querySelectorAll('.large-card:not(.summary-image-box)');
    
    detailLargeCards.forEach(card => {
        const images = card.querySelectorAll('.card-img');
        
        if (images.length > 1) {
            let currentIndex = 0;
            
            setInterval(() => {
                images[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.add('active');
            }, 5000); 
        }
    });
});

// ==========================================================================
// MÓDULO NUEVO: FUNCIONALIDAD DE DESPLAZAMIENTO SUAVE (SCROLL INDICATOR)
// ==========================================================================

// Aseguramos la ejecución del código una vez que el DOM esté completamente estructurado y cargado
document.addEventListener("DOMContentLoaded", () => {
    
    // Captura del contenedor del indicador de scroll por medio de su ID único
    const scrollIndicator = document.getElementById("scroll-pointer");
    
    // Captura de la sección destino (Conferencias) que sigue cronológicamente en tu arquitectura web
    const targetSection = document.getElementById("que-es");

    // Validación preventiva de existencia de ambos elementos en el DOM para mitigar errores en consola
    if (scrollIndicator && targetSection) {
        
        // Asignación del manejador de eventos para detectar el clic del usuario
        scrollIndicator.addEventListener("click", () => {
            
            // Invocación del método nativo para activar la transición animada de la pantalla
            targetSection.scrollIntoView({
                behavior: "smooth", // Define que el desplazamiento sea progresivo y suave, no un salto brusco
                block: "start"      // Alinea el inicio de la sección destino con la parte superior del viewport
            });
        });
    }
});

//CONFERENCIA 1 CONFERECIAS GENERAL SCROLL ///

// Aseguramos la ejecución del código una vez que el DOM esté completamente estructurado y cargado
document.addEventListener("DOMContentLoaded", () => {
    
    // Captura del contenedor del indicador de scroll por medio de su ID único
    const scrollIndicator = document.getElementById("scroll-pointer2");
    
    // Captura de la sección destino (Conferencias) que sigue cronológicamente en tu arquitectura web
    const targetSection = document.getElementById("conferencias");

    // Validación preventiva de existencia de ambos elementos en el DOM para mitigar errores en consola
    if (scrollIndicator && targetSection) {
        
        // Asignación del manejador de eventos para detectar el clic del usuario
        scrollIndicator.addEventListener("click", () => {
            
            // Invocación del método nativo para activar la transición animada de la pantalla
            targetSection.scrollIntoView({
                behavior: "smooth", // Define que el desplazamiento sea progresivo y suave, no un salto brusco
                block: "start"      // Alinea el inicio de la sección destino con la parte superior del viewport
            });
        });
    }
});

//CONFERENCIA 1 SCROLL ///

// Aseguramos la ejecución del código una vez que el DOM esté completamente estructurado y cargado
document.addEventListener("DOMContentLoaded", () => {
    
    // Captura del contenedor del indicador de scroll por medio de su ID único
    const scrollIndicator = document.getElementById("scroll-pointer3");
    
    // Captura de la sección destino (Conferencias) que sigue cronológicamente en tu arquitectura web
    const targetSection = document.getElementById("detalle-conf2");

    // Validación preventiva de existencia de ambos elementos en el DOM para mitigar errores en consola
    if (scrollIndicator && targetSection) {
        
        // Asignación del manejador de eventos para detectar el clic del usuario
        scrollIndicator.addEventListener("click", () => {
            
            // Invocación del método nativo para activar la transición animada de la pantalla
            targetSection.scrollIntoView({
                behavior: "smooth", // Define que el desplazamiento sea progresivo y suave, no un salto brusco
                block: "start"      // Alinea el inicio de la sección destino con la parte superior del viewport
            });
        });
    }
});

//CONFERENCIA 2 SCROLL ///

document.addEventListener("DOMContentLoaded", () => {
    
    // Captura del contenedor del indicador de scroll por medio de su ID único
    const scrollIndicator = document.getElementById("scroll-pointer4");
    
    // Captura de la sección destino (Conferencias) que sigue cronológicamente en tu arquitectura web
    const targetSection = document.getElementById("detalle-conf3");

    // Validación preventiva de existencia de ambos elementos en el DOM para mitigar errores en consola
    if (scrollIndicator && targetSection) {
        
        // Asignación del manejador de eventos para detectar el clic del usuario
        scrollIndicator.addEventListener("click", () => {
            
            // Invocación del método nativo para activar la transición animada de la pantalla
            targetSection.scrollIntoView({
                behavior: "smooth", // Define que el desplazamiento sea progresivo y suave, no un salto brusco
                block: "start"      // Alinea el inicio de la sección destino con la parte superior del viewport
            });
        });
    }
});


//CONFERENCIA 3 SCROLL ///

document.addEventListener("DOMContentLoaded", () => {
    
    // Captura del contenedor del indicador de scroll por medio de su ID único
    const scrollIndicator = document.getElementById("scroll-pointer5");
    
    // Captura de la sección destino (Conferencias) que sigue cronológicamente en tu arquitectura web
    const targetSection = document.getElementById("galeria");

    // Validación preventiva de existencia de ambos elementos en el DOM para mitigar errores en consola
    if (scrollIndicator && targetSection) {
        
        // Asignación del manejador de eventos para detectar el clic del usuario
        scrollIndicator.addEventListener("click", () => {
            
            // Invocación del método nativo para activar la transición animada de la pantalla
            targetSection.scrollIntoView({
                behavior: "smooth", // Define que el desplazamiento sea progresivo y suave, no un salto brusco
                block: "start"      // Alinea el inicio de la sección destino con la parte superior del viewport
            });
        });
    }
});

//GALERIA- A CONCEPTOS SCROLL ///

document.addEventListener("DOMContentLoaded", () => {
    
    // Captura del contenedor del indicador de scroll por medio de su ID único
    const scrollIndicator = document.getElementById("scroll-pointer6");
    
    // Captura de la sección destino (Conferencias) que sigue cronológicamente en tu arquitectura web
    const targetSection = document.getElementById("conceptos");

    // Validación preventiva de existencia de ambos elementos en el DOM para mitigar errores en consola
    if (scrollIndicator && targetSection) {
        
        // Asignación del manejador de eventos para detectar el clic del usuario
        scrollIndicator.addEventListener("click", () => {
            
            // Invocación del método nativo para activar la transición animada de la pantalla
            targetSection.scrollIntoView({
                behavior: "smooth", // Define que el desplazamiento sea progresivo y suave, no un salto brusco
                block: "start"      // Alinea el inicio de la sección destino con la parte superior del viewport
            });
        });
    }
});


// ==========================================================================
// MÓDULO DE INTERACTIVIDAD Y ANIMACIÓN PARA EL TEXTO CENTRAL DE INICIO
// ==========================================================================

// Escucha activa hasta que la estructura del árbol de nodos (DOM) esté lista
document.addEventListener("DOMContentLoaded", () => {

    // Selección del contenedor principal del bloque de texto mediante su clase CSS
    const textBlock = document.querySelector(".inicio-text-block");

    // Condicional de seguridad para comprobar que el elemento existe antes de aplicar efectos
    if (textBlock) {
        
        // Fase 1: Seteo de propiedades de inicio de animación (Invisible y ligeramente desplazado)
        textBlock.style.opacity = "0"; // Esconde el elemento inicialmente
        textBlock.style.transform = "translateY(15px)"; // Baja el bloque 15 píxeles en el eje vertical
        textBlock.style.transition = "opacity 1.2s ease-out, transform 1.2s ease-out"; // Declara una transición suave

        // Fase 2: Ejecución del efecto con un micro-retraso para simular la inicialización de una interfaz
        setTimeout(() => {
            
            // Devuelve la opacidad al máximo de manera fluida y orgánica
            textBlock.style.opacity = "1"; 
            
            // Regresa el contenedor a su posición original de maquetación (0px de desfase)
            textBlock.style.transform = "translateY(0px)";
            
        }, 250); // El micro-retraso está calibrado exactamente en 250 milisegundos
    }
});


// =========================================================================
// INTERACTIVIDAD DEL MENÚ DE HAMBURGUESA
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // Alterna la clase 'active' para mostrar/ocultar el menú
            navMenu.classList.toggle('active');
        });
    }

    // Opcional: Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
});

