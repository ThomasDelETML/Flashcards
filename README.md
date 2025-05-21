# P_BULLES-Flashcards-Thomas_Moreira

# Flashcards Project

## Description

Flashcards est une application permettant d'apprendre facilement avec des cartes mémoires. Cette application utilise **AdonisJS** pour le backend et **Edge** pour les templates.

## Stage du projet

Le projet est dans un stage de **staging**, la production na pas était réaliser.

## Prérequis & outils

Avant d'installer l'environnement, assurez-vous que vous avez les logiciels suivants installés :

- **Node.js** (v20.11.0 ou supérieur)
- **NPM** (v10.2.4 ou supérieur)
- **Git** (téléchargeable depuis [Git officiel](https://git-scm.com/))

# Installation

1. **Cloner le dépôt**  
   Clonez le repository GitHub dans votre machine locale :

   ````bash
   git clone https://github.com/thomasdeletml/flashcards.git
   ```thomas@etml.comthomas@etml.com

   ````

2. **Accéder au dossier du projet**  
   Naviguez dans le répertoire du projet cloné :

   ```bash
   cd flashcards/code/
   ```

3. **Installer les dépendances**  
   Utilisez `npm` pour installer les dépendances du projet :

   ```bash
   npm install
   ```

   **Si une erreur survient**, assurez-vous que vous avez bien la version correcte de Node.js et NPM.

4. **Configuration de l'environnement**  
   Copiez le fichier `.env.example` et renommez-le en `.env` :

   ```bash
   cp .env.example .env
   ```

   Ensuite, ouvrez le fichier `.env` et configurez les paramètres suivants :

   - Base de données (nom, utilisateur, mot de passe)
   - URL de l'application si différente de `http://localhost:3333`

5. **Générer la clé de l'application**  
   AdonisJS utilise une clé secrète pour le chiffrement. Générez cette clé en utilisant la commande suivante :

   ```bash
   node ace generate:key
   ```

   Cette commande va générer une clé et l'ajouter automatiquement dans le fichier `.env`.

6. **Exécuter les migrations de la base de données**  
   Si l'application utilise une base de données, exécutez cette commande pour créer les tables :

   ```bash
   node ace migration:run
   ```

7. **Lancer l'application**  
   Démarrez le serveur en mode développement :

   ```bash
   npm run dev
   ```

   Si tout s'est bien passé, vous devriez voir l'application accessible sur `http://localhost:3333`.

## Utilisation

Après avoir lancé le serveur, ouvrez votre navigateur et allez à `http://localhost:3333` pour accéder à l'application.

## Contribuer

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nom-fonctionnalité`).
3. Commitez vos changements (`git commit -am 'Ajout de la fonctionnalité'`).
4. Poussez à votre branche (`git push origin feature/nom-fonctionnalité`).
5. Ouvrez une pull request.

## Problèmes et solutions

- **Erreur lors de `npm install`** : Assurez-vous d'avoir les versions requises de Node.js et NPM.
- **Problème de connexion à la base de données** : Vérifiez les paramètres dans `.env` et que votre base de données est bien en cours d'exécution.
- **Erreur `E_MISSING_APP_KEY`** : La clé de l'application n'a pas été générée. Exécutez `node ace generate:key`.

Si le problème persiste, consultez la documentation officielle d'AdonisJS ou ouvrez une issue sur le repo GitHub du projet.

# Dockerisation

Ce guide décrit les étapes nécessaires pour dockeriser une application AdonisJS avec une base de données MySQL, les migrations, les seeds, et un accès via le navigateur.

---

## Prérequis

- Docker et Docker Compose installés
- Un projet AdonisJS existant (`node ace` fonctionne)
- Une base MySQL utilisée par le projet
- Fichier `.env` configuré

---

## Étape 1 : Dockerfile

**`docker/Dockerfile`** :

```Dockerfile
FROM node:18

WORKDIR /app

COPY . .

RUN npm install

COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
```

---

## Étape 2 : Script d’entrée

**`docker/docker-entrypoint.sh`** :

```sh
#!/bin/sh
set -e

echo "Attente du démarrage de MySQL..."
/app/wait-for-it.sh db:3306 --timeout=60 --strict -- echo "MySQL est prêt"

echo "Exécution des migrations..."
node ace migration:run --force

echo "Exécution des seeds..."
node ace db:seed

echo "Démarrage de l'application..."
npm run dev
```

---

## Étape 3 : Script wait-for-it

Télécharger et rendre exécutable :

```bash
curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
chmod +x wait-for-it.sh
```

---

## Étape 4 : Fichier `docker-compose.yml`

**À la racine du projet** :

```yaml
version: '3'

services:
  db:
    image: mysql:8.0.30
    hostname: db
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_USER: db_user
      MYSQL_PASSWORD: db_user_pass
      MYSQL_DATABASE: app
    restart: always
    ports:
      - '6032:3306'
    volumes:
      - dbdata:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin:5.2.0
    links:
      - db
    environment:
      PMA_HOST: db
      PMA_PORT: 3306
      PMA_ARBITRARY: 1
    restart: always
    ports:
      - 8084:80

  app:
    build:
      context: ./code
      dockerfile: ../docker/Dockerfile
    container_name: db_adonis
    restart: always
    ports:
      - '3333:3333'
    volumes:
      - ./code:/app
      - /app/node_modules
    depends_on:
      - db

volumes:
  dbdata:
```

---

## Étape 5 : Fichier `.env`

**Dans `code/.env`**, configure AdonisJS :

```env
HOST=0.0.0.0
PORT=3333

DB_HOST=db
DB_PORT=3306
DB_USER=db_user
DB_PASSWORD=db_user_pass
DB_DATABASE=app
```

---

## Étape 6 : Lancer les conteneurs

Depuis la racine du projet :

```bash
docker-compose up --build
```

---

## Accès à l'application

- **AdonisJS App** : [http://localhost:3333](http://localhost:3333)
- **phpMyAdmin** : [http://localhost:8084](http://localhost:8084)

---

## Nettoyage

```bash
docker-compose down -v
```

Cela arrête et supprime les conteneurs, réseaux et volumes.

---

## Vérifications

- Les logs de `docker logs db_adonis` montrent que le serveur démarre.
- `ping db` depuis le conteneur fonctionne.
- `node ace migration:run` fonctionne à l’intérieur du conteneur.

---

# Déploiement du service Railway à partir du dépôt GitHub "Flashcards"

## Étapes détaillées

### 1. Connexion à Railway

- Connectez-vous à votre compte sur [Railway.app](https://railway.app).

---

### 2. Ajouter un nouveau service depuis GitHub

- Créez un nouveau projet/service Railway.
- Sélectionnez l’option **"Deploy from GitHub repo"**.
- Choisissez le dépôt **`Flashcards`**.
- Sélectionnez la branche **`main`**.

---

### 3. Organisation des fichiers

- Assurez-vous que tous les fichiers du projet sont placés à la racine du dépôt, c’est-à-dire au même niveau que le dossier `.git`.

---

### 4. Création du service MySQL

- Dans Railway, ajoutez un nouveau service de base de données.
- Choisissez **MySQL** comme moteur de base de données.

---

### 5. Configuration des variables d’environnement

- Dans le fichier `.env.deploiement`, ajoutez les variables nécessaires pour la connexion à la base de données et pour la configuration du projet.

  Par exemple :

```env
APP_KEY=

HOST="0.0.0.0"
LOG_LEVEL="info"

DB_DATABASE="${{MySQL.MYSQL_DATABASE}}"
DB_HOST="mysql.railway.internal"
DB_PASSWORD="${{MySQL.MYSQLPASSWORD}}"
DB_PORT="${{MySQL.MYSQLPORT}}"
DB_USER="${{MySQL.MYSQLUSER}}"

SESSION_DRIVER="cookie"
PORT="8080"
```

- Générez une clé unique pour `APP_KEY` (exemple : une chaîne aléatoire sécurisée).

---

### 6. Configuration du déploiement GitHub dans Railway

- Dans les paramètres du service Railway, rendez-vous dans l’onglet **Settings**.
- Sous **Deploy**, trouvez le champ **Pre-deploy Command**.
- Ajoutez la commande suivante :

  node ace migration:fresh --seed --force

  Cette commande permet de lancer les migrations et d’initialiser la base de données avec des données de test à chaque déploiement.

---

### 7. Génération du domaine public

- Toujours dans Railway, ouvrez l’onglet **Networking**.
- Cliquez sur **Generate Domain** pour obtenir une URL publique accessible.

## Maintenance & modification (comment modifier des trucs)
