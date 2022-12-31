import { Schema, model } from 'mongoose';

interface IAssignmentSubmission {
  assignment: Schema.Types.ObjectId;
  student: Schema.Types.ObjectId;
  submittedAt: Date;
  submittedAttachments: IAssignmentSubmissionAttachment[];
  rating: IAssignmentSubmissionRating;
}

interface IAssignmentSubmissionAttachment {
  name: string;
  mimeType: string;
  content: Schema.Types.Buffer;
}

interface IAssignmentSubmissionRating {
  rating: number;
  feedback: string;
  ratedAt: Date;
}

const AssignmentSubmissionAttachmentSchema =
  new Schema<IAssignmentSubmissionAttachment>({
    name: { type: String, required: true },
    mimeType: { type: String, required: true },
    content: {
      type: Schema.Types.Buffer,
      required: true,
      maxlength: 1024 * 1024 * 5,
    },
  });

const AssignmentSubmissionRatingSchema =
  new Schema<IAssignmentSubmissionRating>({
    rating: { type: Number, required: true },
    feedback: { type: String, required: false },
    ratedAt: { type: Date, required: true, default: Date.now },
  });

const AssignmentSubmissionSchema = new Schema<IAssignmentSubmission>({
  assignment: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  submittedAt: { type: Date, required: true, default: Date.now },
  submittedAttachments: {
    type: [AssignmentSubmissionAttachmentSchema],
    required: true,
    maxlength: 5,
  },
  rating: { type: AssignmentSubmissionRatingSchema, required: false },
});

const AssignmentSubmission = model<IAssignmentSubmission>(
  'AssignmentSubmission',
  AssignmentSubmissionSchema
);

export default AssignmentSubmission;
