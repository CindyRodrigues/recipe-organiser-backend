require('dotenv').config()

const express = require('express')

const app = express()

const cors = require('cors')

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))

const { initializeDatabase } = require('./db/db.connect')
const Recipe = require('./models/recipes.models')

app.use(express.json())

initializeDatabase()

app.get('/', (req, res) => {
    res.send("Recipe Organiser")
})

const getRecipes = async () => {
    try {
        const recipes = await Recipe.find()
        return recipes
    } catch (error) {
        console.log("Error getting recipes:", error)
    }
}

app.get('/recipes', async (req, res) => {
    try {
        const recipes = await getRecipes()
        if(recipes.length != 0) {
            res.json(recipes)
        } else {
            res.status(404).json({error: "No recipes found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch recipes."})
    }
})

const getRecipeById = async (recipeId) => {
    try {
        const recipe = await Recipe.findById(recipeId)
        return recipe
    } catch (error) {
        console.log("Error getting recipe by id:", error)
    }
}

app.get('/recipes/:recipeId', async (req, res) => {
    try {
        const recipe = await getRecipeById(req.params.recipeId)
        if(recipe) {
            res.json(recipe)
        } else {
            res.status(404).json({error: "Recipe not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch recipe."})
    }
})

const createRecipe = async (newRecipe) => {
    try {
        const recipe = new Recipe(newRecipe)
        const savedRecipe = await recipe.save()
        return savedRecipe
    } catch (error) {
        console.log("Error adding recipe:", error)
    }
}

app.post("/recipes", async (req, res) => {
    try {
        const savedRecipe = await createRecipe(req.body)
        if(savedRecipe) {
            res.status(201).json({message: "Recipe added successfully.", recipe: savedRecipe})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to add recipe."})
    }
})

const deleteRecipeById = async (recipeId) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(recipeId)
        return deletedRecipe
    } catch (error) {
        console.log("Error deleting recipe:", error)
    }
}

app.delete('/recipes/:recipeId', async (req, res) => {
    try {
        const deletedRecipe = await deleteRecipeById(req.params.recipeId)
        if(deletedRecipe) {
            res.status(200).json({message: "Recipe deleted successfully."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to delete recipe."})
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})