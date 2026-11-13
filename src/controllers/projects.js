import { getProjectDetails, getUpcomingProjects } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

    res.render('project', { title: project.title, project });
};

export { showProjectsPage, showProjectDetailsPage };