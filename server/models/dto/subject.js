const SubjectDto = (subject) => {
    return {
        id: subject._id,
        name: subject.name,
        iconUrl: subject.iconUrl,
    };
}

module.exports = {SubjectDto};