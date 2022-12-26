const SubjectDto = (subject) => {
    return {
        id: subject._id,
        name: subject.name
    };
}

module.exports = {SubjectDto};