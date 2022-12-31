const AssignmentDto = assignment => {
    return {
        id: assignment._id,
        ownerId: assignment.owner,
        subjectId: assignment.subject,
        teacherId: assignment.teacher,
        title: assignment.title,
        description: assignment.description,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
        dueDate: assignment.dueDate,
        submission: assignment.submission || null,
        rating: assignment.rating || null
    };
}

const AssignmentInfoDto = assignment => {
    return {
        id: assignment._id,
        ownerId: assignment.owner,
        subjectId: assignment.subject,
        teacherId: assignment.teacher,
        title: assignment.title,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
        dueDate: assignment.dueDate,
        hasSubmission: assignment.submission !== undefined && assignment.submission !== null,
        hasRating: assignment.rating !== undefined && assignment.rating !== null
    };
}

const AssignmentSubmissionDto = submission => {
    return {
        type: submission.type,
        content: submission.content,
        originalName: submission.originalName,
        submittedAt: submission.submittedAt
    };
}

const AssignmentRatingDto = rating => {
    return {
        rating: rating.rating,
        date: rating.date,
        comment: rating.comment
    };
}

module.exports = { AssignmentDto, AssignmentInfoDto, AssignmentSubmissionDto, AssignmentRatingDto };
