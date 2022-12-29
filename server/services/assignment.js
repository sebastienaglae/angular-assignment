const { Assignment } = require('../models/db');

class AssignmentService {
    static _maxSearchLimit = 1000;
    static _maxSubmissionSize = 1024 * 1024 * 4; // 4 MB

    get maxSearchLimit() {
        return AssignmentService._maxSearchLimit;
    }

    get maxSubmissionSize() {
        return AssignmentService._maxSubmissionSize;
    }

    async create(ownerId, subjectId, teacherId, title, description, dueDate) {
        const assignment = new Assignment({
            owner: ownerId,
            subject: subjectId,
            teacher: teacherId,

            title,
            description,
            dueDate
        });
        await assignment.save();

        return assignment;
    }

    async updateInformation(id, subjectId, teacherId, title, description, dueDate) {
        const result = await Assignment.updateOne({ _id: id }, {
            subject: subjectId,
            teacher: teacherId,

            title,
            description,
            dueDate,

            updatedAt: Date.now()
        });
        return result.modifiedCount === 1;
    }

    async updateSubmission(id, submission) {
        const result = await Assignment.updateOne({ _id: id }, {
            submission,
        });
        return result.modifiedCount === 1;
    }

    async updateRating(id, rating) {
        const result = await Assignment.updateOne({ _id: id }, {
            rating
        });
        return result.modifiedCount === 1;
    }

    async delete(id) {
        const result = await Assignment.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }

    async find(id) {
        return Assignment.findById(id);
    }

    async search(options) {
        const checkOptionsResult = this.checkOptions(options);
        if (checkOptionsResult !== undefined) {
            throw checkOptionsResult;
        }

        const filter = this.convertFilterToQuery(options.filter);
        const query = Assignment
            .find(filter)
            .sort(options.order)
            .skip((options.page - 1) * options.limit)
            .limit(options.limit + 1);

        const items = await query.exec();
        const result = new SearchResult();
        const totalDocuments = await this.countDocuments(filter);

        result.items = items.slice(0, options.limit);
        result.page = options.page;
        result.totalPages = Math.max(Math.ceil(totalDocuments / options.limit), 1)
        result.totalItems = totalDocuments;
        result.hasNext = items.length > options.limit;
        result.hasPrevious = options.page > 1;

        return result;
    }

    convertFilterToQuery(filter) {
        const query = {};
        for (const key in filter) {
            const value = filter[key];
            const type = typeof value;
            const path = Assignment.schema.paths[key];
            if (path.instance === 'String' && type === 'string') {
                query[key] = { $regex: value, $options: 'i' };
            } else {
                query[key] = value;
            }
        }
        return query;
    }

    countDocuments(filter) {
        return Assignment.countDocuments(filter);
    }

    checkOptions(options) {
        if (options.page < 1) {
            return new SearchBadRequestError('Invalid page number');
        }
        if (options.limit < 1 || options.limit > this.maxSearchLimit) {
            return new SearchBadRequestError('Invalid limit');
        }
        if (typeof options.filter !== 'object') {
            return new SearchBadRequestError('Invalid filter');
        }
        if (typeof options.order !== 'object') {
            return new SearchBadRequestError('Invalid order');
        }

        // check if values inside filter are valid
        for (const key in options.filter) {
            const value = options.filter[key];
            const type = typeof value;
            if (type !== 'string' && type !== 'number' && type !== 'boolean') {
                return new SearchBadRequestError('Invalid filter. Values must be strings, numbers or booleans.');
            }
            const keyExists = key in Assignment.schema.paths;
            if (!keyExists) {
                return new SearchBadRequestError('Invalid filter. Unknown key.');
            }
        }

        // check if values inside order are valid
        for (const key in options.order) {
            const value = options.order[key];
            if (value !== 1 && value !== -1) {
                return new SearchBadRequestError('Invalid order. Order value must be 1 or -1.');
            }
            const keyExists = key in Assignment.schema.paths;
            if (!keyExists) {
                return new SearchBadRequestError('Invalid order. Unknown key.');
            }
        }
    }
}

class SearchBadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SearchBadRequestError';
        this.code = 400;
    }
}

class SearchResult {
    constructor() {
        this.page = 1;
        this.totalPages = 1;
        this.totalItems = 0;
        this.items = [];
        this.hasNext = false;
        this.hasPrevious = false;
    }
}

const assignmentService = new AssignmentService();

module.exports = assignmentService;
