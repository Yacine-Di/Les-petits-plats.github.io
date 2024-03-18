import { recipes } from '/script/data/recipes.js'
import { filtersTemplate } from '/script/templates/filtersTemplate.js'
import { recipeTemplate, ingredientsTemplate } from '/script/templates/recipeTemplate.js'

async function init() {
    manageMainSearchField()

    const filters = new filtersTemplate(recipes)
    filters.render()

    const recipesWrapper = document.querySelector(".recipes")
    recipes.forEach(recipe => {
        const recipeArticle = recipeTemplate(recipe)
        recipesWrapper.innerHTML += recipeArticle

        const ingredientsArticle = document.querySelector(`.recipe[data-id="${recipe.id}"] .recipe__details .recipe__ingredients`)
        ingredientsArticle.appendChild(ingredientsTemplate(recipe.ingredients))
    })
}

async function manageMainSearchField() {
    const searchField = document.querySelector(".main__field ")
    searchField.value = ""
    const xMarkMainField = document.querySelector(".search .fa-xmark")
    searchField.addEventListener("keyup", (event) => {
        const query = event.target.value
        if (query.length > 0) {
            xMarkMainField.style.display = "inline"
        } else {
            xMarkMainField.style.display = "none"
        }
    })

    xMarkMainField.addEventListener("click", () => {
        const query = searchField.value
        if (query.length > 0) {
            searchField.value = ""
            xMarkMainField.style.display = "none"
        }
    })
}

init()