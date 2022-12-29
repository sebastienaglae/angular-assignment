const TeacherDto = (teacher) => {
    return {
        id: teacher._id,
        name: teacher.name,
        iconUrl: teacher.iconUrl,
        createdAt: teacher.createdAt,
    };
}

module.exports = { TeacherDto };