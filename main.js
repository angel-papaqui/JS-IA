/**
 * Archivo principal - Inicialización y coordinación
 * Demostración práctica de Arrow Functions
 */

// ✅ Arrow function para inicialización cuando el DOM está listo
const initializeApp = () => {
    console.log('🎵 Inicializando reproductor musical...');
    
    // Crear instancia global del reproductor
    window.musicPlayer = new MusicPlayer();
    
    // Configurar demostraciones interactivas
    setupDemonstrations();
    
    // Cargar datos iniciales
    loadInitialData();
    
    // Mostrar ejemplos de arrow functions en consola
    demonstrateArrowFunctions();
};

// ✅ Arrow function para configurar demostraciones
const setupDemonstrations = () => {
    const demoBtn = document.getElementById('demoBtn');
    const resetBtn = document.getElementById('resetBtn');
    const sortTitleBtn = document.getElementById('sortTitle');
    const sortDurationBtn = document.getElementById('sortDuration');
    
    // ✅ Arrow functions para event listeners
    demoBtn?.addEventListener('click', () => {
        runArrowFunctionDemo();
    });
    
    resetBtn?.addEventListener('click', () => {
        resetPlayer();
    });
    
    sortTitleBtn?.addEventListener('click', () => {
        sortSongs('title');
        updateSortButtons('title');
    });
    
    sortDurationBtn?.addEventListener('click', () => {
        sortSongs('duration');
        updateSortButtons('duration');
    });
    
    // Input en tiempo real con debounce
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();
            if (query.length >= 2) {
                window.musicPlayer.debouncedSearch(query);
            }
        });
    }
};

// ✅ Arrow function para cargar datos iniciales
const loadInitialData = async () => {
    console.log('📥 Cargando datos iniciales...');
    
    try {
        // Cargar artistas populares automáticamente
        const popularArtists = ['Coldplay', 'Queen', 'Bad Bunny'];
        
        // ✅ Arrow function para procesar cada artista
        const loadArtist = async (artist) => {
            const results = await window.musicPlayer.api.searchArtists(artist);
            console.log(`✅ ${artist}: ${results.length} canciones cargadas`);
            return results;
        };
        
        // Cargar todos los artistas en paralelo
        const allPromises = popularArtists.map(artist => loadArtist(artist));
        const allResults = await Promise.allSettled(allPromises);
        
        // ✅ Arrow function para combinar resultados
        const combinedResults = allResults
            .filter(result => result.status === 'fulfilled')
            .flatMap(result => result.value)
            .slice(0, 15); // Limitar a 15 canciones
        
        if (combinedResults.length > 0) {
            window.musicPlayer.playlist = combinedResults;
            window.musicPlayer.renderSongList(combinedResults);
            updateSearchCount(combinedResults.length);
        }
        
    } catch (error) {
        console.error('❌ Error cargando datos iniciales:', error);
    }
};

// ✅ Arrow function para ordenar canciones
const sortSongs = (criteria) => {
    const player = window.musicPlayer;
    
    if (player.playlist.length === 0) return;
    
    // ✅ Arrow function para comparación en sort
    const compareSongs = (a, b) => {
        switch (criteria) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'duration':
                return a.duration - b.duration;
            default:
                return 0;
        }
    };
    
    // Ordenar playlist
    player.playlist.sort(compareSongs);
    
    // Re-renderizar lista
    player.renderSongList(player.playlist);
    
    // Actualizar canción actual si está reproduciendo
    if (player.currentTrackIndex >= 0) {
        const currentId = player.playlist[player.currentTrackIndex]?.id;
        player.highlightCurrentTrack();
    }
    
    console.log(`🔃 Canciones ordenadas por: ${criteria}`);
};

// ✅ Arrow function para actualizar botones de ordenamiento
const updateSortButtons = (activeSort) => {
    const sortTitleBtn = document.getElementById('sortTitle');
    const sortDurationBtn = document.getElementById('sortDuration');
    
    // ✅ Arrow function para manejar clases activas
    const updateButtonState = (button, isActive) => {
        if (isActive) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    };
    
    updateButtonState(sortTitleBtn, activeSort === 'title');
    updateButtonState(sortDurationBtn, activeSort === 'duration');
};

// ✅ Arrow function para actualizar contador de resultados
const updateSearchCount = (count) => {
    const searchCountElement = document.getElementById('searchCount');
    if (searchCountElement) {
        searchCountElement.textContent = `${count} ${count === 1 ? 'resultado' : 'resultados'}`;
    }
};

// ✅ Arrow function para resetear el reproductor
const resetPlayer = () => {
    const player = window.musicPlayer;
    
    // Resetear estado
    player.playlist = [];
    player.currentTrackIndex = -1;
    player.isPlaying = false;
    player.currentTime = 0;
    
    // Resetear UI
    player.elements.currentSong.textContent = 'Selecciona una canción';
    player.elements.currentArtist.innerHTML = '<i class="fas fa-user"></i> <span>Artista</span>';
    player.elements.currentDuration.textContent = '--:--';
    player.elements.currentGenre.textContent = 'Género';
    player.elements.currentTime.textContent = '0:00';
    player.elements.totalTime.textContent = '0:00';
    player.elements.playerStatus.textContent = 'Pausado';
    player.elements.playIcon.className = 'fas fa-play';
    player.elements.albumCover.classList.remove('playing');
    
    // Limpiar lista
    player.elements.songList.innerHTML = '';
    
    // Limpiar input
    player.elements.searchInput.value = '';
    
    // Actualizar contador
    updateSearchCount(0);
    
    // Detener progreso si está corriendo
    if (player.progressInterval) {
        clearInterval(player.progressInterval);
        player.progressInterval = null;
    }
    
    console.log('🔄 Reproductor reiniciado');
    showNotification('Reproductor reiniciado', 'info');
};

// ✅ Arrow function para mostrar notificaciones
const showNotification = (message, type = 'info') => {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'error' ? '#e74c3c' : type === 'success' ? '#2ecc71' : '#3498db',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease'
    });
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Animaciones CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
};

// ✅ Arrow function para demostración interactiva
const runArrowFunctionDemo = () => {
    console.clear();
    console.log('%c🚀 DEMOSTRACIÓN DE ARROW FUNCTIONS', 'font-size: 20px; color: #1db954; font-weight: bold;');
    
    // 1. Arrow functions básicas
    console.log('\n%c1. Arrow Functions Básicas:', 'color: #3498db; font-weight: bold;');
    
    const sum = (a, b) => a + b;
    const square = x => x * x;
    const greet = name => `Hola, ${name}!`;
    
    console.log(`sum(5, 3) = ${sum(5, 3)}`);
    console.log(`square(4) = ${square(4)}`);
    console.log(`greet("Bootcamp") = ${greet("Bootcamp")}`);
    
    // 2. Arrow functions en arrays
    console.log('\n%c2. Arrow Functions en Array Methods:', 'color: #3498db; font-weight: bold;');
    
    const numbers = [1, 2, 3, 4, 5];
    const songs = [
        { title: 'Bohemian Rhapsody', duration: 354 },
        { title: 'Blinding Lights', duration: 200 },
        { title: 'Viva La Vida', duration: 242 }
    ];
    
    // Map
    const squares = numbers.map(n => n * n);
    console.log('Map:', numbers, '→', squares);
    
    // Filter
    const longSongs = songs.filter(song => song.duration > 250);
    console.log('Filter (duración > 250):', longSongs);
    
    // Reduce
    const totalDuration = songs.reduce((total, song) => total + song.duration, 0);
    console.log('Reduce (duración total):', totalDuration);
    
    // 3. Arrow functions y this
    console.log('\n%c3. Arrow Functions y "this":', 'color: #3498db; font-weight: bold;');
    
    const player = {
        name: 'Reproductor Demo',
        tracks: ['Track 1', 'Track 2', 'Track 3'],
        
        // Arrow function mantiene el contexto
        playWithArrow: () => {
            console.log(`Reproduciendo en: ${this.name}`); // undefined
        },
        
        // Método tradicional
        playTraditional() {
            console.log(`Reproduciendo en: ${this.name}`); // Correcto
        },
        
        // Arrow function como callback mantiene contexto
        playAllTracks() {
            this.tracks.forEach((track, index) => {
                console.log(`${index + 1}. ${track} (en ${this.name})`);
            });
        }
    };
    
    player.playTraditional();
    player.playAllTracks();
    
    // 4. Arrow functions asíncronas
    console.log('\n%c4. Arrow Functions Asíncronas:', 'color: #3498db; font-weight: bold;');
    
    const fetchData = async (url) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ data: `Datos de ${url}`, status: 200 });
            }, 1000);
        });
    };
    
    const processData = async () => {
        try {
            const result = await fetchData('api/musica');
            console.log('Datos obtenidos:', result);
            
            // Encadenamiento con arrow functions
            const process = data => data.toUpperCase();
            const logResult = data => console.log('Procesado:', data);
            
            process(result.data).then(logResult);
            
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    processData();
    
    // Mostrar notificación
    showNotification('Demostración ejecutada en consola', 'success');
};

// ✅ Arrow function para demostrar conceptos en consola
const demonstrateArrowFunctions = () => {
    setTimeout(() => {
        console.log('%c💡 CONSEJOS DE ARROW FUNCTIONS:', 'font-size: 16px; color: #f39c12;');
        console.log('%c• Usa arrow functions para callbacks cortos', 'color: #b3b3b3;');
        console.log('%c• Usa arrow functions en métodos de array (map, filter, reduce)', 'color: #b3b3b3;');
        console.log('%c• Usa arrow functions cuando necesites mantener el contexto léxico (this)', 'color: #b3b3b3;');
        console.log('%c• NO uses arrow functions como métodos de objeto si necesitas this dinámico', 'color: #b3b3b3;');
        console.log('%c• NO uses arrow functions en constructores', 'color: #b3b3b3;');
    }, 2000);
};

// ✅ Arrow function para manejar errores globales
const setupGlobalErrorHandling = () => {
    // Manejar errores no capturados
    window.addEventListener('error', (event) => {
        console.error('❌ Error global:', event.error);
        showNotification(`Error: ${event.message}`, 'error');
    });
    
    // Manejar promesas rechazadas no capturadas
    window.addEventListener('unhandledrejection', (event) => {
        console.error('❌ Promesa rechazada:', event.reason);
        showNotification(`Error en promesa: ${event.reason.message || 'Error desconocido'}`, 'error');
    });
};

// ✅ Arrow function para agregar funcionalidades adicionales
const setupAdditionalFeatures = () => {
    // Atajos de teclado
    document.addEventListener('keydown', (event) => {
        // Space para play/pause
        if (event.code === 'Space' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            window.musicPlayer.togglePlay();
        }
        
        // Flechas para navegar
        if (event.code === 'ArrowRight') {
            window.musicPlayer.nextTrack();
        }
        
        if (event.code === 'ArrowLeft') {
            window.musicPlayer.prevTrack();
        }
    });
    
    // Volumen con rueda del mouse
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.addEventListener('wheel', (event) => {
            event.preventDefault();
            const delta = event.deltaY > 0 ? -5 : 5;
            const newVolume = Math.min(100, Math.max(0, window.musicPlayer.volume + delta));
            window.musicPlayer.setVolume(newVolume);
            volumeSlider.value = newVolume;
        });
    }
};

// ✅ Arrow function principal que ejecuta todo
const main = () => {
    // Configurar manejo de errores
    setupGlobalErrorHandling();
    
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
    
    // Configurar características adicionales
    setTimeout(setupAdditionalFeatures, 1000);
};

// Iniciar la aplicación
main();

// Exportar funciones para pruebas
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        sortSongs,
        resetPlayer,
        runArrowFunctionDemo,
        demonstrateArrowFunctions
    };
}