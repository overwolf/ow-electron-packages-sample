
import EventEmitter from 'events';
import { LogLevel } from '../services/base.service';
import { app } from 'electron';

export type PackageName = overwolf.packages.PackageName;

export abstract class PackageControllerBase extends EventEmitter {
  // Base functionality for all package controllers

  constructor(packageName: PackageName) {
    super();
    this.init(packageName);
  }

  private init(packageName: PackageName) {
    // Initialization logic for the package controller
    app.overwolf.packages.on(
      'ready',
      (_e, name: PackageName, version: string) => {
        // Check if the package name matches
        if (name !== packageName) {
          return;
        }

        this.log(`Package ready: ${name} - version: ${version}`);
        this.onPackageReady();
      },
    );
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

  /**
   * Called when the package is ready.
   * Each package controller must implement this method.
   */
  protected abstract onPackageReady(): void;
}
