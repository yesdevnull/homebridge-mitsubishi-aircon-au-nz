import { API, HAP, CharacteristicValue, Logger, PlatformAccessory, Service } from 'homebridge';
import { MelviewMitsubishiHomebridgePlatform } from '../platform.js';
import { Unit } from '../data.js';
import { WithUUID } from 'hap-nodejs';

export abstract class AbstractService {
  public readonly api: API;
  protected readonly hap: HAP;

  protected service: Service;
  public readonly device: Unit;
  protected constructor(
    protected readonly platform: MelviewMitsubishiHomebridgePlatform,
    protected readonly accessory: PlatformAccessory,
  ) {
    this.api = platform.api;
    this.hap = this.api.hap;
    this.device = accessory.context.device;
    if (!this.device.name) {
      this.device.name = this.getDeviceRoom();
    }
    this.log.info('Set Device:', this.device.name);
    // @ts-expect-error dunno, don't have time to fix this yet
    this.service = this.accessory.getService(this.getServiceType()) || this.accessory.addService(this.getServiceType());
    this.service.setCharacteristic(this.hap.Characteristic.Name, this.device.name);

    this.service.getCharacteristic(this.hap.Characteristic.Active)
      .onSet(this.setActive.bind(this))
      .onGet(this.getActive.bind(this));

    this.service.getCharacteristic(this.hap.Characteristic.RotationSpeed)
      .onSet(this.setRotationSpeed.bind(this))
      .onGet(this.getRotationSpeed.bind(this));

  }

  protected abstract getServiceType<T extends WithUUID<typeof Service>>(): T;
  protected abstract getDeviceRoom(): string;
  protected abstract getDeviceName(): string;

  get characteristic() {
    return this.platform.api.hap.Characteristic;
  }

  public getService(): Service {
    return this.service!;
  }

  abstract setActive(value: CharacteristicValue): void;

  abstract getActive(): Promise<CharacteristicValue>;

  abstract getRotationSpeed(): Promise<CharacteristicValue>;

  abstract setRotationSpeed(value: CharacteristicValue): void;

  protected get log(): Logger {
    return this.platform.log;
  }
}