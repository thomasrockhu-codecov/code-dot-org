import GoogleBlockly from 'blockly/core';

export default class CdoTrashcan extends GoogleBlockly.DeleteArea {
  constructor(workspace) {
    super();
    this.workspace = workspace;
    this.id = 'cdoTrashcan';

    /**
     * Width of both the trash can and lid images.
     * @const {number}
     * @private
     */
    this.WIDTH_ = 47;

    /**
     * Height of the trashcan image (minus lid).
     * @const {number}
     * @private
     */
    this.BODY_HEIGHT_ = 44;

    /**
     * Height of the lid image.
     * @const {number}
     * @private
     */
    this.LID_HEIGHT_ = 16;

    /**
     * Distance between trashcan and top of toolbox.
     * @const {number}
     * @private
     */
    this.MARGIN_TOP_ = 40;

    /**
     * Location of trashcan in sprite image.
     * @const {number}
     * @private
     */
    this.SPRITE_LEFT_ = 0;

    /**
     * Location of trashcan in sprite image.
     * @const {number}
     * @private
     */
    this.SPRITE_TOP_ = 32;

    /**
     * The length of the lid open/close animation in milliseconds.
     * @const {number}
     * @private
     */
    this.ANIMATION_LENGTH_ = 80;

    /**
     * The number of frames in the animation.
     * @const {number}
     * @private
     */
    this.ANIMATION_FRAMES_ = 4;

    /**
     * The maximum angle the trashcan lid can opens to. At the end of the open
     * animation the lid will be open to this angle.
     * @const {number}
     * @private
     */
    this.MAX_LID_ANGLE_ = 45;

    /**
     * The minimum (resting) opacity of the trashcan and lid.
     * @const {number}
     * @private
     */
    this.OPACITY_MIN_ = 0.4;

    /**
     * The maximum (hovered) opacity of the trashcan and lid.
     * @const {number}
     * @private
     */
    this.OPACITY_MAX_ = 0.8;

    /**
     * Current open/close state of the lid.
     * @type {boolean}
     */
    this.isLidOpen = false;

    /**
     * Task ID of opening/closing animation.
     * @type {number}
     * @private
     */
    this.lidTask_ = 0;

    /**
     * Current state of lid opening (0.0 = closed, 1.0 = open).
     * @type {number}
     * @private
     */
    this.lidOpen_ = 0;

    this.TRASH_URL = '/blockly/media/trash.png';
  }

  /**
   * Called by Blockly.inject after the workspace is created
   */
  init() {
    this.workspace.addChangeListener(this.workspaceChangeHandler.bind(this));

    const svg = this.workspace.getParentSvg();
    this.container = Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.SVG);
    this.container.style.visibility = 'hidden';
    this.position(this.workspace.getMetricsManager().getUiMetrics());
    this.createTrashcanSvg();

    svg.parentNode.insertBefore(this.container, svg);

    this.workspace.getComponentManager().addComponent({
      component: this,
      // Weight determines the order of drag targets. The toolbox is also a drag
      // target (weight 1). onDragEnter/Exit/Over are only called for the first
      // drag target, so the trashcan needs to have a smaller weight than the toolbox.
      weight: 0,
      capabilities: [
        Blockly.ComponentManager.Capability.DELETE_AREA,
        Blockly.ComponentManager.Capability.DRAG_TARGET,
        Blockly.ComponentManager.Capability.POSITIONABLE
      ]
    });
    this.workspace.recordDragTargets();
  }

  createTrashcanSvg() {
    this.svgGroup_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.G,
      {class: 'blocklyTrash'},
      this.container
    );
    this.svgGroup_.setAttribute(
      'transform',
      `translate(${this.workspace.getToolboxWidth() / 2 - this.WIDTH_ / 2}, ${
        this.MARGIN_TOP_
      })`
    );

    // Trash can body
    const bodyClipPath = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.CLIPPATH,
      {id: 'blocklyTrashBodyClipPath'},
      this.svgGroup_
    );
    Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.RECT,
      {
        width: this.WIDTH_,
        height: this.BODY_HEIGHT_,
        y: this.LID_HEIGHT_
      },
      bodyClipPath
    );
    const body = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.IMAGE,
      {
        width: Blockly.SPRITE.width,
        x: -this.SPRITE_LEFT_,
        height: Blockly.SPRITE.height,
        y: -this.SPRITE_TOP_,
        'clip-path': 'url(#blocklyTrashBodyClipPath)'
      },
      this.svgGroup_
    );
    body.setAttributeNS(
      Blockly.utils.dom.XLINK_NS,
      'xlink:href',
      this.TRASH_URL
    );

    // Trash can lid
    const lidClipPath = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.CLIPPATH,
      {id: 'blocklyTrashLidClipPath'},
      this.svgGroup_
    );
    Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.RECT,
      {width: this.WIDTH_, height: this.LID_HEIGHT_},
      lidClipPath
    );
    this.svgLid_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.IMAGE,
      {
        width: Blockly.SPRITE.width,
        x: -this.SPRITE_LEFT_,
        height: Blockly.SPRITE.height,
        y: -this.SPRITE_TOP_,
        'clip-path': 'url(#blocklyTrashLidClipPath)'
      },
      this.svgGroup_
    );
    this.svgLid_.setAttributeNS(
      Blockly.utils.dom.XLINK_NS,
      'xlink:href',
      this.TRASH_URL
    );

    // not allowed symbol for undeletable blocks. Circle with line through it
    this.notAllowed_ = Blockly.utils.dom.createSvgElement(
      'g',
      {},
      this.svgGroup_
    );
    Blockly.utils.dom.createSvgElement(
      'line',
      {x1: 0, y1: 10, x2: 45, y2: 60, stroke: '#c00', 'stroke-width': 5},
      this.notAllowed_
    );
    Blockly.utils.dom.createSvgElement(
      'circle',
      {cx: 22, cy: 33, r: 33, stroke: '#c00', 'stroke-width': 5, fill: 'none'},
      this.notAllowed_
    );

    this.animateLid_();
    return this.svgGroup_;
  }

  workspaceChangeHandler(blocklyEvent) {
    if (blocklyEvent.type === Blockly.Events.BLOCK_DRAG) {
      // blocklyEvent.isStart is true when the drag starts, false when the drag ends.
      const trashcanVisibility = blocklyEvent.isStart ? 'visible' : 'hidden';
      const toolboxVisibility = blocklyEvent.isStart ? 'hidden' : 'visible';

      /**
       * NodeList.forEach() is not supported on IE. Use Array.prototype.forEach.call() as a workaround.
       * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
       */
      Array.prototype.forEach.call(
        // query selector for uncategorized toolbox contents
        document.querySelectorAll('.blocklyFlyout .blocklyWorkspace'),
        function(x) {
          x.style.visibility = toolboxVisibility;
        }
      );
      Array.prototype.forEach.call(
        // query selector for categorized toolbox contents
        document.querySelectorAll('.blocklyToolboxContents'),
        function(x) {
          x.style.visibility = toolboxVisibility;
        }
      );

      this.container.style.visibility = trashcanVisibility;

      // Show the not allowed symbol if the trashcan is visible and
      // any of the dragging blocks are undeletable. Otherwise, hide it.
      const isDeletable = blocklyEvent.blocks.every(block =>
        block.isDeletable()
      );
      if (trashcanVisibility === 'visible' && !isDeletable) {
        this.notAllowed_.style.visibility = 'visible';
      } else {
        this.notAllowed_.style.visibility = 'hidden';
      }
    }
  }

  /**
   * IPositionable method
   * Positions the element. Called when the window is resized.
   * @param {!Blockly.MetricsManager.UiMetrics} metrics The workspace metrics.
   * @param {!Array<!Blockly.utils.Rect>} savedPositions List of rectangles that
   *     are already on the workspace.
   */
  position(metrics) {
    this.container.style.height = metrics.viewMetrics.height + 'px';
    this.container.style.width = this.workspace.getToolboxWidth() + 'px';
    this.container.style.left = '0px';
    this.container.style.top = '0px';
    this.container.style.position = 'absolute';
    // Should be above toolbox but under drag surface
    this.container.style.zIndex = '75';
  }

  /**
   * IPositionable method
   * Returns the bounding rectangle of the UI element in pixel units relative to
   * the Blockly injection div.
   * @return {?Blockly.utils.Rect} The UI elements’s bounding box. Null if
   *   bounding box should be ignored by other UI elements.
   */
  getBoundingRectangle() {
    return this.getClientRect();
  }

  /**
   * IDragTarget method
   * Returns the bounding rectangle of the drag target area in pixel units
   * relative to the Blockly injection div.
   * @return {?Blockly.utils.Rect} The component's bounding box. Null if drag
   *   target area should be ignored.
   */
  getClientRect() {
    const toolboxRect = this.container.getBoundingClientRect();
    return new Blockly.utils.Rect(
      toolboxRect.top,
      toolboxRect.bottom,
      toolboxRect.left,
      toolboxRect.right
    );
  }

  /**
   * Flip the lid open or shut.
   * @param {boolean} state True if open.
   */
  setLidOpen(state) {
    if (this.isLidOpen === state) {
      return;
    }
    clearTimeout(this.lidTask_);
    this.isLidOpen = state;
    this.animateLid_();
  }

  /**
   * Rotate the lid open or closed by one step.  Then wait and recurse.
   * @private
   */
  animateLid_() {
    var frames = this.ANIMATION_FRAMES_;

    var delta = 1 / (frames + 1);
    this.lidOpen_ += this.isLidOpen ? delta : -delta;
    this.lidOpen_ = Math.min(this.lidOpen_, 1);
    this.lidOpen_ = Math.max(this.lidOpen_, 0);

    this.setLidAngle_(this.lidOpen_ * this.MAX_LID_ANGLE_);

    var minOpacity = this.OPACITY_MIN_;
    var maxOpacity = this.OPACITY_MAX_;
    // Linear interpolation between min and max.
    var opacity = minOpacity + this.lidOpen_ * (maxOpacity - minOpacity);
    this.svgGroup_.style.opacity = opacity;

    if (this.lidOpen_ >= 0 && this.lidOpen_ < 1) {
      this.lidTask_ = setTimeout(
        this.animateLid_.bind(this),
        this.ANIMATION_LENGTH_ / frames
      );
    }
  }

  /** Open the lid the opposite direction
   * @override
   */
  setLidAngle_(lidAngle) {
    var openAtRight = !this.workspace.RTL;
    this.svgLid_.setAttribute(
      'transform',
      'rotate(' +
        (openAtRight ? -lidAngle : lidAngle) +
        ',' +
        (openAtRight ? 4 : this.WIDTH_ - 4) +
        ',' +
        (this.LID_HEIGHT_ - 2) +
        ')'
    );
  }

  /**
   * IDragTarget method
   * Handles when a cursor with a block or bubble enters this drag target.
   * @param {!Blockly.IDraggable} _dragElement The block or bubble currently being
   *   dragged.
   */
  onDragEnter(_dragElement) {
    this.setLidOpen(_dragElement.isDeletable());
  }

  /**
   * IDragTarget method
   * Handles when a cursor with a block or bubble is dragged over this drag
   * target.
   * @param {!Blockly.IDraggable} _dragElement The block or bubble currently being
   *   dragged.
   */
  onDragOver(_dragElement) {}

  /**
   * IDragTarget method
   * Handles when a cursor with a block or bubble exits this drag target.
   * @param {!Blockly.IDraggable} _dragElement The block or bubble currently being
   *   dragged.
   */
  onDragExit(_dragElement) {
    this.setLidOpen(false);
  }

  /**
   * IDragTarget method
   * Handles when a block or bubble is dropped on this component.
   * Should not handle delete here.
   * @param {!Blockly.IDraggable} _dragElement The block or bubble currently being
   *   dragged.
   */
  onDrop(_dragElement) {
    this.setLidOpen(false);
  }

  /**
   * IDragTarget method
   * Returns whether the provided block or bubble should not be moved after being
   * dropped on this component. If true, the element will return to where it was
   * when the drag started.
   * @param {!Blockly.IDraggable} _dragElement The block or bubble currently being
   *   dragged.
   * @return {boolean} Whether the block or bubble provided should be returned to
   *     drag start.
   */
  shouldPreventMove(_dragElement) {
    return false;
  }
}
