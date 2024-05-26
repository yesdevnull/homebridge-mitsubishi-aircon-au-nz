import { API } from 'homebridge';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';
import { MelviewMitsubishiHomebridgePlatform } from './platform.js';

/**
 * This method registers the platform with Homebridge
 */
export default (api: API): void => {
  api.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, MelviewMitsubishiHomebridgePlatform);
};
