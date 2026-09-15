package com.example.backend.controller;

import com.example.backend.service.TmdbSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sync")
public class SyncController {

    @Autowired
    private TmdbSyncService tmdbSyncService;

    @PostMapping("/tmdb")
    public ResponseEntity<String> syncTmdb() {
        // Toca a rotina de sincronização manualmente em uma thread separada para não travar
        new Thread(() -> tmdbSyncService.syncPopularMovies()).start();
        return ResponseEntity.ok("Sincronização iniciada em segundo plano! Olhe o terminal do Java.");
    }
}
