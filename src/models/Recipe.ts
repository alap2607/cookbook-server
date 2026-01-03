export interface Ingredient {
  item: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: 'vegetarian' | 'chicken' | 'quick' | 'spicy';
  cookTime: number;
  servings: number;
  imageUrl: string;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeData {
  recipes: Recipe[];
}
