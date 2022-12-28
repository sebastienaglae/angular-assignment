import { Buffer } from 'buffer';
import { Assignment } from './assignment.model';

export class Submission {
  type!: string;
  content: Buffer | string | null = null;
  submittedAt!: Date;

  public static downloadContentToUser(assignment: Assignment): void {
    const submission = assignment.submission;
    if (submission && submission.content) {
      const uint8Array = (submission.content as any).data;
      const blob = new Blob([new Uint8Array(uint8Array)], {
        type: submission.type,
      });
      const url = window.URL.createObjectURL(blob);
      // Trick to force download, see https://stackoverflow.com/a/32226068 but it's not clean :(
      const link = document.createElement('a');
      link.href = url;
      link.download = `${assignment.id}.${submission.type.split('/')[1]}`;
      link.click();
    }
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
