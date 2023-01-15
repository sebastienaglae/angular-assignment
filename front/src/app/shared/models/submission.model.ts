import { Buffer } from 'buffer';
import { Assignment } from './assignment.model';

export class Submission {
  type!: string;
  content: Buffer | string | null = null;
  submittedAt!: Date;
  originalName!: string;

  public static createSubmission(
    file: File,
    buffer: Buffer
  ): Submission {
    let submission = new Submission();
    submission.type = file.type;
    submission.originalName = file.name;
    submission.content = buffer;
    return submission;
  }

  public static getFile(submission: Submission | undefined): File | undefined {
    if (submission && submission.content) {
      const uint8Array = (submission.content as any).data;
      const blob = new Blob([new Uint8Array(uint8Array)], {
        type: submission.type,
      });
      return new File([blob], 'file', { type: submission.type });
    }
    return undefined;
  }
}
