import { recipeTemplate, ingredientsTemplate } from '../templates/recipeTemplate.js'

export class filtersTemplate {
    constructor(recipes) {
        this.recipes = recipes
        this.wrapper = document.querySelector(".filters__tags")
    }

    render() {
        const filters = `
        <article class="filter__tags">
            <article class="filter">
                <label for="ingredients">Ingrédients<i class="fa-solid fa-chevron-up"></i></label>
                <span class="input__block" data-hidden>
                    <input type="text" name="ingredients" id="ingredients">
                    <i class="fa-solid fa-xmark"></i>
                    <i class="fa-solid fa-magnifying-glass"></i>
                </span>
                <ul class="ingredients__list"></ul>
            </article>
            <article class="tags"></article>
        </article>
        <article class="filter__tags">
            <article class="filter">
                <label for="appliance">Appareils<i class="fa-solid fa-chevron-up"></i></label>
                <span class="input__block" data-hidden>
                    <input type="text" name="appliances" id="appliances">
                    <i class="fa-solid fa-xmark"></i>
                    <i class="fa-solid fa-magnifying-glass"></i>
                </span>
                <ul class="appliances__list"></ul>
            </article>
            <article class="tags"></article>
        </article>
        <article class="filter__tags">
            <article class="filter">
                <label for="ustensils">Ustensiles<i class="fa-solid fa-chevron-up"></i></label>
                <span class="input__block" data-hidden>
                    <input type="text" name="ustensils" id="ustensils">
                    <i class="fa-solid fa-xmark"></i>
                    <i class="fa-solid fa-magnifying-glass"></i>
                </span>
                <ul class="ustensils__list"></ul>
            </article>
            <article class="tags"></article>
        </article>
        `

        this.wrapper.innerHTML = filters

        this.createFilters(this.recipes)
        this.openFilters()
        this.onSearch()
        this.addTag()
    }


    updateResult(){
        const resultWrapper = document.querySelector(".result")
        const nbrOfResults = document.querySelector(".recipes").childElementCount
        resultWrapper.innerText = `${nbrOfResults} recettes`
    }

    updateRecipes(newRecipesList){
        const recipesWrapper = document.querySelector(".recipes")
        recipesWrapper.innerHTML = ""

        newRecipesList.forEach(recipe => {
            const recipeArticle = recipeTemplate(recipe)
            recipesWrapper.innerHTML += recipeArticle

            const ingredientsArticle = document.querySelector(`.recipe[data-id="${recipe.id}"] .recipe__details .recipe__ingredients`)
            ingredientsArticle.appendChild(ingredientsTemplate(recipe.ingredients))
        })
    }

    /** Met à jour les filtres en fonction des recettes affichées
     * 
     * @param {Arary [recipes]} recipes 
     */
    updateFilters(recipes){
        this.clearFilters()
        this.createFilters(recipes)

        /* Supprime l'élément de la liste de filtre */
        const filterElements = document.querySelectorAll(".filter ul li")
        const displayedTag = document.querySelectorAll(".tag")
        filterElements.forEach(element => {
            displayedTag.forEach(t => {
                if (element.getAttribute("id") === t.getAttribute("data-name")) {
                    element.style.display = "none"
                }
            })
        })

        this.onSearch()
        this.addTag()
    }

    /**
     * supprime le contenu des listes dans les filtres
     */
    clearFilters() {
        const ingredientsList = document.querySelector(".ingredients__list")
        const appliancesList = document.querySelector(".appliances__list")
        const ustensilsList = document.querySelector(".ustensils__list")
        ingredientsList.innerHTML = ""
        appliancesList.innerHTML = ""
        ustensilsList.innerHTML = ""
    }

    /** Retourne les recettes correspondantes aux tags affichés.
     * 
     * @param {Array[recipes]} recipes tableau de recette
     * @param {span} tag tag selectionné dans l'une des listes déroulante
     * @returns {Array[recipes]} 
     */
    getNewRecipesList(recipes, tag) {
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
                break;
            case "appliance":
                recipes.forEach(recipe => {
                    if (recipe.appliance.toLowerCase() === selectedData) {
                        newRecipes.push(recipe)
                    }
                })
                break;
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

    /** Retire les recettes non correspondante lors del'ajout de tag
     * 
     * @param {Array[recipes]} recipes 
     * @param {*} tag 
     */
    removeRecipes(recipes, tag) {
        const recipesArticle = document.querySelectorAll(".recipes [data-id]")
        const recipesArticleId = []
        //récupération des Ids présents sur la page
        recipesArticle.forEach(displayedRecipe => {
            recipesArticleId.push(parseInt(displayedRecipe.getAttribute("data-id")))
        })

        const actualRecipes = []
        //récupération des recettes affichées sur la page
        recipes.forEach(recipe => {
            if (recipesArticleId.includes(recipe.id)) {
                actualRecipes.push(recipe)
            }
        })

        const newRecipesList = this.getNewRecipesList(actualRecipes, tag)
        this.updateRecipes(newRecipesList)
        this.updateFilters(newRecipesList)
    }

    deleteTag(tag, tagsArticle, recipes) {
        tag.querySelector(".fa-xmark").addEventListener("click", () => {
            tagsArticle.removeChild(tag)

            let newRecipesList = []
            let isFirstFiltering = true
            const allTags = document.querySelectorAll(".tag")

            if (allTags.length === 0) {
                newRecipesList = recipes
            } else {
                allTags.forEach(t => {
                    if (isFirstFiltering) {
                        newRecipesList = this.getNewRecipesList(recipes, t)
                        isFirstFiltering = false
                    } else {
                        newRecipesList = this.getNewRecipesList(newRecipesList, t)
                    }
                    //trier les recettes avec les tag récupéré dans l'ordre des recettes du fichiers
                })
            }
            
            this.updateRecipes(newRecipesList)
            this.updateFilters(newRecipesList)
            this.updateResult()
        })
    }

    //ajout de tag dans la zone dédié
    addTag() {
        const allListElements = this.wrapper.querySelectorAll("ul li")
        allListElements.forEach(element => {
            element.addEventListener("click", () => {
                const tag = document.createElement("span")
                const text = document.createElement("p")
                const clearBtn = `<i class="fa-solid fa-xmark"></i>`

                text.innerHTML = element.innerHTML
                tag.appendChild(text)
                tag.classList.add("tag")
                tag.setAttribute("data-name", element.id)
                tag.innerHTML += clearBtn

                const tagsArticle = element.parentNode.parentNode.parentNode.querySelector(".tags")
                tagsArticle.appendChild(tag)

                this.deleteTag(tag, tagsArticle, this.recipes)
                this.removeRecipes(this.recipes, tag)
                this.updateResult()
            })
        })
    }

    /** Actualise les filtres
     * 
     * @param {input} input champ de recherche
     * @param {Array[li]} defaultList liste complète par default
     * @param {icon} closeBtn icon permettant d'effacer le texte
     */
    changeFilters(input, defaultList, closeBtn) {
        const query = input.value.toLowerCase()
        const list = input.parentNode.parentNode.querySelector("ul")
        const newList = []
        list.innerHTML = ""

        if (query.length > 0) {
            closeBtn.style.display = "block"

            defaultList.forEach(element => {
                if (element.id.includes(query)) {
                    newList.push(element)
                }
            })

            for (let i = 0; i < newList.length; i++) {
                list.appendChild(newList[i])
                list.parentNode.style.height = "fit-content"
            }
        } else {
            defaultList.forEach(element => {
                list.appendChild(element)
                closeBtn.style.display = "none"
            })
        }
    }

    onSearch() {
        this.wrapper
            .querySelectorAll(".filter input")
            .forEach(input => {
                const defaultList = input.parentNode.parentNode.querySelectorAll("ul li")
                const closeBtn = input.parentNode.querySelector(".fa-xmark")

                input.addEventListener("keyup", () => {
                    this.changeFilters(input, defaultList, closeBtn)
                })

                closeBtn.addEventListener("click", () => {
                    input.value = ""
                    closeBtn.style.display = "none"
                    this.changeFilters(input, defaultList, closeBtn)
                })
            })
    }

    /**
     * eventlisteners d'ouverture et fermeture des filtres
     */
    openFilters() {
        const filtersLabel = document.querySelectorAll(".filter label")

        filtersLabel.forEach(label => {
            label.addEventListener("click", (event) => {
                const inputBlock = event.target.parentNode.querySelector(".input__block")
                const List = event.target.parentNode.querySelector("ul")
                const icon = event.target.querySelector(".fa-chevron-up")

                if (inputBlock) {
                    if (inputBlock.style.display === "block") {
                        inputBlock.style.display = "none"
                        List.style.display = "none"
                        icon.style.transform = null
                    } else {
                        inputBlock.style.display = "block"
                        List.style.display = "block"
                        icon.style.transform = "rotate(180deg)"
                    }
                }
            })
        })

        const icons = document.querySelectorAll(".fa-chevron-up")
        icons.forEach(icon => {
            icon.addEventListener("click", (event) => {
                const inputBlock = event.target.parentNode.parentNode.querySelector(".input__block")
                const List = event.target.parentNode.parentNode.querySelector("ul")

                if (inputBlock.style.display === "block") {
                    inputBlock.style.display = "none"
                    List.style.display = "none"
                    icon.style.transform = null
                } else {
                    inputBlock.style.display = "block"
                    List.style.display = "block"
                    icon.style.transform = "rotate(180deg)"
                }
            })
        })
    }

    /** Créé les filtres en fonction des recettes
     * 
     * @param {Array[Object]} recipes tableau de recettes
     */
    createFilters(recipes) {
        recipes.forEach(recipe => {
            const ingredientsList = document.querySelector(".ingredients__list")
            const appliancesList = document.querySelector(".appliances__list")
            const ustensilsList = document.querySelector(".ustensils__list")

            recipe.ingredients.forEach(ingredientDetails => {
                const ingredientListElements = document.querySelectorAll(".ingredients__list li")
                const ingredientsValues = [...ingredientListElements].map(ing => ing.id.toLowerCase())

                if (!ingredientsValues.includes(ingredientDetails.ingredient.toLowerCase())) {
                    const ingredientListElement = document.createElement("li")

                    ingredientListElement.id = ingredientDetails.ingredient.toLowerCase()
                    ingredientListElement.innerHTML = ingredientDetails.ingredient
                    ingredientsList.appendChild(ingredientListElement)
                }
            })

            const applianceListElements = document.querySelectorAll(".appliances__list li")
            const appliancesValues = [...applianceListElements].map(app => app.id)

            if (!appliancesValues.includes(recipe.appliance.toLowerCase())) {
                const applianceListElement = document.createElement("li")

                applianceListElement.id = recipe.appliance.toLowerCase()
                applianceListElement.innerHTML = recipe.appliance
                appliancesList.appendChild(applianceListElement)
            }

            recipe.ustensils.forEach(ustensil => {
                const ustensilOptions = document.querySelectorAll(".ustensils__list li")
                const ustensilsValues = [...ustensilOptions].map(ust => ust.id.toLowerCase())

                if (!ustensilsValues.includes(ustensil.toLowerCase())) {
                    const ustensilOption = document.createElement("li")

                    ustensilOption.id = ustensil.toLowerCase()
                    ustensilOption.innerHTML = ustensil
                    ustensilsList.appendChild(ustensilOption)
                }
            })
        })
    }
}