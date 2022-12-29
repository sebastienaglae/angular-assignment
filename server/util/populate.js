const AuthenticationService = require('../services/authentication');
const SubjectService = require('../services/subject');
const AssignmentService = require('../services/assignment');
const TeacherService = require('../services/teacher');

class DatabasePopulate {
    _userIds = [];
    _teacherIds = [];

    async populate() {
        if ((await SubjectService.fetchAll()).length !== 0) {
            console.warn('Database is not empty. Skipping population.');
            return;
        }

        await this.createUsers();
        await this.createSubjects();
        await this.createTeachers();
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
        await SubjectService.create('Math', 'https://picsum.photos/200/300?random=1');
        await SubjectService.create('English', 'https://picsum.photos/200/300?random=2');
        await SubjectService.create('Science', 'https://picsum.photos/200/300?random=1');
        await SubjectService.create('History', 'https://picsum.photos/200/300?random=1');
        await SubjectService.create('Art', 'https://picsum.photos/200/300?random=1');
        await SubjectService.create('Music', 'https://picsum.photos/200/300?random=1');
        await SubjectService.create('PE', 'https://picsum.photos/200/300?random=1');
        await SubjectService.create('Computer Science', 'https://picsum.photos/200/300?random=1');
        await SubjectService.create('Foreign Language', 'https://picsum.photos/200/300?random=1');
        await SubjectService.create('Other', 'https://picsum.photos/200/300?random=1');
    }

    async createTeachers() {
        this._teacherIds = [];

        for (let i = 1; i <= 10; i++) {
            const id = await TeacherService.create(`Fake Teacher ${i}`, `https://picsum.photos/200/300?random=${i}`);
            this._teacherIds.push(id);
        }
    }

    async createAssignments() {
        const subjects = await SubjectService.fetchAll();

        for (let i = 1; i <= 1000; i++) {
            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            const user = this._userIds[Math.floor(Math.random() * this._userIds.length)];
            const teacher = this._teacherIds[Math.floor(Math.random() * this._teacherIds.length)];

            const year = new Date().getFullYear() + 1;
            const month = Math.floor(Math.random() * 12);
            const day = Math.floor(Math.random() * 28);

            const dueDate = new Date(year, month, day);

            await AssignmentService.create(user._id, subject._id, teacher._id, `Test Assignment ${i}`, `This is a test assignment for user id ${user}. Random number: ${Math.random()}`, dueDate);
        }
    }
}

module.exports = new DatabasePopulate();