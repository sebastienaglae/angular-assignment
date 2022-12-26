const {Subject} = require('../models/db');

class SubjectService {
    async fetchAll() {
        return Subject.find().sort({ title: 1 }).exec();
    }

    async fetch(id) {
        return Subject.findById(id);
    }

    exists(id) {
        return Subject.exists({ _id: id });
    }

    async create(title) {
        const subject = new Subject({
            name: title
        });
        await subject.save();
    }
}

module.exports = new SubjectService();