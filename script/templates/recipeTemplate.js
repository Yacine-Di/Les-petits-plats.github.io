
export function recipeTemplate(data) {
    const { id, image, name, time, description } = data

    const picture = `assets/recipes/${image}`

    const article = `
    <article class="recipe" data-id=${id}>
        <article class="img__time">
            <img src="${picture}" alt="${name}">
            <p class="time">${time} min</p>
        </article>
        <h2>${name}</h2>
        <article class="recipe__details">
            <article class="recipe__description">
                <h3>RECETTE</h3>
                <p>${description}</p>
            </article>
            <article class="recipe__ingredients">
                <h3>INGRÉDIENTS</h3>
            </article>
        </article>
    </article>
    `
    return article
}

export function ingredientsTemplate(ingredients) {

    const ingredientsArticle = document.createElement("article")
    ingredientsArticle.classList.add("ingredients")

    ingredients.forEach((ingredient) => {
        const ingredientArticle = document.createElement("article")
        ingredientArticle.classList.add("ingredient")
        const ingredientName = document.createElement("p")
        ingredientName.classList.add("ingredient__name")
        const ingredientQuantityAndUnit = document.createElement("p")
        ingredientQuantityAndUnit.classList.add("ingredient__quantity")

        ingredientName.innerText = ingredient.ingredient

        if (ingredient.unit) {
            switch (ingredient.unit) {
            case "grammes":
                ingredientQuantityAndUnit.innerText = `${ingredient.quantity}g`
                break
            case "ml":
            case "cl":
                ingredientQuantityAndUnit.innerText = `${ingredient.quantity}${ingredient.unit}`
                break
            default:
                ingredientQuantityAndUnit.innerText = `${ingredient.quantity} ${ingredient.unit}`
            }
        } else if (ingredient.quantity) {
            ingredientQuantityAndUnit.innerText = `${ingredient.quantity}`
        }

        ingredientArticle.append(ingredientName, ingredientQuantityAndUnit)
        ingredientsArticle.appendChild(ingredientArticle)
    })

    return ingredientsArticle
}

