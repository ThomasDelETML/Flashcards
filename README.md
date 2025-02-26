# P_BULLES-Flashcards-Thomas_Moreira

# Flashcards Project

## Description

Flashcards est une application permettant d'apprendre facilement avec des cartes mémoires. Cette application utilise **AdonisJS** pour le backend et **Edge** pour les templates.

## Prérequis

Avant d'installer l'environnement, assurez-vous que vous avez les logiciels suivants installés :

- **Node**  
  Prenez la version v20.11.0 ou supérieur.

- **NPM**
  Prenez la version 10.2.4 ou supérieur.

- **Git**  
  Si vous ne l'avez pas déjà, vous pouvez télécharger Git à partir de [Git officiel](https://git-scm.com/).

## Installation

1. **Cloner le dépôt**  
   Clonez le repository GitHub dans votre machine locale :

   ```bash
   git clone https://github.com/thomasdeletml/flashcards.git
   ```

2. **Accéder au dossier du projet**  
   Naviguez dans le répertoire du projet cloné :

   ```bash
   cd .\flashcards\code\flashcards\
   ```

3. **Installer les dépendances**  
   Utilisez `npm` pour installer les dépendances du projet :

   ```bash
   npm install
   ```

4. **Configuration de l'environnement**  
   Copiez le fichier `.env.example` et renommez-le en `.env` :

   ```bash
   cp .env.example .env
   ```

   Ensuite, ajustez les configurations dans le fichier `.env` si nécessaire (par exemple, les paramètres de base de données).

5. **Generer la clé**  
   Pour generer la clé, exécutez la commande suivante :

   ```bash
   node ace generate:key
   ```

   Cela va crée la clé.

6. **Lancer l'application**  
   Pour démarrer le serveur en mode développement, exécutez la commande suivante :

   ```bash
   npm run dev
   ```

   Cela démarrera le serveur à l'adresse `http://localhost:3333`.

## Utilisation

Après avoir lancé le serveur, ouvrez votre navigateur et allez à `http://localhost:3333` pour accéder à l'application.

## Contribuer

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nom-fonctionnalité`).
3. Commitez vos changements (`git commit -am 'Ajout de la fonctionnalité'`).
4. Poussez à votre branche (`git push origin feature/nom-fonctionnalité`).
5. Ouvrez une pull request.
