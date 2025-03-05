# P_BULLES-Flashcards-Thomas_Moreira

# Flashcards Project

## Description

Flashcards est une application permettant d'apprendre facilement avec des cartes mémoires. Cette application utilise **AdonisJS** pour le backend et **Edge** pour les templates.

## Prérequis

Avant d'installer l'environnement, assurez-vous que vous avez les logiciels suivants installés :

- **Node.js** (v20.11.0 ou supérieur)
- **NPM** (v10.2.4 ou supérieur)
- **Git** (téléchargeable depuis [Git officiel](https://git-scm.com/))

## Installation

1. **Cloner le dépôt**  
   Clonez le repository GitHub dans votre machine locale :

   ```bash
   git clone https://github.com/thomasdeletml/flashcards.git
   ```

2. **Accéder au dossier du projet**  
   Naviguez dans le répertoire du projet cloné :

   ```bash
   cd flashcards/code/flashcards
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

