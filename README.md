# Homebridge Melview AU/NZ Airconditioners - with Zone Support

Use this plugin to integrate your Mitsubishi AirConditioner appliances with Apple's HomeKit using Homebridge. It now also supports zone controls on ducted A/C.

This plugin was forked from [AURC plugin](https://github.com/aurc/melview-mitsubishi-au-nz) and [jherden84](https://github.com/jherden84/homebridge-mitsubishi-aircon-au-nz) to add additional support as the previous plugin was no longer being updated. 

## Overview

This plugin allows you to control the basic functionalities of your AC units through the home app and Siri. The features include:
- Instant unit response - update the unit directly via LAN interface & cloud Melview.
- Automatically find all appliances linked to your account;
- Control power ON/OFF
- Set mode AUTO, HEAT, COOL
- Dehumidifier (DRY): **Experimental**, disabled by default, use with caution as
  this feature is not extensively tested.
- Set desired temperature
- Obtain unit status, e.g. power, mode, room temperature and desired temperature.
**NEW**
- Allows control of Zones in ducted Mitsubishi Units. Each Zone will be exposed as a seperate fan accessory in HomeKit.

This original project by aurc was created to address the need for a stable plugin
in AU/NZ to control Mitsubishi Air Conditioners. https://github.com/aurc/melview-mitsubishi-au-nz/
It would not have been possible without the great reverse engineering effort done by these folks: [NovaGL/diy-melview](https://github.com/NovaGL/diy-melview).

Also note that the [Homebridge](https://homebridge.io/) put together excellent developer
documentation which made it possible to get up and running quickly (e.g.
[plugin-template](https://github.com/homebridge/homebridge-plugin-template))!

## Compatibility & Pre-requisites

It should work with most modern Mitsubishi Electric Airconditioner units that are Wi-Fi capable.
This plugin has been developed and tested against the following products:
| Model                                                                                              | Wi-Fi Module                                    |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [MSZ-GL71VGD](https://www.mitsubishielectric.com.au/assets/LEG/JG79A991H01-UM.pdf)                 | [MAC-568IF-E](https://www.mitsubishielectric.com.au/assets/LEG/MAC-568IF-E.pdf)   |
| [MSZ-GL35VGD](https://www.mitsubishielectric.com.au/assets/LEG/JG79A991H01-UM.pdf)                 | [MAC-568IF-E](https://www.mitsubishielectric.com.au/assets/LEG/MAC-568IF-E.pdf)   |
| [MSZ-AP25VGD](https://www.mitsubishielectric.com.au/assets/LEG/MSZ-AP-User-Manual-JG79Y333H01.pdf) | [MAC-568IF-E](https://www.mitsubishielectric.com.au/assets/LEG/MAC-568IF-E.pdf)   |

In a nutshell, if you were able to install the **[Wi-Fi Control App](https://apps.apple.com/au/app/mitsubishi-wi-fi-control/id796225889#?platform=iphone)** and operate the unit, this plugin is for you!

Nevertheless, you should have **[Homebridge](https://homebridge.io/)** running.

## Known issues
- **Dry mode**: Does not control fan speed.
- **LAN access**: Still requires internet connection, as it authenticates the requests with Melview cloud. It still
operates way faster than Alexa and Goolge home integration as it has a fast follower command locally removing
the know lag.


## Installation

### Through Homebridge Config UI (recommeded)
It's highly recommended that you use the [Homebridge Config UI X](https://github.com/oznu/homebridge-config-ui-x).
1. Access the settings and configure the credentials as per the required fields.
2. Save and restart homebridge.
3. All units in your network should be automatically recognised. Open your Home App and allocate them to their respective rooms.
4. To detect and add Zone fucntionality select in the Plugin Config.

### Through CLI

You can install the package manually by issuing:
````
npm install -g @yesdevnull/homebridge-mitsubishi-aircon-au-nz
````
and configuring the plugin file `config.json` as:
````
{
    "bridge": {
        //...
    },
    "accessories": [],
    "platforms": [
        {
            "user": "user@domain.com",
            "password": "yourpassword",
            "platform": "MitsubishiAUNZ"
        }
    ]
}
````
where **user** is your user name, typically the email you used to register with the app
and **password** is your account password.

## Questions & Issues
If you have issues, found a bug or have a question, please open an issue **[here](https://github.com/yesdevnull/homebridge-mitsubishi-aircon-au-nz/issues)**.

## TODO

- Troubleshooting local commands - maybe the format has changed?
  - https://github.com/NovaGL/diy-melview/issues/4
