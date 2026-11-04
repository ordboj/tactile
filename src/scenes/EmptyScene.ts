import Phaser from "phaser";

export const EMPTY_SCENE_KEY = "empty";

export class EmptyScene extends Phaser.Scene {
  public constructor() {
    super(EMPTY_SCENE_KEY);
  }

  public create(): void {
    this.cameras.main.setBackgroundColor("#f4f1ea");
  }
}
