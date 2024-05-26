import { API, PlatformAccessory, CharacteristicValue, HAP } from 'homebridge';
import { MelviewMitsubishiHomebridgePlatform } from './platform';
import { Unit } from './data';
import { CommandZone } from './melviewCommand';
import { MelviewService } from './melviewService';

export class ZoneAccessory {
  public readonly api: API;
  protected readonly hap: HAP;
  //private dryService?: DryService;
  //private acService: HeatCoolService;
  //protected service: Service;
  public melviewService?: MelviewService;
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
        public readonly platform: MelviewMitsubishiHomebridgePlatform,
        public readonly accessory: PlatformAccessory,
  ) {
    this.api = platform.api;
    this.hap = this.api.hap;

    const device: Unit = accessory.context.device;
        // set accessory information
        accessory.getService(this.hap.Service.AccessoryInformation)!
          .setCharacteristic(this.hap.Characteristic.Manufacturer, 'Mitsubishi Electric')
          .setCharacteristic(this.hap.Characteristic.Model, device.capabilities!.adaptortype)
          .setCharacteristic(this.hap.Characteristic.SerialNumber, device.unitid);

        let service = accessory.getService(this.hap.Service.Fanv2);
        this.platform.log.info('Device Found:', accessory.displayName, device.room, ' [COMPLETED]');
        // otherwise create a new device service (Fanv2)
        if (!service) {
          service = accessory.addService(this.hap.Service.Fanv2);
          //this.service = new this.service(this.Service.Switch)
        }
        //this.platform.log.info('DeviceList **POWER**', accessory, accessory.context.device.state.power);
        service.getCharacteristic(this.hap.Characteristic.Active)
          .onGet(this.handleOnGet.bind(this))
          .onSet(this.handleOnSet.bind(this));

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

  async handleOnGetState(): Promise<CharacteristicValue> {
    this.platform.log.error('Triggered GET FanState');

    // set this to a valid value for Active
    const currentValue = '0';
    this.platform.log.debug('Triggered GET FanState', currentValue);
    //const currentValue = this.Characteristic.CurrentFanState.IDLE;
    //const currentValue = this.Characteristic.CurrentFanState.BLOWING_AIR;
    return currentValue;
  }

  async handleOnGet(): Promise<CharacteristicValue> {
    //passed through displayname
    const zonename = this.accessory.displayName;
    //returns the sotred zone information block based on name e.g. { zoneid: 1, status: 1, name: 'Dining' }
    const zoneinfo = this.accessory.context.device.state.zones.find(zone => zone.name === this.accessory.displayName);
    //Keep this please for troubleshooting
    /*
        this.platform.log.info('MAPPING CHECK - zones not !', zonename, this.accessory.context.device.state.zones);
        this.platform.log.info('find!', this.accessory.context.device.state.zones.find(zone => zone.name === this.accessory.displayName));
        this.platform.log.info('result!', zoneinfo.zoneid);
        */

    if (zoneinfo.zoneid) {
      const zonearray = (zoneinfo.zoneid - 1); // give array position as arrays start at 0
      if (this.accessory.context.device.state.power === 0) {
        return 0; //ac power off, Zones updated in app to off.
      } else { //power is on
        this.platform.log.debug('getZoneAccessoryState', zonename,
          (this.accessory.context.device.state!.zones![zonearray].status === 1) ? ': ON' : ': OFF');
        return this.accessory.context.device.state!.zones![zonearray].status;
      }
    } else { //zoneid is undefined
      this.platform.log.error('** UNDEFINED ZoneAccessory onGet(), Unable to find zone, Zone status has been set off but may be on **');
      return 0;
    }
  }

  /**
    * Handle requests to set the "On" characteristic
    */
  async handleOnSet(value) {
    //returns the sotred zone information block based on name e.g. { zoneid: 1, status: 1, name: 'Dining' }
    const zoneinfo = this.accessory.context.device.state.zones.find(zone => zone.name === this.accessory.displayName);
    //const newValue = Zonelookup[this.accessory.displayName]+ +value;
    //We are wanting to send command e.g. 'Z11' for 'Z'(zoneid)(1=on; 0=off)
    if (zoneinfo.zoneid) {//undefined
      const newValue = 'Z' + zoneinfo.zoneid + +value;
      this.platform.log.debug('setZoneAccessoryState:', this.accessory.displayName, (value === 1) ? ': ON' : ': OFF (', newValue, ')');

      await this.platform.melviewService?.command(
        new CommandZone(newValue, this.accessory.context.device, this.platform));
    } else {
      this.platform.log.error('** UNDEFINED ZoneAccessory onSet(), Unable to find zone, Zone status has not been set **');
    }
  }
}
