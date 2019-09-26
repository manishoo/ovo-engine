/*
 * tag.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Ctx, Query, Resolver, Mutation, Arg, Authorized } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '@Utils/context'
import { UserRole, LanguageCode } from '@Types/common'
import { Diet, DietInput } from '@Types/diet'



@Service()
@Resolver()
export default class DietResolver {
  constructor(
    // service injection

  ) {
    // noop
  }

  @Authorized(UserRole.user)
  @Mutation(returns => Diet)
  async createDiet(
    @Arg('diet') diet: DietInput,
    @Ctx() ctx: Context,
  ) {
    /**
     * iterate on `includes` and:
     * 1- validate and get the excluded foodclasses,
     * 2- create new diets tag*,
     * 3- add tag to every foodclass except excluded ones,
     * 4- save foodclass
     * create tag using: {type: TagType.diet, slug: slug, title: name, info: description}
     */
    return {
      id: '5d468cd9778387332e45e823',
      name: diet.name,
      slug: diet.slug,
      description: diet.description,
      excludes: [
        {
          id: '5d468cee778387332e45e913',
          name: [{ locale: LanguageCode.en, text: 'Black mulberry' }],
          slug: 'black%20mulberry-Xz_EySo9500',
          foodGroup: {
            _id: '5d468cd9778387332e45e823',
            name: [{ locale: LanguageCode.en, text: "Fruits" }]
          },
        }
      ]
    }
  }
  
}
