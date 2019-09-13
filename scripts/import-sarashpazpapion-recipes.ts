/*
 * import-sarashpazpapion-recipes.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import mongoose from 'mongoose'
// @ts-ignore
import persianJs from 'persianjs'
import shortid from 'shortid'
import { Container } from 'typedi'
import { RecipeModel } from '../src/models/recipe.model'
import { TagModel } from '../src/models/tag.model'
import TagService from '../src/services/tag/tag.service'
import { LanguageCode } from '../src/types/common'
import { Recipe, RecipeDifficulty } from '../src/types/recipe'
import { TagType } from '../src/types/tag'


const tagService = Container.get(TagService)

const slug = require('slug')

const r1: any[] = require(process.env.RECIPES_1 || './recipes(1-5000).json') // './recipes(1-5000).json'
const r2: any[] = require(process.env.RECIPES_2 || './recipes(5001-20000).json') // './recipes(5001-20000).json'

async function main() {
  const recipes: any[] = [...r1, ...r2]

  await TagModel.deleteMany({})

  for (let rec of recipes) {
    const slugAddedId = shortid.generate()
    const generatedSlug = `${slug(rec.title)}-${slugAddedId}`

    /**
     * Create tags
     * */
    const tags = await Promise.all(rec.tags.map(async (tag: any) => {
      const foundTag = await TagModel.findOne({ slug: tag })
      if (foundTag) return foundTag

      return tagService.create({
        // info: '',
        slug: tag,
        title: [{ text: tag, locale: LanguageCode.fa, verified: true }],
        type: TagType.other,
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
    const likes = new Array(parseFloat(stringLikes) * (stringLikes.includes('k') ? 1000 : 1))

    await RecipeModel.create({
      title: [{ text: rec.title, locale: LanguageCode.fa, verified: true }],
      serving: Number(persianJs(rec.serveCount).persianNumber().toString()),
      slug: generatedSlug,
      coverImage: {
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
      // reviews: '',
      // likesCount: '',
      difficulty,
      author: mongoose.Types.ObjectId('5d7a220cb875fb99497a8de0'),
      description: [],
      timing: {
        prepTime: persianJs(rec.prepTime).persianNumber().toString(),
        cookTime: persianJs(rec.cookTime).persianNumber().toString(),
        totalTime: Number(persianJs(rec.prepTime).persianNumber().toString()) + Number(persianJs(rec.cookTime).persianNumber().toString()),
      },
      // nutrition: '',
      origin: {
        source: 'sarashpazpapion.com',
        sourceUrl: 'https://sarashpazpapion.com',
        url: '/recipe/12/%D8%AE%D9%88%D8%B1%D8%B4-%D8%A8%D9%87-%D9%82%DB%8C%D9%85%D9%87',
      },
      tags: tags.map((t: any) => t._id),
      languages: [LanguageCode.fa],
      // createdAt: '',
      // updatedAt: '',
      // userLikedRecipe: '',
      likes,
      ingredients: rec.ingredients.map((ingredient: any) => {
        return {
          amount: 1,
          name: [{ text: ingredient.name, locale: LanguageCode.fa, verified: true }],
        }
      }),
    } as Partial<Recipe>)
    process.stdout.write('.')
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => console.error(e))
