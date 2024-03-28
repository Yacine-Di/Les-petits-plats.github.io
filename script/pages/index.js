import { recipes } from "../data/recipes.js"
import { filtersTemplate } from "../templates/filtersTemplate.js"
import { recipeTemplate, ingredientsTemplate } from "../templates/recipeTemplate.js"
import { filterQueryTags } from "../filter/filterSearch.js"

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

export async function displayNoResultMsg(query){
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
        let matchingRecipes = filterQueryTags(recipes, query)

        if (query.length === 0) {
            clearMainField.style.display = "none"
            filters.updateFilters(matchingRecipes)
            updateRecipes(matchingRecipes)
            updateResult()
        } else {
            clearMainField.style.display = "inline"
            if (query.length >= 3) {
                if(matchingRecipes.length === 0){
                    displayNoResultMsg(query)
                }
                filters.updateFilters(matchingRecipes)
                updateRecipes(matchingRecipes)
                updateResult()
            }
        }
    })
    
    clearMainField.addEventListener("click", () => {
        const query = searchField.value.trim()
        if (query.length > 0) {
            searchField.value = ""
            clearMainField.style.display = "none"
            let matchingRecipes = filterQueryTags(recipes)
            filters.updateFilters(matchingRecipes)
            updateRecipes(matchingRecipes)
            updateResult()
        }
    })
}

init()