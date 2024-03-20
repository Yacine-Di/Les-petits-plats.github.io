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
                <label for="appliances">Appareils<i class="fa-solid fa-chevron-up"></i></label>
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

    deleteTag(tag, tagList){
        tag.querySelector(".fa-xmark").addEventListener("click", () => {
            tagList.removeChild(tag)
        })
    }
    
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

                const tagList = element.parentNode.parentNode.parentNode.querySelector(".tags")
                tagList.appendChild(tag)

                this.deleteTag(tag, tagList)
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

    /**
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