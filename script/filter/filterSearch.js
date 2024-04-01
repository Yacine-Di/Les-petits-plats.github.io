import { recipes as allRecipes } from "../data/recipes.js"
// eslint-disable-next-line no-unused-vars
import { displayNoResultMsg } from "../pages/index.js"

/**
 * 
 * @param {Array[recipes]} recipes tableau de recettes
 * @returns renvoie un tableau de recettes filtré
 */
export function filterQueryTags(recipes) {
    let newRecipesList = []
    let isFirstFiltering = true
    const allTags = document.querySelectorAll(".tag")
    const searchField = document.querySelector(".main__field ")


    if (allTags.length === 0 && searchField.value.length === 0) {
        newRecipesList = recipes
    } else if (allTags.length > 0 && searchField.value.length === 0) {
        allTags.forEach(t => {
            if (isFirstFiltering) {
                newRecipesList = getNewRecipesList(recipes, t)
                isFirstFiltering = false
            } else {
                newRecipesList = getNewRecipesList(newRecipesList, t)
            }
        })
    } else if (allTags.length === 0 && searchField.value.length >= 3) {
        newRecipesList = filterQuery(allRecipes, searchField.value)
    } else {
        if(searchField.value.length >= 3){
            newRecipesList = filterQuery(allRecipes, searchField.value)
            allTags.forEach(t => {
                newRecipesList = getNewRecipesList(newRecipesList, t)
            })
        }
    }

    return newRecipesList
}

/** fonction de tri des recettes lors de la recherche avec les méthodes de l'objet Array
 * 
 * @param {Array[recipes]} recipes 
*/
function filterQuery(recipes, query) {
    let matchingRecipes = []

    recipes.forEach(recipe => {
        const ingredients = recipe.ingredients
        const name = recipe.name.toLowerCase()
        const description = recipe.description.toLowerCase()

        ingredients.forEach(ingredient => {
            const actualIngredient = ingredient.ingredient.toLowerCase()
            if (actualIngredient.includes(query) 
                && !matchingRecipes.some(r => r.id === recipe.id)) {
                matchingRecipes.push(recipe)
            }
        })

        console.log(matchingRecipes.some(r => r.id === recipe.id))

        if((name.includes(query) || description.includes(query))
            && !matchingRecipes.some(r => r.id === recipe.id)){
            matchingRecipes.push(recipe)
        }
    })

    if (matchingRecipes.length === 0) {
        displayNoResultMsg(query)
    } else {
        const noResultMsg = document.querySelector(".no_ressult p")
        noResultMsg.style.display = "none"
    }

    return matchingRecipes
}

/** Retourne les recettes correspondantes aux tags affichés.
 * 
 * @param {Array[recipes]} recipes tableau de recette
 * @param {span} tag tag selectionné dans l'une des listes déroulante
 * @returns {Array[recipes]} 
 */
export function getNewRecipesList(recipes, tag) {
    const dataType = tag.parentNode.parentNode.querySelector(".filter label").getAttribute("for")
    const selectedData = tag.getAttribute("data-name")
    const newRecipes = []

    switch (dataType) {
    case "ingredients":
        recipes.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
                if (ingredient.ingredient.toLowerCase() === selectedData) {
                    newRecipes.push(recipe)
                }
            })
        })
        break
    case "appliance":
        recipes.forEach(recipe => {
            if (recipe.appliance.toLowerCase() === selectedData) {
                newRecipes.push(recipe)
            }
        })
        break
    case "ustensils":
        recipes.forEach(recipe => {
            recipe.ustensils.forEach(ustensil => {
                if (ustensil.toLowerCase() === selectedData) {
                    newRecipes.push(recipe)
                }
            })
        })
    }

    return newRecipes
}