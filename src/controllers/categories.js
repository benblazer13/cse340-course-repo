import {
    getAllCategories,
    getCategoryById,
    getCategoriesByServiceProjectId,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    const category = await getCategoryById(req.params.id);
    if (!category) {
        return res.status(404).render('errors/404', { title: 'Page Not Found' });
    }

    const projects = await getProjectsByCategoryId(req.params.id);
    res.render('category', { title: category.name, category, projects });
};

const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

const showEditCategoryForm = async (req, res) => {
    const category = await getCategoryById(req.params.id);
    if (!category) {
        return res.status(404).render('errors/404', { title: 'Page Not Found' });
    }

    res.render('edit-category', { title: 'Edit Category', category });
};

const processNewCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect('/new-category');
    }

    try {
        const categoryId = await createCategory(req.body.name);
        req.flash('success', 'Category added successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        if (error.code !== '23505') {
            throw error;
        }

        req.flash('error', 'A category with that name already exists.');
        res.redirect('/new-category');
    }
};

const processEditCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect(`/edit-category/${req.params.id}`);
    }

    try {
        const categoryId = await updateCategory(req.params.id, req.body.name);
        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        if (error.code !== '23505') {
            throw error;
        }

        req.flash('error', 'A category with that name already exists.');
        res.redirect(`/edit-category/${req.params.id}`);
    }
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    if (!projectDetails) {
        return res.status(404).render('errors/404', { title: 'Page Not Found' });
    }

    res.render('assign-categories', {
        title: 'Assign Categories to Project',
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selected = req.body.categoryIds || [];
    const categoryIdsArray = Array.isArray(selected) ? selected : [selected];

    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};