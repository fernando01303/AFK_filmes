package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "filmes")
public class Filme extends Midia {

    @Column(name = "duracao_minutos", nullable = false)
    private Integer duracaoMinutos;

    public Filme() {}

    public Filme(String titulo, Integer anoLancamento, Categoria categoria, Integer duracaoMinutos) {
        super(titulo, anoLancamento, categoria);
        this.duracaoMinutos = duracaoMinutos;
    }

    @Override
    public String exibirDetalhes() {
        return "Filme: " + getTitulo() + " (" + getAnoLancamento() + ") - Duração: " + duracaoMinutos + " min. Categoria: " + getCategoria().getNome();
    }

    public Integer getDuracaoMinutos() { return duracaoMinutos; }
    public void setDuracaoMinutos(Integer duracaoMinutos) { this.duracaoMinutos = duracaoMinutos; }
}
