/*
 * import-sarashpazpapion-recipes.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { RecipeModel } from '@Models/recipe.model'
import { TagModel } from '@Models/tag.model'
import TagService from '@Services/tag/tag.service'
import UserService from '@Services/user/user.service'
import { LanguageCode, ObjectId } from '@Types/common'
import { Ingredient } from '@Types/ingredient'
import { Recipe, RecipeDifficulty } from '@Types/recipe'
import { TagType } from '@Types/tag'
import shortid from 'shortid'
import { Container } from 'typedi'


const persianJs = require('persianjs')

const tagService = Container.get(TagService)
const userService = Container.get(UserService)

const slug = require('slug')

const r1: any[] = require(process.env.RECIPES_1 || '/Users/mani/Desktop/recipes/recipes(1-5000).json') // './recipes(1-5000).json'
const r2: any[] = require(process.env.RECIPES_2 || '/Users/mani/Desktop/recipes/recipes(5001-20000).json') // './recipes(5001-20000).json'

export default async function main(userPassword: string) {
  const recipes: any[] = [...r1, ...r2]

  await TagModel.deleteMany({})
  await RecipeModel.deleteMany({})
  const user = await userService.register({
    username: 'sarashpazpapion',
    email: 'sarashpazpapion@gmail.com',
    firstName: 'Sarashpaz',
    lastName: 'Papion',
    password: userPassword,
  })

  for (let rec of recipes) {
    const slugAddedId = shortid.generate()
    const generatedSlug = `${slug(rec.title)}-${slugAddedId}`

    /**
     * Create tags
     * */
    const tags = await Promise.all(rec.tags.map(async (tag: any) => {
      const sl = `sarashpazpapion-${slug(tag)}`
      const foundTag = await TagModel.findOne({ slug: sl })
      if (foundTag) return foundTag

      return tagService.create({
        info: [{ text: 'imported from sarashpazpapion', locale: LanguageCode.en, verified: true }],
        slug: sl,
        title: [{ text: tag, locale: LanguageCode.fa, verified: true }],
        type: TagType.imported,
      })
    }))

    /**
     * Difficulty
     * */
    let difficulty

    switch (rec.difficulty) {
      case '3':
        difficulty = RecipeDifficulty.hard
        break
      case '2':
        difficulty = RecipeDifficulty.medium
        break
      case '1':
        difficulty = RecipeDifficulty.easy
        break
    }

    /**
     * Likes
     * */
    const stringLikes = persianJs(rec.likes).persianNumber().toString()
    const likes = new Array(Math.floor(parseFloat(stringLikes) * (stringLikes.includes('k') ? 1000 : 1)))

    await RecipeModel.create({
      title: [{ text: rec.title, locale: LanguageCode.fa, verified: true }],
      serving: Number(persianJs(rec.serveCount).persianNumber().toString()),
      slug: generatedSlug,
      image: {
        url: rec.image.url,
        alt: rec.image.alt,
      },
      thumbnail: {
        url: rec.image.url,
        alt: rec.image.alt,
      },
      instructions: (rec.instruction as string[]).map((s, i) => ({
        text: [{ text: s, locale: LanguageCode.fa, verified: true }],
        step: i + 1,
      })),
      difficulty,
      author: user.user._id,
      description: [],
      timing: {
        prepTime: Number(persianJs(rec.prepTime).persianNumber().toString()),
        cookTime: Number(persianJs(rec.cookTime).persianNumber().toString()),
        totalTime: Number(persianJs(rec.prepTime).persianNumber().toString()) + Number(persianJs(rec.cookTime).persianNumber().toString()),
      },
      // nutrition: '', // TODO
      origin: {
        source: 'sarashpazpapion.com',
        sourceUrl: 'https://sarashpazpapion.com',
        url: rec.path,
      },
      tags: tags.map((t: any) => t._id),
      languages: [LanguageCode.fa],
      likes,
      ingredients: rec.ingredients.map((ingredient: any) => {
        let amountDescription: string | undefined
        let amount: number | undefined

        const customUnit = (persianJs(ingredient.quantity).persianNumber().toString() as string).replace(/[0-9]*(\/.)?(-.)?(\..)?/, (substring => {
          amountDescription = substring ? persianJs(substring.trim()).persianNumber().toString() : undefined
          return ''
        })).trim()

        if (amountDescription) {
          if (amountDescription.includes('-')) {
            amountDescription.replace(/[0-9]/, (substring => {
              amount = Number(substring.trim())
              return substring
            }))
          } else if (amountDescription && amountDescription.includes('/')) {
            let s = amountDescription.trim()
            if (!/[0-9]/.test(s[0])) {
              s = `0${s}`
            }

            try {
              if (!Number.isNaN(Number(Number(eval(s)).toFixed(2)))) {
                amount = Number(Number(eval(s)).toFixed(2))
              }
            } catch (e) {
              //
            }
          } else if (amountDescription && amountDescription.includes('.')) {
            amount = eval(amountDescription.trim())
          } else {
            if (!Number.isNaN(Number(amountDescription))) {
              amount = Number(amountDescription)
            }
          }
        }

        return {
          id: new ObjectId(),
          amount,
          customUnit: {
            name: [{text: customUnit, locale: LanguageCode.fa, verified: true}],
          },
          name: [{ text: ingredient.name, locale: LanguageCode.fa, verified: true }],
        } as Ingredient
      }),
    } as Partial<Recipe>)
    process.stdout.write('.')
  }
}

main('sarashpazpapion')
  .then(() => console.log('finis'))
