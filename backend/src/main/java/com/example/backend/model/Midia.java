package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "midias")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Midia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(name = "ano_lancamento", nullable = false)
    private Integer anoLancamento;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    public Midia() {}

    public Midia(String titulo, Integer anoLancamento, Categoria categoria) {
        this.titulo = titulo;
        this.anoLancamento = anoLancamento;
        this.categoria = categoria;
    }

    // Polimorfismo: Método que será sobrescrito nas subclasses
    public abstract String exibirDetalhes();

    // Getters e Setters (Encapsulamento)
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public Integer getAnoLancamento() { return anoLancamento; }
    public void setAnoLancamento(Integer anoLancamento) { this.anoLancamento = anoLancamento; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
}
