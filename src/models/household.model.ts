/*
 * household.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { UserSchema } from '@Models/user.model'
import { Household, LatLng, PantryItem } from '@Types/household'
import { User } from '@Types/user'
import { prop, Ref, Typegoose } from 'typegoose'


export class HouseholdSchema extends Typegoose implements Household {
	@prop({ required: true, ref: UserSchema })
	members: Ref<UserSchema>[] | User[]
	@prop()
	location?: LatLng
	@prop()
	pantry?: PantryItem[]
}

export const HouseholdModel = new HouseholdSchema().getModelForClass(HouseholdSchema)
