import { RemoteGamepadAPI } from "./serverlib/RemoteGamepadAPI";


// add remote gamepad api to global object...
let root: any = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

// use existing remote gamepad api or load new instance
var remoteGamepadAPI: RemoteGamepadAPI = root.remoteGamepadAPI || RemoteGamepadAPI.getInstance();
root.remoteGamepadAPI = remoteGamepadAPI;

export default remoteGamepadAPI;