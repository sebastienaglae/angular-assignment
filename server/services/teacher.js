const { Teacher } = require('../models/db');

class TeacherService {
    async search(name, limit) {
        if (name && name.length > 0) {
            return Teacher.find({ name: { $regex: name, $options: 'i' } }).limit(limit).exec();
        }
        return Teacher.find().limit(limit).exec();
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