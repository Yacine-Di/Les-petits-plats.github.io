export class filtersTemplate {
    constructor(recipes) {
        this.recipes = recipes
        this.wrapper = document.querySelector(".filters")
    }

    render() {
        const filters = `
        <article class="filter">
            <label for="ingredients">Ingrédients<i class="fa-solid fa-chevron-up"></i></label>
            <span class="input__block" data-hidden>
                <input type="text" name="ingredients" id="ingredients">
                <i class="fa-solid fa-xmark"></i>
                <i class="fa-solid fa-magnifying-glass"></i>
            </span>
            <ul class="ingredients__list"></ul>
        </article>
        <article class="filter">
            <label for="appliances">Appareils<i class="fa-solid fa-chevron-up"></i></label>
            <span class="input__block" data-hidden>
                <input type="text" name="appliances" id="appliances">
                <i class="fa-solid fa-xmark"></i>
                <i class="fa-solid fa-magnifying-glass"></i>
            </span>
            <ul class="appliances__list"></ul>
        </article>
        <article class="filter">
            <label for="ustensils">Ustensiles<i class="fa-solid fa-chevron-up"></i></label>
            <span class="input__block" data-hidden>
                <input type="text" name="ustensils" id="ustensils">
                <i class="fa-solid fa-xmark"></i>
                <i class="fa-solid fa-magnifying-glass"></i>
            </span>
            <ul class="ustensils__list"></ul>
        </article>
        `

        this.wrapper.innerHTML = filters

        this.createFilters(this.recipes)
        this.openFilters()
        this.onSearch()
    }

    onSearch() {

        this.wrapper
            .querySelectorAll(".filter input")
            .forEach(input => {
                const defaultList = input.parentNode.parentNode.querySelectorAll("ul li")

                input.addEventListener("keyup", (event) => {
                    const query = event.target.value
                    const list = event.target.parentNode.parentNode.querySelector("ul")
                    const newList = []
                    list.innerHTML = ""

                    if(query.length > 0){
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
                        })
                    }
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

    /**
     * 
     * @param {Array[Object]} recipes tableau de recettes
     */
    createFilters(recipes) {
        recipes.forEach(recipe => {
            const ingredientsList = document.querySelector(".ingredients__list")
            const appliancesList = document.querySelector(".appliances__list")
            const ustensilsList = document.querySelector(".ustensils__list")

            const applianceListElement = document.createElement("li")
            applianceListElement.id = recipe.appliance

            const ustensilsListElement = document.createElement("li")
            ustensilsListElement.id = recipe.ustensils

            recipe.ingredients.forEach(ingredientDetails => {
                const ingredientListElements = document.querySelectorAll(".ingredients__list li")
                const ingredientsValues = [...ingredientListElements].map(ing => ing.id.toLowerCase())

                if (!ingredientsValues.includes(ingredientDetails.ingredient.toLowerCase())) {
                    const ingredientListElement = document.createElement("li")

                    ingredientListElement.id = ingredientDetails.ingredient
                    ingredientListElement.innerHTML = ingredientDetails.ingredient
                    ingredientsList.appendChild(ingredientListElement)
                }
            })

            const applianceListElements = document.querySelectorAll(".appliances__list li")
            const appliancesValues = [...applianceListElements].map(app => app.id)

            if (!appliancesValues.includes(recipe.appliance)) {
                const applianceListElement = document.createElement("li")

                applianceListElement.id = recipe.appliance
                applianceListElement.innerHTML = recipe.appliance
                appliancesList.appendChild(applianceListElement)
            }

            recipe.ustensils.forEach(ustensil => {
                const ustensilOptions = document.querySelectorAll(".ustensils__list li")
                const ustensilsValues = [...ustensilOptions].map(ust => ust.id.toLowerCase())

                if (!ustensilsValues.includes(ustensil.toLowerCase())) {
                    const ustensilOption = document.createElement("li")

                    ustensilOption.id = ustensil
                    ustensilOption.innerHTML = ustensil
                    ustensilsList.appendChild(ustensilOption)
                }
            })
        })
    }
}