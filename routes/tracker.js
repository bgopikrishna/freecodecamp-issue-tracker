const express = require('express');
const {
    Project,
    validateIssuePost,
    validateIssuePut,
    validateIssueGet
} = require('../models/project');

const router = express.Router();

router.get('/:projectName', async (req, res) => {
    const { projectName } = req.params;
    const queryParams = validateIssueGet(req.query);
    console.log('Query Parmam: Get', queryParams, 'Project Name', projectName);

    let project;

    if (Object.keys(queryParams.value).length === 0) {
      project =  await Project.findOne({ name: projectName });
    } 
    else {
        project = await Project.findOne({
            name: projectName
        }).or({ issues: { $elemMatch: { ...queryParams.value } } });
    }

    console.log(project);
    if (project) {
        res.send(project);
    } else {
        res.send("Couldn't find the project");
    }
});

router.post('/:projectName', async (req, res) => {
    const { projectName } = req.params;
    let project = await Project.findOne({ name: projectName });

    const issue = validateIssuePost(req.body);

    if (issue.error) {
        return res.send(issue.error.message);
    }
    if (!project) {
        project = new Project({
            name: projectName
        });
    }

    const subdoc = project.issues.create(issue.value);
    project.issues.push(subdoc);
    const updated = await project.save();

    console.log(updated);

    res.send(subdoc);
});

router.put('/:projectName', async (req, res) => {
    const { projectName } = req.params;
    const issueToBeUpdated = validateIssuePut(req.body);
    if (issueToBeUpdated.error) {
        return res.send(issueToBeUpdated.error.message);
    }

    const project = await Project.findOne({ name: projectName });
    console.log(project);
    if (!project) {
        return res.send("Couldn't find the project");
    }

    const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
    } = issueToBeUpdated.value;

    if (
        !(
            issue_title ||
            issue_text ||
            (created_by && assigned_to) ||
            status_text ||
            open
        )
    ) {
        return res.send('no updated field sent');
    }

    const subdoc = project.issues.id(_id);
    const updatedDoc = await subdoc.set({
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
        updated_on: Date.now()
    });
    const updated = await project.save();

    console.log(updated);

    if (updatedDoc) {
        return res.send('successfully updated');
    } else {
        return res.send('could not update ' + _id);
    }
});

router.delete('/:projectName', async (req, res) => {
    const { projectName } = req.params;
    const { _id } = req.body;

    if (_id) {
        return res.send('_id error');
    }

    const project = await Project.findOne({ name: projectName });
    console.log(project);
    if (!project) {
        return res.send('could not delete ' + _id);
    }

    const deleted = await project.issues.id(_id).remove();
    const updated = await project.save();

    console.log(updated);
    if (deleted) {
        return res.send('deleted ' + _id);
    } else {
        return res.send('could not delete ' + _id);
    }
});

module.exports = router;
