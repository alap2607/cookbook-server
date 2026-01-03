import { Request, Response, NextFunction } from 'express';
import * as storage from '../utils/fileStorage';
import { Recipe } from '../models/Recipe';

// Get all recipes
export const getAllRecipes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipes = await storage.readRecipes();
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

// Get single recipe by ID
export const getRecipeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const recipe = await storage.findRecipeById(id);

    if (!recipe) {
      return res.status(404).json({
        error: 'Recipe not found',
        code: 'RECIPE_NOT_FOUND',
        status: 404,
      });
    }

    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

// Create new recipe
export const createRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, category, cookTime, servings, imageUrl, ingredients, instructions, tags } = req.body;

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        error: 'Title, description, and category are required',
        code: 'VALIDATION_ERROR',
        status: 400,
      });
    }

    if (!['vegetarian', 'chicken', 'quick', 'spicy'].includes(category)) {
      return res.status(400).json({
        error: 'Invalid category. Must be one of: vegetarian, chicken, quick, spicy',
        code: 'VALIDATION_ERROR',
        status: 400,
      });
    }

    const newRecipe = await storage.createRecipe({
      title,
      description,
      category,
      cookTime: cookTime || 0,
      servings: servings || 1,
      imageUrl: imageUrl || '',
      ingredients: ingredients || [],
      instructions: instructions || [],
      tags: tags || [],
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    next(error);
  }
};

// Update recipe
export const updateRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate category if provided
    if (updates.category && !['vegetarian', 'chicken', 'quick', 'spicy'].includes(updates.category)) {
      return res.status(400).json({
        error: 'Invalid category. Must be one of: vegetarian, chicken, quick, spicy',
        code: 'VALIDATION_ERROR',
        status: 400,
      });
    }

    const updatedRecipe = await storage.updateRecipe(id, updates);

    if (!updatedRecipe) {
      return res.status(404).json({
        error: 'Recipe not found',
        code: 'RECIPE_NOT_FOUND',
        status: 404,
      });
    }

    res.json(updatedRecipe);
  } catch (error) {
    next(error);
  }
};

// Delete recipe
export const deleteRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteRecipe(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Recipe not found',
        code: 'RECIPE_NOT_FOUND',
        status: 404,
      });
    }

    res.json({ message: 'Recipe deleted successfully', id });
  } catch (error) {
    next(error);
  }
};
