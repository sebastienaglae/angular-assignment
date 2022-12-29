const { AccountDto } = require('./account');
const { SubjectDto } = require('./subject');
const { TeacherDto } = require('./teacher');

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

const AssignmentSearchEntryDto = assignment => {
    return {
        id: assignment._id,
        ownerId: assignment.owner,
        subjectId: assignment.subject,
        teacherId: assignment.teacher,
        title: assignment.title,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
        dueDate: assignment.dueDate,
        hasSubmission: assignment.submission !== null,
        hasRating: assignment.rating !== null
    };
}

const AssignmentFullDto = assignment => {
    return {
        id: assignment._id,
        owner: AccountDto(assignment.owner),
        subject: SubjectDto(assignment.subject),
        teacher: TeacherDto(assignment.teacher),
        title: assignment.title,
        description: assignment.description,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
        dueDate: assignment.dueDate,
        submission: assignment.submission || null,
        rating: assignment.rating || null
    };
}

module.exports = { AssignmentDto, AssignmentSearchEntryDto, AssignmentFullDto };