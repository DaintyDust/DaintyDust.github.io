import _ from "underscore";

type Coord = [number, number];
type CanvasPaintFn = (ctx: CanvasRenderingContext2D, layer: FullscreenCanvas) => void;

const STEP_LENGTH = 1;
const CELL_SIZE = 8; //10;
const BORDER_WIDTH = 2;
const MAX_FONT_SIZE = 500;
const MAX_ELECTRONS = 750;
const CELL_DISTANCE = CELL_SIZE + BORDER_WIDTH;
const CELL_REPAINT_INTERVAL: readonly [number, number] = [250, 550];
const RANDOM_SPAWN_INTERVAL: readonly [number, number] = [300, 600];
const GALAXY_COLOR = "#328bf6";
let BG_COLOR = "#1d2227";
let BORDER_COLOR = "#0d1a2e";
let CELL_HIGHLIGHT = "#00b4d8";
let ELECTRON_COLOR = "#328bf6";
let FONT_COLOR = "#0081a7";
const FONT_FAMILY = 'Inter, Helvetica, Arial, "Hiragino Sans GB", "Microsoft YaHei", "WenQuan Yi Micro Hei", sans-serif';

const ACTIVE_ELECTRONS: Electron[] = [];
const PINNED_CELLS: Cell[] = [];

const MOVE_TRAILS: Coord[] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
].map(([x, y]) => [x * CELL_DISTANCE, y * CELL_DISTANCE]);

const END_POINTS_OFFSET: Coord[] = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
].map(([x, y]) => [x * CELL_DISTANCE - BORDER_WIDTH / 2, y * CELL_DISTANCE - BORDER_WIDTH / 2]);

class FullscreenCanvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  disableScale: boolean;
  width = 0;
  height = 0;
  realWidth = 0;
  realHeight = 0;
  container?: HTMLElement;
  private resizeHandlers: CanvasPaintFn[] = [];

  constructor(disableScale = false) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      throw new Error("2D canvas context is not available");
    }

    this.canvas = canvas;
    this.context = context;
    this.disableScale = disableScale;
    // this.handleResize = _.debounce(() => this.handleResize(), 100);
    this.handleResize = _.debounce(this.handleResize.bind(this), 100);

    this.adjust();

    window.addEventListener("resize", this.handleResize);
  }

  adjust() {
    const { canvas, context, disableScale } = this;
    const { innerWidth, innerHeight } = window;
    const DPR = window.devicePixelRatio || 1;

    this.width = innerWidth;
    this.height = innerHeight;

    const scale = disableScale ? 1 : DPR;

    this.realWidth = canvas.width = innerWidth * scale;
    this.realHeight = canvas.height = innerHeight * scale;

    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(scale, scale);
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  private makeCallback(fn: CanvasPaintFn) {
    fn(this.context, this);
  }

  blendBackground(background: CanvasImageSource /*, opacity = 0.05*/) {
    return this.paint((ctx, { realWidth, realHeight, width, height }) => {
      ctx.globalCompositeOperation = "source-over";
      // ctx.globalAlpha = opacity;
      ctx.fillStyle = `rgba(0,0,0,0.05)`; //`rgba(0,0,0,${opacity})`; //`rgba(29, 34, 39, 0.05)`;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighten";
      ctx.drawImage(background, 0, 0, realWidth, realHeight, 0, 0, width, height);
    });
  }

  paint(fn?: CanvasPaintFn) {
    if (!fn) return;

    this.context.save();
    this.makeCallback(fn);
    this.context.restore();

    return this;
  }

  repaint(fn?: CanvasPaintFn) {
    if (!fn) return;

    this.clear();
    return this.paint(fn);
  }

  onResize(fn?: CanvasPaintFn) {
    if (!fn) return;

    this.resizeHandlers.push(fn);
  }

  private handleResize() {
    if (!this.resizeHandlers.length) return;

    this.adjust();
    // this.resizeHandlers.forEach((handler) => this.makeCallback(handler));
    this.resizeHandlers.forEach(this.makeCallback.bind(this));
  }

  renderIntoView(target: HTMLElement = document.body) {
    this.container = target;

    this.canvas.id = "background";
    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0px";
    this.canvas.style.top = "0px";

    target.appendChild(this.canvas);
  }

  remove() {
    if (!this.container) return;

    try {
      window.removeEventListener("resize", this.handleResize);
      this.container.removeChild(this.canvas);
    } catch {
      return;
    }
  }
}

type ElectronOptions = {
  lifeTime?: number;
  speed?: number;
  color?: string;
};

class Electron {
  lifeTime: number;
  expireAt: number;
  speed: number;
  color: string;
  radius: number;
  current: Coord;
  destination: Coord;
  visited: Record<string, boolean> = {};

  constructor(x = 0, y = 0, { lifeTime = 3000, speed = STEP_LENGTH, color = ELECTRON_COLOR }: ElectronOptions = {}) {
    this.lifeTime = lifeTime;
    this.expireAt = Date.now() + lifeTime;

    this.speed = speed;
    this.color = color;

    this.radius = BORDER_WIDTH / 2;
    this.current = [x, y];
    this.destination = this.randomPath();
    this.setDest(this.destination);
  }

  randomPath(): Coord {
    const [x, y] = this.current;
    const [deltaX, deltaY] = MOVE_TRAILS[Math.floor(Math.random() * MOVE_TRAILS.length)];
    return [x + deltaX, y + deltaY];
  }

  static composeCoord(coord: Coord) {
    return coord.join(",");
  }

  hasVisited(dest: Coord) {
    return this.visited[Electron.composeCoord(dest)];
  }

  setDest(dest: Coord) {
    this.destination = dest;
    this.visited[Electron.composeCoord(dest)] = true;
  }

  next(): Coord {
    const { speed, current } = this;
    let { destination } = this;

    if (Math.abs(current[0] - destination[0]) <= speed / 2 && Math.abs(current[1] - destination[1]) <= speed / 2) {
      destination = this.randomPath();

      let tryCount = 1;
      const maxAttempt = 4;

      while (this.hasVisited(destination) && tryCount <= maxAttempt) {
        tryCount += 1;
        destination = this.randomPath();
      }

      this.setDest(destination);
    }

    const deltaX = destination[0] - current[0];
    const deltaY = destination[1] - current[1];

    if (deltaX) {
      current[0] += (deltaX / Math.abs(deltaX)) * speed;
    }

    if (deltaY) {
      current[1] += (deltaY / Math.abs(deltaY)) * speed;
    }

    return [...this.current];
  }
}

type GlowSprite = {
  canvas: HTMLCanvasElement;
  offset: number;
};

const GLOW_SPRITES = new Map<string, GlowSprite>();

function getGlowSprite(color: string, radius: number): GlowSprite {
  const key = `${color}_${radius}`;
  const cached = GLOW_SPRITES.get(key);

  if (cached) return cached;

  const blur = radius * 5;
  const size = Math.ceil((radius + blur * 2) * 2);
  const offscreen = document.createElement("canvas");
  offscreen.width = size;
  offscreen.height = size;

  const offscreenContext = offscreen.getContext("2d");

  if (!offscreenContext) throw new Error("2D canvas context is not available");

  offscreenContext.fillStyle = color;
  offscreenContext.shadowColor = color;
  offscreenContext.shadowBlur = blur;
  offscreenContext.beginPath();
  offscreenContext.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
  offscreenContext.closePath();
  offscreenContext.fill();

  const sprite = { canvas: offscreen, offset: size / 2 };
  GLOW_SPRITES.set(key, sprite);

  return sprite;
}

function drawElectronsBatch(layer: FullscreenCanvas) {
  const now = Date.now();
  let writeIndex = 0;

  layer.paint((ctx) => {
    ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < ACTIVE_ELECTRONS.length; i++) {
      const electron = ACTIVE_ELECTRONS[i];

      if (now >= electron.expireAt) continue;

      const [x, y] = electron.next();
      const alpha = Math.max(0, electron.expireAt - now) / electron.lifeTime;
      const { canvas: sprite, offset } = getGlowSprite(electron.color, electron.radius);

      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, x - offset, y - offset);

      ACTIVE_ELECTRONS[writeIndex] = electron;
      writeIndex++;
    }
  });

  ACTIVE_ELECTRONS.length = writeIndex;
}

type CellOptions = {
  electronCount?: number;
  background?: string;
  forceElectrons?: boolean;
  electronOptions?: ElectronOptions;
};

type ExplodeOptions = {
  electronOptions?: ElectronOptions;
};

class Cell {
  background: string;
  electronOptions: ElectronOptions;
  forceElectrons: boolean;
  electronCount: number;
  startY: number;
  startX: number;
  expireAt = Number.MAX_SAFE_INTEGER;
  nextUpdate?: number;

  constructor(row = 0, col = 0, { electronCount = 1 + Math.floor(Math.random() * 4), background = ELECTRON_COLOR, forceElectrons = false, electronOptions = {} }: CellOptions = {}) {
    this.background = background;
    this.electronOptions = electronOptions;
    this.forceElectrons = forceElectrons;
    this.electronCount = Math.min(electronCount, 4);

    this.startY = row * CELL_DISTANCE;
    this.startX = col * CELL_DISTANCE;
  }

  delay(ms = 0) {
    this.pin(ms * 1.5);
    this.nextUpdate = Date.now() + ms;
  }

  pin(lifeTime = Number.MAX_SAFE_INTEGER) {
    this.expireAt = Date.now() + lifeTime;
    PINNED_CELLS.push(this);
  }

  scheduleUpdate(t1 = CELL_REPAINT_INTERVAL[0], t2 = CELL_REPAINT_INTERVAL[1]) {
    this.nextUpdate = Date.now() + t1 + Math.floor(Math.random() * (t2 - t1 + 1));
  }

  paintNextTo(layer = new FullscreenCanvas()) {
    const { startX, startY, background, nextUpdate } = this;

    if (nextUpdate && Date.now() < nextUpdate) return;

    this.scheduleUpdate();
    this.createElectrons();

    layer.paint((ctx) => {
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = background;
      ctx.fillRect(startX, startY, CELL_SIZE, CELL_SIZE);
    });
  }

  static popRandom<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array.splice(randomIndex, 1)[0];
  }

  createElectrons() {
    if (!this.electronCount) return;

    const endpoints: Coord[] = [...END_POINTS_OFFSET];
    const max = this.forceElectrons ? this.electronCount : Math.min(this.electronCount, MAX_ELECTRONS - ACTIVE_ELECTRONS.length);

    for (let i = 0; i < max; i++) {
      const [offsetX, offsetY] = Cell.popRandom(endpoints);
      ACTIVE_ELECTRONS.push(new Electron(this.startX + offsetX, this.startY + offsetY, this.electronOptions));
    }
  }
}

const bgLayer = new FullscreenCanvas();
const mainLayer = new FullscreenCanvas();
const shapeLayer = new FullscreenCanvas(true);

type TextMatrixOptions = {
  fontWeight?: string;
  fontFamily?: string;
};

type ShapeController = {
  lastText: string;
  renderID?: number;
  isAlive: boolean;
  unbindEvents: () => void;
  readonly electronOptions: ElectronOptions;
  readonly cellOptions: CellOptions;
  readonly explodeOptions: ExplodeOptions;
  init: (container?: HTMLElement) => void;
  clear: () => void;
  destroy: () => void;
  getTextMatrix: (text: string, options?: TextMatrixOptions) => Coord[];
  print: (text: string, options?: TextMatrixOptions) => void;
  spiral: (options?: { radius?: number; increment?: number; reverse?: boolean; lifeTime?: number; electronCount?: number; forceElectrons?: boolean }) => void;
  explode: (matrix?: Coord[]) => void;
  queue: (commandText?: string, defaultText?: string) => void;
  countdown: () => void;
  galaxy: () => void;
  ring: () => void;
};

const shape: ShapeController = {
  lastText: "",
  renderID: undefined,
  isAlive: false,
  unbindEvents: () => {
    return;
  },

  get electronOptions() {
    return {
      speed: 2,
      color: FONT_COLOR,
      lifeTime: 300 + Math.floor(Math.random() * (500 - 300 + 1)),
    };
  },

  get cellOptions() {
    return {
      background: FONT_COLOR,
      electronCount: 1 + Math.floor(Math.random() * 4),
      electronOptions: this.electronOptions,
    };
  },

  get explodeOptions() {
    return Object.assign(this.cellOptions, {
      electronOptions: Object.assign(this.electronOptions, {
        lifeTime: _.random(500, 1500),
      }),
    });
  },

  init(container = document.body) {
    if (this.isAlive) {
      return;
    }

    bgLayer.onResize(drawGrid);
    mainLayer.onResize(prepaint);

    mainLayer.renderIntoView(container);

    shapeLayer.onResize(() => {
      if (this.lastText) {
        this.print(this.lastText);
      }
    });

    prepaint();
    render();

    this.unbindEvents = handlePointer();
    this.isAlive = true;
  },

  clear() {
    this.lastText = "";
    PINNED_CELLS.length = 0;
  },

  destroy() {
    if (!this.isAlive) {
      return;
    }

    bgLayer.remove();
    mainLayer.remove();
    shapeLayer.remove();

    this.unbindEvents();

    if (this.renderID !== undefined) cancelAnimationFrame(this.renderID);

    ACTIVE_ELECTRONS.length = 0;
    PINNED_CELLS.length = 0;
    this.lastText = "";
    this.isAlive = false;
  },

  getTextMatrix(text, { fontWeight = "bold", fontFamily = FONT_FAMILY } = {}) {
    const { width, height } = shapeLayer;

    shapeLayer.repaint((ctx) => {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${fontWeight} ${MAX_FONT_SIZE}px ${fontFamily}`;

      const measuredWidth = ctx.measureText(text).width || 1;
      const scale = width / measuredWidth;
      const fontSize = Math.min(MAX_FONT_SIZE, MAX_FONT_SIZE * scale * 0.8);

      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillText(text, width / 2, height / 2);
    });

    const pixels = shapeLayer.context.getImageData(0, 0, width, height).data;
    const matrix: Coord[] = [];

    for (let y = 0; y < height; y += CELL_DISTANCE) {
      for (let x = 0; x < width; x += CELL_DISTANCE) {
        const alpha = pixels[(x + y * width) * 4 + 3];

        if (alpha > 0) {
          matrix.push([Math.floor(y / CELL_DISTANCE), Math.floor(x / CELL_DISTANCE)]);
        }
      }
    }

    return matrix;
  },

  print(text, options) {
    this.clear();
    this.lastText = text;

    const matrix = _.shuffle(this.getTextMatrix(text, options));

    matrix.forEach(([i, j]) => {
      const cell = new Cell(i, j, this.cellOptions);
      cell.scheduleUpdate(200);
      cell.pin();
    });
  },

  spiral({ radius, increment = 0, reverse = false, lifeTime = 250, electronCount = 1, forceElectrons = true } = {}) {
    const { width, height } = mainLayer;

    const cols = Math.floor(width / CELL_DISTANCE);
    const rows = Math.floor(height / CELL_DISTANCE);

    const ox = Math.floor(cols / 2);
    const oy = Math.floor(rows / 2);

    let cnt = 1;
    let deg = _.random(360);
    let r = radius === undefined ? Math.floor(Math.min(cols, rows) / 3) : radius;

    const step = reverse ? 15 : -15;
    const max = Math.abs(360 / step);

    while (cnt <= max) {
      const i = oy + Math.floor(r * Math.sin((deg / 180) * Math.PI));
      const j = ox + Math.floor(r * Math.cos((deg / 180) * Math.PI));

      const cell = new Cell(i, j, {
        electronCount,
        forceElectrons,
        background: GALAXY_COLOR, //CELL_HIGHLIGHT,
        electronOptions: {
          lifeTime,
          speed: 3,
          color: GALAXY_COLOR, //CELL_HIGHLIGHT,
        },
      });

      cell.delay(cnt * 16);

      cnt++;
      deg += step;
      r += increment;
    }
  },

  explode(matrix) {
    stripOld();

    if (matrix) {
      const { length } = matrix;

      const max = Math.min(50, _.random(Math.floor(length / 20), Math.floor(length / 10)));

      for (let idx = 0; idx < max; idx++) {
        const [i, j] = matrix[idx];

        const cell = new Cell(i, j, this.explodeOptions);

        cell.paintNextTo(mainLayer);
      }
    } else {
      const max = _.random(10, 20);

      for (let idx = 0; idx < max; idx++) {
        createRandomCell(this.explodeOptions);
      }
    }
  },

  queue(commandText, defaultText) {
    queue(commandText, defaultText);
  },

  countdown() {
    countdown();
  },

  galaxy() {
    galaxy();
  },

  ring() {
    ring();
  },
};

function stripOld(limit = 1000) {
  const now = Date.now();

  for (let i = 0, max = ACTIVE_ELECTRONS.length; i < max; i++) {
    const e = ACTIVE_ELECTRONS[i];

    if (e.expireAt - now < limit) {
      ACTIVE_ELECTRONS.splice(i, 1);

      i--;
      max--;
    }
  }
}

function createRandomCell(options: CellOptions = {}) {
  if (ACTIVE_ELECTRONS.length >= MAX_ELECTRONS) return;

  const { width, height } = mainLayer;

  const cell = new Cell(Math.floor(Math.random() * (height / CELL_DISTANCE + 1)), Math.floor(Math.random() * (width / CELL_DISTANCE + 1)), options);

  cell.paintNextTo(mainLayer);
}

function compactAndPaint(list: Cell[]) {
  const now = Date.now();
  let writeIndex = 0;

  for (let i = 0; i < list.length; i++) {
    const item = list[i];

    if (now >= item.expireAt) continue;

    item.paintNextTo(mainLayer);
    list[writeIndex] = item;
    writeIndex++;
  }

  list.length = writeIndex;
}

let nextRandomAt = 0;

function activateRandom() {
  const now = Date.now();

  if (now < nextRandomAt) {
    return;
  }

  const [min, max] = RANDOM_SPAWN_INTERVAL;
  nextRandomAt = now + min + Math.floor(Math.random() * (max - min + 1));
  createRandomCell();
}

function drawItems() {
  compactAndPaint(PINNED_CELLS);
  drawElectronsBatch(mainLayer);
}

function drawGrid() {
  bgLayer.paint((ctx, { width, height }) => {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = BORDER_COLOR;

    for (let h = CELL_SIZE; h < height; h += CELL_DISTANCE) {
      ctx.fillRect(0, h, width, BORDER_WIDTH);
    }

    for (let w = CELL_SIZE; w < width; w += CELL_DISTANCE) {
      ctx.fillRect(w, 0, BORDER_WIDTH, height);
    }
  });
}

function handlePointer() {
  let lastCell: Coord | null = null;
  let touchRecords: Record<number, { clientX: number; clientY: number }> = {};

  function isSameCell(i: number, j: number) {
    const isSame = Boolean(lastCell && i === lastCell[0] && j === lastCell[1]);
    lastCell = [i, j];
    return isSame;
  }

  function print(isMove: boolean, point: { clientX: number; clientY: number }) {
    const i = Math.floor(point.clientY / CELL_DISTANCE);
    const j = Math.floor(point.clientX / CELL_DISTANCE);

    if (isMove && isSameCell(i, j)) {
      return;
    }

    const cell = new Cell(i, j, {
      background: CELL_HIGHLIGHT,
      forceElectrons: true,
      electronCount: isMove ? 2 : 4,
      electronOptions: {
        speed: 3,
        lifeTime: isMove ? 500 : 1000,
        color: CELL_HIGHLIGHT,
      },
    });

    cell.paintNextTo(mainLayer);
  }

  const handlers: Record<string, EventListener> = {
    touchend: (event: Event) => {
      if (!(event instanceof TouchEvent)) {
        touchRecords = {};
        return;
      }

      Array.from(event.changedTouches).forEach(({ identifier }) => {
        delete touchRecords[identifier];
      });
    },
  };

  function filterTouches(touchList: TouchList) {
    return Array.from(touchList).filter(({ identifier, clientX, clientY }) => {
      const record = touchRecords[identifier];
      touchRecords[identifier] = { clientX, clientY };

      return !record || clientX !== record.clientX || clientY !== record.clientY;
    });
  }

  ["mousedown", "touchstart", "mousemove", "touchmove"].forEach((name) => {
    const isMove = /move/.test(name);
    const isTouch = /touch/.test(name);

    handlers[name] = (event: Event) => {
      if (isTouch) {
        if (!(event instanceof TouchEvent)) return;

        filterTouches(event.touches).forEach((touch) => print(isMove, touch));
        return;
      }

      if (!(event instanceof MouseEvent)) return;

      print(isMove, event);
    };
  });

  const events = Object.keys(handlers);

  events.forEach((name) => {
    document.addEventListener(name, handlers[name]);
  });

  return function unbind() {
    events.forEach((name) => {
      document.removeEventListener(name, handlers[name]);
    });
  };
}

let timer: number;

function queue(commandText?: string, defaultText?: string) {
  const inputText = commandText?.trim();
  const textParam = getUrlParameter("text");
  const text = inputText || textParam || defaultText || "DaintyDust";

  let i = 0;
  const max = text.length;

  const run = () => {
    if (i >= max) return;

    shape.print(text.slice(0, ++i));
    clearTimeout(timer);
    timer = setTimeout(run, 1e3 + i);
  };

  run();
}

function countdown() {
  const arr = _.range(3, 0, -1);

  let i = 0;
  const max = arr.length;

  const run = () => {
    if (i >= max) {
      shape.clear();
      return galaxy();
    }

    shape.print(String(arr[i++]));
    clearTimeout(timer);
    timer = setTimeout(run, 1e3 + i);
  };

  run();
}

function galaxy() {
  shape.spiral({
    radius: 0,
    increment: 1,
    lifeTime: 100,
    electronCount: 1,
  });

  clearTimeout(timer);
  timer = setTimeout(galaxy, 16);
}

function ring() {
  shape.spiral();

  clearTimeout(timer);
  timer = setTimeout(ring, 16);
}

function prepaint() {
  drawGrid();

  mainLayer.paint((ctx, { width, height }) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
  });

  mainLayer.blendBackground(bgLayer.canvas /*, 0.9*/);
}

function render() {
  mainLayer.blendBackground(bgLayer.canvas);

  drawItems();
  activateRandom();
  shape.renderID = requestAnimationFrame(render);
}

function getUrlParameter(name: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

type ThemeColorOptions = {
  bgColor?: string;
  borderColor?: string;
  cellHighlight?: string;
  electronColor?: string;
  fontColor?: string;
};

let themeRepaintFrameId: number | undefined;
let themeNeedsGridRefresh = false;
let themeNeedsTextRefresh = false;

export function setThemeColors({ bgColor, borderColor, cellHighlight, electronColor, fontColor }: ThemeColorOptions) {
  if (bgColor && bgColor !== BG_COLOR) {
    BG_COLOR = bgColor;
    themeNeedsGridRefresh = true;
  }

  if (borderColor && borderColor !== BORDER_COLOR) {
    BORDER_COLOR = borderColor;
    themeNeedsGridRefresh = true;
  }

  if (cellHighlight && cellHighlight !== CELL_HIGHLIGHT) {
    CELL_HIGHLIGHT = cellHighlight;
  }

  if (electronColor && electronColor !== ELECTRON_COLOR) {
    ELECTRON_COLOR = electronColor;
  }

  if (fontColor && fontColor !== FONT_COLOR) {
    FONT_COLOR = fontColor;
    themeNeedsTextRefresh = true;
  }

  if (!shape.isAlive) return;
  if (themeRepaintFrameId !== undefined) return;

  themeRepaintFrameId = requestAnimationFrame(() => {
    themeRepaintFrameId = undefined;

    if (!shape.isAlive) return;

    if (themeNeedsGridRefresh) {
      drawGrid();
      themeNeedsGridRefresh = false;
    }

    if (themeNeedsTextRefresh && shape.lastText) {
      shape.print(shape.lastText);
    }

    themeNeedsTextRefresh = false;
  });
}

export { shape };
export { timer };

export async function init(text?: string) {
  shape.init();

  const textParam = getUrlParameter("text");
  const displayText = textParam || text || "DaintyDust";
  shape.print(displayText);
}

// document.getElementById("input").addEventListener("keypress", ({ keyCode, target }) => {
//   if (keyCode === 13) {
//     clearTimeout(timer);
//     const value = target.value.trim();
//     target.value = "";

//     switch (value) {
//       case "#destroy":
//         return shape.destroy();

//       case "#init":
//         return shape.init();

//       case "#explode":
//         return shape.explode();

//       case "#clear":
//         return shape.clear();

//       case "#queue":
//         return queue();

//       case "#countdown":
//         return countdown();

//       case "#galaxy":
//         shape.clear();
//         return galaxy();

//       case "#ring":
//         shape.clear();
//         return ring();

//       default:
//         return shape.print(value);
//     }
//   }
// });

document.addEventListener("touchmove", (event) => event.preventDefault(), { passive: false });
