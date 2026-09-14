-- Criação do banco de dados (execute no MySQL Workbench)
CREATE DATABASE IF NOT EXISTS afk_filmes;
USE afk_filmes;

-- Tabela de Usuários (Login)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

-- Tabela de Categorias (Gênero)
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Tabela de Relacionamento (Usuários <-> Categorias Favoritas)
CREATE TABLE IF NOT EXISTS users_categorias (
    user_id INT NOT NULL,
    categoria_id INT NOT NULL,
    PRIMARY KEY (user_id, categoria_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- Tabela de Mídias (Superclasse, Herança)
CREATE TABLE IF NOT EXISTS midias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    ano_lancamento INT NOT NULL,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE CASCADE
);

-- Tabela de Filmes (Subclasse de Mídias)
CREATE TABLE IF NOT EXISTS filmes (
    id INT PRIMARY KEY,
    duracao_minutos INT NOT NULL,
    FOREIGN KEY (id) REFERENCES midias(id) ON DELETE CASCADE
);

-- Tabela de Séries (Subclasse de Mídias)
CREATE TABLE IF NOT EXISTS series (
    id INT PRIMARY KEY,
    temporadas INT NOT NULL,
    episodios_por_temporada INT NOT NULL,
    FOREIGN KEY (id) REFERENCES midias(id) ON DELETE CASCADE
);

-- Inserindo categorias de exemplo
INSERT INTO categorias (nome) VALUES ('Ação'), ('Comédia'), ('Ficção Científica'), ('Terror');
