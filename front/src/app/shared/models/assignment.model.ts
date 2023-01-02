import { ValidatorFn, Validators } from '@angular/forms';
import { Utils } from '../utils/Utils';
import { Rating } from './rating.model';
import { Submission } from './submission.model';

export class Assignment {
  public id?: string;

  public ownerId?: string;
  public subjectId?: string;
  public title?: string;
  public description?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public dueDate?: Date;
  public submission?: Submission;
  public rating?: Rating;
  public teacherId?: string;

  public static getOwnerIdValidators(): ValidatorFn | null {
    return Validators.compose([Validators.required]);
  }

  public static getSubjectIdValidators(): ValidatorFn | null {
    return Validators.compose([Validators.required]);
  }

  public static getTitleValidators(): ValidatorFn | null {
    return Validators.compose([Validators.required]);
  }

  public static getDescriptionValidators(): ValidatorFn | null {
    return Validators.compose([Validators.required]);
  }

  public static getDueDateValidators(): ValidatorFn | null {
    return Validators.compose([Validators.required]);
  }

  public static geTeacherIdValidators(): ValidatorFn | null {
    return Validators.compose([Validators.required]);
  }

  public isValid() {
    return (
      this.ownerId !== undefined &&
      this.subjectId !== undefined &&
      this.title !== undefined &&
      this.description !== undefined &&
      this.dueDate !== undefined &&
      this.teacherId !== undefined
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

  public static random(): Assignment {
    // TODO: implement
    let assignment = new Assignment();

    return assignment;
  }
}
