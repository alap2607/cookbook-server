import fs from 'fs/promises';
import path from 'path';
import { Recipe, RecipeData } from '../models/Recipe';
import { v4 as uuidv4 } from 'uuid';

const DATA_FILE = path.join(__dirname, '../../data/recipes.json');

// Write queue to prevent concurrent writes
let isWriting = false;
const writeQueue: (() => Promise<void>)[] = [];

async function queueWrite(writeOp: () => Promise<void>): Promise<void> {
  return new Promise((resolve, reject) => {
    writeQueue.push(async () => {
      try {
        await writeOp();
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    processQueue();
  });
}

async function processQueue() {
  if (isWriting || writeQueue.length === 0) return;

  isWriting = true;
  const operation = writeQueue.shift();

  if (operation) {
    await operation();
  }

  isWriting = false;
  if (writeQueue.length > 0) {
    processQueue();
  }
}

export async function readRecipes(): Promise<Recipe[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const recipeData: RecipeData = JSON.parse(data);
    return recipeData.recipes;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create it with empty recipes
      await writeRecipes([]);
      return [];
    }
    throw error;
  }
}

export async function writeRecipes(recipes: Recipe[]): Promise<void> {
  const data: RecipeData = { recipes };
  await queueWrite(async () => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  });
}

export async function findRecipeById(id: string): Promise<Recipe | null> {
  const recipes = await readRecipes();
  const recipe = recipes.find((r) => r.id === id);
  return recipe || null;
}

export async function createRecipe(recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
  const recipes = await readRecipes();
  const now = new Date().toISOString();

  const newRecipe: Recipe = {
    id: uuidv4(),
    ...recipeData,
    createdAt: now,
    updatedAt: now,
  };

  recipes.push(newRecipe);
  await writeRecipes(recipes);

  return newRecipe;
}

export async function updateRecipe(id: string, updates: Partial<Omit<Recipe, 'id' | 'createdAt'>>): Promise<Recipe | null> {
  const recipes = await readRecipes();
  const index = recipes.findIndex((r) => r.id === id);

  if (index === -1) {
    return null;
  }

  const updatedRecipe: Recipe = {
    ...recipes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  recipes[index] = updatedRecipe;
  await writeRecipes(recipes);

  return updatedRecipe;
}

export async function deleteRecipe(id: string): Promise<boolean> {
  const recipes = await readRecipes();
  const filteredRecipes = recipes.filter((r) => r.id !== id);

  if (filteredRecipes.length === recipes.length) {
    return false; // Recipe not found
  }

  await writeRecipes(filteredRecipes);
  return true;
}
