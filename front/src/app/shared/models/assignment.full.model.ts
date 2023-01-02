import { Utils } from '../utils/Utils';
import { Rating } from './rating.model';
import { Subject } from './subject.model';
import { Submission } from './submission.model';
import { Teacher } from './teacher.model';
import { User } from './user.model';

export class Assignment {
  public id?: string;

  public title?: string;
  public description?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public dueDate?: Date;
  public submission?: Submission;
  public rating?: Rating;
  public teacher?: Teacher;
  public subject?: Subject;
  public owner?: User;

  public isValid() {
    return (
      this.owner !== undefined &&
      this.subject !== undefined &&
      this.title !== undefined &&
      this.description !== undefined &&
      this.dueDate !== undefined &&
      this.teacher !== undefined
    );
  }
  // Fonction qui retourne true si la date de rendu est dépassée
  public static isTooLate(ass: Assignment): boolean {
    if (!ass || !ass.dueDate) return false;
    let today = new Date();
    let rendu = new Date(ass.dueDate);
    return today > rendu;
  }

  // Fonction qui retourne le temps restant avant la date de rendu
  public static getTimeRemaining(ass: Assignment): string {
    if (!ass || !ass.dueDate) return 'Erreur: date de rendu non définie';
    let today = new Date();
    let rendu = new Date(ass.dueDate);
    let diff = rendu.getTime() - today.getTime();
    return Utils.convertTimestampToTimeRemaining(diff);
  }
}
