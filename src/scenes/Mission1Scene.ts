import Phaser from "phaser";
import { createPlaceholderAudio } from "../audio/placeholder";
import type { TickResult } from "../game/contracts";
import { Mission1Logic, noticeRows } from "../game/Mission1Logic";
import { SCENE_CAR_PX } from "../game/traffic/Car";
import { vibrateFromNavigator } from "../game/traffic/TouchToQuery";
import {
  assetRotationRad,
  headingFromFacing,
  WALKER_ASSET,
  WALKER_BODY_CSS_PX,
  WALKER_BODY_VIEWBOX,
  WALKER_VIEWBOX,
} from "../game/Walker";
import { mission1 } from "../levels/mission1";
import { CONTROL_ACTIONS, CONTROL_MIN_PX, controlLabel } from "./controlLabels";
import { actionForCode } from "./keyboard";
import { cssColorToHex, PALETTE } from "./palette";
import { TactileMapView } from "./TactileMapView";

export interface MissionShell {
  readonly stage: HTMLElement;
  readonly map: HTMLElement;
  readonly controls: HTMLElement;
  readonly notice: HTMLElement;
  readonly line: HTMLElement;
  readonly caption: HTMLElement;
}

const WORLD_W = 800;
const WORLD_H = 600;
/** World width of the scene walker body. Minimum zoom makes this 48 CSS px. */
const SCENE_BODY_WORLD = 36;

export class Mission1Scene extends Phaser.Scene {
  private logic!: Mission1Logic;
  private audio!: ReturnType<typeof createPlaceholderAudio>;
  private mapView!: TactileMapView;
  private walkerSprite!: Phaser.GameObjects.Image;
  private carSprite!: Phaser.GameObjects.Rectangle;
  private bars: Phaser.GameObjects.Rectangle[] = [];
  private zoom = 1;
  private onKey: ((event: KeyboardEvent) => void) | null = null;

  public constructor(private readonly shell: MissionShell) {
    super("mission-1");
  }

  public preload(): void {
    this.load.svg("walker", WALKER_ASSET, {
      width: WALKER_VIEWBOX.width,
      height: WALKER_VIEWBOX.height,
    });
  }

  public create(): void {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
    this.audio = createPlaceholderAudio({ reducedMotion: () => reduced });
    this.logic = new Mission1Logic(this.audio, {
      vibrate: vibrateFromNavigator(window.navigator),
      reducedMotion: reduced,
    });
    this.logic.start(mission1);
    this.mapView = new TactileMapView(this.shell.map);
    this.drawWorld();
    this.walkerSprite = this.add.image(0, 0, "walker").setOrigin(0.5).setDepth(3);
    this.carSprite = this.add
      .rectangle(0, 0, SCENE_CAR_PX.width, SCENE_CAR_PX.height, cssColorToHex(PALETTE.carFill))
      .setStrokeStyle(4, cssColorToHex(PALETTE.ink))
      .setDepth(2)
      .setVisible(false);
    this.bars = [0, 1, 2].map(() =>
      this.add.rectangle(0, 0, 18, 10, cssColorToHex(PALETTE.rim)).setDepth(4).setVisible(false),
    );
    this.buildControls();
    this.bindKeys();
    this.bindRoadHold();
    this.scale.on(Phaser.Scale.Events.RESIZE, () => {
      this.fit();
    });
    this.fit();
    this.publish(this.logic.tick(0));
  }

  public update(_time: number, delta: number): void {
    this.fit();
    const frameDtMs = Math.max(0, Math.round(delta));
    this.publish(this.logic.tick(frameDtMs));
  }

  private drawWorld(): void {
    const part = mission1.parts[0];
    if (part === undefined) {
      throw new Error("Mission 1 is missing part A");
    }
    this.cameras.main.setBackgroundColor(PALETTE.pavement);
    const road = part.road;
    this.add
      .rectangle(WORLD_W / 2, road.from.y, WORLD_W, road.width, cssColorToHex(PALETTE.road))
      .setStrokeStyle(4, cssColorToHex(PALETTE.rim))
      .setDepth(0);
    const stripes = this.add.graphics();
    stripes.setDepth(1);
    stripes.fillStyle(cssColorToHex(PALETTE.rim), 1);
    const top = Math.min(part.crosswalk.from.y, part.crosswalk.to.y);
    const height = Math.abs(part.crosswalk.to.y - part.crosswalk.from.y);
    const left = part.crosswalk.from.x - part.crosswalk.width / 2;
    const stripeCount = 6;
    const stripeH = 8;
    const gap = (height - stripeCount * stripeH) / (stripeCount + 1);
    for (let index = 0; index < stripeCount; index += 1) {
      const y = top + gap + index * (stripeH + gap);
      stripes.fillRect(left, y, part.crosswalk.width, stripeH);
    }
  }

  private bindRoadHold(): void {
    const road = mission1.parts[0]?.road;
    if (road === undefined) {
      return;
    }
    const zone = this.add.zone(WORLD_W / 2, road.from.y, WORLD_W, road.width).setInteractive();
    zone.on("pointerdown", () => {
      this.audio.prime();
      this.logic.setRoadHold(true);
    });
    this.input.on("pointerup", () => {
      this.logic.setRoadHold(false);
    });
    this.input.on("pointerupoutside", () => {
      this.logic.setRoadHold(false);
    });
  }

  private buildControls(): void {
    this.shell.controls.replaceChildren();
    for (const action of CONTROL_ACTIONS) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = controlLabel(action);
      button.style.minHeight = `${CONTROL_MIN_PX}px`;
      button.style.minWidth = `${CONTROL_MIN_PX}px`;
      button.style.font = "700 16px/1.35 sans-serif";
      button.addEventListener("click", () => {
        this.audio.prime();
        this.logic.input(action, this.logic.timeMs);
      });
      this.shell.controls.append(button);
    }
  }

  private bindKeys(): void {
    this.onKey = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }
      const action = actionForCode(event.code);
      if (action === null) {
        return;
      }
      event.preventDefault();
      this.audio.prime();
      this.logic.input(action, this.logic.timeMs);
    };
    window.addEventListener("keydown", this.onKey);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.onKey !== null) {
        window.removeEventListener("keydown", this.onKey);
      }
    });
  }

  private fit(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    if (width < 1 || height < 1) {
      return;
    }
    const minZoom = WALKER_BODY_CSS_PX.scene / SCENE_BODY_WORLD;
    const fitZoom = Math.min(width / WORLD_W, height / WORLD_H);
    this.zoom = Math.max(minZoom, fitZoom);
    this.cameras.main.setZoom(this.zoom);
    const part = mission1.parts[0];
    const focusY = part === undefined ? WORLD_H / 2 : part.road.from.y;
    this.cameras.main.centerOn(WORLD_W / 2, focusY);
    this.applySizes();
  }

  private applySizes(): void {
    const scale = SCENE_BODY_WORLD / WALKER_BODY_VIEWBOX;
    this.walkerSprite.setDisplaySize(WALKER_VIEWBOX.width * scale, WALKER_VIEWBOX.height * scale);
    const carScale = SCENE_BODY_WORLD / WALKER_BODY_CSS_PX.scene;
    this.carSprite.setSize(SCENE_CAR_PX.width * carScale, SCENE_CAR_PX.height * carScale);
    for (const bar of this.bars) {
      bar.setSize(16 * carScale, 8 * carScale);
    }
  }

  private publish(result: TickResult): void {
    const view = result.view;
    const part = mission1.parts[0];
    if (part === undefined) {
      return;
    }
    this.shell.notice.textContent = noticeRows(view.notice);
    this.shell.line.textContent = view.text?.text ?? "";
    const caption = this.logic.captionText();
    const captionText = this.shell.caption.querySelector("span");
    if (captionText !== null) {
      captionText.textContent = caption ?? "";
    }
    this.shell.caption.hidden = caption === null;
    this.walkerSprite.setPosition(view.sceneWalker.position.x, view.sceneWalker.position.y);
    this.walkerSprite.setRotation(assetRotationRad(headingFromFacing(view.sceneWalker.facingRad)));
    this.applySizes();
    if (view.car === null) {
      this.carSprite.setVisible(false);
    } else {
      this.carSprite.setVisible(true);
      this.carSprite.setPosition(view.car.position.x, view.car.position.y);
    }
    const count = this.logic.pulseBarCount;
    this.bars.forEach((bar, index) => {
      bar.setVisible(index < count);
      bar.setPosition(part.crosswalk.from.x, part.road.from.y - 18 + index * 14);
    });
    this.mapView.render({
      visible: true,
      map: part.map,
      road: view.road,
      crosswalk: view.crosswalk,
      walker: view.mapWalker,
      car: view.car,
    });
  }
}
