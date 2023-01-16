# Angular assignment
Nous avons implémenté, toutes les fonctionnalités obligatoire, optionnel et en AVANCEE++. Nous n'avons pas ajouté de choses supplémentaire. Par contre nous nous sommes plus attardé sur le code

## Binome
AGLAE Sébastien
CHIAPPE Mike
TD03

## Vidéo
https://youtu.be/cHUTZQNY3BE (1440p60)

## Hébergement
- Site Web : https://seb.angular.bdemiagenice.fr/
- API : https://seb-api.angular.bdemiagenice.fr/
- Cloud panel : https://www.cloudpanel.io/
- Config du front : https://seb.angular.bdemiagenice.fr/assets/json/config.json

## Faire tourner !
Le lien vers notre de base de données est dans le mail.
Le lien pour votre base de données local : mongodb://localhost:27017/assignment
### Serveur
Le serveur utilise une variable d'environnement pour lien vers la base de données mongo
#### Sur windows
##### Méthode 1 sans variable d'environnement
- 1. Allez dans le fichier ./server/app.js
- 2. Modifier la ligne 45 et changer `mongoose.connect(<nouveau lien>)`
```
$ cd server
$ npm i
$ npm run start
```

##### Méthode 2 avec variable d'environnement
Ajouter une variable d'environnement MONGO_URL=<Lien base de données> .
```
$ cd server
$ npm i
$ npm run start
```
#### Sur mac
```
$ cd server
$ npm i
# Si vous voulez utiliser notre base de données
$ MONGO_URL=<nouveau lien> node bin/www
```

### Client
```
$ cd front
$ npm i
$ ng serve
```

## Travail attendu
- [x] FACILE avec options AVANCEES :
  - [x] Au moins 1000 assignments dans la base de données. 
  - [x] Ajouter une gestion de login/password
    - [x] Vous ajouter dans la toolbar un formulaire login/password + bouton connexion. Une fois loggué, le formulaire disparait et seul un bouton de deconnexion apparait.
    - [x] Si on est loggué en tant que user autorisé on a le droit de modifier / ajouter un assignment. Si on est loggué en admin on pourra en plus supprimer des assignments. Si on n'est pas loggué on ne peut que consulter.
    - [x] Vous codez en dur dans le service d'authentification une liste de login/passwords valides.
    - ~[x]~ AVANCE : Cas mieux (mais pas mal de travail sur back-end): en créant une collection Utilisateurs dans MongoDB, et en validant que le user/password est correct.
 
    - [x] AVANCE++ : Encore mieux: regardez comment utiliser l'authentification à l'aide de Json Web Tokens (JWT), en suivant par exemple ce tutoriel. 
  
  - [x] Ajouter de nouvelles propriétés au modèle des Assignments
    - [x] Vous ajouterez dans la définition des assignments : 
      - [x] Auteur (nom de l'élève)
      - [x] Matière (Base de données, Technologies Web, Grails, etc.)
        - [x] Une image sera associée à chaque matière et une photo du prof
      - [x] Note sur 20, on ne peut marquer "rendu" un Assignment qui n'a pas été noté.
      - [x] Remarques sur l'assignment
 
    - ~[x]~ APPROCHE FACILE : on ajoute des propriétés au modèle des Assignments (dans le front-end et dans le back-end). On n'ajoute pas de nouvelle collection à la base de données. C'est ce que je recommande pour la plupart d'entre vous.
    - [x] APPROCHE AVANCEE : vous ajoutez une collection "matières" et/ou "élève" mais évidemment cela impactera plus le back end et cela représente beaucoup de travail par rapport au reste de ce qui est demandé, c'est donc une solution optionnelle pour les meilleurs d'entre vous.
 
  - [x] Améliorer l'affichage des Assignments
    - [x] Vous afficherez les assignments dans une table angular material. A vous de voir si vous arrivez à la rendre triable, avec ligne des headers fixe (qui ne scrolle pas), avec la pagination. Ajoutez un moyen pour avoir une vue de détail sur un assignment.
    - [x] OPTIONNEL : pour la pagination vous pouvez regarder pour utiliser le composant Paginator de angular material.
    - [x] Regardez les tables avec datasource, c'est encore plus simple.
    - [x] La vue détails montrera en plus les remarques, la note s'il a été rendu, la photo du prof, etc.
    - [x] Les formulaires d'ajout et de détails proposeront un choix fixe de matières (et associeront automatiquement le prof et l'image illustrant la matière)
 
    - [x] OPTIONNEL : Ajouter un filtre rendu/non rendu : Selon que cette case est cochée ou pas le tableau affichera uniquement les assignments rendus ou non rendus.
 
    - [x] OPTIONNEL : Ajouter un champ de recherche sur le nom de l'assignment qui enverra une requête et affichera les résultats correspondants à la recherche.
 
    - [x] Optionnel (mais simple à faire): utiliser un Formulaire de type Stepper (formulaire en plusieurs étapes) pour l'ajout d'Assignments (éventuellement pour la modification)

- [x] Rendre le tout plus joli, essayez de ne faire tous la même chose. Je recommande une toolbar en haut, une sidebar sur le côté.
- [x] ~Hébergement sur Heroku.com ou render.com.~ Hebergé chez Hetzner via cloud panel

## Travail ajouté
- [x] Le sujet est ouvert, vous pouvez ajouter ce qui vous semble amusant/pertinent:
  - [x] (facile) Ajout de messages de notification (SnackBar Material)
  - [x] Progress bar Material pour le loading des pages
  - [x] Date avec Time picker (https://github.com/h2qutc/angular-material-components)
  - [x] Bottom Sheet Material pour les options du devoirs dans la page des détail
  - [x] Upload & Download fichier des devoirs
  - [x] Ajout de Tabs Material dans les détails
  - [x] Ajout de Expansion Material
  - [x] Ajout du composant Upload (https://github.com/h2qutc/angular-material-components)
  - [x] Ajout de Chip Angular pour les filtres
  - [x] Ajout de pipe sur le temps restant et sur les tailles de fichiers
  - [x] Le site se sert d'un fichier de configuration (https://seb.angular.bdemiagenice.fr/assets/json/config.json)
  
## Contribution
### Mike Chiappe
- Mise en place de la structure du projet
- Conception du schéma de données
- Conception des DTOs
- Développement des services Assignment, Authentication (JWT), Teacher et Subject (matière).
- Filtrage des données renvoyés au client
- Stockage des fichiers des submissions des assignments dans un dossier local pour éviter les problèmes de performance et de limitation de taille des documents
- Remplissage de la base de données avec des données de test

### Sébastien Aglaé
- Reprise de mon tp
- Connexion des différents services du back
- Affichage des devoirs depuis les APIS
- Ajout de tous les composants en utilisant le maximum de composant de Angular Material
- Implémentation du JWT coté front
- Implémentation du système de config coté front
- Mise en place des filtres dynamiques (frontend) via les options sélectionnées par l'utilisateur
- Mise en place d'un menu de débogage pour faciliter les tests.
