import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

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

export { showCategoriesPage, showCategoryDetailsPage };