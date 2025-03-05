# Application des surnoms des enseignants avec AdonisJS

## Générer le projet de départ - Step 0

Dans cet étape, nous avons simplement exécuter la commande initiale qui permet de générer un projet AodnisJS.

```bash
npm init adonisjs@latest app-teachers-adonisjs -- --db=mysql
```

`app-teachers-adonisjs` est le nom du projet.

`--db=mysql` permet d'indiquer le SGBDR souhaité, dans notre cas MySQL.

Le kit de démarrage (Starter kit) nous demande de choisir entre différentes options.

Il est important de choisir :

- Web Starter Kit
- session

comme ci-dessous :

<img src="./doc/images/create-project-adonis-with-session-mysql.png">

## Installation des extensions de vscode

Nous allons installer 3 extensions :

- AdonisJS Extension

<img src="./doc/images/extension-vscode-adonisjs.png">

- Edge template

<img src="./doc/images/extension-vscode-adonisjs-edge-template.png">

- Test runner Japa (facultatif)

<img src="./doc/images/extension-vscode-test-runner-japa.png">

## Prochaine étape

Dans la prochaine étape <a href="https://github.com/GregLeBarbar/app-teachers-adonisjs/tree/step1">step1</a>, nous allons modifier la vue `home` et gérer les fichiers statiques CSS et JS.
