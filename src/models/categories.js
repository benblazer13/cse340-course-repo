import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM category
        ORDER BY name;
    `;
    const result = await db.query(query);
    return result.rows;
};

const getCategoryById = async (id) => {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const createCategory = async (name) => {
    const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `;
    const result = await db.query(query, [name]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE category
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;
    const result = await db.query(query, [name, categoryId]);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    return result.rows[0].category_id;
};

const getCategoriesByProjectId = async (project_id) => {
    const query = `
        SELECT c.category_id, c.name
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;
    const result = await db.query(query, [project_id]);
    return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;
    await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

const getProjectsByCategoryId = async (category_id) => {
    const query = `
        SELECT
          p.project_id,
          p.title,
          TO_CHAR(p.project_date, 'YYYY-MM-DD') AS date,
          p.organization_id,
          o.name AS organization_name
        FROM service_project p
        JOIN project_category pc ON p.project_id = pc.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date;
    `;
    const result = await db.query(query, [category_id]);
    return result.rows;
};

export {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getCategoriesByProjectId,
    getCategoriesByProjectId as getCategoriesByServiceProjectId,
    updateCategoryAssignments,
    getProjectsByCategoryId
};