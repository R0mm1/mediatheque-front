import {Entity} from "@/assets/ts/entity/Entity";
import FlagService from "@/assets/ts/service/FlagService";
import EntityModuleFlagInterface from "@/assets/ts/store/EntityModuleFlagInterface";

/**
 * Class to be used in entities store modules
 */
export default class EntityModuleService {
    propertyUpdate<EntityInterface>(entity: EntityInterface, flagService: FlagService<EntityModuleFlagInterface>, property: string, newVal: any): { entity: EntityInterface, flagService: FlagService<EntityModuleFlagInterface> } {

        let isModified = flagService.flags.isModified;

        if(!isModified){ //if entity already has been modified, we don't change it
            if (typeof (entity as any)[property] === 'string') {
                isModified = ((entity as any)[property] !== newVal);
            }
        }

        flagService.flags.isModified = isModified;
        (entity as any)[property] = newVal;

        return {
            entity: entity,
            flagService: flagService
        };
    }
}
