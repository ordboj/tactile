import { describe, expect, it } from "vitest";
import { actionForCode } from "./keyboard";

describe("keyboard", () => {
  it("maps desktop keys to player actions", () => {
    expect(actionForCode("ArrowUp")).toBe("move");
    expect(actionForCode("Space")).toBe("stop");
    expect(actionForCode("ArrowLeft")).toBe("turn");
    expect(actionForCode("ArrowRight")).toBe("turn");
    expect(actionForCode("ArrowDown")).toBe("step-back");
    expect(actionForCode("KeyA")).toBe("align");
    expect(actionForCode("KeyL")).toBe("listen");
    expect(actionForCode("KeyM")).toBe("read-map");
    expect(actionForCode("KeyW")).toBe("wait");
    expect(actionForCode("Enter")).toBe("cross");
    expect(actionForCode("KeyC")).toBe("cross");
    expect(actionForCode("KeyQ")).toBeNull();
  });
});
