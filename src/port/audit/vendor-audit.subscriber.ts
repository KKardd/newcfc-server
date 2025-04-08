import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';

import { VendorAudit } from '@/domain/entity/vendor-audit.entity';
import { Vendor } from '@/domain/entity/vendor.entity';

@EventSubscriber()
export class VendorAuditSubscriber implements EntitySubscriberInterface<Vendor> {
  listenTo() {
    return Vendor;
  }

  async afterInsert(event: InsertEvent<Vendor>) {
    if (event.entity) {
      const newAudit = new VendorAudit();
      newAudit.vendorId = event.entity.id;
      newAudit.tenantId = event.entity.tenantId;
      newAudit.siteId = event.entity.siteId;
      newAudit.manageCode = event.entity.manageCode;
      newAudit.name = event.entity.name;
      newAudit.businessRegistrationNumber = event.entity.businessRegistrationNumber;
      newAudit.representative = event.entity.representative;
      newAudit.postalCode = event.entity.postalCode;
      newAudit.address = event.entity.address;
      newAudit.addressDetail = event.entity.addressDetail;
      newAudit.industrialCategoryCode = event.entity.industrialCategoryCode;
      newAudit.contactDepartment = event.entity.contactDepartment;
      newAudit.contactPhoneNumber = event.entity.contactPhoneNumber;
      newAudit.supplyChain = event.entity.supplyChain;
      newAudit.status = event.entity.status;
      newAudit.createdBy = event.entity.createdBy;
      newAudit.updatedBy = event.entity.updatedBy;

      await event.manager.save(newAudit);
    }
  }

  async afterUpdate(event: UpdateEvent<Vendor>) {
    if (event.entity) {
      const newAudit = new VendorAudit();
      newAudit.vendorId = event.entity.id;
      newAudit.tenantId = event.entity.tenantId;
      newAudit.siteId = event.entity.siteId;
      newAudit.manageCode = event.entity.manageCode;
      newAudit.name = event.entity.name;
      newAudit.businessRegistrationNumber = event.entity.businessRegistrationNumber;
      newAudit.representative = event.entity.representative;
      newAudit.postalCode = event.entity.postalCode;
      newAudit.address = event.entity.address;
      newAudit.addressDetail = event.entity.addressDetail;
      newAudit.industrialCategoryCode = event.entity.industrialCategoryCode;
      newAudit.contactDepartment = event.entity.contactDepartment;
      newAudit.contactPhoneNumber = event.entity.contactPhoneNumber;
      newAudit.supplyChain = event.entity.supplyChain;
      newAudit.status = event.entity.status;
      newAudit.createdBy = event.entity.createdBy;
      newAudit.updatedBy = event.entity.updatedBy;

      await event.manager.save(newAudit);
    }
  }

  async afterRemove(event: RemoveEvent<Vendor>) {
    if (event.entity) {
      const newAudit = new VendorAudit();
      newAudit.vendorId = event.entity.id;
      newAudit.tenantId = event.entity.tenantId;
      newAudit.siteId = event.entity.siteId;
      newAudit.manageCode = event.entity.manageCode;
      newAudit.name = event.entity.name;
      newAudit.businessRegistrationNumber = event.entity.businessRegistrationNumber;
      newAudit.representative = event.entity.representative;
      newAudit.postalCode = event.entity.postalCode;
      newAudit.address = event.entity.address;
      newAudit.addressDetail = event.entity.addressDetail;
      newAudit.industrialCategoryCode = event.entity.industrialCategoryCode;
      newAudit.contactDepartment = event.entity.contactDepartment;
      newAudit.contactPhoneNumber = event.entity.contactPhoneNumber;
      newAudit.supplyChain = event.entity.supplyChain;
      newAudit.status = event.entity.status;
      newAudit.createdBy = event.entity.createdBy;
      newAudit.updatedBy = event.entity.updatedBy;

      await event.manager.save(newAudit);
    }
  }
}
