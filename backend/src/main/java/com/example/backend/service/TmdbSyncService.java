package com.example.backend.service;

import com.example.backend.model.Categoria;
import com.example.backend.model.Filme;
import com.example.backend.repository.CategoriaRepository;
import com.example.backend.repository.FilmeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TmdbSyncService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private FilmeRepository filmeRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String TMDB_API_KEY = "dfa86a914be5b8f4bc8d5c2605b8f5ba"; 

    // Roda todo dia as 3 da manha (se descomentar) ou chamando manualmente
    // @Scheduled(cron = "0 0 3 * * ?")
    public void syncPopularMovies() {
        if (TMDB_API_KEY.equals("COLOQUE_SUA_CHAVE_AQUI")) {
            System.out.println("Por favor, adicione sua chave do TMDB no TmdbSyncService.java");
            return;
        }

        System.out.println("Iniciando sincronização com TMDB...");

        // 1. Sincronizar Categorias
        String genresUrl = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + TMDB_API_KEY + "&language=pt-BR";
        TmdbGenresResponse genresResponse = restTemplate.getForObject(genresUrl, TmdbGenresResponse.class);
        
        Map<Integer, Categoria> tmdbGenreToCategoriaMap = new HashMap<>();
        
        if (genresResponse != null && genresResponse.getGenres() != null) {
            for (TmdbGenre g : genresResponse.getGenres()) {
                // Busca se já existe
                Categoria cat = categoriaRepository.findByNome(g.getName()).orElseGet(() -> {
                    // Cria se não existir
                    Categoria novaCat = new Categoria(g.getName());
                    return categoriaRepository.save(novaCat);
                });
                tmdbGenreToCategoriaMap.put(g.getId(), cat);
            }
        }

        // 2. Sincronizar Filmes de Múltiplas Fontes (Populares, Bem avaliados, Lançamentos)
        List<String> endpoints = List.of(
            "https://api.themoviedb.org/3/movie/popular?api_key=" + TMDB_API_KEY + "&language=pt-BR&page=1",
            "https://api.themoviedb.org/3/movie/popular?api_key=" + TMDB_API_KEY + "&language=pt-BR&page=2",
            "https://api.themoviedb.org/3/movie/popular?api_key=" + TMDB_API_KEY + "&language=pt-BR&page=3",
            "https://api.themoviedb.org/3/movie/top_rated?api_key=" + TMDB_API_KEY + "&language=pt-BR&page=1",
            "https://api.themoviedb.org/3/movie/top_rated?api_key=" + TMDB_API_KEY + "&language=pt-BR&page=2",
            "https://api.themoviedb.org/3/movie/now_playing?api_key=" + TMDB_API_KEY + "&language=pt-BR&page=1"
        );

        int totalAdicionados = 0;

        for (String url : endpoints) {
            TmdbMovieResponse moviesResponse = restTemplate.getForObject(url, TmdbMovieResponse.class);

            if (moviesResponse != null && moviesResponse.getResults() != null) {
                for (TmdbMovie tmdbMovie : moviesResponse.getResults()) {
                    // Se já temos no banco, pula
                    if (filmeRepository.existsById(tmdbMovie.getId())) {
                        continue;
                    }

                    // Busca detalhes para pegar a duração
                    String detailsUrl = "https://api.themoviedb.org/3/movie/" + tmdbMovie.getId() + "?api_key=" + TMDB_API_KEY + "&language=pt-BR";
                    TmdbMovieDetails details = null;
                    try {
                        details = restTemplate.getForObject(detailsUrl, TmdbMovieDetails.class);
                    } catch (Exception e) {
                        System.out.println("Aviso: Falha ao buscar detalhes do filme " + tmdbMovie.getId());
                    }

                    // Determina a categoria principal (pegamos a primeira)
                    Categoria categoriaEscolhida = null;
                    if (tmdbMovie.getGenre_ids() != null && !tmdbMovie.getGenre_ids().isEmpty()) {
                        categoriaEscolhida = tmdbGenreToCategoriaMap.get(tmdbMovie.getGenre_ids().get(0));
                    }

                    if (categoriaEscolhida == null) {
                        // Fallback
                        categoriaEscolhida = categoriaRepository.findByNome("Ação").orElse(null);
                        if (categoriaEscolhida == null) continue;
                    }

                    // Pega ano
                    int ano = 2026;
                    if (tmdbMovie.getRelease_date() != null && tmdbMovie.getRelease_date().length() >= 4) {
                        try { ano = Integer.parseInt(tmdbMovie.getRelease_date().substring(0, 4)); } catch (Exception e) {}
                    }

                    // Cria e salva
                    Filme novoFilme = new Filme();
                    novoFilme.setId(tmdbMovie.getId());
                    novoFilme.setTmdbId(tmdbMovie.getId());
                    novoFilme.setTitulo(tmdbMovie.getTitle());
                    novoFilme.setAnoLancamento(ano);
                    novoFilme.setCategoria(categoriaEscolhida);
                    novoFilme.setCapa(tmdbMovie.getPoster_path() != null ? "https://image.tmdb.org/t/p/w500" + tmdbMovie.getPoster_path() : "");
                    novoFilme.setDuracaoMinutos(details != null && details.getRuntime() != null ? details.getRuntime() : 120);

                    filmeRepository.save(novoFilme);
                    totalAdicionados++;
                    System.out.println("Filme salvo: " + novoFilme.getTitulo());
                }
            }
        }
        System.out.println("Sincronização Finalizada! Total de filmes adicionados: " + totalAdicionados);
    }

    // Classes DTO (Data Transfer Objects) internas para ler o JSON do TMDB
    static class TmdbGenresResponse {
        private List<TmdbGenre> genres;
        public List<TmdbGenre> getGenres() { return genres; }
        public void setGenres(List<TmdbGenre> genres) { this.genres = genres; }
    }
    static class TmdbGenre {
        private int id;
        private String name;
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
    static class TmdbMovieResponse {
        private List<TmdbMovie> results;
        public List<TmdbMovie> getResults() { return results; }
        public void setResults(List<TmdbMovie> results) { this.results = results; }
    }
    static class TmdbMovie {
        private int id;
        private String title;
        private String release_date;
        private String poster_path;
        private List<Integer> genre_ids;
        // getters & setters
        public int getId() { return id; } public void setId(int id) { this.id = id; }
        public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
        public String getRelease_date() { return release_date; } public void setRelease_date(String release_date) { this.release_date = release_date; }
        public String getPoster_path() { return poster_path; } public void setPoster_path(String poster_path) { this.poster_path = poster_path; }
        public List<Integer> getGenre_ids() { return genre_ids; } public void setGenre_ids(List<Integer> genre_ids) { this.genre_ids = genre_ids; }
    }
    static class TmdbMovieDetails {
        private Integer runtime;
        public Integer getRuntime() { return runtime; }
        public void setRuntime(Integer runtime) { this.runtime = runtime; }
    }
}
