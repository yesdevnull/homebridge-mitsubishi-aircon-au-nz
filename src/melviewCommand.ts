import {CharacteristicValue} from 'homebridge';
import {MelviewMitsubishiHomebridgePlatform} from './platform';
import {Unit, WorkMode} from './data';

export interface Command {
    execute(): string;

    getUnitID(): string;
}

export abstract class AbstractCommand implements Command {
  public constructor(protected value: CharacteristicValue,
                     protected device: Unit,
                     protected platform: MelviewMitsubishiHomebridgePlatform) {
  }

    abstract execute(): string;

    public getUnitID(): string {
      return this.device.unitid;
    }
}

export class CommandPower extends AbstractCommand {
  public execute(): string {
        this.device.state!.power = this.value as number;
        return 'PW' + this.value;
  }
}

export class CommandTargetHeaterCoolerState extends AbstractCommand {
  public execute(): string {
    switch (this.value) {
      case this.platform.Characteristic.TargetHeaterCoolerState.COOL:
                this.device.state!.setmode = WorkMode.COOL;
        return 'MD' + WorkMode.COOL;
      case this.platform.Characteristic.TargetHeaterCoolerState.HEAT:
                this.device.state!.setmode = WorkMode.HEAT;
        return 'MD' + WorkMode.HEAT;
      case this.platform.Characteristic.TargetHeaterCoolerState.AUTO:
                this.device.state!.setmode = WorkMode.AUTO;
        return 'MD' + WorkMode.AUTO;
    }
    return '';
  }
}

export class CommandRotationSpeed extends AbstractCommand {
  public execute(): string {
    if (this.value <= 20) {
            this.device.state!.setfan = 1;
    } else if (this.value <= 40) {
            this.device.state!.setfan = 2;
    } else if (this.value <= 60) {
            this.device.state!.setfan = 3;
    } else if (this.value <= 80) {
            this.device.state!.setfan = 4;
    } else {
            this.device.state!.setfan = 5;
    }
    return 'FS'+this.device.state!.setfan;
  }
}

export class CommandTemperature extends AbstractCommand {
  public execute(): string {
        this.device.state!.settemp = this.value as string;
        return 'TS'+this.device.state!.setfan;
  }
}