import { API, HAP, CharacteristicValue } from 'homebridge';
import { MelviewMitsubishiHomebridgePlatform } from './platform.js';
import { Unit, WorkMode } from './data.js';

export interface Command {
  execute(): string;
  getUnitID(): string;
  getLocalCommandURL(): string;
  getLocalCommandBody(key: string): string;
}

export abstract class AbstractCommand implements Command {
  public readonly api: API;
  protected readonly hap: HAP;

  public constructor(protected value: CharacteristicValue,
    protected device: Unit,
    protected platform: MelviewMitsubishiHomebridgePlatform) {
    this.api = platform.api;
    this.hap = this.api.hap;
  }

  public abstract execute(): string;

  public getUnitID(): string {
    return this.device.unitid;
  }

  public getLocalCommandURL(): string {
    return 'http://' + this.device.capabilities!.localip + '/smart';
  }

  public getLocalCommandBody(key: string): string {
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<ESV>' + key + '</ESV>';
  }
}

export class CommandPower extends AbstractCommand {
  public execute(): string {
    this.device.state!.power = this.value as number;
    //  this.platform.log.debug('COmmandPoser- before', this.device.power);\
    if (this.value === 1) {
      this.device.power = 'on';
    } else {
      this.device.power = 'off';
    }
    this.platform.log.debug('Unit Power: ', this.device.power);
    return 'PW' + this.value;
  }
}

export class CommandTargetHeaterCoolerState extends AbstractCommand {
  public execute(): string {
    switch (this.value) {
    case this.hap.Characteristic.TargetHeaterCoolerState.COOL:
        this.device.state!.setmode = WorkMode.COOL;
      return 'MD' + WorkMode.COOL;
    case this.hap.Characteristic.TargetHeaterCoolerState.HEAT:
        this.device.state!.setmode = WorkMode.HEAT;
      return 'MD' + WorkMode.HEAT;
    case this.hap.Characteristic.TargetHeaterCoolerState.AUTO:
        this.device.state!.setmode = WorkMode.AUTO;
      return 'MD' + WorkMode.AUTO;
    }
    return '';
  }
}

export class CommandTargetHumidifierDehumidifierState extends AbstractCommand {
  public execute(): string {
    switch (this.value) {
    case this.hap.Characteristic.TargetHumidifierDehumidifierState.DEHUMIDIFIER:
        this.device.state!.setmode = WorkMode.DRY;
      return 'MD' + WorkMode.DRY;
    }
    return '';
  }
}

export class CommandRotationSpeed extends AbstractCommand {
  public execute(): string {
    if (this.value === 0) {
      this.device.state!.setfan = 0;
    } else if (this.value as number <= 20) {
      this.device.state!.setfan = 1;
    } else if (this.value as number <= 40) {
      this.device.state!.setfan = 2;
    } else if (this.value as number <= 60) {
      this.device.state!.setfan = 3;
    } else if (this.value as number <= 80) {
      this.device.state!.setfan = 5;
    } else {
      this.device.state!.setfan = 6;
    }
    return 'FS' + this.device.state!.setfan;
  }
}

export class CommandTemperature extends AbstractCommand {
  public execute(): string {
    this.device.state!.settemp = this.value as string;
    return 'TS' + this.device.state!.settemp;

  }
}

export class CommandZone extends AbstractCommand {
  public execute(): string {
    //this.device.state!.settemp = this.value as string;
    //this.device.state!.zones!['1'].status = this.value
    //this.platform.log.debug('CommandValue', this.value, this.device);
    //return 'Z21'
    return this.value as string;
  }
}
