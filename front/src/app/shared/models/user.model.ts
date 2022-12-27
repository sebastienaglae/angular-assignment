export class User {
  id!: string;
  roles!: number[];
  iat!: number;
  exp!: number;

  // Fonction qui permet de savoir si l'utilisateur a le droit de creer un devoir
  canCreateAssignment(): boolean {
    return this.roles.includes(Role.CREATE_ASSIGNMENT);
  }

  // Fonction qui permet de savoir si l'utilisateur a le droit de modifier un devoir
  canUpdateAssignment(): boolean {
    return this.roles.includes(Role.UPDATE_ASSIGNMENT);
  }

  // Fonction qui permet de savoir si l'utilisateur a le droit de supprimer un devoir
  canDeleteAssignment(): boolean {
    return this.roles.includes(Role.DELETE_ASSIGNMENT);
  }
}

export enum Role {
  DELETE_ASSIGNMENT = 1,
  UPDATE_ASSIGNMENT = 2,
  CREATE_ASSIGNMENT = 4,
}
