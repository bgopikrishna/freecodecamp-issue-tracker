const {
    issueSchema,
    validateIssuePost,
    validateIssuePut,
    validateIssueGet
} = require('./issue');

const mongoose = require('mongoose');

const projectScehma = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    issues: [issueSchema]
});

const Project = new mongoose.model('projects', projectScehma);


exports.Project = Project;
exports.validateIssuePost = validateIssuePost;
exports.validateIssuePut = validateIssuePut;
exports.validateIssueGet = validateIssueGet;
