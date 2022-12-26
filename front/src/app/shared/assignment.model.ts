import { Utils } from './tools/Utils';
import { Rating } from './rating.model';

export class Assignment {
  public _id!: string;

  public ownerId!: string;
  public subject!: string;
  public title!: string;
  public description!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public dueDate!: Date;
  public submission!: boolean;
  public rating!: Rating;

  public isValid(): boolean {
    // TODO: implement

    return true;
  }

  public getTeacherImgPath(): string {
    //todo implement
    throw new Error('Method not implemented.');
  }

  public getSubjectImgPath(): string {
    //todo implement
    throw new Error('Method not implemented.');
  }

  public static isTooLate(ass: Assignment): boolean {
    let today = new Date();
    let rendu = new Date(ass.dueDate);
    return today > rendu;
  }

  public static getTimeRemaining(ass: Assignment): string {
    let today = new Date();
    let rendu = new Date(ass.dueDate);
    let diff = rendu.getTime() - today.getTime();
    return Utils.convertTimestampToTimeRemaining(diff);
  }

  public static random(): Assignment {
    let assignment = new Assignment();
    assignment.title = 'Random Assignment ' + Math.floor(Math.random() * 1000);
    assignment.dueDate = Utils.randomDate(2018, 2024);
    assignment.ownerId = 'Random Author';

    // TODO: implement

    return assignment;
  }
}
