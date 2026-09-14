package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allows the frontend to connect
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email já está em uso.");
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginData) {
        Optional<User> userOpt = userRepository.findByEmail(loginData.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getSenha().equals(loginData.getSenha())) {
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas.");
    }

    @PostMapping("/{email}/categorias")
    public ResponseEntity<?> updatePreferencias(@PathVariable String email, @RequestBody java.util.List<Integer> categoriaIds, @Autowired com.example.backend.repository.CategoriaRepository categoriaRepository) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }
        User user = userOpt.get();
        java.util.List<com.example.backend.model.Categoria> categoriasSelecionadas = categoriaRepository.findAllById(categoriaIds);
        user.setCategorias(categoriasSelecionadas);
        userRepository.save(user);
        return ResponseEntity.ok("Preferências atualizadas com sucesso.");
    }
}
