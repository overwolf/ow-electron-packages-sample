import overwolf from '@overwolf/ow-electron';
import { app } from 'electron';
import EventEmitter from 'events';

export type PackageName = overwolf.overwolf.packages.PackageName;

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
    try {
      console.log(`[${this.constructor.name}] - ${message}`, ...args);
      const fullMessage = `[${this.constructor.name}] - ${message}`;
      this.emit('log', fullMessage, ...args);
    } catch (error) {
      console.error('Error logging message:', error);
    }
  }

  /**
   * Called when the package is ready.
   * Each package controller must implement this method.
   */
  protected abstract onPackageReady(): void;
}
