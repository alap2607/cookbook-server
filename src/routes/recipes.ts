import express from 'express';
import * as recipeController from '../controllers/recipeController';

const router = express.Router();

// GET /api/recipes - Get all recipes
router.get('/', recipeController.getAllRecipes);

// GET /api/recipes/:id - Get single recipe
router.get('/:id', recipeController.getRecipeById);

// POST /api/recipes - Create new recipe
router.post('/', recipeController.createRecipe);

// PUT /api/recipes/:id - Update recipe
router.put('/:id', recipeController.updateRecipe);

// DELETE /api/recipes/:id - Delete recipe
router.delete('/:id', recipeController.deleteRecipe);

export default router;
