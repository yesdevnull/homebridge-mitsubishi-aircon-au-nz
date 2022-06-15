import {PlatformAccessory, Service, Characteristic, CharacteristicValue , API, } from 'homebridge';

import {MelviewMitsubishiHomebridgePlatform} from './platform';
import {Unit} from './data';
import {HeatCoolService} from './services/heatCoolService';
import {DryService} from './services/dryService';
//import {ExampleSwitch} from './services/switch-accessory';
import {
    CommandZone,
} from "./melviewCommand";
import {MelviewService} from './melviewService';

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
      public melviewService?: MelviewService;
      constructor(
          public readonly platform: MelviewMitsubishiHomebridgePlatform,
          public readonly accessory: PlatformAccessory,
          //public readonly api: API,
      ) {

        const device: Unit = accessory.context.device;
        //this.platform.log.info('SWITCHDevice***:', device);
          // set accessory information

          //this.accessory.getService(this.platform.Service.AccessoryInformation)!
          //  .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Mitsubishi Electric')
          //  .setCharacteristic(this.platform.Characteristic.Model, device.capabilities!.adaptortype)
          //  .setCharacteristic(this.platform.Characteristic.SerialNumber, device.unitid);

            //accessory = new this.api.platformAccessory('zone', 'uuid');
            //this.service = new accessory.service(this.platform, this.accessory);
            let service = accessory.getService(this.platform.Service.Fanv2);
            this.platform.log.info('Device Found:', accessory.displayName, device.room, ' [COMPLETED]');

            // otherwise create a new LightBulb service
            if (!service) {
              service = accessory.addService(this.platform.Service.Fanv2);
            //this.service = new this.service(this.Service.Switch)
            //this.platform.log.info('NewSWITHCServiceAdded***:', device.room, ' [COMPLETED]');
          }
            //this.service.getCharacteristic(this.platform.Characteristic.On);
            //service.updateCharacteristic(this.platform.Characteristic.On, 1);

/*
            if (accessory.displayName === 'Dining')
            {
              const value = device.state!.zones!['0'].status;
              this.platform.log.info(accessory.displayName, 'Status', value);
            service.setCharacteristic(this.platform.Characteristic.On, value);
                    .onGet(this.handleOnGet.bind(this))
                    .onSet(this.handleOnSet.bind(this));
            }

            if (accessory.displayName === 'Study')
            {
              const value = device.state!.zones!['1'].status;
              this.platform.log.info(accessory.displayName, 'Status', value);
            service.getCharacteristic(this.platform.Characteristic.On)
                  .onGet(this.handleOnGet.bind(this))
                  .onSet(this.handleOnSet.bind(this));
            }

*/

      service.getCharacteristic(this.platform.Characteristic.Active)
              .onGet(this.handleOnGet.bind(this))
              .onSet(this.handleOnSet.bind(this));


//service.getCharacteristic(this.platform.Characteristic.CurrentFanState)
//              .onGet(this.handleOnGetState.bind(this))



//consider using fan state for when A/c is off??
    //service.getCharacteristic(this.platform.Characteristic.RotationSpeed)
      //.onGet(this.handleOnGetState.bind(this))

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

async handleOnGetState() : Promise<CharacteristicValue> {
      this.platform.log.error('Triggered GET FanState');

    // set this to a valid value for Active
    const currentValue = '0';
    this.platform.log.debug('Triggered GET FanState', currentValue);
    //const currentValue = this.Characteristic.CurrentFanState.IDLE;
  //  const currentValue = this.Characteristic.CurrentFanState.BLOWING_AIR;
    return currentValue;
}
          /*  async getCurrentZone(): Promise<CharacteristicValue> {
              if (accessory.displayName === 'Dining')
              {const value = device.state!.zones!['0'].status;
                this.platform.log.info(accessory.displayName, 'Status', value);
              service.getCharacteristic(this.platform.Characteristic.On, value);
              }

              if (accessory.displayName === 'Study')
              {const value = device.state!.zones!['1'].status;
                this.platform.log.info(accessory.displayName, 'Status', value);
              service.getCharacteristic(this.platform.Characteristic.On, value);
              }
            }*/

            //sync getSwitchState(mode?:number): Promise<CharacteristicValue> {
            //  if (!mode) {
            //      mode = this.device.state!.setmode;
            //      const c = this.platform.api.hap.Characteristic;


            //this.platform.log.info('zonestatus', zonestatus, zonestatus3, zonestatus4);
            async handleOnGet() : Promise<CharacteristicValue> {
              // set this to a valid value for On
              //ugly to be tidied up later.....
            /*
              if (this.accessory.displayName === 'Dining')
              {
              this.platform.log.debug('Triggered GET On', 'Dining', this.accessory.context.device.state!.zones!['0'].status);
              return this.accessory.context.device.state!.zones!['0'].status;
              }

              if (this.accessory.displayName === 'Study')
              {
                this.platform.log.debug('Triggered GET On', 'Study', this.accessory.context.device.state!.zones!['1'].status);
                return this.accessory.context.device.state!.zones!['1'].status;
              }
              if (this.accessory.displayName === 'Theatre')
              {
              this.platform.log.debug('Triggered GET On', 'Dining', this.accessory.context.device.state!.zones!['2'].status);
              return this.accessory.context.device.state!.zones!['3'].status;
              }

              if (this.accessory.displayName === 'Master Bed')
              {
                this.platform.log.debug('Triggered GET On', 'Study', this.accessory.context.device.state!.zones!['3'].status);
                return this.accessory.context.device.state!.zones!['4'].status;
              }
              if (this.accessory.displayName === 'AJ')
              {
              this.platform.log.debug('Triggered GET On', 'Dining', this.accessory.context.device.state!.zones!['4'].status);
              return this.accessory.context.device.state!.zones!['5'].status;
              }

              if (this.accessory.displayName === 'Spare')
              {
                this.platform.log.debug('Triggered GET On', 'Study', this.accessory.context.device.state!.zones!['5'].status);
                return this.accessory.context.device.state!.zones!['6'].status;
              }
              if (this.accessory.displayName === 'Ruby')
              {
              this.platform.log.debug('Triggered GET On', 'Dining', this.accessory.context.device.state!.zones!['6'].status);
              return this.accessory.context.device.state!.zones!['7'].status;
              }

*/
              const Zonelookup = {
              'Dining': '0',
              'Study': '1',
              'Theatre ': '2', //theatre has a space doh!
              'Master Bed': '3',
              'AJ': '4',
              'Spare': '5',
              'Ruby': '6',
              //Case 'Other': return '7';
              };
              //const c = await this.melviewService!.capabilities('156447';
              //this.platform.log.debug('cpabilities', c);
              //const s = await this.melviewService!.getStatus(this.accessory.context.device.id);
              //this.platform.log.debug('status', s);
              //this.platform.log.debug('power check', this.accessory.context.device.state);


              //Attemped to detect unit device power and update fans to off - but failed.
              //f (this.accessory.context.device.power === 'off')
              //{
              //  this.platform.log.debug('update as off');
              //  return 0;
              //}
              //else {
            //this.platform.log.debug(this.accessory.displayName);

            const zonename = this.accessory.displayName;
            const zonearray = Zonelookup[zonename];
            this.platform.log.debug('Triggered GET On', zonename, this.accessory.context.device.state!.zones![zonearray].status);
            return this.accessory.context.device.state!.zones![zonearray].status;

          }

            /**
             * Handle requests to set the "On" characteristic
             */
             async handleOnSet(value) {

               const Zonelookup = {
               'Dining': 'Z1',
               'Study': 'Z2',
               'Theatre ': 'Z3',
               'Master Bed': 'Z4',
               'AJ': 'Z5',
               'Spare': 'Z6',
               'Ruby': 'Z7',

             };

             const newValue = Zonelookup[this.accessory.displayName]+ +value;
             this.platform.log.debug('Zone Set:', this.accessory.displayName, value);
             await this.platform.melviewService?.command(
                 new CommandZone(newValue, this.accessory.context.device, this.platform));

             /*
              //this.platform.log.debug('Triggered SET On:', value);
              if (this.accessory.displayName === 'Dining')
              {
                //homekit send value ture false
                const newValue = 'Z1'+ +value;
              this.platform.log.debug('Triggered SET On', 'Dining', (newValue));
              await this.platform.melviewService?.command(
                  new CommandZone(newValue, this.accessory.context.device, this.platform));

              }

              if (this.accessory.displayName === 'Study')
              {
                //homekit send value ture false
                const newValue = 'Z2'+ +value;
              this.platform.log.debug('Triggered SET On', 'Study', (newValue));
              await this.platform.melviewService?.command(
                  new CommandZone(newValue, this.accessory.context.device, this.platform));

              }
              */


            }
}
