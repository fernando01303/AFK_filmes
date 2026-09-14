package com.example.backend.controller;

import com.example.backend.model.Categoria;
import com.example.backend.model.Filme;
import com.example.backend.repository.CategoriaRepository;
import com.example.backend.repository.FilmeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/filmes")
@CrossOrigin(origins = "*")
public class FilmeController {

    @Autowired
    private FilmeRepository filmeRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    // 1. Cadastrar
    @PostMapping
    public ResponseEntity<?> cadastrarFilme(@RequestBody Filme filme) {
        try {
            // Validação de entrada
            if (filme.getTitulo() == null || filme.getTitulo().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Erro: O título não pode ser vazio.");
            }
            if (filme.getAnoLancamento() == null || filme.getAnoLancamento() < 0) {
                return ResponseEntity.badRequest().body("Erro: O ano de lançamento não pode ser negativo.");
            }
            if (filme.getCategoria() == null || filme.getCategoria().getId() == null) {
                return ResponseEntity.badRequest().body("Erro: Categoria é obrigatória.");
            }

            // Garante que a categoria existe
            Optional<Categoria> catOpt = categoriaRepository.findById(filme.getCategoria().getId());
            if (catOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Erro: Categoria informada não existe no banco de dados.");
            }
            filme.setCategoria(catOpt.get());

            Filme salvo = filmeRepository.save(filme);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (Exception e) {
            // Tratamento de Exceções adequado
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno de conexão ou SQL: " + e.getMessage());
        }
    }

    // 2. Listar todos
    @GetMapping
    public ResponseEntity<?> listarFilmes() {
        try {
            List<Filme> filmes = filmeRepository.findAll(); // Uso de Coleções (List)
            return ResponseEntity.ok(filmes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar filmes: " + e.getMessage());
        }
    }

    // 3. Atualizar
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarFilme(@PathVariable Integer id, @RequestBody Filme filmeAtualizado) {
        try {
            Optional<Filme> filmeExistente = filmeRepository.findById(id);
            if (filmeExistente.isPresent()) {
                Filme f = filmeExistente.get();
                if (filmeAtualizado.getTitulo() != null && !filmeAtualizado.getTitulo().trim().isEmpty()) {
                    f.setTitulo(filmeAtualizado.getTitulo());
                }
                if (filmeAtualizado.getAnoLancamento() != null && filmeAtualizado.getAnoLancamento() >= 0) {
                    f.setAnoLancamento(filmeAtualizado.getAnoLancamento());
                }
                if (filmeAtualizado.getDuracaoMinutos() != null) {
                    f.setDuracaoMinutos(filmeAtualizado.getDuracaoMinutos());
                }
                filmeRepository.save(f);
                return ResponseEntity.ok(f);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Filme não encontrado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar filme: " + e.getMessage());
        }
    }

    // 4. Excluir
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirFilme(@PathVariable Integer id) {
        try {
            if (filmeRepository.existsById(id)) {
                filmeRepository.deleteById(id);
                return ResponseEntity.ok("Filme deletado com sucesso.");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Filme não encontrado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao deletar filme: " + e.getMessage());
        }
    }

    // Filtros e Buscas Adicionais
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorTitulo(@RequestParam String titulo) {
        try {
            return ResponseEntity.ok(filmeRepository.buscarPorParteDoTitulo(titulo));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro na busca: " + e.getMessage());
        }
    }

    @GetMapping("/ano/{ano}")
    public ResponseEntity<?> listarPorAno(@PathVariable Integer ano) {
        try {
            return ResponseEntity.ok(filmeRepository.findByAnoLancamento(ano));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro na busca: " + e.getMessage());
        }
    }

    @GetMapping("/categoria/{nomeCategoria}")
    public ResponseEntity<?> listarPorCategoria(@PathVariable String nomeCategoria) {
        try {
            return ResponseEntity.ok(filmeRepository.findByCategoriaNomeIgnoreCase(nomeCategoria));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro na busca: " + e.getMessage());
        }
    }

    @GetMapping("/recomendados/{email}")
    public ResponseEntity<?> listarRecomendados(@PathVariable String email, @Autowired com.example.backend.repository.UserRepository userRepository) {
        try {
            Optional<com.example.backend.model.User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                java.util.List<Categoria> cats = userOpt.get().getCategorias();
                if (cats != null && !cats.isEmpty()) {
                    java.util.List<Integer> ids = cats.stream().map(Categoria::getId).toList();
                    return ResponseEntity.ok(filmeRepository.findByCategoriaIdIn(ids));
                }
            }
            // Retorna todos se não houver preferências ou usuário não encontrado
            return ResponseEntity.ok(filmeRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro na busca: " + e.getMessage());
        }
    }
}
