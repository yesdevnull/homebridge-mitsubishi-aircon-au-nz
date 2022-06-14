import {PlatformAccessory, Service, Characteristic, API, } from 'homebridge';

import {MelviewMitsubishiHomebridgePlatform} from './platform';
import {Unit} from './data';
import {HeatCoolService} from './services/heatCoolService';
import {DryService} from './services/dryService';
//import {ExampleSwitch} from './services/switch-accessory';


/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */

export class MelviewMitsubishiPlatformAccessory {
    private dryService?: DryService;
    private acService: HeatCoolService;
    constructor(
        private readonly platform: MelviewMitsubishiHomebridgePlatform,
        private readonly accessory: PlatformAccessory,
    ) {
      const device: Unit = accessory.context.device;
      //this.platform.log.info('melview-device-logging***:', device);
        // set accessory information
        this.accessory.getService(this.platform.Service.AccessoryInformation)!
          .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Mitsubishi Electric')
          .setCharacteristic(this.platform.Characteristic.Model, device.capabilities!.adaptortype)
          .setCharacteristic(this.platform.Characteristic.SerialNumber, device.unitid);

        /*********************************************************
         * HEATER & Cooler Capability
         * see https://developers.homebridge.io/#/service/HeaterCooler
         *********************************************************/
        this.acService = new HeatCoolService(this.platform, this.accessory);
        this.platform.log.info('HEAT/COOL Capability:', device.room, ' [COMPLETED]');

        /*********************************************************
         * Dehumidifier Capability
         * https://developers.homebridge.io/#/service/HumidifierDehumidifier
         *********************************************************/
        if (accessory.context.dry) {
          if (device.capabilities?.hasdrymode === 1) {
            this.dryService = new DryService(this.platform, this.accessory);
            this.platform.log.info('DRY Capability:', device.room, ' [COMPLETED]');
          } else {
            this.platform.log.info('DRY Capability:', device.room, ' [UNAVAILABLE]');
          }
        };


        /*********************************************************
         * Polling for state change
         *********************************************************/

        setInterval(() => {
          this.platform.melviewService?.getStatus(
            this.accessory.context.device.unitid)
            .then(s => {
              // this.platform.log.debug('Updating Accessory State:',
              //   this.accessory.context.device.unitid);
              this.accessory.context.device.state = s;
            })
            .catch(e => {
              this.platform.log.error('Unable to find accessory status. Check the network');
              this.platform.log.debug(e);
            });
        }, 5000);
    }
  }

  export class ZoneAccessory {
      //private dryService?: DryService;
      //private acService: HeatCoolService;
      //protected service: Service;
      constructor(
          public readonly platform: MelviewMitsubishiHomebridgePlatform,
          public readonly accessory: PlatformAccessory,
          //public readonly api: API,
      ) {

        const device: Unit = accessory.context.device;
        this.platform.log.info('SWITCHDevice***:', device);
          // set accessory information

          //this.accessory.getService(this.platform.Service.AccessoryInformation)!
          //  .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Mitsubishi Electric')
          //  .setCharacteristic(this.platform.Characteristic.Model, device.capabilities!.adaptortype)
          //  .setCharacteristic(this.platform.Characteristic.SerialNumber, device.unitid);

            //accessory = new this.api.platformAccessory('zone', 'uuid');
            //this.service = new accessory.service(this.platform, this.accessory);
            let service = accessory.getService(this.platform.Service.Switch);
            this.platform.log.info('SwitchDevice FOund?***:', accessory.displayName, device.room, ' [COMPLETED]');

            // otherwise create a new LightBulb service
            if (!service) {
              service = accessory.addService(this.platform.Service.Switch);

            //this.service = new this.service(this.Service.Switch)
            this.platform.log.info('NewSWITHCServiceAdded***:', device.room, ' [COMPLETED]');
          }
            //this.service.getCharacteristic(this.platform.Characteristic.On);
            service.updateCharacteristic(this.platform.Characteristic.On, 1);
/*
          /*********************************************************
           * HEATER & Cooler Capability
           * see https://developers.homebridge.io/#/service/HeaterCooler
           ********************************************************
          this.acService = new HeatCoolService(this.platform, this.accessory);
          this.platform.log.info('HEAT/COOL Capability:', device.room, ' [COMPLETED]');

          /*********************************************************
           * Dehumidifier Capability
           * https://developers.homebridge.io/#/service/HumidifierDehumidifier
           ********************************************************
          if (accessory.context.dry) {
            if (device.capabilities?.hasdrymode === 1) {
              this.dryService = new DryService(this.platform, this.accessory);
              this.platform.log.info('DRY Capability:', device.room, ' [COMPLETED]');
            } else {
              this.platform.log.info('DRY Capability:', device.room, ' [UNAVAILABLE]');
            }
          };
*/

          /*********************************************************
           * Polling for state change
           *********************************************************/

          setInterval(() => {
            this.platform.melviewService?.getStatus(
              this.accessory.context.device.unitid)
              .then(s => {
                // this.platform.log.debug('Updating Accessory State:',
                //   this.accessory.context.device.unitid);
                this.accessory.context.device.state = s;
              })
              .catch(e => {
                this.platform.log.error('Unable to find SSWITHC accessory status. Check the network');
                this.platform.log.debug(e);
              });
          }, 5000);
      }
    }
