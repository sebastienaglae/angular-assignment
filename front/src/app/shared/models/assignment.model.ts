import { Utils } from '../tools/Utils';
import { Rating } from './rating.model';
import { Submission } from './submission.model';

export class Assignment {
  public _id!: string;

  public ownerId!: string;
  public subjectId!: string;
  public title!: string;
  public description!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public dueDate!: Date;
  public submission!: Submission;
  public rating!: Rating;

  public isValid(): boolean {
    // TODO: implement

    return true;
  }

  // Fonction qui retourne true si la date de rendu est dépassée
  public static isTooLate(ass: Assignment): boolean {
    let today = new Date();
    let rendu = new Date(ass.dueDate);
    return today > rendu;
  }

  // Fonction qui retourne le temps restant avant la date de rendu
  public static getTimeRemaining(ass: Assignment): string {
    let today = new Date();
    let rendu = new Date(ass.dueDate);
    let diff = rendu.getTime() - today.getTime();
    return Utils.convertTimestampToTimeRemaining(diff);
  }

  public static random(): Assignment {
    // TODO: implement
    let assignment = new Assignment();

    return assignment;
  }
}
