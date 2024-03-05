import { recipes } from '/script/data/recipes.js'
import {recipeTemplate, ingredientsTemplate} from '/script/templates/recipeTemplate.js'

async function init() {
    createFilters(recipes)

    displayRecipes(recipes)
}

async function displayRecipes(recipes){
    const recipesWrapper = document.querySelector(".recipes")

    recipes.forEach(recipe => {
        const recipeArticle =  recipeTemplate(recipe)
        recipesWrapper.innerHTML += recipeArticle

        const ingredientsArticle = document.querySelector(`.recipe[data-id="${recipe.id}"] .recipe__details .recipe__ingredients`)
        ingredientsArticle.appendChild(ingredientsTemplate(recipe.ingredients))
    })
}

async function createFilters(recipes) {

    recipes.forEach(recipe => {
        const ingredientsSelect = document.getElementById("ingredients")
        const appliancesSelect = document.getElementById("appliances")
        const ustensilsSelect = document.getElementById("ustensils")

        const applianceOption = document.createElement("option")
        applianceOption.value = recipe.appliance

        const ustensilsOption = document.createElement("option")
        ustensilsOption.value = recipe.ustensils

        recipe.ingredients.forEach(ingredientDetails => {
            const ingredientOptions = document.querySelectorAll("[name='ingredients'] option")
            const ingredientsValues = [...ingredientOptions].map(ing => ing.value)

            if (!ingredientsValues.includes(ingredientDetails.ingredient)) {
                const ingredientOption = document.createElement("option")

                ingredientOption.value = ingredientDetails.ingredient
                ingredientOption.innerHTML = ingredientDetails.ingredient
                ingredientsSelect.appendChild(ingredientOption)
            }
        })

        const applianceOptions = document.querySelectorAll("[name='appliances'] option")
        const appliancesValues = [...applianceOptions].map(app => app.value)

        if (!appliancesValues.includes(recipe.appliance)) {
            const applianceOption = document.createElement("option")

            applianceOption.value = recipe.appliance
            applianceOption.innerHTML = recipe.appliance
            appliancesSelect.appendChild(applianceOption)
        }

        recipe.ustensils.forEach(ustensil => {
            const ustensilOptions = document.querySelectorAll("[name='ustensils'] option")
            const ustensilsValues = [...ustensilOptions].map(ust => ust.value)

            if (!ustensilsValues.includes(ustensil)) {
                const ustensilOption = document.createElement("option")

                ustensilOption.value = ustensil
                ustensilOption.innerHTML = ustensil
                ustensilsSelect.appendChild(ustensilOption)
            }
        })
    }) 
}

init()