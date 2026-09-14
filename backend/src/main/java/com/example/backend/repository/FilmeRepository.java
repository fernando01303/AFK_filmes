package com.example.backend.repository;

import com.example.backend.model.Filme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilmeRepository extends JpaRepository<Filme, Integer> {
    
    // Filtros e Buscas
    List<Filme> findByAnoLancamento(Integer anoLancamento);

    @Query("SELECT f FROM Filme f WHERE LOWER(f.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))")
    List<Filme> buscarPorParteDoTitulo(@Param("titulo") String titulo);

    List<Filme> findByCategoriaNomeIgnoreCase(String nomeCategoria);

    List<Filme> findByCategoriaIdIn(List<Integer> categoriaIds);
}
