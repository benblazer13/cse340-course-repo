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
    getCategoriesByProjectId,
    getProjectsByCategoryId
};