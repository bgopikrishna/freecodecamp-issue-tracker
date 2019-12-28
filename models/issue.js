const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const issueSchema = new mongoose.Schema({
    issue_title: {
        type: String
    },
    issue_text: {
        type: String
    },
    created_by: {
        type: String
    },
    assigned_to: {
        type: String,
        default: ''
    },
    status_text: {
        type: String,
        default: ''
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    updated_on: {
        type: Date,
        default: null
    },
    open: {
        type: Boolean,
        default: true
    }
});

function validateIssueGet(issue) {
    const joiSchema = Joi.object({
        _id: Joi.string().optional(),
        issue_title: Joi.string().optional(''),
        issue_text: Joi.string().optional(''),
        created_by: Joi.string().optional(''),
        assigned_to: Joi.string().optional(''),
        status_text: Joi.string().optional(''),
        open: Joi.boolean().optional()
    });

    return joiSchema.validate(issue);
}

function validateIssuePost(issue) {
    const joiSchema = Joi.object({
        issue_title: Joi.string().required(),
        issue_text: Joi.string().required(),
        created_by: Joi.string().default(''),
        assigned_to: Joi.string().default(''),
        status_text: Joi.string().default('')
    });
    return joiSchema.validate(issue);
}
function validateIssuePut(issue) {
    const joiSchema = Joi.object({
        _id: Joi.string().required(),
        issue_title: Joi.string().default(''),
        issue_text: Joi.string().default(''),
        created_by: Joi.string().default(''),
        assigned_to: Joi.string().default(''),
        status_text: Joi.string().default(''),
        open: Joi.boolean().default(true)
    });
    return joiSchema.validate(issue);
}

exports.issueSchema = issueSchema;
exports.validateIssuePost = validateIssuePost;
exports.validateIssuePut = validateIssuePut;
exports.validateIssueGet = validateIssueGet
