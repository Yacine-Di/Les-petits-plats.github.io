import { recipes } from '../data/recipes.js'
import { filtersTemplate } from '../templates/filtersTemplate.js'
import { recipeTemplate, ingredientsTemplate } from '../templates/recipeTemplate.js'

const filters = new filtersTemplate(recipes)

async function init() {
    manageMainSearchField(recipes)

    filters.render()

    const recipesWrapper = document.querySelector(".recipes")
    recipes.forEach(recipe => {
        const recipeArticle = recipeTemplate(recipe)
        recipesWrapper.innerHTML += recipeArticle

        const ingredientsArticle = document.querySelector(`.recipe[data-id="${recipe.id}"] .recipe__details .recipe__ingredients`)
        ingredientsArticle.appendChild(ingredientsTemplate(recipe.ingredients))
    })

    updateResult()
}

/** fonction de tri des recettes lors de la recherche avec des boucles natives
 * 
 * @param {Array[recipes]} recipes 
 * @param {string} query recherche tapé par l'utilisateur dans le champ de recherche principal 
 */
export function filterQuery(recipes, query) {
    let matchingRecipes = []

    recipesLoop: for (let i = 0; i < recipes.length; i++) {
        const actualRecipe = recipes[i]
        const ingredients = actualRecipe.ingredients
        const name = actualRecipe.name
        const description = actualRecipe.description

        for (let j = 0; j < ingredients.length; j++) {
            const actualIngredient = ingredients[j]

            if (actualIngredient.ingredient.includes(query)) {
                matchingRecipes.push(actualRecipe)
                continue recipesLoop
            }
        }

        if (name.trim().includes(query) || description.trim().includes(query)) {
            matchingRecipes.push(actualRecipe)
        }
    }

    if (matchingRecipes.length === 0) {
        displayNoResultMsg(query)
    } else{
        const noResultMsg= document.querySelector(".no_ressult p")
        noResultMsg.style.display = "none"
    }

    return matchingRecipes
}

async function displayNoResultMsg(query){
    const noResultMsg = document.querySelector(".no_ressult p")
    noResultMsg.innerText = `Aucune recette ne contient '${query}' vous pouvez chercher «
    tarte aux pommes », « poisson », etc.`
    noResultMsg.style.display = "block"
}

async function updateResult() {
    const resultWrapper = document.querySelector(".result")
    const nbrOfResults = document.querySelector(".recipes").childElementCount
    resultWrapper.innerText = `${nbrOfResults} recettes`
}


async function updateRecipes(recipesList) {
    const recipesWrapper = document.querySelector(".recipes")
    recipesWrapper.innerHTML = ""

    recipesList.forEach(recipe => {
        const recipeArticle = recipeTemplate(recipe)
        recipesWrapper.innerHTML += recipeArticle

        const ingredientsArticle = document.querySelector(`.recipe[data-id="${recipe.id}"] .recipe__details .recipe__ingredients`)
        ingredientsArticle.appendChild(ingredientsTemplate(recipe.ingredients))
    })
}


async function manageMainSearchField(recipes) {
    const searchField = document.querySelector(".main__field ")
    searchField.value = ""
    const clearMainField = document.querySelector(".search .fa-xmark")

    searchField.addEventListener("keyup", (event) => {
        const query = event.target.value.trim()
        if (query.length < 3) {
            clearMainField.style.display = "none"
            updateRecipes(recipes)
            updateResult()

        } else {
            clearMainField.style.display = "inline"
            if (query.length >= 3) {
                let matchingRecipes = filterQuery(recipes, query)
                filters.updateFilters(matchingRecipes)
                updateRecipes(matchingRecipes)
                updateResult()
            }
        }
    })
    
    clearMainField.addEventListener("click", () => {
        const query = searchField.value
        if (query.length > 0) {
            searchField.value = ""
            clearMainField.style.display = "none"
            let matchingRecipes = filters.filterQueryTags(recipes)
            filters.updateFilters(matchingRecipes)
            updateRecipes(matchingRecipes)
            updateResult()
        }
    })
}

init()