import { Utils } from '../utils/Utils';

export class AssignmentSearch {
  public id?: string;

  public ownerId?: string;
  public subjectId?: string;
  public title?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public dueDate?: Date;
  public teacherId?: string;
  public hasRating?: boolean;
  public hasSubmission?: boolean;

  // Fonction qui retourne true si la date de rendu est dépassée
  public static isTooLate(ass: AssignmentSearch): boolean {
    if (!ass || !ass.dueDate) return false;
    let today = new Date();
    let rendu = new Date(ass.dueDate);
    return today > rendu;
  }
}
