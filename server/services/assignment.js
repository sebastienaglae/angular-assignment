const {Assignment} = require('../models/db');

class AssignmentService {
    static _maxSearchLimit = 1000;
    static _orderOptions = {
        'created-asc': { createdAt: 1 },
        'created-desc': { createdAt: -1 },
    };

    async create(title, description, dueDate) {
        const assignment = new Assignment({
            title,
            description,
            dueDate
        });
        await assignment.save();

        return assignment;
    }

    async update(id, title, description, dueDate) {
        const result = await Assignment.updateOne({ _id: id }, {
            title,
            description,
            dueDate
        });

        return result.nModified === 1;
    }

    async delete(id) {
        const result = await Assignment.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }

    async find(id) {
        return Assignment.findById(id);
    }

    async search(options) {
        if (options === undefined) {
            options = new SearchOptions();
        }

        const checkOptionsResult = this.checkOptions(options);
        if (checkOptionsResult !== undefined) {
            throw checkOptionsResult;
        }

        const filter = {};
        const query = Assignment.find(filter);

        query.sort(AssignmentService._orderOptions[options.order]);
        query.limit(options.limit + 1); // +1 to check if there is a next page

        const items = await query.exec();
        const result = new SearchResult();
        result.items = items.slice(0, options.limit);
        result.page = options.page;
        result.totalPages = Math.ceil(await this.countDocuments(filter) / options.limit);
        result.hasNext = items.length > options.limit;
        result.hasPrevious = options.page > 1;

        return result;
    }

    countDocuments(filter) {
        return Assignment.countDocuments(filter);
    }

    checkOptions(options) {
        if (options.page < 1) {
            return new SearchBadRequestError('Invalid page number');
        }
        if (options.limit < 1 || options.limit > AssignmentService._maxSearchLimit) {
            return new SearchBadRequestError('Invalid limit');
        }
        if (!AssignmentService._orderOptions.hasOwnProperty(options.order)) {
            return new SearchBadRequestError('Invalid order');
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

class SearchOptions {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.order = 'created-asc';
    }
}

class SearchResult {
    constructor() {
        this.page = 1;
        this.totalPages = 1;
        this.items = [];
        this.hasNext = false;
        this.hasPrevious = false;
    }
}

const assignmentService = new AssignmentService();

module.exports = assignmentService;
