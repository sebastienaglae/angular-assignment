const { Teacher } = require('../models/db');

class TeacherService {
    async search(name, limit) {
        return Teacher.find({ name: { $regex: name, $options: 'i' } }).limit(limit).exec();
    }

    async fetch(id) {
        return Teacher.findById(id);
    }

    exists(id) {
        return Teacher.exists({ _id: id });
    }

    async create(title, iconUrl) {
        const teacher = new Teacher({
            name: title,
            iconUrl: iconUrl,
        });
        await teacher.save();
        return teacher._id;
    }
}

module.exports = new TeacherService();