export class GepActions {
  static setRequiredFeature = async () => {
    await window.gep.setRequiredFeature();
  };

  static getInfo = async () => {
    await window.gep.getInfo();
  };
}
