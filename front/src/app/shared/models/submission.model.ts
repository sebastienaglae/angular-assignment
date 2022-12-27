export class Submission {
  type!: string;
  content: Buffer | string | null = null;
  submittedAt!: Date;
}
