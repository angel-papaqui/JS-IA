/**
 * API de Música Simulada con Arrow Functions
 * No requiere API key - Datos simulados para demostración
 */

class MusicAPISimulator {
    constructor() {
        this.cache = new Map();
        this.requestQueue = new Map();
        this.rateLimitDelay = 500;
        
        // ✅ Arrow function para transformar datos (método privado)
        this.transformTrackData = (track) => ({
            id: track.id,
            title: track.title,
            artist: track.artist,
            duration: track.duration,
            genre: track.genre,
            album: track.album || `${track.artist} Album`,
            year: track.year || 2023,
            popularity: track.popularity || Math.floor(Math.random() * 100)
        });
    }

    // ✅ Arrow function para formatear duración (método estático)
    static formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // ✅ Simulación de base de datos de música
    getMusicDatabase() {
        return {
            'coldplay': [
                { id: 1, title: 'Viva La Vida', artist: 'Coldplay', duration: 242, genre: 'Alternative Rock', year: 2008, popularity: 95 },
                { id: 2, title: 'The Scientist', artist: 'Coldplay', duration: 309, genre: 'Alternative Rock', year: 2002, popularity: 90 },
                { id: 3, title: 'Paradise', artist: 'Coldplay', duration: 277, genre: 'Pop Rock', year: 2011, popularity: 88 },
                { id: 4, title: 'Yellow', artist: 'Coldplay', duration: 266, genre: 'Alternative Rock', year: 2000, popularity: 92 },
                { id: 5, title: 'Fix You', artist: 'Coldplay', duration: 294, genre: 'Alternative Rock', year: 2005, popularity: 94 }
            ],
            'bad bunny': [
                { id: 6, title: 'Dákiti', artist: 'Bad Bunny', duration: 205, genre: 'Reggaeton', year: 2020, popularity: 98 },
                { id: 7, title: 'Tití Me Preguntó', artist: 'Bad Bunny', duration: 244, genre: 'Reggaeton', year: 2022, popularity: 97 },
                { id: 8, title: 'Me Porto Bonito', artist: 'Bad Bunny', duration: 178, genre: 'Reggaeton', year: 2022, popularity: 96 },
                { id: 9, title: 'Moscow Mule', artist: 'Bad Bunny', duration: 245, genre: 'Reggaeton', year: 2022, popularity: 92 },
                { id: 10, title: 'Efecto', artist: 'Bad Bunny', duration: 213, genre: 'Reggaeton', year: 2022, popularity: 91 }
            ],
            'queen': [
                { id: 11, title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354, genre: 'Rock', year: 1975, popularity: 99 },
                { id: 12, title: 'Don\'t Stop Me Now', artist: 'Queen', duration: 209, genre: 'Rock', year: 1978, popularity: 96 },
                { id: 13, title: 'Another One Bites the Dust', artist: 'Queen', duration: 215, genre: 'Funk Rock', year: 1980, popularity: 95 },
                { id: 14, title: 'We Will Rock You', artist: 'Queen', duration: 122, genre: 'Rock', year: 1977, popularity: 98 },
                { id: 15, title: 'I Want to Break Free', artist: 'Queen', duration: 258, genre: 'Pop Rock', year: 1984, popularity: 93 }
            ],
            'taylor swift': [
                { id: 16, title: 'Shake It Off', artist: 'Taylor Swift', duration: 219, genre: 'Pop', year: 2014, popularity: 95 },
                { id: 17, title: 'Blank Space', artist: 'Taylor Swift', duration: 231, genre: 'Pop', year: 2014, popularity: 96 },
                { id: 18, title: 'Love Story', artist: 'Taylor Swift', duration: 235, genre: 'Country Pop', year: 2008, popularity: 94 },
                { id: 19, title: 'Anti-Hero', artist: 'Taylor Swift', duration: 200, genre: 'Pop', year: 2022, popularity: 97 }
            ],
            'the weeknd': [
                { id: 20, title: 'Blinding Lights', artist: 'The Weeknd', duration: 200, genre: 'R&B', year: 2019, popularity: 99 },
                { id: 21, title: 'Save Your Tears', artist: 'The Weeknd', duration: 215, genre: 'R&B', year: 2020, popularity: 97 },
                { id: 22, title: 'Starboy', artist: 'The Weeknd', duration: 230, genre: 'R&B', year: 2016, popularity: 96 },
                { id: 23, title: 'The Hills', artist: 'The Weeknd', duration: 242, genre: 'R&B', year: 2015, popularity: 95 }
            ],
            'arctic monkeys': [
                { id: 24, title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', duration: 272, genre: 'Indie Rock', year: 2013, popularity: 98 },
                { id: 25, title: '505', artist: 'Arctic Monkeys', duration: 253, genre: 'Indie Rock', year: 2007, popularity: 96 },
                { id: 26, title: 'R U Mine?', artist: 'Arctic Monkeys', duration: 202, genre: 'Indie Rock', year: 2012, popularity: 95 }
            ]
        };
    }

    // ✅ Búsqueda con arrow function (método de instancia)
    searchArtists = async (artistName, options = {}) => {
        const cacheKey = `${artistName}-${JSON.stringify(options)}`;
        
        // Cache check con arrow function
        const getFromCache = (key) => {
            if (this.cache.has(key)) {
                const cached = this.cache.get(key);
                console.log(`✅ Cache hit para: ${artistName}`);
                return cached;
            }
            return null;
        };

        const cachedResult = getFromCache(cacheKey);
        if (cachedResult) return cachedResult;

        // Rate limiting simulation
        if (this.requestQueue.has(artistName)) {
            console.log(`⏳ Request ya en cola para: ${artistName}`);
            return this.requestQueue.get(artistName);
        }

        // ✅ Simular delay de red con arrow function
        const networkDelay = () => new Promise(resolve => {
            setTimeout(() => {
                console.log(`🌐 Simulando request API para: ${artistName}`);
                resolve();
            }, this.rateLimitDelay);
        });

        // Crear promesa para la cola de requests
        const searchPromise = (async () => {
            await networkDelay();
            
            const db = this.getMusicDatabase();
            const searchTerm = artistName.toLowerCase();
            let results = [];

            // ✅ Arrow function para búsqueda en database
            const searchInDatabase = (term) => {
                if (db[term]) {
                    return db[term];
                }

                // Búsqueda parcial con arrow functions
                const allTracks = Object.values(db).flat();
                return allTracks.filter(track => {
                    const trackArtist = track.artist.toLowerCase();
                    const trackTitle = track.title.toLowerCase();
                    return trackArtist.includes(term) || trackTitle.includes(term);
                });
            };

            results = searchInDatabase(searchTerm);

            // ✅ Aplicar filtros con arrow functions
            if (options.minDuration) {
                results = results.filter(track => track.duration >= options.minDuration);
            }

            if (options.genre) {
                results = results.filter(track => 
                    track.genre.toLowerCase().includes(options.genre.toLowerCase())
                );
            }

            // ✅ Ordenar resultados
            if (options.sortBy) {
                results = this.sortResults(results, options.sortBy, options.sortOrder);
            }

            // Transformar datos
            const transformedResults = results.map(this.transformTrackData);

            // Guardar en cache
            this.cache.set(cacheKey, transformedResults);
            this.requestQueue.delete(artistName);

            return transformedResults;
        })();

        this.requestQueue.set(artistName, searchPromise);
        return searchPromise;
    };

    // ✅ Arrow function para ordenar resultados
    sortResults = (tracks, sortBy, order = 'asc') => {
        return [...tracks].sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'duration':
                    comparison = a.duration - b.duration;
                    break;
                case 'popularity':
                    comparison = b.popularity - a.popularity; // Descendente por defecto
                    break;
                case 'year':
                    comparison = b.year - a.year;
                    break;
                default:
                    comparison = a.title.localeCompare(b.title);
            }
            
            return order === 'asc' ? comparison : -comparison;
        });
    };

    // ✅ Método para obtener sugerencias (arrow function)
    getSuggestions = async (partialName) => {
        const allArtists = Object.keys(this.getMusicDatabase());
        
        // Arrow function para filtrar artistas
        const filteredArtists = allArtists.filter(artist =>
            artist.toLowerCase().includes(partialName.toLowerCase())
        );
        
        // Arrow function para mapear resultados
        const suggestions = filteredArtists.map(artist => ({
            name: artist.charAt(0).toUpperCase() + artist.slice(1),
            count: this.getMusicDatabase()[artist].length
        }));
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return suggestions.slice(0, 5); // Limitar a 5 sugerencias
    };

    // ✅ Método estático para generar ID único
    static generateTrackId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicAPISimulator;
}