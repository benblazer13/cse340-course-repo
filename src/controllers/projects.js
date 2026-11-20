import { getProjectDetails, getUpcomingProjects, createProject, updateProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Title must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location cannot exceed 200 characters'),
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Organization must be a valid integer')
];

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const project = await getProjectDetails(req.params.id);
    if (!project) {
        return res.status(404).render('errors/404', { title: 'Page Not Found' });
    }

    const categories = await getCategoriesByProjectId(req.params.id);
    res.render('project', { title: project.title, project, categories });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    res.render('new-project', { title: 'Add New Service Project', organizations });
};

const showEditProjectForm = async (req, res) => {
    const project = await getProjectDetails(req.params.id);
    if (!project) {
        return res.status(404).render('errors/404', { title: 'Page Not Found' });
    }

    const organizations = await getAllOrganizations();
    res.render('edit-project', { title: 'Edit Service Project', project, organizations });
};

const processNewProjectForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);
        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

const processEditProjectForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-project/${req.params.id}`);
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        const projectId = await updateProject(
            req.params.id,
            title,
            description,
            location,
            date,
            organizationId
        );
        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'There was an error updating the service project.');
        res.redirect(`/edit-project/${req.params.id}`);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    showEditProjectForm,
    processNewProjectForm,
    processEditProjectForm,
    projectValidation
};