import { EntityManager, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

import { BaseEntity } from '@/domain/entity/base.entity';
import { RequestContext } from '@/port/audit/request-context.middleware';

@EventSubscriber()
export class RequestSubscriber {
  constructor(private entityManager: EntityManager) {}

  beforeInsert(event: InsertEvent<BaseEntity>) {
    const request = this.getRequestFromContext();
    if (request != null && request.user != undefined) {
      event.entity.createdBy = request.user.payload.userId;
      event.entity.updatedBy = request.user.payload.userId;
    } else {
      event.entity.createdBy = 0;
      event.entity.updatedBy = 0;
    }
  }

  beforeUpdate(event: UpdateEvent<BaseEntity>) {
    const request = this.getRequestFromContext();

    if (event.entity) {
      if (request != null && request.user != undefined) {
        event.entity.updatedBy = request.user.payload.userId;
      } else {
        event.entity.createdBy = 0;
        event.entity.updatedBy = 0;
      }
      event.entity.updatedAt = new Date();
    }
  }

  private getRequestFromContext() {
    const request = RequestContext.getRequest();
    if (!request) {
      return null;
    }
    return request;
  }
}
