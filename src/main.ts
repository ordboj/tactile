import Phaser from "phaser";
import { Mission1Scene, type MissionShell } from "./scenes/Mission1Scene";

export function createGame(shell: MissionShell): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: shell.stage,
    backgroundColor: "#7A6854",
    banner: false,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [new Mission1Scene(shell)],
  });
}

function requiredElement(id: string): HTMLElement {
  const node = document.getElementById(id);
  if (node === null) {
    throw new Error(`The page has no #${id} element.`);
  }
  return node;
}

const stage = document.getElementById("game");
if (stage !== null) {
  createGame({
    stage,
    map: requiredElement("map"),
    controls: requiredElement("controls"),
    notice: requiredElement("notice"),
    line: requiredElement("line"),
    caption: requiredElement("caption"),
  });
}
