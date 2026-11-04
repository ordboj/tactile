import Phaser from "phaser";
import { EmptyScene } from "./scenes/EmptyScene";

export function createGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 800,
    height: 600,
    backgroundColor: "#f4f1ea",
    banner: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [EmptyScene],
  });
}

const parent = document.getElementById("game");
if (parent === null) {
  throw new Error("The page has no #game element.");
}

createGame(parent);
