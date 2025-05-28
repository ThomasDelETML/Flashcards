# P_BULLES-Flashcards-Thomas_Moreira

# Flashcards Project

## Description

Flashcards est une application permettant d'apprendre facilement avec des cartes mémoires. Cette application utilise **AdonisJS** pour le backend et **Edge** pour les templates.

## Stage du projet

Le projet à était déployer, le staging na pas était réaliser.

## Prérequis & outils

Avant d'installer l'environnement, assurez-vous que vous avez les logiciels suivants installés :

- **Node.js** (v20.11.0 ou supérieur)
- **NPM** (v10.2.4 ou supérieur)
- **Git** (téléchargeable depuis [Git officiel](https://git-scm.com/))

### DBeaver peut s'avérer utile.

Pour connecter Dbeaver à la db, créer une nouvelle connection (Ctrl+Shift+N), puis sélectionner Mysql, ensuite remplir les paramètres suivants:
server host: localhost
Port: 6032
Username: root
Password: root

# Installation

1. **Cloner le dépôt**  
   Clonez le repository GitHub dans votre machine locale :

   ````bash
   git clone https://github.com/thomasdeletml/flashcards.git

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

## Schéma 
![image](https://github.com/user-attachments/assets/3cad0384-981b-4b24-8919-97937b4c9ce6)

---

# Dockerisation

Ce guide décrit les étapes nécessaires pour dockeriser une application AdonisJS avec une base de données MySQL, les migrations, les seeds, et un accès via le navigateur.

---

## Prérequis

- Docker et Docker Compose installés
- Un projet AdonisJS existant (`node ace` fonctionne)
- Une base MySQL utilisée par le projet
- Fichier `.env` configuré
- Etre sur la branche 'Docker' du projet

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

![image](https://github.com/user-attachments/assets/f781d381-a3fd-405c-b1a8-e5b2d4269afd)
#### Même que le Dev car l'architecture est la même.
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

![image](https://github.com/user-attachments/assets/ef973b01-247b-4c2a-bea8-56165af064d5)

---

# Staging
### Je n'ai pas fait la partie staging mais voilà ce que j'aurais fais:

Le staging est un environnement intermédiaire entre le développement et la production qui permet de tester l'application dans des conditions similaires à la production avant le déploiement final.

---

## Objectifs du staging

- **Validation finale** : Tester toutes les fonctionnalités dans un environnement proche de la production
- **Tests d'intégration** : Vérifier que tous les composants fonctionnent ensemble
- **Tests de performance** : Mesurer les performances sous charge
- **Validation des migrations** : S'assurer que les migrations de base de données fonctionnent correctement
- **Tests utilisateur** : Permettre aux testeurs de valider l'interface et l'expérience utilisateur

---

## Architecture de staging

### Structure des environnements

```
├── Development (local)
├── Staging (test)        ← Nous sommes ici
└── Production (live)
```

### Configuration staging

**Variables d'environnement pour staging (.env.staging)** :

```env
# Application
APP_KEY=your-staging-app-key-here
NODE_ENV=staging
HOST=0.0.0.0
PORT=3333
LOG_LEVEL=debug

# Base de données de staging
DB_HOST=staging-db-host
DB_PORT=3306
DB_USER=staging_user
DB_PASSWORD=staging_secure_password
DB_DATABASE=flashcards_staging

# Sessions et sécurité
SESSION_DRIVER=cookie
```

---

## Déploiement sur Railway (Staging)

### 1. Création du service staging

```bash
# Créer une nouvelle branche staging
git checkout -b staging
git push origin staging
```

### 2. Configuration Railway pour staging

- Créez un nouveau projet Railway nommé `flashcards-staging`
- Déployez depuis la branche `staging`
- Configurez les variables d'environnement staging

### 3. Base de données staging séparée

```bash
# Créer un service MySQL dédié au staging
# Variables à configurer dans Railway :
MYSQL_DATABASE=flashcards_staging
MYSQL_USER=staging_user
MYSQL_PASSWORD=secure_staging_password
```

### 4. Scripts de déploiement staging

**package.json** - Ajouter les scripts suivants :

```json
{
  "scripts": {
    "staging:build": "npm run build",
    "staging:migrate": "node ace migration:run --force",
    "staging:seed": "node ace db:seed --force",
    "staging:deploy": "npm run staging:migrate && npm run staging:seed && npm start",
    "staging:rollback": "node ace migration:rollback --force",
    "staging:reset": "node ace migration:fresh --seed --force"
  }
}
```

---

## Tests automatisés en staging

### 1. Tests d'intégration

Créer un fichier `tests/staging/integration.spec.ts` :

```typescript
import { test } from '@japa/runner'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

test.group('Staging Integration Tests', () => {
  test('should connect to staging database', async ({ assert }) => {
    // Test de connexion à la base de données
    const Database = (await import('@adonisjs/lucid/database')).default
    const connection = await Database.connection()
    assert.isTrue(connection.isConnected)
  })

  test('should run migrations successfully', async ({ assert }) => {
    // Test des migrations
    const { default: Migrator } = await import('@adonisjs/lucid/migrator')
    const migrator = new Migrator(Database, Application, {
      direction: 'up',
      dryRun: false,
    })
    await migrator.run()
    assert.isTrue(migrator.status === 'completed')
  })

  test('should seed data successfully', async ({ assert }) => {
    // Test des seeders
    // Vérifier que les données de test sont bien créées
    const User = (await import('#models/user')).default
    const users = await User.all()
    assert.isTrue(users.length > 0)
  })
})
```

### 2. Tests de performance

```typescript
test.group('Performance Tests', () => {
  test('should handle multiple concurrent users', async ({ assert }) => {
    // Simuler 100 requêtes simultanées
    const promises = Array(100).fill(null).map(() => 
      fetch('https://flashcards-staging.yourdomain.com/api/health')
    )
    
    const results = await Promise.all(promises)
    const successfulRequests = results.filter(r => r.status === 200)
    
    assert.isTrue(successfulRequests.length >= 95) // 95% de succès minimum
  })
})
```

---

## Processus de validation staging

### 1. Checklist de déploiement

- [ ] **Code review** terminé et approuvé
- [ ] **Tests unitaires** passent (100%)
- [ ] **Tests d'intégration** passent
- [ ] **Migrations** testées et validées
- [ ] **Variables d'environnement** configurées
- [ ] **Base de données staging** opérationnelle
- [ ] **Monitoring** et logs activés

### 2. Tests fonctionnels

#### Tests utilisateur
- [ ] Inscription/Connexion utilisateur
- [ ] Création de flashcards
- [ ] Modification de flashcards
- [ ] Suppression de flashcards
- [ ] Navigation entre les cartes
- [ ] Système de révision
- [ ] Sauvegarde des progrès

#### Tests de sécurité
- [ ] Authentification
- [ ] Autorisation
- [ ] Protection CSRF (Pas vraiment besoins dans la cadre de ce projet mais une bonne pratique, apprit dans le cours i183 de Mr. Schaffter)
- [ ] Validation des données
- [ ] Sécurité des sessions

### 3. Tests de charge

```bash
# Utilisation d'Artillery pour les tests de charge
npm install -g artillery

# Créer artillery-staging.yml
artillery run artillery-staging.yml
```

**artillery-staging.yml** :

```yaml
config:
  target: 'https://flashcards-staging.yourdomain.com'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
  defaults:
    headers:
      Content-Type: 'application/json'

scenarios:
  - name: "Load test flashcards"
    requests:
      - get:
          url: "/"
      - get:
          url: "/flashcards"
      - post:
          url: "/api/flashcards"
          json:
            title: "Test Card"
            front: "Question"
            back: "Answer"
```

---

## Monitoring et observabilité

### 1. Logs structurés

```typescript
// config/logger.ts - Configuration pour staging
import { defineConfig } from '@adonisjs/logger'

export default defineConfig({
  default: 'app',
  loggers: {
    app: {
      enabled: true,
      name: 'flashcards-staging',
      level: 'debug',
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            level: 'info',
            options: {
              colorize: true
            }
          },
          {
            target: 'pino/file',
            level: 'error',
            options: {
              destination: './storage/logs/staging-errors.log'
            }
          }
        ]
      }
    }
  }
})
```

### 2. Health checks

```typescript
// app/controllers/health_controller.ts
export default class HealthController {
  async check({ response }: HttpContext) {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: 'staging',
      database: await this.checkDatabase(),
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
    
    return response.ok(health)
  }
  
  private async checkDatabase() {
    try {
      await Database.rawQuery('SELECT 1')
      return { status: 'connected' }
    } catch (error) {
      return { status: 'error', message: error.message }
    }
  }
}
```

---

## Processus de promotion vers production

### 1. Critères de validation

Pour qu'une version puisse passer en production :

- ✅ **Tous les tests automatisés** passent
- ✅ **Tests de performance** satisfaisants (< 2s temps de réponse)
- ✅ **Tests de sécurité** validés
- ✅ **Tests utilisateur** approuvés par l'équipe
- ✅ **Pas d'erreurs critiques** en staging pendant 48h minimum
- ✅ **Documentation** mise à jour
- ✅ **Plan de rollback** préparé

### 2. Workflow de promotion

```bash
# 1. Finaliser les tests en staging
npm run test:staging:full

# 2. Créer une release candidate
git checkout main
git merge staging
git tag -a v1.0.0-rc.1 -m "Release candidate 1.0.0"

# 3. Déployer en production (après validation)
git checkout production
git merge main
git tag -a v1.0.0 -m "Production release 1.0.0"
```

### 3. Documentation de release

```markdown
## Release Notes v1.0.0

### Nouvelles fonctionnalités
- Système de flashcards avec révision espacée
- Interface utilisateur responsive
- Authentification sécurisée

### Corrections
- Fix validation des formulaires
- Amélioration des performances de base de données

### Améliorations
- Optimisation du chargement des cartes
- Amélioration de l'UX mobile

### Tests validés
- Tests unitaires : 100% (150 tests)
- Tests d'intégration : ✅ (25 tests)
- Tests de performance : ✅ (< 1.5s temps de réponse)
- Tests de sécurité : ✅ Aucune vulnérabilité critique

### Instructions de déploiement
1. Effectuer la sauvegarde de la base de données production
2. Exécuter les migrations : `node ace migration:run --force`
3. Déployer le code
4. Vérifier les health checks
5. Activer le monitoring
```

---

## Outils et commandes utiles

### Scripts de gestion staging

```bash
#!/bin/bash
# staging-deploy.sh

echo "Déploiement en staging..."

# Vérifications préalables
npm run test
npm run lint

# Build et déploiement
npm run build
git push origin staging

echo "Déploiement staging terminé"
echo "URL: https://flashcards-staging.yourdomain.com"
echo "Monitoring: https://railway.app/project/flashcards-staging"
```

### Nettoyage et maintenance

```bash
# Nettoyage des logs anciens
find ./storage/logs -name "*.log" -mtime +7 -delete

# Reset complet de l'environnement staging
npm run staging:reset

# Sauvegarde de la base de données staging
mysqldump -h staging-db -u staging_user -p flashcards_staging > staging-backup-$(date +%Y%m%d).sql
```

---

Cette configuration de staging assure une validation complète avant le passage en production et maintient la qualité de l'application Flashcards.

![image](https://github.com/user-attachments/assets/8932ad4e-06d8-42eb-9888-c5e52a7f520f)

