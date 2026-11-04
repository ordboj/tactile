import type { PlayerAction } from "../levels/schema";

export function actionForCode(code: string): PlayerAction | null {
  switch (code) {
    case "ArrowUp":
      return "move";
    case "Space":
      return "stop";
    case "ArrowLeft":
    case "ArrowRight":
      return "turn";
    case "ArrowDown":
      return "step-back";
    case "KeyA":
      return "align";
    case "KeyL":
      return "listen";
    case "KeyM":
      return "read-map";
    case "KeyW":
      return "wait";
    case "Enter":
    case "KeyC":
      return "cross";
    default:
      return null;
  }
}
