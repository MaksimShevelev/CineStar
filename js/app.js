const apiKey = '4bca1acc7fc125e6bd15772c2e0bc964'; // clave de API de TMDb

const app = Vue.createApp({
  data() {
    return {
      peliculas: [],
      peliculasPopulares: [],
      consulta: '',
      peliculaSeleccionada: null,
      favoritos: [],
      generoSeleccionado: '',
      edadSeleccionada: '', // Параметр для фильтра по возрасту
      generos: [
        { id: 28, name: 'Acción' },
        { id: 12, name: 'Aventura' },
        { id: 16, name: 'Animación' },
        { id: 35, name: 'Comedia' },
        { id: 80, name: 'Crimen' },
        { id: 99, name: 'Documental' },
        { id: 18, name: 'Drama' },
        { id: 10751, name: 'Familiar' },
        { id: 14, name: 'Fantasía' },
        { id: 36, name: 'Historia' },
        { id: 27, name: 'Terror' },
        { id: 10402, name: 'Música' },
        { id: 9648, name: 'Misterio' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Ciencia ficción' },
        { id: 10770, name: 'Película de TV' },
        { id: 53, name: 'Suspenso' },
        { id: 10752, name: 'Bélica' },
        { id: 37, name: 'Western' }
      ],
      edades: [
        { value: '', text: 'Todas las edades' },
        { value: 'G', text: 'G - General Audience' },
        { value: 'PG', text: 'PG - Parental Guidance Suggested' },
        { value: 'PG-13', text: 'PG-13 - Parents Strongly Cautioned' },
        { value: 'R', text: 'R - Restricted' },
        { value: 'NC-17', text: 'NC-17 - Adults Only' }
      ],
      mostrarPeliculasPopulares: true,
      mensajeError: '',
      mensajeAlerta: null
    };
  },
  methods: {
    async buscarPeliculas() {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${this.consulta}&language=es-ES&page=1&api_key=${apiKey}`);
        const data = await response.json();
        this.peliculas = data.results;
        this.mostrarPeliculasPopulares = false;
        if (this.peliculas.length === 0) {
          this.mostrarAlerta('warning', 'No se encontraron resultados para tu búsqueda.');
        } else {
          this.mensajeError = '';
        }
      } catch (error) {
        console.error('Error al buscar películas:', error);
        this.mostrarAlerta('danger', 'Ocurrió un error al realizar la búsqueda. Intenta nuevamente.');
      }
    },
    async obtenerPeliculasPopulares() {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1&api_key=${apiKey}`);
        const data = await response.json();
        this.peliculasPopulares = data.results;
      } catch (error) {
        console.error('Error al obtener películas populares:', error);
        this.mostrarAlerta('danger', 'Error al obtener películas populares. Intenta nuevamente.');
      }
    },
    async obtenerDetallesPelicula(id) {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=es-ES&api_key=${apiKey}`);
        const data = await response.json();
        window.location.href = `detalles.html?id=${data.id}`;
      } catch (error) {
        console.error('Información detallada de la película:', error);
        this.mostrarAlerta('danger', 'Error al recuperar los detalles de la película. Intentar otra vez.');
      }
    },
    agregarAFavoritos(pelicula) {
      if (!this.esFavorita(pelicula.id)) {
        this.favoritos.push(pelicula);
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
        this.mostrarAlerta('success', 'Película agregada a favoritos');
      }
    },
    eliminarDeFavoritos(id) {
      this.favoritos = this.favoritos.filter(pelicula => pelicula.id !== id);
      localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
      this.mostrarAlerta('danger', 'Película eliminada de favoritos');
    },
    esFavorita(id) {
      return this.favoritos.some(p => p.id === id);
    },
    cargarFavoritos() {
      const favoritosGuardados = localStorage.getItem('favoritos');
      if (favoritosGuardados) {
        this.favoritos = JSON.parse(favoritosGuardados);
      }
    },
    filtrarPorGenero() {
      if (!this.generoSeleccionado) {
        this.obtenerPeliculasPopulares();
      } else {
        this.buscarPeliculasPorGenero();
      }
    },
    async buscarPeliculasPorGenero() {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${this.generoSeleccionado}&language=es-ES&page=1&api_key=${apiKey}`);
        const data = await response.json();
        this.peliculas = data.results;
        this.mostrarPeliculasPopulares = false;
      } catch (error) {
        console.error('Error al buscar películas por género:', error);
        this.mostrarAlerta('danger', 'Ocurrió un error al realizar la búsqueda por género. Intenta nuevamente.');
      }
    },
    async filtrarPorEdad() {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?certification_country=US&certification=${this.edadSeleccionada}&language=es-ES&page=1&api_key=${apiKey}`);
        const data = await response.json();
        this.peliculas = data.results;
        this.mostrarPeliculasPopulares = false;
        if (this.peliculas.length === 0) {
          this.mostrarAlerta('warning', 'No se encontraron resultados para la edad seleccionada.');
        } else {
          this.mensajeError = '';
        }
      } catch (error) {
        console.error('Error al filtrar películas por edad:', error);
        this.mostrarAlerta('danger', 'Ocurrió un error al realizar la búsqueda por edad. Intenta nuevamente.');
      }
    },
    mostrarAlerta(tipo, texto) {
      this.mensajeAlerta = { tipo: `alert-${tipo}`, texto: texto };
      setTimeout(() => {
        this.mensajeAlerta = null;
      }, 3000);
    }    
  },
  created() {
    this.obtenerPeliculasPopulares();
    this.cargarFavoritos();
  }
});

app.mount('#app');
