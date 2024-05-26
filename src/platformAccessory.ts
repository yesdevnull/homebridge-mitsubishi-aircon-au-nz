import { API, PlatformAccessory, HAP } from 'homebridge';
import { MelviewMitsubishiHomebridgePlatform } from './platform';
import { Unit } from './data';
import { HeatCoolService } from './services/heatCoolService';
import { DryService } from './services/dryService';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */

export class MelviewMitsubishiPlatformAccessory {
  public readonly api: API;
  protected readonly hap: HAP;
  private dryService?: DryService;
  private acService: HeatCoolService;

  constructor(
    private readonly platform: MelviewMitsubishiHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.api = platform.api;
    this.hap = this.api.hap;

    const device: Unit = accessory.context.device;
    this.platform.log.info('melview-device-logging***:', device);
    // set accessory information
    this.accessory.getService(this.hap.Service.AccessoryInformation)!
      .setCharacteristic(this.hap.Characteristic.Manufacturer, 'Mitsubishi Electric')
      .setCharacteristic(this.hap.Characteristic.Model, device.capabilities!.adaptortype)
      .setCharacteristic(this.hap.Characteristic.SerialNumber, device.unitid);

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
    }

    /*********************************************************
     * Polling for state change
     *********************************************************/

    setInterval(() => {
      this.platform.melviewService?.getStatus(
        this.accessory.context.device.unitid)
        .then(s => {
          //this.accessory.context.device.unitid);
          this.accessory.context.device.state = s;
        })
        .catch(e => {
          this.platform.log.error('Unable to find accessory status. Check the network');
          this.platform.log.debug(e);
        });
    }, 5000);
  }
}
