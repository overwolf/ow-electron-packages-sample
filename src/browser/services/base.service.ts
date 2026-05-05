import { app as electronApp, ipcMain } from 'electron';
import { overwolf } from '@overwolf/ow-electron';
const app = electronApp as overwolf.OverwolfApp;

import EventEmitter from 'events';

export declare type PackageName = overwolf.packages.PackageName | 'utility';

export abstract class PackageServiceBase extends EventEmitter {
  constructor() {
    super();
  }
  
  protected log(message: string, ...args: any[]) {
    try {
      console.log(`[${this.constructor.name}] - ${message}`, ...args);
      const fullMessage = `[${this.constructor.name}] - ${message}`;
      this.emit('log', fullMessage, ...args);
    } catch (error) {
      console.error('Error logging message:', error);
    }
  }

}