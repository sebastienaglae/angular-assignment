import {Assigment} from "../models/db";

class AssigmentService {
    static _maxSearchLimit = 1000;
    static _orderOptions = {
        'created-asc': {createdAt: 1},
        'created-desc': {createdAt: -1},
    };

    async create(title, description, dueDate) {
        const assigment = new Assigment({
            title,
            description,
            dueDate
        });
        await assigment.save();

        return assigment;
    }

    async update(id, title, description, dueDate) {
        const result = await Assigment.updateOne({_id: id}, {
            title,
            description,
            dueDate
        });

        return result.nModified === 1;
    }

    async delete(id) {
        const result = await Assigment.deleteOne({_id: id});
        return result.deletedCount === 1;
    }

    async find(id) {
        return Assigment.findById(id);
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
        const query = Assigment.find(filter);

        if (options.page > 1) {
            query.skip((options.page - 1) * options.limit - 1);
            query.limit(options.limit + 2); // +1 for the last previous element page, +1 for the next page element
        } else {
            query.limit(options.limit + 1); // +1 for the next page element
        }

        query.sort(AssigmentService._orderOptions[options.order]);
        const items = await query.exec();
        const result = new SearchResult();
        result.items = items.slice(0, options.limit);
        result.page = options.page;
        result.totalPages = Math.ceil(await this.countDocuments(filter) / options.limit);
        result.hasNext = items.length > options.limit;
        result.hasPrevious = options.page > 1;
    }

    countDocuments(filter) {
        return Assigment.countDocuments(filter);
    }

    checkOptions(options) {
        if (options.page < 1) {
            return new SearchBadRequestError('Invalid page number');
        }
        if (options.limit < 1 || options.limit > AssigmentService._maxSearchLimit) {
            return new SearchBadRequestError('Invalid limit');
        }
        if (!AssigmentService._orderOptions.hasOwnProperty(options.order)) {
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

const assigmentService = new AssigmentService();

module.exports = {assigmentService};