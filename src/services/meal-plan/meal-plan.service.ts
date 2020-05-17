/*
 * meal-plan.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import { PlanModel } from '@Models/plan.model'
import UploadService from '@Services/upload/upload.service'
import UserService from '@Services/user/user.service'
import { ObjectId } from '@Types/common'
import { Plan, PlanInput } from '@Types/plan'
import Errors from '@Utils/errors'
import { Inject, Service } from 'typedi'


@Service()
export default class PlanService {
  @Inject(type => UserService)
  private readonly userService: UserService
  @Inject(type => UploadService)
  private readonly uploadService: UploadService

  async get(planId: ObjectId, userId: string) {
    return PlanModel.findOne({ _id: planId, user: new ObjectId(userId) })
  }

  async list(userId?: string) {
    const plans = await PlanModel.find({ user: new ObjectId(userId || config.rootUserId) })

    const user = await this.userService.getUserById(userId || config.rootUserId)
    return plans.filter(p => String(p.id) !== String(user.plan))
  }

  async delete(planId: ObjectId, userId: string) {
    const user = await this.userService.getUserById(userId)

    if (String(user.plan) === String(planId)) throw new Errors.Forbidden('You cannot delete the user\'s main plan')

    await PlanModel.deleteOne({ user: new ObjectId(userId), _id: planId })
    return planId
  }

  async create(planInput: PlanInput, userId: string) {
    const id = new ObjectId()

    const plan: Partial<Plan> = {
      _id: id,
      name: planInput.name,
      description: planInput.description,
      user: new ObjectId(userId)
    }

    if (planInput.coverImage) {
      plan.coverImage = {
        url: await this.uploadService.processUpload(planInput.coverImage, 'full', `images/plans/${userId}/${id}`),
      }
      if (planInput.thumbnailImage) {
        plan.thumbnailImage = {
          url: await this.uploadService.processUpload(planInput.thumbnailImage, 'thumb', `images/plans/${userId}/${id}`)
        }
      }
    }
    return PlanModel.create(plan)
  }

  async update(id: ObjectId, planInput: PlanInput, userId: string) {
    const plan: Partial<Plan> = {
      name: planInput.name,
      description: planInput.description,
    }

    if (planInput.coverImage !== undefined) {
      plan.coverImage = planInput.coverImage ? {
        url: await this.uploadService.processUpload(planInput.coverImage, 'full', `images/plans/${userId}/${id}`),
      } : undefined
      if (!planInput.thumbnailImage !== undefined) {
        plan.thumbnailImage = planInput.thumbnailImage ? {
          url: await this.uploadService.processUpload(planInput.thumbnailImage, 'thumb', `images/plans/${userId}/${id}`)
        } : undefined
      }
    }

    await PlanModel.update({ _id: id, user: new ObjectId(userId) }, { $set: { ...plan } }, { multi: false })

    return this.get(id, userId)
  }
}
