package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "series")
public class Serie extends Midia {

    @Column(nullable = false)
    private Integer temporadas;

    @Column(name = "episodios_por_temporada", nullable = false)
    private Integer episodiosPorTemporada;

    public Serie() {}

    public Serie(String titulo, Integer anoLancamento, Categoria categoria, Integer temporadas, Integer episodiosPorTemporada) {
        super(titulo, anoLancamento, categoria);
        this.temporadas = temporadas;
        this.episodiosPorTemporada = episodiosPorTemporada;
    }

    @Override
    public String exibirDetalhes() {
        return "Série: " + getTitulo() + " (" + getAnoLancamento() + ") - Temporadas: " + temporadas + ", Episódios/Temp: " + episodiosPorTemporada + ". Categoria: " + getCategoria().getNome();
    }

    public Integer getTemporadas() { return temporadas; }
    public void setTemporadas(Integer temporadas) { this.temporadas = temporadas; }

    public Integer getEpisodiosPorTemporada() { return episodiosPorTemporada; }
    public void setEpisodiosPorTemporada(Integer episodiosPorTemporada) { this.episodiosPorTemporada = episodiosPorTemporada; }
}
