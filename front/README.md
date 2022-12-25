- O [] : Au moins 1000 assignments dans la base de données.

- O [] : Ajouter une gestion de login/password

  - O [] : Vous ajouter dans la toolbar un formulaire login/password + bouton connexion. Une fois loggué, le formulaire disparait et seul un bouton de deconnexion apparait.
  - O [] : Si on est loggué en tant que user autorisé on a le droit de modifier / ajouter un assignment. Si on est loggué en admin on pourra en plus supprimer des assignments. Si on n'est pas loggué on ne peut que consulter.
  - O [] : Vous codez en dur dans le service d'authentification une liste de login/passwords valides.
  - A [] : Cas mieux (mais pas mal de travail sur back-end): en créant une collection Utilisateurs dans MongoDB, et en validant que le user/password est correct.
  - A++ [] : Encore mieux: regardez comment utiliser l'authentification à l'aide de Json Web Tokens (JWT), en suivant par exemple ce tutoriel.

- O [] : Ajouter de nouvelles propriétés au modèle des Assignments

  - O [] : Auteur, Matière, Note, Remarques
  - L'un des deux :
    - O [] FACILE : on ajoute des propriétés au modèle des Assignments (dans le front-end et dans le back-end). On n'ajoute pas de nouvelle collection à la base de données. C'est ce que je recommande pour la plupart d'entre vous.
    - O [] AVANCEE : vous ajoutez une collection "matières" et/ou "élève" mais évidemment cela impactera plus le back end et cela représente beaucoup de travail par rapport au reste de ce qui est demandé, c'est donc une solution optionnelle pour les meilleurs d'entre vous.

- O [] : Améliorer l'affichage des Assignments
  - O [] : Vous afficherez les assignments dans une table angular material. A vous de voir si vous arrivez à la rendre triable, avec ligne des headers fixe (qui ne scrolle pas), avec la pagination. Ajoutez un moyen pour avoir une vue de détail sur un assignment.
  - OPT [] : pour la pagination vous pouvez regarder pour utiliser le composant Paginator de angular material.
  - O [] : Regardez les tables avec datasource, c'est encore plus simple.
  - O [] : La vue détails montrera en plus les remarques, la note s'il a été rendu, la photo du prof, etc.
  - O [] : Les formulaires d'ajout et de détails proposeront un choix fixe de matières (et associeront automatiquement le prof et l'image illustrant la matière)
  - OPT [] : Ajouter un filtre rendu/non rendu : Selon que cette case est cochée ou pas le tableau affichera uniquement les assignments rendus ou non rendus.
  - OPT [] : Ajouter un champ de recherche sur le nom de l'assignment qui enverra une requête et affichera les résultats correspondants à la recherche.
  - OPT [] : Utiliser un Formulaire de type Stepper (formulaire en plusieurs étapes) pour l'ajout d'Assignments (éventuellement pour la modification)
