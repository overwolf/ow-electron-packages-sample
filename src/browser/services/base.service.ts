import EventEmitter from 'events';

export declare type PackageName = overwolf.packages.PackageName | 'utility';

export type LogLevel = 'info' | 'warn' | 'error';

export abstract class PackageServiceBase extends EventEmitter {
  constructor() {
    super();
  }

  protected log(message: string, ...args: any[]) {
    this._emitLog('info', message, ...args);
  }

  protected warn(message: string, ...args: any[]) {
    this._emitLog('warn', message, ...args);
  }

  protected error(message: string, ...args: any[]) {
    this._emitLog('error', message, ...args);
  }

  private _emitLog(type: LogLevel, message: string, ...args: any[]) {
    try {
      const ts = new Date().toTimeString().slice(0, 8);
      const fullMessage = `[${ts}] [${this.constructor.name}] - ${message}`;
      console[type](fullMessage, ...args);
      this.emit('log', { message: fullMessage, type, args: args.length ? args : undefined });
    } catch (e) {
      console.error('Error logging message:', e);
    }
  }
}
