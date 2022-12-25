import { SchoolSubject } from './SchoolSubject';
import { Utils } from './tools/Utils';

export class Assignment {
  public _id!: string;
  public id!: string;

  public dateDeRendu!: Date;
  public nom: string = '';
  public rendu: boolean = false;
  public auteur!: string;
  public note!: number;
  public remarque!: string;
  public matiere!: SchoolSubject;

  constructor(nom?: string, dateDeRendu?: Date, rendu?: boolean) {
    if (nom !== undefined) this.nom = nom;
    if (dateDeRendu !== undefined) this.dateDeRendu = dateDeRendu;
    if (rendu !== undefined) this.rendu = rendu;
  }

  public isValid(): boolean {
    if (this.nom === '') return false;
    if (this.dateDeRendu === undefined) return false;
    return true;
  }

  public static random(): Assignment {
    let assignment = new Assignment();
    assignment.nom = 'Random Assignment ' + Math.floor(Math.random() * 1000);
    assignment.dateDeRendu = Utils.randomDate(2018, 2023);
    assignment.rendu = false;
    assignment.auteur = 'Random Author';
    assignment.note = Math.floor(Math.random() * 20);
    assignment.remarque = 'Random Remark';
    assignment.matiere = Utils.randomSubject();

    return assignment;
  }
}
