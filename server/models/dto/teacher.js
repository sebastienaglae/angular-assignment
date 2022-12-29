const TeacherDto = (teacher) => {
    return {
        id: teacher._id,
        name: teacher.name,
        iconUrl: teacher.iconUrl,
    };
}

module.exports = {TeacherDto};