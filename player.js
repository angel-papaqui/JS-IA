/**
 * Clase Reproductor Musical con Arrow Functions
 * Maneja toda la lógica del reproductor
 */

class MusicPlayer {
    constructor() {
        // Verificar que MusicAPISimulator esté disponible
        if (typeof MusicAPISimulator === 'undefined') {
            throw new Error('MusicAPISimulator no está definido. Verifica el orden de los scripts.');
        }
        
        this.api = new MusicAPISimulator();
        this.playlist = [];
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        this.currentTime = 0;
        this.volume = 70;
        this.progressInterval = null;
        this.sortBy = 'title';
        this.sortOrder = 'asc';
        
        this.elements = {};
        this.initializeElements();
        this.bindEvents();
        
        // ✅ Debounce para búsqueda (optimización)
        this.debouncedSearch = this.createDebouncedSearch();
        
        // Inicializar con datos de ejemplo
        this.loadExampleData();
    }

    // ✅ Arrow function para inicializar elementos DOM
    initializeElements = () => {
        const getElement = (id) => document.getElementById(id);
        
        this.elements = {
            // Inputs
            searchInput: getElement('searchInput'),
            searchBtn: getElement('searchBtn'),
            volumeSlider: getElement('volumeSlider'),
            
            // Player display
            currentSong: getElement('currentSong'),
            currentArtist: getElement('currentArtist'),
            currentDuration: getElement('currentDuration'),
            currentGenre: getElement('currentGenre'),
            currentTime: getElement('currentTime'),
            totalTime: getElement('totalTime'),
            playerStatus: getElement('playerStatus'),
            albumCover: getElement('albumCover'),
            progressBar: getElement('progressBar'),
            
            // Controls
            playBtn: getElement('playBtn'),
            playIcon: getElement('playIcon'),
            prevBtn: getElement('prevBtn'),
            nextBtn: getElement('nextBtn'),
            
            // Results
            songList: getElement('songList'),
            loadingMessage: getElement('loadingMessage'),
            errorContainer: getElement('errorContainer'),
            errorMessage: getElement('errorMessage'),
            searchCount: getElement('searchCount')
        };
    };

    // ✅ Arrow function para bindear eventos
    bindEvents = () => {
        const { searchBtn, playBtn, prevBtn, nextBtn, volumeSlider } = this.elements;
        
        // ✅ Arrow functions para event listeners
        searchBtn?.addEventListener('click', () => this.handleSearch());
        
        playBtn?.addEventListener('click', () => this.togglePlay());
        prevBtn?.addEventListener('click', () => this.prevTrack());
        nextBtn?.addEventListener('click', () => this.nextTrack());
        
        volumeSlider?.addEventListener('input', (e) => {
            this.setVolume(parseInt(e.target.value));
        });
        
        // Enter en el input de búsqueda
        this.elements.searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
    };

    // ✅ Arrow function para crear debounce (optimización)
    createDebouncedSearch = () => {
        let timeoutId;
        
        return (query = null) => {
            const searchQuery = query || this.elements.searchInput?.value.trim();
            
            if (!searchQuery) {
                this.showError('Por favor, escribe un artista para buscar');
                return;
            }
            
            // Limpiar timeout anterior
            clearTimeout(timeoutId);
            
            // Establecer nuevo timeout
            timeoutId = setTimeout(() => {
                this.performSearch(searchQuery);
            }, 500);
        };
    };

    // ✅ Arrow function para manejar búsqueda
    handleSearch = async () => {
        const query = this.elements.searchInput?.value.trim();
        
        if (!query) {
            this.showError('Por favor, escribe un artista para buscar');
            return;
        }
        
        await this.performSearch(query);
    };

    // ✅ Arrow function para realizar búsqueda
    performSearch = async (query) => {
        this.showLoading(`Buscando "${query}"...`);
        this.hideError();
        
        try {
            // Usar arrow function en then
            const results = await this.api.searchArtists(query)
                .then(data => {
                    console.log(`✅ Encontradas ${data.length} canciones para "${query}"`);
                    return data;
                });
            
            if (results.length === 0) {
                this.showError(`No se encontraron canciones para "${query}". Prueba con otro artista.`);
                this.renderSongList([]);
            } else {
                this.playlist = results;
                this.renderSongList(results);
                this.updateSearchCount(results.length);
                this.showSuccess(`${results.length} canciones encontradas`);
            }
            
        } catch (error) {
            // Arrow function en catch
            this.showError(`Error en búsqueda: ${error.message}`);
            console.error('Search error:', error);
        } finally {
            this.hideLoading();
        }
    };

    // ✅ Arrow function para renderizar lista de canciones
    renderSongList = (songs) => {
        const { songList } = this.elements;
        
        if (!songList) return;
        
        if (songs.length === 0) {
            songList.innerHTML = `
                <div class="song-item empty-state">
                    <i class="fas fa-music"></i>
                    <div>
                        <h4>No hay canciones</h4>
                        <p>Busca un artista para empezar</p>
                    </div>
                </div>
            `;
            return;
        }
        
        // ✅ Arrow function en map para crear HTML
        const songsHTML = songs.map((song, index) => `
            <div class="song-item ${index === this.currentTrackIndex ? 'active' : ''}" 
                 data-index="${index}"
                 onclick="window.musicPlayer.selectTrack(${index})">
                <div class="song-number">${index + 1}</div>
                <div class="song-content">
                    <h4>${song.title}</h4>
                    <p>
                        <i class="fas fa-user"></i> ${song.artist}
                        <span class="genre-tag">${song.genre}</span>
                    </p>
                </div>
                <div class="song-duration">
                    <span class="play-indicator">
                        ${index === this.currentTrackIndex ? '<i class="fas fa-play"></i>' : ''}
                    </span>
                    ${MusicAPISimulator.formatDuration(song.duration)}
                </div>
            </div>
        `).join('');
        
        songList.innerHTML = songsHTML;
    };

    // ✅ Arrow function para seleccionar track
    selectTrack = (index) => {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentTrackIndex = index;
        const track = this.playlist[index];
        
        // Actualizar UI
        this.updateNowPlaying(track);
        this.highlightCurrentTrack();
        
        // Reproducir automáticamente
        this.playTrack();
    };

    // ✅ Arrow function para actualizar información de reproducción
    updateNowPlaying = (track) => {
        const { currentSong, currentArtist, currentDuration, currentGenre, totalTime } = this.elements;
        
        if (!track) return;
        
        // ✅ Arrow function para truncar texto largo
        const truncate = (text, maxLength) => 
            text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        
        currentSong.textContent = truncate(track.title, 40);
        currentArtist.innerHTML = `<i class="fas fa-user"></i> <span>${track.artist}</span>`;
        currentDuration.textContent = MusicAPISimulator.formatDuration(track.duration);
        currentGenre.textContent = track.genre;
        totalTime.textContent = MusicAPISimulator.formatDuration(track.duration);
        
        // Resetear progreso
        this.currentTime = 0;
        this.updateProgress();
        
        // Animar cover
        this.elements.albumCover?.classList.add('playing');
    };

    // ✅ Arrow function para reproducir track
    playTrack = () => {
        if (this.currentTrackIndex < 0) return;
        
        this.isPlaying = true;
        this.elements.playIcon.className = 'fas fa-pause';
        this.elements.playerStatus.textContent = 'Reproduciendo';
        
        // Simular progreso de reproducción
        this.startProgressSimulation();
    };

    // ✅ Arrow function para pausar
    pauseTrack = () => {
        this.isPlaying = false;
        this.elements.playIcon.className = 'fas fa-play';
        this.elements.playerStatus.textContent = 'Pausado';
        
        // Detener progreso
        this.stopProgressSimulation();
    };

    // ✅ Arrow function para toggle play/pause
    togglePlay = () => {
        if (this.currentTrackIndex < 0 && this.playlist.length > 0) {
            this.selectTrack(0);
        } else if (this.isPlaying) {
            this.pauseTrack();
        } else {
            this.playTrack();
        }
    };

    // ✅ Arrow function para siguiente track
    nextTrack = () => {
        if (this.playlist.length === 0) return;
        
        const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.selectTrack(nextIndex);
    };

    // ✅ Arrow function para track anterior
    prevTrack = () => {
        if (this.playlist.length === 0) return;
        
        const prevIndex = this.currentTrackIndex <= 0 
            ? this.playlist.length - 1 
            : this.currentTrackIndex - 1;
        this.selectTrack(prevIndex);
    };

    // ✅ Arrow function para simular progreso
    startProgressSimulation = () => {
        this.stopProgressSimulation();
        
        const track = this.playlist[this.currentTrackIndex];
        if (!track) return;
        
        const totalDuration = track.duration;
        
        this.progressInterval = setInterval(() => {
            if (this.currentTime >= totalDuration) {
                this.nextTrack();
                return;
            }
            
            this.currentTime += 1;
            this.updateProgress();
        }, 1000);
    };

    // ✅ Arrow function para detener progreso
    stopProgressSimulation = () => {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    };

    // ✅ Arrow function para actualizar barra de progreso
    updateProgress = () => {
        const { progressBar, currentTime: currentTimeElement } = this.elements;
        const track = this.playlist[this.currentTrackIndex];
        
        if (!track || !progressBar) return;
        
        const progress = (this.currentTime / track.duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        if (currentTimeElement) {
            currentTimeElement.textContent = MusicAPISimulator.formatDuration(this.currentTime);
        }
    };

    // ✅ Arrow function para resaltar track actual
    highlightCurrentTrack = () => {
        document.querySelectorAll('.song-item').forEach((item, index) => {
            if (index === this.currentTrackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    // ✅ Arrow function para establecer volumen
    setVolume = (volume) => {
        this.volume = Math.max(0, Math.min(100, volume));
        console.log(`Volume: ${this.volume}%`);
    };

    // ✅ Arrow function para cargar datos de ejemplo
    loadExampleData = async () => {
        try {
            // Cargar algunos artistas por defecto
            const defaultArtists = ['Coldplay', 'Queen'];
            const allPromises = defaultArtists.map(artist => 
                this.api.searchArtists(artist).catch(() => [])
            );
            
            const results = await Promise.all(allPromises);
            const combinedResults = results.flat().slice(0, 8); // Limitar a 8 canciones
            
            this.playlist = combinedResults;
            if (combinedResults.length > 0) {
                this.renderSongList(combinedResults);
                this.updateSearchCount(combinedResults.length);
            }
            
        } catch (error) {
            console.error('Error loading example data:', error);
        }
    };

    // ✅ Arrow function para actualizar contador
    updateSearchCount = (count) => {
        const { searchCount } = this.elements;
        if (searchCount) {
            searchCount.textContent = `${count} ${count === 1 ? 'resultado' : 'resultados'}`;
        }
    };

    // ✅ Arrow functions para manejo de UI
    showLoading = (message = 'Cargando...') => {
        const { loadingMessage } = this.elements;
        if (loadingMessage) {
            loadingMessage.innerHTML = `
                <div class="spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <p>${message}</p>
            `;
            loadingMessage.style.display = 'block';
        }
    };

    hideLoading = () => {
        const { loadingMessage } = this.elements;
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }
    };

    showError = (message) => {
        const { errorContainer, errorMessage } = this.elements;
        if (errorContainer && errorMessage) {
            errorMessage.textContent = message;
            errorContainer.style.display = 'flex';
        }
    };

    hideError = () => {
        const { errorContainer } = this.elements;
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    };

    showSuccess = (message) => {
        console.log(`✅ ${message}`);
        // Podrías agregar notificaciones toast aquí
    };
}

// Verificar que estamos en el navegador
if (typeof window !== 'undefined') {
    window.MusicPlayer = MusicPlayer;
}