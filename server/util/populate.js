const AuthenticationService = require('../services/authentication');
const SubjectService = require('../services/subject');
const AssignmentService = require('../services/assignment');

class DatabasePopulate {
    _userIds = [];

    async populate() {
        if ((await SubjectService.fetchAll()).length !== 0) {
            console.warn('Database is not empty. Skipping population.');
            return;
        }

        await this.createUsers();
        await this.createSubjects();
        await this.createAssignments();
    }

    async createUsers() {
        this._userIds = [];

        for (let i = 1; i <= 1000; i++) {
            const userId = await AuthenticationService.register(`Fake User ${i}`, `Password ${i}`, `bot-${i}@fake.com`);
            this._userIds.push(userId);
        }
    }

    async createSubjects() {
        await SubjectService.create('Math');
        await SubjectService.create('English');
        await SubjectService.create('Science');
        await SubjectService.create('History');
        await SubjectService.create('Art');
        await SubjectService.create('Music');
        await SubjectService.create('PE');
        await SubjectService.create('Computer Science');
        await SubjectService.create('Foreign Language');
        await SubjectService.create('Other');
    }

    async createAssignments() {
        const subjects = await SubjectService.fetchAll();

        for (let i = 1; i <= 1000; i++) {
            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            const user = this._userIds[Math.floor(Math.random() * this._userIds.length)];
            let dueDate = null;
            if (Math.random() < 0.5) {
                const year = new Date().getFullYear() + 1;
                const month = Math.floor(Math.random() * 12);
                const day = Math.floor(Math.random() * 28);
                dueDate = new Date(year, month, day);
            }

            await AssignmentService.create(user._id, subject._id, `Test Assignment ${i}`, `This is a test assignment for user id ${user}. Random number: ${Math.random()}`, dueDate);
        }
    }
}

module.exports = new DatabasePopulate();