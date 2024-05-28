'use strict';

var obsidian = require('obsidian');
var language = require('@codemirror/language');
var state = require('@codemirror/state');
var view = require('@codemirror/view');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function getDocumentTitle(state) {
    return state.field(obsidian.editorViewField).getDisplayText();
}

function getEditorViewFromEditorState(state) {
    return state.field(obsidian.editorEditorField);
}

function cleanTitle(title) {
    return title
        .trim()
        .replace(/^#+(\s)/, "$1")
        .replace(/^([-+*]|\d+\.)(\s)/, "$2")
        .trim();
}

class CollectBreadcrumbs {
    constructor(getDocumentTitle) {
        this.getDocumentTitle = getDocumentTitle;
    }
    collectBreadcrumbs(state, pos) {
        const breadcrumbs = [
            { title: this.getDocumentTitle.getDocumentTitle(state), pos: null },
        ];
        const posLine = state.doc.lineAt(pos);
        for (let i = 1; i < posLine.number; i++) {
            const line = state.doc.line(i);
            const f = language.foldable(state, line.from, line.to);
            if (f && f.to > posLine.from) {
                breadcrumbs.push({ title: cleanTitle(line.text), pos: line.from });
            }
        }
        breadcrumbs.push({
            title: cleanTitle(posLine.text),
            pos: posLine.from,
        });
        return breadcrumbs;
    }
}

function calculateVisibleContentBoundariesViolation(tr, hiddenRanges) {
    let touchedBefore = false;
    let touchedAfter = false;
    let touchedInside = false;
    const t = (f, t) => Boolean(tr.changes.touchesRange(f, t));
    if (hiddenRanges.length === 2) {
        const [a, b] = hiddenRanges;
        touchedBefore = t(a.from, a.to);
        touchedInside = t(a.to + 1, b.from - 1);
        touchedAfter = t(b.from, b.to);
    }
    if (hiddenRanges.length === 1) {
        const [a] = hiddenRanges;
        if (a.from === 0) {
            touchedBefore = t(a.from, a.to);
            touchedInside = t(a.to + 1, tr.newDoc.length);
        }
        else {
            touchedInside = t(0, a.from - 1);
            touchedAfter = t(a.from, a.to);
        }
    }
    const touchedOutside = touchedBefore || touchedAfter;
    const res = {
        touchedOutside,
        touchedBefore,
        touchedAfter,
        touchedInside,
    };
    return res;
}

class DetectRangeBeforeVisibleRangeChanged {
    constructor(calculateHiddenContentRanges, rangeBeforeVisibleRangeChanged) {
        this.calculateHiddenContentRanges = calculateHiddenContentRanges;
        this.rangeBeforeVisibleRangeChanged = rangeBeforeVisibleRangeChanged;
        this.detectVisibleContentBoundariesViolation = (tr) => {
            const hiddenRanges = this.calculateHiddenContentRanges.calculateHiddenContentRanges(tr.startState);
            const { touchedBefore, touchedInside } = calculateVisibleContentBoundariesViolation(tr, hiddenRanges);
            if (touchedBefore && !touchedInside) {
                setImmediate(() => {
                    this.rangeBeforeVisibleRangeChanged.rangeBeforeVisibleRangeChanged(tr.state);
                });
            }
            return null;
        };
    }
    getExtension() {
        return state.EditorState.transactionExtender.of(this.detectVisibleContentBoundariesViolation);
    }
}

function renderHeader(doc, ctx) {
    const { breadcrumbs, onClick } = ctx;
    const h = doc.createElement("div");
    h.classList.add("zoom-plugin-header");
    for (let i = 0; i < breadcrumbs.length; i++) {
        if (i > 0) {
            const d = doc.createElement("span");
            d.classList.add("zoom-plugin-delimiter");
            d.innerText = ">";
            h.append(d);
        }
        const breadcrumb = breadcrumbs[i];
        const b = doc.createElement("a");
        b.classList.add("zoom-plugin-title");
        b.dataset.pos = String(breadcrumb.pos);
        b.appendChild(doc.createTextNode(breadcrumb.title));
        b.addEventListener("click", (e) => {
            e.preventDefault();
            const t = e.target;
            const pos = t.dataset.pos;
            onClick(pos === "null" ? null : Number(pos));
        });
        h.appendChild(b);
    }
    return h;
}

const showHeaderEffect = state.StateEffect.define();
const hideHeaderEffect = state.StateEffect.define();
const headerState = state.StateField.define({
    create: () => null,
    update: (value, tr) => {
        for (const e of tr.effects) {
            if (e.is(showHeaderEffect)) {
                value = e.value;
            }
            if (e.is(hideHeaderEffect)) {
                value = null;
            }
        }
        return value;
    },
    provide: (f) => view.showPanel.from(f, (state) => {
        if (!state) {
            return null;
        }
        return (view) => ({
            top: true,
            dom: renderHeader(view.dom.ownerDocument, {
                breadcrumbs: state.breadcrumbs,
                onClick: (pos) => state.onClick(view, pos),
            }),
        });
    }),
});
class RenderNavigationHeader {
    constructor(logger, zoomIn, zoomOut) {
        this.logger = logger;
        this.zoomIn = zoomIn;
        this.zoomOut = zoomOut;
        this.onClick = (view, pos) => {
            if (pos === null) {
                this.zoomOut.zoomOut(view);
            }
            else {
                this.zoomIn.zoomIn(view, pos);
            }
        };
    }
    getExtension() {
        return headerState;
    }
    showHeader(view, breadcrumbs) {
        const l = this.logger.bind("ToggleNavigationHeaderLogic:showHeader");
        l("show header");
        view.dispatch({
            effects: [
                showHeaderEffect.of({
                    breadcrumbs,
                    onClick: this.onClick,
                }),
            ],
        });
    }
    hideHeader(view) {
        const l = this.logger.bind("ToggleNavigationHeaderLogic:hideHeader");
        l("hide header");
        view.dispatch({
            effects: [hideHeaderEffect.of()],
        });
    }
}

class ShowHeaderAfterZoomIn {
    constructor(notifyAfterZoomIn, collectBreadcrumbs, renderNavigationHeader) {
        this.notifyAfterZoomIn = notifyAfterZoomIn;
        this.collectBreadcrumbs = collectBreadcrumbs;
        this.renderNavigationHeader = renderNavigationHeader;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.notifyAfterZoomIn.notifyAfterZoomIn((view, pos) => {
                const breadcrumbs = this.collectBreadcrumbs.collectBreadcrumbs(view.state, pos);
                this.renderNavigationHeader.showHeader(view, breadcrumbs);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
class HideHeaderAfterZoomOut {
    constructor(notifyAfterZoomOut, renderNavigationHeader) {
        this.notifyAfterZoomOut = notifyAfterZoomOut;
        this.renderNavigationHeader = renderNavigationHeader;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.notifyAfterZoomOut.notifyAfterZoomOut((view) => {
                this.renderNavigationHeader.hideHeader(view);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
class UpdateHeaderAfterRangeBeforeVisibleRangeChanged {
    constructor(plugin, calculateHiddenContentRanges, calculateVisibleContentRange, collectBreadcrumbs, renderNavigationHeader) {
        this.plugin = plugin;
        this.calculateHiddenContentRanges = calculateHiddenContentRanges;
        this.calculateVisibleContentRange = calculateVisibleContentRange;
        this.collectBreadcrumbs = collectBreadcrumbs;
        this.renderNavigationHeader = renderNavigationHeader;
        this.detectRangeBeforeVisibleRangeChanged = new DetectRangeBeforeVisibleRangeChanged(this.calculateHiddenContentRanges, {
            rangeBeforeVisibleRangeChanged: (state) => this.rangeBeforeVisibleRangeChanged(state),
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(this.detectRangeBeforeVisibleRangeChanged.getExtension());
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    rangeBeforeVisibleRangeChanged(state) {
        const view = getEditorViewFromEditorState(state);
        const pos = this.calculateVisibleContentRange.calculateVisibleContentRange(state).from;
        const breadcrumbs = this.collectBreadcrumbs.collectBreadcrumbs(state, pos);
        this.renderNavigationHeader.showHeader(view, breadcrumbs);
    }
}
class HeaderNavigationFeature {
    constructor(plugin, logger, calculateHiddenContentRanges, calculateVisibleContentRange, zoomIn, zoomOut, notifyAfterZoomIn, notifyAfterZoomOut) {
        this.plugin = plugin;
        this.logger = logger;
        this.calculateHiddenContentRanges = calculateHiddenContentRanges;
        this.calculateVisibleContentRange = calculateVisibleContentRange;
        this.zoomIn = zoomIn;
        this.zoomOut = zoomOut;
        this.notifyAfterZoomIn = notifyAfterZoomIn;
        this.notifyAfterZoomOut = notifyAfterZoomOut;
        this.collectBreadcrumbs = new CollectBreadcrumbs({
            getDocumentTitle: getDocumentTitle,
        });
        this.renderNavigationHeader = new RenderNavigationHeader(this.logger, this.zoomIn, this.zoomOut);
        this.showHeaderAfterZoomIn = new ShowHeaderAfterZoomIn(this.notifyAfterZoomIn, this.collectBreadcrumbs, this.renderNavigationHeader);
        this.hideHeaderAfterZoomOut = new HideHeaderAfterZoomOut(this.notifyAfterZoomOut, this.renderNavigationHeader);
        this.updateHeaderAfterRangeBeforeVisibleRangeChanged = new UpdateHeaderAfterRangeBeforeVisibleRangeChanged(this.plugin, this.calculateHiddenContentRanges, this.calculateVisibleContentRange, this.collectBreadcrumbs, this.renderNavigationHeader);
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(this.renderNavigationHeader.getExtension());
            this.showHeaderAfterZoomIn.load();
            this.hideHeaderAfterZoomOut.load();
            this.updateHeaderAfterRangeBeforeVisibleRangeChanged.load();
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showHeaderAfterZoomIn.unload();
            this.hideHeaderAfterZoomOut.unload();
            this.updateHeaderAfterRangeBeforeVisibleRangeChanged.unload();
        });
    }
}

function calculateLimitedSelection(selection, from, to) {
    const mainSelection = selection.main;
    const newSelection = state.EditorSelection.range(Math.min(Math.max(mainSelection.anchor, from), to), Math.min(Math.max(mainSelection.head, from), to), mainSelection.goalColumn);
    const shouldUpdate = selection.ranges.length > 1 ||
        newSelection.anchor !== mainSelection.anchor ||
        newSelection.head !== mainSelection.head;
    return shouldUpdate ? newSelection : null;
}

const zoomInEffect = state.StateEffect.define();
const zoomOutEffect = state.StateEffect.define();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isZoomInEffect(e) {
    return e.is(zoomInEffect);
}

class LimitSelectionOnZoomingIn {
    constructor(logger) {
        this.logger = logger;
        this.limitSelectionOnZoomingIn = (tr) => {
            const e = tr.effects.find(isZoomInEffect);
            if (!e) {
                return tr;
            }
            const newSelection = calculateLimitedSelection(tr.newSelection, e.value.from, e.value.to);
            if (!newSelection) {
                return tr;
            }
            this.logger.log("LimitSelectionOnZoomingIn:limitSelectionOnZoomingIn", "limiting selection", newSelection.toJSON());
            return [tr, { selection: newSelection }];
        };
    }
    getExtension() {
        return state.EditorState.transactionFilter.of(this.limitSelectionOnZoomingIn);
    }
}

class LimitSelectionWhenZoomedIn {
    constructor(logger, calculateVisibleContentRange) {
        this.logger = logger;
        this.calculateVisibleContentRange = calculateVisibleContentRange;
        this.limitSelectionWhenZoomedIn = (tr) => {
            if (!tr.selection || !tr.isUserEvent("select")) {
                return tr;
            }
            const range = this.calculateVisibleContentRange.calculateVisibleContentRange(tr.state);
            if (!range) {
                return tr;
            }
            const newSelection = calculateLimitedSelection(tr.newSelection, range.from, range.to);
            if (!newSelection) {
                return tr;
            }
            this.logger.log("LimitSelectionWhenZoomedIn:limitSelectionWhenZoomedIn", "limiting selection", newSelection.toJSON());
            return [tr, { selection: newSelection }];
        };
    }
    getExtension() {
        return state.EditorState.transactionFilter.of(this.limitSelectionWhenZoomedIn);
    }
}

class LimitSelectionFeature {
    constructor(plugin, logger, calculateVisibleContentRange) {
        this.plugin = plugin;
        this.logger = logger;
        this.calculateVisibleContentRange = calculateVisibleContentRange;
        this.limitSelectionOnZoomingIn = new LimitSelectionOnZoomingIn(this.logger);
        this.limitSelectionWhenZoomedIn = new LimitSelectionWhenZoomedIn(this.logger, this.calculateVisibleContentRange);
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(this.limitSelectionOnZoomingIn.getExtension());
            this.plugin.registerEditorExtension(this.limitSelectionWhenZoomedIn.getExtension());
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

class ListsStylesFeature {
    constructor(settings) {
        this.settings = settings;
        this.onZoomOnClickSettingChange = (zoomOnClick) => {
            if (zoomOnClick) {
                this.addZoomStyles();
            }
            else {
                this.removeZoomStyles();
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.settings.zoomOnClick) {
                this.addZoomStyles();
            }
            this.settings.onChange("zoomOnClick", this.onZoomOnClickSettingChange);
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings.removeCallback("zoomOnClick", this.onZoomOnClickSettingChange);
            this.removeZoomStyles();
        });
    }
    addZoomStyles() {
        document.body.classList.add("zoom-plugin-bls-zoom");
    }
    removeZoomStyles() {
        document.body.classList.remove("zoom-plugin-bls-zoom");
    }
}

class DetectVisibleContentBoundariesViolation {
    constructor(calculateHiddenContentRanges, visibleContentBoundariesViolated) {
        this.calculateHiddenContentRanges = calculateHiddenContentRanges;
        this.visibleContentBoundariesViolated = visibleContentBoundariesViolated;
        this.detectVisibleContentBoundariesViolation = (tr) => {
            const hiddenRanges = this.calculateHiddenContentRanges.calculateHiddenContentRanges(tr.startState);
            const { touchedOutside, touchedInside } = calculateVisibleContentBoundariesViolation(tr, hiddenRanges);
            if (touchedOutside && touchedInside) {
                setImmediate(() => {
                    this.visibleContentBoundariesViolated.visibleContentBoundariesViolated(tr.state);
                });
            }
            return null;
        };
    }
    getExtension() {
        return state.EditorState.transactionExtender.of(this.detectVisibleContentBoundariesViolation);
    }
}

class ResetZoomWhenVisibleContentBoundariesViolatedFeature {
    constructor(plugin, logger, calculateHiddenContentRanges, zoomOut) {
        this.plugin = plugin;
        this.logger = logger;
        this.calculateHiddenContentRanges = calculateHiddenContentRanges;
        this.zoomOut = zoomOut;
        this.detectVisibleContentBoundariesViolation = new DetectVisibleContentBoundariesViolation(this.calculateHiddenContentRanges, {
            visibleContentBoundariesViolated: (state) => this.visibleContentBoundariesViolated(state),
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(this.detectVisibleContentBoundariesViolation.getExtension());
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    visibleContentBoundariesViolated(state) {
        const l = this.logger.bind("ResetZoomWhenVisibleContentBoundariesViolatedFeature:visibleContentBoundariesViolated");
        l("visible content boundaries violated, zooming out");
        this.zoomOut.zoomOut(getEditorViewFromEditorState(state));
    }
}

class ObsidianZoomPluginSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin, settings) {
        super(app, plugin);
        this.settings = settings;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName("Zooming in when clicking on the bullet")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.zoomOnClick).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.zoomOnClick = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Debug mode")
            .setDesc("Open DevTools (Command+Option+I or Control+Shift+I) to copy the debug logs.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.debug).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.debug = value;
                yield this.settings.save();
            }));
        });
    }
}
class SettingsTabFeature {
    constructor(plugin, settings) {
        this.plugin = plugin;
        this.settings = settings;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addSettingTab(new ObsidianZoomPluginSettingTab(this.plugin.app, this.plugin, this.settings));
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

function isFoldingEnabled(app) {
    const config = Object.assign({ foldHeading: true, foldIndent: true }, app.vault.config);
    return config.foldHeading && config.foldIndent;
}

class CalculateRangeForZooming {
    calculateRangeForZooming(state, pos) {
        const line = state.doc.lineAt(pos);
        const foldRange = language.foldable(state, line.from, line.to);
        if (!foldRange && /^\s*([-*+]|\d+\.)\s+/.test(line.text)) {
            return { from: line.from, to: line.to };
        }
        if (!foldRange) {
            return null;
        }
        return { from: line.from, to: foldRange.to };
    }
}

function rangeSetToArray(rs) {
    const res = [];
    const i = rs.iter();
    while (i.value !== null) {
        res.push({ from: i.from, to: i.to });
        i.next();
    }
    return res;
}

const zoomMarkHidden = view.Decoration.replace({ block: true });
const zoomStateField = state.StateField.define({
    create: () => {
        return view.Decoration.none;
    },
    update: (value, tr) => {
        value = value.map(tr.changes);
        for (const e of tr.effects) {
            if (e.is(zoomInEffect)) {
                value = value.update({ filter: () => false });
                if (e.value.from > 0) {
                    value = value.update({
                        add: [zoomMarkHidden.range(0, e.value.from - 1)],
                    });
                }
                if (e.value.to < tr.newDoc.length) {
                    value = value.update({
                        add: [zoomMarkHidden.range(e.value.to + 1, tr.newDoc.length)],
                    });
                }
            }
            if (e.is(zoomOutEffect)) {
                value = value.update({ filter: () => false });
            }
        }
        return value;
    },
    provide: (zoomStateField) => view.EditorView.decorations.from(zoomStateField),
});
class KeepOnlyZoomedContentVisible {
    constructor(logger) {
        this.logger = logger;
    }
    getExtension() {
        return zoomStateField;
    }
    calculateHiddenContentRanges(state) {
        return rangeSetToArray(state.field(zoomStateField));
    }
    calculateVisibleContentRange(state) {
        const hidden = this.calculateHiddenContentRanges(state);
        if (hidden.length === 1) {
            const [a] = hidden;
            if (a.from === 0) {
                return { from: a.to + 1, to: state.doc.length };
            }
            else {
                return { from: 0, to: a.from - 1 };
            }
        }
        if (hidden.length === 2) {
            const [a, b] = hidden;
            return { from: a.to + 1, to: b.from - 1 };
        }
        return null;
    }
    keepOnlyZoomedContentVisible(view$1, from, to) {
        const effect = zoomInEffect.of({ from, to });
        this.logger.log("KeepOnlyZoomedContent:keepOnlyZoomedContentVisible", "keep only zoomed content visible", effect.value.from, effect.value.to);
        view$1.dispatch({
            effects: [effect],
        });
        view$1.dispatch({
            effects: [
                view.EditorView.scrollIntoView(view$1.state.selection.main, {
                    y: "start",
                }),
            ],
        });
    }
    showAllContent(view$1) {
        this.logger.log("KeepOnlyZoomedContent:showAllContent", "show all content");
        view$1.dispatch({ effects: [zoomOutEffect.of()] });
        view$1.dispatch({
            effects: [
                view.EditorView.scrollIntoView(view$1.state.selection.main, {
                    y: "center",
                }),
            ],
        });
    }
}

class ZoomFeature {
    constructor(plugin, logger) {
        this.plugin = plugin;
        this.logger = logger;
        this.zoomInCallbacks = [];
        this.zoomOutCallbacks = [];
        this.keepOnlyZoomedContentVisible = new KeepOnlyZoomedContentVisible(this.logger);
        this.calculateRangeForZooming = new CalculateRangeForZooming();
    }
    calculateVisibleContentRange(state) {
        return this.keepOnlyZoomedContentVisible.calculateVisibleContentRange(state);
    }
    calculateHiddenContentRanges(state) {
        return this.keepOnlyZoomedContentVisible.calculateHiddenContentRanges(state);
    }
    notifyAfterZoomIn(cb) {
        this.zoomInCallbacks.push(cb);
    }
    notifyAfterZoomOut(cb) {
        this.zoomOutCallbacks.push(cb);
    }
    zoomIn(view, pos) {
        const l = this.logger.bind("ZoomFeature:zoomIn");
        l("zooming in");
        if (!isFoldingEnabled(this.plugin.app)) {
            new obsidian.Notice(`In order to zoom, you must first enable "Fold heading" and "Fold indent" under Settings -> Editor`);
            return;
        }
        const range = this.calculateRangeForZooming.calculateRangeForZooming(view.state, pos);
        if (!range) {
            l("unable to calculate range for zooming");
            return;
        }
        this.keepOnlyZoomedContentVisible.keepOnlyZoomedContentVisible(view, range.from, range.to);
        for (const cb of this.zoomInCallbacks) {
            cb(view, pos);
        }
    }
    zoomOut(view) {
        const l = this.logger.bind("ZoomFeature:zoomIn");
        l("zooming out");
        this.keepOnlyZoomedContentVisible.showAllContent(view);
        for (const cb of this.zoomOutCallbacks) {
            cb(view);
        }
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(this.keepOnlyZoomedContentVisible.getExtension());
            this.plugin.addCommand({
                id: "zoom-in",
                name: "Zoom in",
                icon: "obsidian-zoom-zoom-in",
                editorCallback: (editor) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const view = editor.cm;
                    this.zoomIn(view, view.state.selection.main.head);
                },
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: ".",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "zoom-out",
                name: "Zoom out the entire document",
                icon: "obsidian-zoom-zoom-out",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                editorCallback: (editor) => this.zoomOut(editor.cm),
                hotkeys: [
                    {
                        modifiers: ["Mod", "Shift"],
                        key: ".",
                    },
                ],
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

function isBulletPoint(e) {
    return (e instanceof HTMLSpanElement &&
        (e.classList.contains("list-bullet") ||
            e.classList.contains("cm-formatting-list")));
}

class DetectClickOnBullet {
    constructor(settings, clickOnBullet) {
        this.settings = settings;
        this.clickOnBullet = clickOnBullet;
        this.detectClickOnBullet = (e, view) => {
            if (!this.settings.zoomOnClick ||
                !(e.target instanceof HTMLElement) ||
                !isBulletPoint(e.target)) {
                return;
            }
            const pos = view.posAtDOM(e.target);
            this.clickOnBullet.clickOnBullet(view, pos);
        };
    }
    getExtension() {
        return view.EditorView.domEventHandlers({
            click: this.detectClickOnBullet,
        });
    }
    moveCursorToLineEnd(view, pos) {
        const line = view.state.doc.lineAt(pos);
        view.dispatch({
            selection: state.EditorSelection.cursor(line.to),
        });
    }
}

class ZoomOnClickFeature {
    constructor(plugin, settings, zoomIn) {
        this.plugin = plugin;
        this.settings = settings;
        this.zoomIn = zoomIn;
        this.detectClickOnBullet = new DetectClickOnBullet(this.settings, {
            clickOnBullet: (view, pos) => this.clickOnBullet(view, pos),
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(this.detectClickOnBullet.getExtension());
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    clickOnBullet(view, pos) {
        this.detectClickOnBullet.moveCursorToLineEnd(view, pos);
        this.zoomIn.zoomIn(view, pos);
    }
}

class LoggerService {
    constructor(settings) {
        this.settings = settings;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log(method, ...args) {
        if (!this.settings.debug) {
            return;
        }
        console.info(method, ...args);
    }
    bind(method) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (...args) => this.log(method, ...args);
    }
}

const DEFAULT_SETTINGS = {
    debug: false,
    zoomOnClick: true,
};
class SettingsService {
    constructor(storage) {
        this.storage = storage;
        this.handlers = new Map();
    }
    get debug() {
        return this.values.debug;
    }
    set debug(value) {
        this.set("debug", value);
    }
    get zoomOnClick() {
        return this.values.zoomOnClick;
    }
    set zoomOnClick(value) {
        this.set("zoomOnClick", value);
    }
    onChange(key, cb) {
        if (!this.handlers.has(key)) {
            this.handlers.set(key, new Set());
        }
        this.handlers.get(key).add(cb);
    }
    removeCallback(key, cb) {
        const handlers = this.handlers.get(key);
        if (handlers) {
            handlers.delete(cb);
        }
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.values = Object.assign({}, DEFAULT_SETTINGS, yield this.storage.loadData());
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storage.saveData(this.values);
        });
    }
    set(key, value) {
        this.values[key] = value;
        const callbacks = this.handlers.get(key);
        if (!callbacks) {
            return;
        }
        for (const cb of callbacks.values()) {
            cb(value);
        }
    }
}

obsidian.addIcon("obsidian-zoom-zoom-in", `<path fill="currentColor" stroke="currentColor" stroke-width="2" d="M42,6C23.2,6,8,21.2,8,40s15.2,34,34,34c7.4,0,14.3-2.4,19.9-6.4l26.3,26.3l5.6-5.6l-26-26.1c5.1-6,8.2-13.7,8.2-22.1 C76,21.2,60.8,6,42,6z M42,10c16.6,0,30,13.4,30,30S58.6,70,42,70S12,56.6,12,40S25.4,10,42,10z"></path><line x1="24" y1="40" x2="60" y2="40" stroke="currentColor" stroke-width="10"></line><line x1="42" y1="20" x2="42" y2="60" stroke="currentColor" stroke-width="10"></line>`);
obsidian.addIcon("obsidian-zoom-zoom-out", `<path fill="currentColor" stroke="currentColor" stroke-width="2" d="M42,6C23.2,6,8,21.2,8,40s15.2,34,34,34c7.4,0,14.3-2.4,19.9-6.4l26.3,26.3l5.6-5.6l-26-26.1c5.1-6,8.2-13.7,8.2-22.1 C76,21.2,60.8,6,42,6z M42,10c16.6,0,30,13.4,30,30S58.6,70,42,70S12,56.6,12,40S25.4,10,42,10z"></path><line x1="24" y1="40" x2="60" y2="40" stroke="currentColor" stroke-width="10"></line>`);
class ObsidianZoomPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Loading obsidian-zoom`);
            if (this.isLegacyEditorEnabled()) {
                new obsidian.Notice(`Zoom plugin does not support legacy editor mode starting from version 0.2. Please disable the "Use legacy editor" option or manually install version 0.1 of Zoom plugin.`, 30000);
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            window.ObsidianZoomPlugin = this;
            const settings = new SettingsService(this);
            yield settings.load();
            const logger = new LoggerService(settings);
            const settingsTabFeature = new SettingsTabFeature(this, settings);
            this.zoomFeature = new ZoomFeature(this, logger);
            const limitSelectionFeature = new LimitSelectionFeature(this, logger, this.zoomFeature);
            const resetZoomWhenVisibleContentBoundariesViolatedFeature = new ResetZoomWhenVisibleContentBoundariesViolatedFeature(this, logger, this.zoomFeature, this.zoomFeature);
            const headerNavigationFeature = new HeaderNavigationFeature(this, logger, this.zoomFeature, this.zoomFeature, this.zoomFeature, this.zoomFeature, this.zoomFeature, this.zoomFeature);
            const zoomOnClickFeature = new ZoomOnClickFeature(this, settings, this.zoomFeature);
            const listsStylesFeature = new ListsStylesFeature(settings);
            this.features = [
                settingsTabFeature,
                this.zoomFeature,
                limitSelectionFeature,
                resetZoomWhenVisibleContentBoundariesViolatedFeature,
                headerNavigationFeature,
                zoomOnClickFeature,
                listsStylesFeature,
            ];
            for (const feature of this.features) {
                yield feature.load();
            }
        });
    }
    onunload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Unloading obsidian-zoom`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete window.ObsidianZoomPlugin;
            for (const feature of this.features) {
                yield feature.unload();
            }
        });
    }
    getZoomRange(editor) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cm = editor.cm;
        const range = this.zoomFeature.calculateVisibleContentRange(cm.state);
        if (!range) {
            return null;
        }
        const from = cm.state.doc.lineAt(range.from);
        const to = cm.state.doc.lineAt(range.to);
        return {
            from: {
                line: from.number - 1,
                ch: range.from - from.from,
            },
            to: {
                line: to.number - 1,
                ch: range.to - to.from,
            },
        };
    }
    zoomOut(editor) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cm = editor.cm;
        this.zoomFeature.zoomOut(cm);
    }
    zoomIn(editor, line) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cm = editor.cm;
        const pos = cm.state.doc.line(line + 1).from;
        this.zoomFeature.zoomIn(cm, pos);
    }
    isLegacyEditorEnabled() {
        const config = Object.assign({ legacyEditor: false }, this.app.vault.config);
        return config.legacyEditor;
    }
}

module.exports = ObsidianZoomPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9mZWF0dXJlcy91dGlscy9nZXREb2N1bWVudFRpdGxlLnRzIiwic3JjL2ZlYXR1cmVzL3V0aWxzL2dldEVkaXRvclZpZXdGcm9tRWRpdG9yU3RhdGUudHMiLCJzcmMvbG9naWMvdXRpbHMvY2xlYW5UaXRsZS50cyIsInNyYy9sb2dpYy9Db2xsZWN0QnJlYWRjcnVtYnMudHMiLCJzcmMvbG9naWMvdXRpbHMvY2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0aW9uLnRzIiwic3JjL2xvZ2ljL0RldGVjdFJhbmdlQmVmb3JlVmlzaWJsZVJhbmdlQ2hhbmdlZC50cyIsInNyYy9sb2dpYy91dGlscy9yZW5kZXJIZWFkZXIudHMiLCJzcmMvbG9naWMvUmVuZGVyTmF2aWdhdGlvbkhlYWRlci50cyIsInNyYy9mZWF0dXJlcy9IZWFkZXJOYXZpZ2F0aW9uRmVhdHVyZS50cyIsInNyYy9sb2dpYy91dGlscy9jYWxjdWxhdGVMaW1pdGVkU2VsZWN0aW9uLnRzIiwic3JjL2xvZ2ljL3V0aWxzL2VmZmVjdHMudHMiLCJzcmMvbG9naWMvTGltaXRTZWxlY3Rpb25Pblpvb21pbmdJbi50cyIsInNyYy9sb2dpYy9MaW1pdFNlbGVjdGlvbldoZW5ab29tZWRJbi50cyIsInNyYy9mZWF0dXJlcy9MaW1pdFNlbGVjdGlvbkZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvTGlzdHNTdHlsZXNGZWF0dXJlLnRzIiwic3JjL2xvZ2ljL0RldGVjdFZpc2libGVDb250ZW50Qm91bmRhcmllc1Zpb2xhdGlvbi50cyIsInNyYy9mZWF0dXJlcy9SZXNldFpvb21XaGVuVmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0ZWRGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL1NldHRpbmdzVGFiRmVhdHVyZS50cyIsInNyYy9mZWF0dXJlcy91dGlscy9pc0ZvbGRpbmdFbmFibGVkLnRzIiwic3JjL2xvZ2ljL0NhbGN1bGF0ZVJhbmdlRm9yWm9vbWluZy50cyIsInNyYy9sb2dpYy91dGlscy9yYW5nZVNldFRvQXJyYXkudHMiLCJzcmMvbG9naWMvS2VlcE9ubHlab29tZWRDb250ZW50VmlzaWJsZS50cyIsInNyYy9mZWF0dXJlcy9ab29tRmVhdHVyZS50cyIsInNyYy9sb2dpYy91dGlscy9pc0J1bGxldFBvaW50LnRzIiwic3JjL2xvZ2ljL0RldGVjdENsaWNrT25CdWxsZXQudHMiLCJzcmMvZmVhdHVyZXMvWm9vbU9uQ2xpY2tGZWF0dXJlLnRzIiwic3JjL3NlcnZpY2VzL0xvZ2dlclNlcnZpY2UudHMiLCJzcmMvc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlLnRzIiwic3JjL09ic2lkaWFuWm9vbVBsdWdpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcclxuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XHJcbiAgICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkSW4oc3RhdGUsIHJlY2VpdmVyKSB7XHJcbiAgICBpZiAocmVjZWl2ZXIgPT09IG51bGwgfHwgKHR5cGVvZiByZWNlaXZlciAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcmVjZWl2ZXIgIT09IFwiZnVuY3Rpb25cIikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlICdpbicgb3BlcmF0b3Igb24gbm9uLW9iamVjdFwiKTtcclxuICAgIHJldHVybiB0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyID09PSBzdGF0ZSA6IHN0YXRlLmhhcyhyZWNlaXZlcik7XHJcbn1cclxuIiwiaW1wb3J0IHsgZWRpdG9yVmlld0ZpZWxkIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IEVkaXRvclN0YXRlIH0gZnJvbSBcIkBjb2RlbWlycm9yL3N0YXRlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREb2N1bWVudFRpdGxlKHN0YXRlOiBFZGl0b3JTdGF0ZSkge1xuICByZXR1cm4gc3RhdGUuZmllbGQoZWRpdG9yVmlld0ZpZWxkKS5nZXREaXNwbGF5VGV4dCgpO1xufVxuIiwiaW1wb3J0IHsgZWRpdG9yRWRpdG9yRmllbGQgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsgRWRpdG9yU3RhdGUgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivc3RhdGVcIjtcbmltcG9ydCB7IEVkaXRvclZpZXcgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivdmlld1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdG9yVmlld0Zyb21FZGl0b3JTdGF0ZShzdGF0ZTogRWRpdG9yU3RhdGUpOiBFZGl0b3JWaWV3IHtcbiAgcmV0dXJuIHN0YXRlLmZpZWxkKGVkaXRvckVkaXRvckZpZWxkKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjbGVhblRpdGxlKHRpdGxlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHRpdGxlXG4gICAgLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9eIysoXFxzKS8sIFwiJDFcIilcbiAgICAucmVwbGFjZSgvXihbLSsqXXxcXGQrXFwuKShcXHMpLywgXCIkMlwiKVxuICAgIC50cmltKCk7XG59XG4iLCJpbXBvcnQgeyBmb2xkYWJsZSB9IGZyb20gXCJAY29kZW1pcnJvci9sYW5ndWFnZVwiO1xuaW1wb3J0IHsgRWRpdG9yU3RhdGUgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivc3RhdGVcIjtcblxuaW1wb3J0IHsgY2xlYW5UaXRsZSB9IGZyb20gXCIuL3V0aWxzL2NsZWFuVGl0bGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBCcmVhZGNydW1iIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgcG9zOiBudW1iZXIgfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldERvY3VtZW50VGl0bGUge1xuICBnZXREb2N1bWVudFRpdGxlKHN0YXRlOiBFZGl0b3JTdGF0ZSk6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIENvbGxlY3RCcmVhZGNydW1icyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZ2V0RG9jdW1lbnRUaXRsZTogR2V0RG9jdW1lbnRUaXRsZSkge31cblxuICBwdWJsaWMgY29sbGVjdEJyZWFkY3J1bWJzKHN0YXRlOiBFZGl0b3JTdGF0ZSwgcG9zOiBudW1iZXIpIHtcbiAgICBjb25zdCBicmVhZGNydW1iczogQnJlYWRjcnVtYltdID0gW1xuICAgICAgeyB0aXRsZTogdGhpcy5nZXREb2N1bWVudFRpdGxlLmdldERvY3VtZW50VGl0bGUoc3RhdGUpLCBwb3M6IG51bGwgfSxcbiAgICBdO1xuXG4gICAgY29uc3QgcG9zTGluZSA9IHN0YXRlLmRvYy5saW5lQXQocG9zKTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9zTGluZS5udW1iZXI7IGkrKykge1xuICAgICAgY29uc3QgbGluZSA9IHN0YXRlLmRvYy5saW5lKGkpO1xuICAgICAgY29uc3QgZiA9IGZvbGRhYmxlKHN0YXRlLCBsaW5lLmZyb20sIGxpbmUudG8pO1xuICAgICAgaWYgKGYgJiYgZi50byA+IHBvc0xpbmUuZnJvbSkge1xuICAgICAgICBicmVhZGNydW1icy5wdXNoKHsgdGl0bGU6IGNsZWFuVGl0bGUobGluZS50ZXh0KSwgcG9zOiBsaW5lLmZyb20gfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYnJlYWRjcnVtYnMucHVzaCh7XG4gICAgICB0aXRsZTogY2xlYW5UaXRsZShwb3NMaW5lLnRleHQpLFxuICAgICAgcG9zOiBwb3NMaW5lLmZyb20sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYnJlYWRjcnVtYnM7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRyYW5zYWN0aW9uIH0gZnJvbSBcIkBjb2RlbWlycm9yL3N0YXRlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVWaXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRpb24oXG4gIHRyOiBUcmFuc2FjdGlvbixcbiAgaGlkZGVuUmFuZ2VzOiBBcnJheTx7IGZyb206IG51bWJlcjsgdG86IG51bWJlciB9PlxuKSB7XG4gIGxldCB0b3VjaGVkQmVmb3JlID0gZmFsc2U7XG4gIGxldCB0b3VjaGVkQWZ0ZXIgPSBmYWxzZTtcbiAgbGV0IHRvdWNoZWRJbnNpZGUgPSBmYWxzZTtcblxuICBjb25zdCB0ID0gKGY6IG51bWJlciwgdDogbnVtYmVyKSA9PiBCb29sZWFuKHRyLmNoYW5nZXMudG91Y2hlc1JhbmdlKGYsIHQpKTtcblxuICBpZiAoaGlkZGVuUmFuZ2VzLmxlbmd0aCA9PT0gMikge1xuICAgIGNvbnN0IFthLCBiXSA9IGhpZGRlblJhbmdlcztcblxuICAgIHRvdWNoZWRCZWZvcmUgPSB0KGEuZnJvbSwgYS50byk7XG4gICAgdG91Y2hlZEluc2lkZSA9IHQoYS50byArIDEsIGIuZnJvbSAtIDEpO1xuICAgIHRvdWNoZWRBZnRlciA9IHQoYi5mcm9tLCBiLnRvKTtcbiAgfVxuXG4gIGlmIChoaWRkZW5SYW5nZXMubGVuZ3RoID09PSAxKSB7XG4gICAgY29uc3QgW2FdID0gaGlkZGVuUmFuZ2VzO1xuXG4gICAgaWYgKGEuZnJvbSA9PT0gMCkge1xuICAgICAgdG91Y2hlZEJlZm9yZSA9IHQoYS5mcm9tLCBhLnRvKTtcbiAgICAgIHRvdWNoZWRJbnNpZGUgPSB0KGEudG8gKyAxLCB0ci5uZXdEb2MubGVuZ3RoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdG91Y2hlZEluc2lkZSA9IHQoMCwgYS5mcm9tIC0gMSk7XG4gICAgICB0b3VjaGVkQWZ0ZXIgPSB0KGEuZnJvbSwgYS50byk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgdG91Y2hlZE91dHNpZGUgPSB0b3VjaGVkQmVmb3JlIHx8IHRvdWNoZWRBZnRlcjtcblxuICBjb25zdCByZXMgPSB7XG4gICAgdG91Y2hlZE91dHNpZGUsXG4gICAgdG91Y2hlZEJlZm9yZSxcbiAgICB0b3VjaGVkQWZ0ZXIsXG4gICAgdG91Y2hlZEluc2lkZSxcbiAgfTtcblxuICByZXR1cm4gcmVzO1xufVxuIiwiaW1wb3J0IHsgRWRpdG9yU3RhdGUsIFRyYW5zYWN0aW9uIH0gZnJvbSBcIkBjb2RlbWlycm9yL3N0YXRlXCI7XG5cbmltcG9ydCB7IGNhbGN1bGF0ZVZpc2libGVDb250ZW50Qm91bmRhcmllc1Zpb2xhdGlvbiB9IGZyb20gXCIuL3V0aWxzL2NhbGN1bGF0ZVZpc2libGVDb250ZW50Qm91bmRhcmllc1Zpb2xhdGlvblwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlQmVmb3JlVmlzaWJsZVJhbmdlQ2hhbmdlZCB7XG4gIHJhbmdlQmVmb3JlVmlzaWJsZVJhbmdlQ2hhbmdlZChzdGF0ZTogRWRpdG9yU3RhdGUpOiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENhbGN1bGF0ZUhpZGRlbkNvbnRlbnRSYW5nZXMge1xuICBjYWxjdWxhdGVIaWRkZW5Db250ZW50UmFuZ2VzKFxuICAgIHN0YXRlOiBFZGl0b3JTdGF0ZVxuICApOiB7IGZyb206IG51bWJlcjsgdG86IG51bWJlciB9W10gfCBudWxsO1xufVxuXG5leHBvcnQgY2xhc3MgRGV0ZWN0UmFuZ2VCZWZvcmVWaXNpYmxlUmFuZ2VDaGFuZ2VkIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVIaWRkZW5Db250ZW50UmFuZ2VzOiBDYWxjdWxhdGVIaWRkZW5Db250ZW50UmFuZ2VzLFxuICAgIHByaXZhdGUgcmFuZ2VCZWZvcmVWaXNpYmxlUmFuZ2VDaGFuZ2VkOiBSYW5nZUJlZm9yZVZpc2libGVSYW5nZUNoYW5nZWRcbiAgKSB7fVxuXG4gIGdldEV4dGVuc2lvbigpIHtcbiAgICByZXR1cm4gRWRpdG9yU3RhdGUudHJhbnNhY3Rpb25FeHRlbmRlci5vZihcbiAgICAgIHRoaXMuZGV0ZWN0VmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0aW9uXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZGV0ZWN0VmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0aW9uID0gKHRyOiBUcmFuc2FjdGlvbik6IG51bGwgPT4ge1xuICAgIGNvbnN0IGhpZGRlblJhbmdlcyA9XG4gICAgICB0aGlzLmNhbGN1bGF0ZUhpZGRlbkNvbnRlbnRSYW5nZXMuY2FsY3VsYXRlSGlkZGVuQ29udGVudFJhbmdlcyhcbiAgICAgICAgdHIuc3RhcnRTdGF0ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IHsgdG91Y2hlZEJlZm9yZSwgdG91Y2hlZEluc2lkZSB9ID1cbiAgICAgIGNhbGN1bGF0ZVZpc2libGVDb250ZW50Qm91bmRhcmllc1Zpb2xhdGlvbih0ciwgaGlkZGVuUmFuZ2VzKTtcblxuICAgIGlmICh0b3VjaGVkQmVmb3JlICYmICF0b3VjaGVkSW5zaWRlKSB7XG4gICAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xuICAgICAgICB0aGlzLnJhbmdlQmVmb3JlVmlzaWJsZVJhbmdlQ2hhbmdlZC5yYW5nZUJlZm9yZVZpc2libGVSYW5nZUNoYW5nZWQoXG4gICAgICAgICAgdHIuc3RhdGVcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckhlYWRlcihcbiAgZG9jOiBEb2N1bWVudCxcbiAgY3R4OiB7XG4gICAgYnJlYWRjcnVtYnM6IEFycmF5PHsgdGl0bGU6IHN0cmluZzsgcG9zOiBudW1iZXIgfCBudWxsIH0+O1xuICAgIG9uQ2xpY2s6IChwb3M6IG51bWJlciB8IG51bGwpID0+IHZvaWQ7XG4gIH1cbikge1xuICBjb25zdCB7IGJyZWFkY3J1bWJzLCBvbkNsaWNrIH0gPSBjdHg7XG5cbiAgY29uc3QgaCA9IGRvYy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBoLmNsYXNzTGlzdC5hZGQoXCJ6b29tLXBsdWdpbi1oZWFkZXJcIik7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBicmVhZGNydW1icy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpID4gMCkge1xuICAgICAgY29uc3QgZCA9IGRvYy5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIGQuY2xhc3NMaXN0LmFkZChcInpvb20tcGx1Z2luLWRlbGltaXRlclwiKTtcbiAgICAgIGQuaW5uZXJUZXh0ID0gXCI+XCI7XG4gICAgICBoLmFwcGVuZChkKTtcbiAgICB9XG5cbiAgICBjb25zdCBicmVhZGNydW1iID0gYnJlYWRjcnVtYnNbaV07XG4gICAgY29uc3QgYiA9IGRvYy5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICBiLmNsYXNzTGlzdC5hZGQoXCJ6b29tLXBsdWdpbi10aXRsZVwiKTtcbiAgICBiLmRhdGFzZXQucG9zID0gU3RyaW5nKGJyZWFkY3J1bWIucG9zKTtcbiAgICBiLmFwcGVuZENoaWxkKGRvYy5jcmVhdGVUZXh0Tm9kZShicmVhZGNydW1iLnRpdGxlKSk7XG4gICAgYi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IHQgPSBlLnRhcmdldCBhcyBIVE1MQW5jaG9yRWxlbWVudDtcbiAgICAgIGNvbnN0IHBvcyA9IHQuZGF0YXNldC5wb3M7XG4gICAgICBvbkNsaWNrKHBvcyA9PT0gXCJudWxsXCIgPyBudWxsIDogTnVtYmVyKHBvcykpO1xuICAgIH0pO1xuICAgIGguYXBwZW5kQ2hpbGQoYik7XG4gIH1cblxuICByZXR1cm4gaDtcbn1cbiIsImltcG9ydCB7IFN0YXRlRWZmZWN0LCBTdGF0ZUZpZWxkIH0gZnJvbSBcIkBjb2RlbWlycm9yL3N0YXRlXCI7XG5pbXBvcnQgeyBFZGl0b3JWaWV3LCBzaG93UGFuZWwgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivdmlld1wiO1xuXG5pbXBvcnQgeyByZW5kZXJIZWFkZXIgfSBmcm9tIFwiLi91dGlscy9yZW5kZXJIZWFkZXJcIjtcblxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9Mb2dnZXJTZXJ2aWNlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnJlYWRjcnVtYiB7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHBvczogbnVtYmVyIHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBab29tSW4ge1xuICB6b29tSW4odmlldzogRWRpdG9yVmlldywgcG9zOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFpvb21PdXQge1xuICB6b29tT3V0KHZpZXc6IEVkaXRvclZpZXcpOiB2b2lkO1xufVxuXG5pbnRlcmZhY2UgSGVhZGVyU3RhdGUge1xuICBicmVhZGNydW1iczogQnJlYWRjcnVtYltdO1xuICBvbkNsaWNrOiAodmlldzogRWRpdG9yVmlldywgcG9zOiBudW1iZXIgfCBudWxsKSA9PiB2b2lkO1xufVxuXG5jb25zdCBzaG93SGVhZGVyRWZmZWN0ID0gU3RhdGVFZmZlY3QuZGVmaW5lPEhlYWRlclN0YXRlPigpO1xuY29uc3QgaGlkZUhlYWRlckVmZmVjdCA9IFN0YXRlRWZmZWN0LmRlZmluZTx2b2lkPigpO1xuXG5jb25zdCBoZWFkZXJTdGF0ZSA9IFN0YXRlRmllbGQuZGVmaW5lPEhlYWRlclN0YXRlIHwgbnVsbD4oe1xuICBjcmVhdGU6ICgpID0+IG51bGwsXG4gIHVwZGF0ZTogKHZhbHVlLCB0cikgPT4ge1xuICAgIGZvciAoY29uc3QgZSBvZiB0ci5lZmZlY3RzKSB7XG4gICAgICBpZiAoZS5pcyhzaG93SGVhZGVyRWZmZWN0KSkge1xuICAgICAgICB2YWx1ZSA9IGUudmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoZS5pcyhoaWRlSGVhZGVyRWZmZWN0KSkge1xuICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfSxcbiAgcHJvdmlkZTogKGYpID0+XG4gICAgc2hvd1BhbmVsLmZyb20oZiwgKHN0YXRlKSA9PiB7XG4gICAgICBpZiAoIXN0YXRlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKHZpZXcpID0+ICh7XG4gICAgICAgIHRvcDogdHJ1ZSxcbiAgICAgICAgZG9tOiByZW5kZXJIZWFkZXIodmlldy5kb20ub3duZXJEb2N1bWVudCwge1xuICAgICAgICAgIGJyZWFkY3J1bWJzOiBzdGF0ZS5icmVhZGNydW1icyxcbiAgICAgICAgICBvbkNsaWNrOiAocG9zKSA9PiBzdGF0ZS5vbkNsaWNrKHZpZXcsIHBvcyksXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgfSksXG59KTtcblxuZXhwb3J0IGNsYXNzIFJlbmRlck5hdmlnYXRpb25IZWFkZXIge1xuICBnZXRFeHRlbnNpb24oKSB7XG4gICAgcmV0dXJuIGhlYWRlclN0YXRlO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSB6b29tSW46IFpvb21JbixcbiAgICBwcml2YXRlIHpvb21PdXQ6IFpvb21PdXRcbiAgKSB7fVxuXG4gIHB1YmxpYyBzaG93SGVhZGVyKHZpZXc6IEVkaXRvclZpZXcsIGJyZWFkY3J1bWJzOiBCcmVhZGNydW1iW10pIHtcbiAgICBjb25zdCBsID0gdGhpcy5sb2dnZXIuYmluZChcIlRvZ2dsZU5hdmlnYXRpb25IZWFkZXJMb2dpYzpzaG93SGVhZGVyXCIpO1xuICAgIGwoXCJzaG93IGhlYWRlclwiKTtcblxuICAgIHZpZXcuZGlzcGF0Y2goe1xuICAgICAgZWZmZWN0czogW1xuICAgICAgICBzaG93SGVhZGVyRWZmZWN0Lm9mKHtcbiAgICAgICAgICBicmVhZGNydW1icyxcbiAgICAgICAgICBvbkNsaWNrOiB0aGlzLm9uQ2xpY2ssXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBoaWRlSGVhZGVyKHZpZXc6IEVkaXRvclZpZXcpIHtcbiAgICBjb25zdCBsID0gdGhpcy5sb2dnZXIuYmluZChcIlRvZ2dsZU5hdmlnYXRpb25IZWFkZXJMb2dpYzpoaWRlSGVhZGVyXCIpO1xuICAgIGwoXCJoaWRlIGhlYWRlclwiKTtcblxuICAgIHZpZXcuZGlzcGF0Y2goe1xuICAgICAgZWZmZWN0czogW2hpZGVIZWFkZXJFZmZlY3Qub2YoKV0sXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uQ2xpY2sgPSAodmlldzogRWRpdG9yVmlldywgcG9zOiBudW1iZXIgfCBudWxsKSA9PiB7XG4gICAgaWYgKHBvcyA9PT0gbnVsbCkge1xuICAgICAgdGhpcy56b29tT3V0Lnpvb21PdXQodmlldyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuem9vbUluLnpvb21Jbih2aWV3LCBwb3MpO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IEVkaXRvclN0YXRlIH0gZnJvbSBcIkBjb2RlbWlycm9yL3N0YXRlXCI7XG5pbXBvcnQgeyBFZGl0b3JWaWV3IH0gZnJvbSBcIkBjb2RlbWlycm9yL3ZpZXdcIjtcblxuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gXCIuL0ZlYXR1cmVcIjtcbmltcG9ydCB7IGdldERvY3VtZW50VGl0bGUgfSBmcm9tIFwiLi91dGlscy9nZXREb2N1bWVudFRpdGxlXCI7XG5pbXBvcnQgeyBnZXRFZGl0b3JWaWV3RnJvbUVkaXRvclN0YXRlIH0gZnJvbSBcIi4vdXRpbHMvZ2V0RWRpdG9yVmlld0Zyb21FZGl0b3JTdGF0ZVwiO1xuXG5pbXBvcnQgeyBDb2xsZWN0QnJlYWRjcnVtYnMgfSBmcm9tIFwiLi4vbG9naWMvQ29sbGVjdEJyZWFkY3J1bWJzXCI7XG5pbXBvcnQgeyBEZXRlY3RSYW5nZUJlZm9yZVZpc2libGVSYW5nZUNoYW5nZWQgfSBmcm9tIFwiLi4vbG9naWMvRGV0ZWN0UmFuZ2VCZWZvcmVWaXNpYmxlUmFuZ2VDaGFuZ2VkXCI7XG5pbXBvcnQgeyBSZW5kZXJOYXZpZ2F0aW9uSGVhZGVyIH0gZnJvbSBcIi4uL2xvZ2ljL1JlbmRlck5hdmlnYXRpb25IZWFkZXJcIjtcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvTG9nZ2VyU2VydmljZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFpvb21JbiB7XG4gIHpvb21Jbih2aWV3OiBFZGl0b3JWaWV3LCBwb3M6IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgWm9vbU91dCB7XG4gIHpvb21PdXQodmlldzogRWRpdG9yVmlldyk6IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm90aWZ5QWZ0ZXJab29tSW4ge1xuICBub3RpZnlBZnRlclpvb21JbihjYjogKHZpZXc6IEVkaXRvclZpZXcsIHBvczogbnVtYmVyKSA9PiB2b2lkKTogdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOb3RpZnlBZnRlclpvb21PdXQge1xuICBub3RpZnlBZnRlclpvb21PdXQoY2I6ICh2aWV3OiBFZGl0b3JWaWV3KSA9PiB2b2lkKTogdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDYWxjdWxhdGVIaWRkZW5Db250ZW50UmFuZ2VzIHtcbiAgY2FsY3VsYXRlSGlkZGVuQ29udGVudFJhbmdlcyhcbiAgICBzdGF0ZTogRWRpdG9yU3RhdGVcbiAgKTogeyBmcm9tOiBudW1iZXI7IHRvOiBudW1iZXIgfVtdIHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDYWxjdWxhdGVWaXNpYmxlQ29udGVudFJhbmdlIHtcbiAgY2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRSYW5nZShcbiAgICBzdGF0ZTogRWRpdG9yU3RhdGVcbiAgKTogeyBmcm9tOiBudW1iZXI7IHRvOiBudW1iZXIgfSB8IG51bGw7XG59XG5cbmNsYXNzIFNob3dIZWFkZXJBZnRlclpvb21JbiBpbXBsZW1lbnRzIEZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5vdGlmeUFmdGVyWm9vbUluOiBOb3RpZnlBZnRlclpvb21JbixcbiAgICBwcml2YXRlIGNvbGxlY3RCcmVhZGNydW1iczogQ29sbGVjdEJyZWFkY3J1bWJzLFxuICAgIHByaXZhdGUgcmVuZGVyTmF2aWdhdGlvbkhlYWRlcjogUmVuZGVyTmF2aWdhdGlvbkhlYWRlclxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLm5vdGlmeUFmdGVyWm9vbUluLm5vdGlmeUFmdGVyWm9vbUluKCh2aWV3LCBwb3MpID0+IHtcbiAgICAgIGNvbnN0IGJyZWFkY3J1bWJzID0gdGhpcy5jb2xsZWN0QnJlYWRjcnVtYnMuY29sbGVjdEJyZWFkY3J1bWJzKFxuICAgICAgICB2aWV3LnN0YXRlLFxuICAgICAgICBwb3NcbiAgICAgICk7XG4gICAgICB0aGlzLnJlbmRlck5hdmlnYXRpb25IZWFkZXIuc2hvd0hlYWRlcih2aWV3LCBicmVhZGNydW1icyk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7fVxufVxuXG5jbGFzcyBIaWRlSGVhZGVyQWZ0ZXJab29tT3V0IGltcGxlbWVudHMgRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbm90aWZ5QWZ0ZXJab29tT3V0OiBOb3RpZnlBZnRlclpvb21PdXQsXG4gICAgcHJpdmF0ZSByZW5kZXJOYXZpZ2F0aW9uSGVhZGVyOiBSZW5kZXJOYXZpZ2F0aW9uSGVhZGVyXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMubm90aWZ5QWZ0ZXJab29tT3V0Lm5vdGlmeUFmdGVyWm9vbU91dCgodmlldykgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJOYXZpZ2F0aW9uSGVhZGVyLmhpZGVIZWFkZXIodmlldyk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7fVxufVxuXG5jbGFzcyBVcGRhdGVIZWFkZXJBZnRlclJhbmdlQmVmb3JlVmlzaWJsZVJhbmdlQ2hhbmdlZCBpbXBsZW1lbnRzIEZlYXR1cmUge1xuICBwcml2YXRlIGRldGVjdFJhbmdlQmVmb3JlVmlzaWJsZVJhbmdlQ2hhbmdlZCA9XG4gICAgbmV3IERldGVjdFJhbmdlQmVmb3JlVmlzaWJsZVJhbmdlQ2hhbmdlZChcbiAgICAgIHRoaXMuY2FsY3VsYXRlSGlkZGVuQ29udGVudFJhbmdlcyxcbiAgICAgIHtcbiAgICAgICAgcmFuZ2VCZWZvcmVWaXNpYmxlUmFuZ2VDaGFuZ2VkOiAoc3RhdGUpID0+XG4gICAgICAgICAgdGhpcy5yYW5nZUJlZm9yZVZpc2libGVSYW5nZUNoYW5nZWQoc3RhdGUpLFxuICAgICAgfVxuICAgICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgY2FsY3VsYXRlSGlkZGVuQ29udGVudFJhbmdlczogQ2FsY3VsYXRlSGlkZGVuQ29udGVudFJhbmdlcyxcbiAgICBwcml2YXRlIGNhbGN1bGF0ZVZpc2libGVDb250ZW50UmFuZ2U6IENhbGN1bGF0ZVZpc2libGVDb250ZW50UmFuZ2UsXG4gICAgcHJpdmF0ZSBjb2xsZWN0QnJlYWRjcnVtYnM6IENvbGxlY3RCcmVhZGNydW1icyxcbiAgICBwcml2YXRlIHJlbmRlck5hdmlnYXRpb25IZWFkZXI6IFJlbmRlck5hdmlnYXRpb25IZWFkZXJcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJFZGl0b3JFeHRlbnNpb24oXG4gICAgICB0aGlzLmRldGVjdFJhbmdlQmVmb3JlVmlzaWJsZVJhbmdlQ2hhbmdlZC5nZXRFeHRlbnNpb24oKVxuICAgICk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7fVxuXG4gIHByaXZhdGUgcmFuZ2VCZWZvcmVWaXNpYmxlUmFuZ2VDaGFuZ2VkKHN0YXRlOiBFZGl0b3JTdGF0ZSkge1xuICAgIGNvbnN0IHZpZXcgPSBnZXRFZGl0b3JWaWV3RnJvbUVkaXRvclN0YXRlKHN0YXRlKTtcblxuICAgIGNvbnN0IHBvcyA9XG4gICAgICB0aGlzLmNhbGN1bGF0ZVZpc2libGVDb250ZW50UmFuZ2UuY2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRSYW5nZShcbiAgICAgICAgc3RhdGVcbiAgICAgICkuZnJvbTtcblxuICAgIGNvbnN0IGJyZWFkY3J1bWJzID0gdGhpcy5jb2xsZWN0QnJlYWRjcnVtYnMuY29sbGVjdEJyZWFkY3J1bWJzKHN0YXRlLCBwb3MpO1xuXG4gICAgdGhpcy5yZW5kZXJOYXZpZ2F0aW9uSGVhZGVyLnNob3dIZWFkZXIodmlldywgYnJlYWRjcnVtYnMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBIZWFkZXJOYXZpZ2F0aW9uRmVhdHVyZSBpbXBsZW1lbnRzIEZlYXR1cmUge1xuICBwcml2YXRlIGNvbGxlY3RCcmVhZGNydW1icyA9IG5ldyBDb2xsZWN0QnJlYWRjcnVtYnMoe1xuICAgIGdldERvY3VtZW50VGl0bGU6IGdldERvY3VtZW50VGl0bGUsXG4gIH0pO1xuXG4gIHByaXZhdGUgcmVuZGVyTmF2aWdhdGlvbkhlYWRlciA9IG5ldyBSZW5kZXJOYXZpZ2F0aW9uSGVhZGVyKFxuICAgIHRoaXMubG9nZ2VyLFxuICAgIHRoaXMuem9vbUluLFxuICAgIHRoaXMuem9vbU91dFxuICApO1xuXG4gIHByaXZhdGUgc2hvd0hlYWRlckFmdGVyWm9vbUluID0gbmV3IFNob3dIZWFkZXJBZnRlclpvb21JbihcbiAgICB0aGlzLm5vdGlmeUFmdGVyWm9vbUluLFxuICAgIHRoaXMuY29sbGVjdEJyZWFkY3J1bWJzLFxuICAgIHRoaXMucmVuZGVyTmF2aWdhdGlvbkhlYWRlclxuICApO1xuXG4gIHByaXZhdGUgaGlkZUhlYWRlckFmdGVyWm9vbU91dCA9IG5ldyBIaWRlSGVhZGVyQWZ0ZXJab29tT3V0KFxuICAgIHRoaXMubm90aWZ5QWZ0ZXJab29tT3V0LFxuICAgIHRoaXMucmVuZGVyTmF2aWdhdGlvbkhlYWRlclxuICApO1xuXG4gIHByaXZhdGUgdXBkYXRlSGVhZGVyQWZ0ZXJSYW5nZUJlZm9yZVZpc2libGVSYW5nZUNoYW5nZWQgPVxuICAgIG5ldyBVcGRhdGVIZWFkZXJBZnRlclJhbmdlQmVmb3JlVmlzaWJsZVJhbmdlQ2hhbmdlZChcbiAgICAgIHRoaXMucGx1Z2luLFxuICAgICAgdGhpcy5jYWxjdWxhdGVIaWRkZW5Db250ZW50UmFuZ2VzLFxuICAgICAgdGhpcy5jYWxjdWxhdGVWaXNpYmxlQ29udGVudFJhbmdlLFxuICAgICAgdGhpcy5jb2xsZWN0QnJlYWRjcnVtYnMsXG4gICAgICB0aGlzLnJlbmRlck5hdmlnYXRpb25IZWFkZXJcbiAgICApO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNhbGN1bGF0ZUhpZGRlbkNvbnRlbnRSYW5nZXM6IENhbGN1bGF0ZUhpZGRlbkNvbnRlbnRSYW5nZXMsXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVWaXNpYmxlQ29udGVudFJhbmdlOiBDYWxjdWxhdGVWaXNpYmxlQ29udGVudFJhbmdlLFxuICAgIHByaXZhdGUgem9vbUluOiBab29tSW4sXG4gICAgcHJpdmF0ZSB6b29tT3V0OiBab29tT3V0LFxuICAgIHByaXZhdGUgbm90aWZ5QWZ0ZXJab29tSW46IE5vdGlmeUFmdGVyWm9vbUluLFxuICAgIHByaXZhdGUgbm90aWZ5QWZ0ZXJab29tT3V0OiBOb3RpZnlBZnRlclpvb21PdXRcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJFZGl0b3JFeHRlbnNpb24oXG4gICAgICB0aGlzLnJlbmRlck5hdmlnYXRpb25IZWFkZXIuZ2V0RXh0ZW5zaW9uKClcbiAgICApO1xuXG4gICAgdGhpcy5zaG93SGVhZGVyQWZ0ZXJab29tSW4ubG9hZCgpO1xuICAgIHRoaXMuaGlkZUhlYWRlckFmdGVyWm9vbU91dC5sb2FkKCk7XG4gICAgdGhpcy51cGRhdGVIZWFkZXJBZnRlclJhbmdlQmVmb3JlVmlzaWJsZVJhbmdlQ2hhbmdlZC5sb2FkKCk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5zaG93SGVhZGVyQWZ0ZXJab29tSW4udW5sb2FkKCk7XG4gICAgdGhpcy5oaWRlSGVhZGVyQWZ0ZXJab29tT3V0LnVubG9hZCgpO1xuICAgIHRoaXMudXBkYXRlSGVhZGVyQWZ0ZXJSYW5nZUJlZm9yZVZpc2libGVSYW5nZUNoYW5nZWQudW5sb2FkKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEVkaXRvclNlbGVjdGlvbiB9IGZyb20gXCJAY29kZW1pcnJvci9zdGF0ZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlTGltaXRlZFNlbGVjdGlvbihcbiAgc2VsZWN0aW9uOiBFZGl0b3JTZWxlY3Rpb24sXG4gIGZyb206IG51bWJlcixcbiAgdG86IG51bWJlclxuKSB7XG4gIGNvbnN0IG1haW5TZWxlY3Rpb24gPSBzZWxlY3Rpb24ubWFpbjtcblxuICBjb25zdCBuZXdTZWxlY3Rpb24gPSBFZGl0b3JTZWxlY3Rpb24ucmFuZ2UoXG4gICAgTWF0aC5taW4oTWF0aC5tYXgobWFpblNlbGVjdGlvbi5hbmNob3IsIGZyb20pLCB0byksXG4gICAgTWF0aC5taW4oTWF0aC5tYXgobWFpblNlbGVjdGlvbi5oZWFkLCBmcm9tKSwgdG8pLFxuICAgIG1haW5TZWxlY3Rpb24uZ29hbENvbHVtblxuICApO1xuXG4gIGNvbnN0IHNob3VsZFVwZGF0ZSA9XG4gICAgc2VsZWN0aW9uLnJhbmdlcy5sZW5ndGggPiAxIHx8XG4gICAgbmV3U2VsZWN0aW9uLmFuY2hvciAhPT0gbWFpblNlbGVjdGlvbi5hbmNob3IgfHxcbiAgICBuZXdTZWxlY3Rpb24uaGVhZCAhPT0gbWFpblNlbGVjdGlvbi5oZWFkO1xuXG4gIHJldHVybiBzaG91bGRVcGRhdGUgPyBuZXdTZWxlY3Rpb24gOiBudWxsO1xufVxuIiwiaW1wb3J0IHsgU3RhdGVFZmZlY3QgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivc3RhdGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBab29tSW5SYW5nZSB7XG4gIGZyb206IG51bWJlcjtcbiAgdG86IG51bWJlcjtcbn1cblxuZXhwb3J0IHR5cGUgWm9vbUluU3RhdGVFZmZlY3QgPSBTdGF0ZUVmZmVjdDxab29tSW5SYW5nZT47XG5cbmV4cG9ydCBjb25zdCB6b29tSW5FZmZlY3QgPSBTdGF0ZUVmZmVjdC5kZWZpbmU8Wm9vbUluUmFuZ2U+KCk7XG5cbmV4cG9ydCBjb25zdCB6b29tT3V0RWZmZWN0ID0gU3RhdGVFZmZlY3QuZGVmaW5lPHZvaWQ+KCk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG5leHBvcnQgZnVuY3Rpb24gaXNab29tSW5FZmZlY3QoZTogU3RhdGVFZmZlY3Q8YW55Pik6IGUgaXMgWm9vbUluU3RhdGVFZmZlY3Qge1xuICByZXR1cm4gZS5pcyh6b29tSW5FZmZlY3QpO1xufVxuIiwiaW1wb3J0IHsgRWRpdG9yU3RhdGUsIFRyYW5zYWN0aW9uIH0gZnJvbSBcIkBjb2RlbWlycm9yL3N0YXRlXCI7XG5cbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tIFwic3JjL3NlcnZpY2VzL0xvZ2dlclNlcnZpY2VcIjtcblxuaW1wb3J0IHsgY2FsY3VsYXRlTGltaXRlZFNlbGVjdGlvbiB9IGZyb20gXCIuL3V0aWxzL2NhbGN1bGF0ZUxpbWl0ZWRTZWxlY3Rpb25cIjtcbmltcG9ydCB7IFpvb21JblN0YXRlRWZmZWN0LCBpc1pvb21JbkVmZmVjdCB9IGZyb20gXCIuL3V0aWxzL2VmZmVjdHNcIjtcblxuZXhwb3J0IGNsYXNzIExpbWl0U2VsZWN0aW9uT25ab29taW5nSW4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvZ2dlcjogTG9nZ2VyU2VydmljZSkge31cblxuICBnZXRFeHRlbnNpb24oKSB7XG4gICAgcmV0dXJuIEVkaXRvclN0YXRlLnRyYW5zYWN0aW9uRmlsdGVyLm9mKHRoaXMubGltaXRTZWxlY3Rpb25Pblpvb21pbmdJbik7XG4gIH1cblxuICBwcml2YXRlIGxpbWl0U2VsZWN0aW9uT25ab29taW5nSW4gPSAodHI6IFRyYW5zYWN0aW9uKSA9PiB7XG4gICAgY29uc3QgZSA9IHRyLmVmZmVjdHMuZmluZDxab29tSW5TdGF0ZUVmZmVjdD4oaXNab29tSW5FZmZlY3QpO1xuXG4gICAgaWYgKCFlKSB7XG4gICAgICByZXR1cm4gdHI7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3U2VsZWN0aW9uID0gY2FsY3VsYXRlTGltaXRlZFNlbGVjdGlvbihcbiAgICAgIHRyLm5ld1NlbGVjdGlvbixcbiAgICAgIGUudmFsdWUuZnJvbSxcbiAgICAgIGUudmFsdWUudG9cbiAgICApO1xuXG4gICAgaWYgKCFuZXdTZWxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB0cjtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ2dlci5sb2coXG4gICAgICBcIkxpbWl0U2VsZWN0aW9uT25ab29taW5nSW46bGltaXRTZWxlY3Rpb25Pblpvb21pbmdJblwiLFxuICAgICAgXCJsaW1pdGluZyBzZWxlY3Rpb25cIixcbiAgICAgIG5ld1NlbGVjdGlvbi50b0pTT04oKVxuICAgICk7XG5cbiAgICByZXR1cm4gW3RyLCB7IHNlbGVjdGlvbjogbmV3U2VsZWN0aW9uIH1dO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgRWRpdG9yU3RhdGUsIFRyYW5zYWN0aW9uIH0gZnJvbSBcIkBjb2RlbWlycm9yL3N0YXRlXCI7XG5cbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tIFwic3JjL3NlcnZpY2VzL0xvZ2dlclNlcnZpY2VcIjtcblxuaW1wb3J0IHsgY2FsY3VsYXRlTGltaXRlZFNlbGVjdGlvbiB9IGZyb20gXCIuL3V0aWxzL2NhbGN1bGF0ZUxpbWl0ZWRTZWxlY3Rpb25cIjtcblxuZXhwb3J0IGludGVyZmFjZSBDYWxjdWxhdGVWaXNpYmxlQ29udGVudFJhbmdlIHtcbiAgY2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRSYW5nZShcbiAgICBzdGF0ZTogRWRpdG9yU3RhdGVcbiAgKTogeyBmcm9tOiBudW1iZXI7IHRvOiBudW1iZXIgfSB8IG51bGw7XG59XG5cbmV4cG9ydCBjbGFzcyBMaW1pdFNlbGVjdGlvbldoZW5ab29tZWRJbiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRSYW5nZTogQ2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRSYW5nZVxuICApIHt9XG5cbiAgcHVibGljIGdldEV4dGVuc2lvbigpIHtcbiAgICByZXR1cm4gRWRpdG9yU3RhdGUudHJhbnNhY3Rpb25GaWx0ZXIub2YodGhpcy5saW1pdFNlbGVjdGlvbldoZW5ab29tZWRJbik7XG4gIH1cblxuICBwcml2YXRlIGxpbWl0U2VsZWN0aW9uV2hlblpvb21lZEluID0gKHRyOiBUcmFuc2FjdGlvbikgPT4ge1xuICAgIGlmICghdHIuc2VsZWN0aW9uIHx8ICF0ci5pc1VzZXJFdmVudChcInNlbGVjdFwiKSkge1xuICAgICAgcmV0dXJuIHRyO1xuICAgIH1cblxuICAgIGNvbnN0IHJhbmdlID1cbiAgICAgIHRoaXMuY2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRSYW5nZS5jYWxjdWxhdGVWaXNpYmxlQ29udGVudFJhbmdlKHRyLnN0YXRlKTtcblxuICAgIGlmICghcmFuZ2UpIHtcbiAgICAgIHJldHVybiB0cjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSBjYWxjdWxhdGVMaW1pdGVkU2VsZWN0aW9uKFxuICAgICAgdHIubmV3U2VsZWN0aW9uLFxuICAgICAgcmFuZ2UuZnJvbSxcbiAgICAgIHJhbmdlLnRvXG4gICAgKTtcblxuICAgIGlmICghbmV3U2VsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gdHI7XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXIubG9nKFxuICAgICAgXCJMaW1pdFNlbGVjdGlvbldoZW5ab29tZWRJbjpsaW1pdFNlbGVjdGlvbldoZW5ab29tZWRJblwiLFxuICAgICAgXCJsaW1pdGluZyBzZWxlY3Rpb25cIixcbiAgICAgIG5ld1NlbGVjdGlvbi50b0pTT04oKVxuICAgICk7XG5cbiAgICByZXR1cm4gW3RyLCB7IHNlbGVjdGlvbjogbmV3U2VsZWN0aW9uIH1dO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsgRWRpdG9yU3RhdGUgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivc3RhdGVcIjtcblxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gXCJzcmMvc2VydmljZXMvTG9nZ2VyU2VydmljZVwiO1xuXG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSBcIi4vRmVhdHVyZVwiO1xuXG5pbXBvcnQgeyBMaW1pdFNlbGVjdGlvbk9uWm9vbWluZ0luIH0gZnJvbSBcIi4uL2xvZ2ljL0xpbWl0U2VsZWN0aW9uT25ab29taW5nSW5cIjtcbmltcG9ydCB7IExpbWl0U2VsZWN0aW9uV2hlblpvb21lZEluIH0gZnJvbSBcIi4uL2xvZ2ljL0xpbWl0U2VsZWN0aW9uV2hlblpvb21lZEluXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRSYW5nZSB7XG4gIGNhbGN1bGF0ZVZpc2libGVDb250ZW50UmFuZ2UoXG4gICAgc3RhdGU6IEVkaXRvclN0YXRlXG4gICk6IHsgZnJvbTogbnVtYmVyOyB0bzogbnVtYmVyIH0gfCBudWxsO1xufVxuXG5leHBvcnQgY2xhc3MgTGltaXRTZWxlY3Rpb25GZWF0dXJlIGltcGxlbWVudHMgRmVhdHVyZSB7XG4gIHByaXZhdGUgbGltaXRTZWxlY3Rpb25Pblpvb21pbmdJbiA9IG5ldyBMaW1pdFNlbGVjdGlvbk9uWm9vbWluZ0luKFxuICAgIHRoaXMubG9nZ2VyXG4gICk7XG4gIHByaXZhdGUgbGltaXRTZWxlY3Rpb25XaGVuWm9vbWVkSW4gPSBuZXcgTGltaXRTZWxlY3Rpb25XaGVuWm9vbWVkSW4oXG4gICAgdGhpcy5sb2dnZXIsXG4gICAgdGhpcy5jYWxjdWxhdGVWaXNpYmxlQ29udGVudFJhbmdlXG4gICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRSYW5nZTogQ2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRSYW5nZVxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckVkaXRvckV4dGVuc2lvbihcbiAgICAgIHRoaXMubGltaXRTZWxlY3Rpb25Pblpvb21pbmdJbi5nZXRFeHRlbnNpb24oKVxuICAgICk7XG5cbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckVkaXRvckV4dGVuc2lvbihcbiAgICAgIHRoaXMubGltaXRTZWxlY3Rpb25XaGVuWm9vbWVkSW4uZ2V0RXh0ZW5zaW9uKClcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge31cbn1cbiIsImltcG9ydCB7IEZlYXR1cmUgfSBmcm9tIFwiLi9GZWF0dXJlXCI7XG5cbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcblxuZXhwb3J0IGNsYXNzIExpc3RzU3R5bGVzRmVhdHVyZSBpbXBsZW1lbnRzIEZlYXR1cmUge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5nc1NlcnZpY2UpIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy56b29tT25DbGljaykge1xuICAgICAgdGhpcy5hZGRab29tU3R5bGVzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXR0aW5ncy5vbkNoYW5nZShcInpvb21PbkNsaWNrXCIsIHRoaXMub25ab29tT25DbGlja1NldHRpbmdDaGFuZ2UpO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMuc2V0dGluZ3MucmVtb3ZlQ2FsbGJhY2soXG4gICAgICBcInpvb21PbkNsaWNrXCIsXG4gICAgICB0aGlzLm9uWm9vbU9uQ2xpY2tTZXR0aW5nQ2hhbmdlXG4gICAgKTtcblxuICAgIHRoaXMucmVtb3ZlWm9vbVN0eWxlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBvblpvb21PbkNsaWNrU2V0dGluZ0NoYW5nZSA9ICh6b29tT25DbGljazogYm9vbGVhbikgPT4ge1xuICAgIGlmICh6b29tT25DbGljaykge1xuICAgICAgdGhpcy5hZGRab29tU3R5bGVzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlWm9vbVN0eWxlcygpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGFkZFpvb21TdHlsZXMoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwiem9vbS1wbHVnaW4tYmxzLXpvb21cIik7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZVpvb21TdHlsZXMoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwiem9vbS1wbHVnaW4tYmxzLXpvb21cIik7XG4gIH1cbn1cbiIsImltcG9ydCB7IEVkaXRvclN0YXRlLCBUcmFuc2FjdGlvbiB9IGZyb20gXCJAY29kZW1pcnJvci9zdGF0ZVwiO1xuXG5pbXBvcnQgeyBjYWxjdWxhdGVWaXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRpb24gfSBmcm9tIFwiLi91dGlscy9jYWxjdWxhdGVWaXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRpb25cIjtcblxuZXhwb3J0IGludGVyZmFjZSBWaXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRlZCB7XG4gIHZpc2libGVDb250ZW50Qm91bmRhcmllc1Zpb2xhdGVkKHN0YXRlOiBFZGl0b3JTdGF0ZSk6IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FsY3VsYXRlSGlkZGVuQ29udGVudFJhbmdlcyB7XG4gIGNhbGN1bGF0ZUhpZGRlbkNvbnRlbnRSYW5nZXMoXG4gICAgc3RhdGU6IEVkaXRvclN0YXRlXG4gICk6IHsgZnJvbTogbnVtYmVyOyB0bzogbnVtYmVyIH1bXSB8IG51bGw7XG59XG5cbmV4cG9ydCBjbGFzcyBEZXRlY3RWaXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRpb24ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNhbGN1bGF0ZUhpZGRlbkNvbnRlbnRSYW5nZXM6IENhbGN1bGF0ZUhpZGRlbkNvbnRlbnRSYW5nZXMsXG4gICAgcHJpdmF0ZSB2aXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRlZDogVmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0ZWRcbiAgKSB7fVxuXG4gIGdldEV4dGVuc2lvbigpIHtcbiAgICByZXR1cm4gRWRpdG9yU3RhdGUudHJhbnNhY3Rpb25FeHRlbmRlci5vZihcbiAgICAgIHRoaXMuZGV0ZWN0VmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0aW9uXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZGV0ZWN0VmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0aW9uID0gKHRyOiBUcmFuc2FjdGlvbik6IG51bGwgPT4ge1xuICAgIGNvbnN0IGhpZGRlblJhbmdlcyA9XG4gICAgICB0aGlzLmNhbGN1bGF0ZUhpZGRlbkNvbnRlbnRSYW5nZXMuY2FsY3VsYXRlSGlkZGVuQ29udGVudFJhbmdlcyhcbiAgICAgICAgdHIuc3RhcnRTdGF0ZVxuICAgICAgKTtcblxuICAgIGNvbnN0IHsgdG91Y2hlZE91dHNpZGUsIHRvdWNoZWRJbnNpZGUgfSA9XG4gICAgICBjYWxjdWxhdGVWaXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRpb24odHIsIGhpZGRlblJhbmdlcyk7XG5cbiAgICBpZiAodG91Y2hlZE91dHNpZGUgJiYgdG91Y2hlZEluc2lkZSkge1xuICAgICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcbiAgICAgICAgdGhpcy52aXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRlZC52aXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRlZChcbiAgICAgICAgICB0ci5zdGF0ZVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgeyBFZGl0b3JTdGF0ZSB9IGZyb20gXCJAY29kZW1pcnJvci9zdGF0ZVwiO1xuaW1wb3J0IHsgRWRpdG9yVmlldyB9IGZyb20gXCJAY29kZW1pcnJvci92aWV3XCI7XG5cbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tIFwic3JjL3NlcnZpY2VzL0xvZ2dlclNlcnZpY2VcIjtcblxuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gXCIuL0ZlYXR1cmVcIjtcbmltcG9ydCB7IGdldEVkaXRvclZpZXdGcm9tRWRpdG9yU3RhdGUgfSBmcm9tIFwiLi91dGlscy9nZXRFZGl0b3JWaWV3RnJvbUVkaXRvclN0YXRlXCI7XG5cbmltcG9ydCB7IERldGVjdFZpc2libGVDb250ZW50Qm91bmRhcmllc1Zpb2xhdGlvbiB9IGZyb20gXCIuLi9sb2dpYy9EZXRlY3RWaXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRpb25cIjtcblxuZXhwb3J0IGludGVyZmFjZSBDYWxjdWxhdGVIaWRkZW5Db250ZW50UmFuZ2VzIHtcbiAgY2FsY3VsYXRlSGlkZGVuQ29udGVudFJhbmdlcyhcbiAgICBzdGF0ZTogRWRpdG9yU3RhdGVcbiAgKTogeyBmcm9tOiBudW1iZXI7IHRvOiBudW1iZXIgfVtdIHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBab29tT3V0IHtcbiAgem9vbU91dCh2aWV3OiBFZGl0b3JWaWV3KTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFJlc2V0Wm9vbVdoZW5WaXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRlZEZlYXR1cmVcbiAgaW1wbGVtZW50cyBGZWF0dXJlXG57XG4gIHByaXZhdGUgZGV0ZWN0VmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0aW9uID1cbiAgICBuZXcgRGV0ZWN0VmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0aW9uKFxuICAgICAgdGhpcy5jYWxjdWxhdGVIaWRkZW5Db250ZW50UmFuZ2VzLFxuICAgICAge1xuICAgICAgICB2aXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRlZDogKHN0YXRlKSA9PlxuICAgICAgICAgIHRoaXMudmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0ZWQoc3RhdGUpLFxuICAgICAgfVxuICAgICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2FsY3VsYXRlSGlkZGVuQ29udGVudFJhbmdlczogQ2FsY3VsYXRlSGlkZGVuQ29udGVudFJhbmdlcyxcbiAgICBwcml2YXRlIHpvb21PdXQ6IFpvb21PdXRcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJFZGl0b3JFeHRlbnNpb24oXG4gICAgICB0aGlzLmRldGVjdFZpc2libGVDb250ZW50Qm91bmRhcmllc1Zpb2xhdGlvbi5nZXRFeHRlbnNpb24oKVxuICAgICk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7fVxuXG4gIHByaXZhdGUgdmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0ZWQoc3RhdGU6IEVkaXRvclN0YXRlKSB7XG4gICAgY29uc3QgbCA9IHRoaXMubG9nZ2VyLmJpbmQoXG4gICAgICBcIlJlc2V0Wm9vbVdoZW5WaXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRlZEZlYXR1cmU6dmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0ZWRcIlxuICAgICk7XG4gICAgbChcInZpc2libGUgY29udGVudCBib3VuZGFyaWVzIHZpb2xhdGVkLCB6b29taW5nIG91dFwiKTtcbiAgICB0aGlzLnpvb21PdXQuem9vbU91dChnZXRFZGl0b3JWaWV3RnJvbUVkaXRvclN0YXRlKHN0YXRlKSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgUGx1Z2luU2V0dGluZ1RhYiwgUGx1Z2luXzIsIFNldHRpbmcgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gXCIuL0ZlYXR1cmVcIjtcblxuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1NldHRpbmdzU2VydmljZVwiO1xuXG5jbGFzcyBPYnNpZGlhblpvb21QbHVnaW5TZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFBsdWdpbl8yLCBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5nc1NlcnZpY2UpIHtcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gIH1cblxuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlpvb21pbmcgaW4gd2hlbiBjbGlja2luZyBvbiB0aGUgYnVsbGV0XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Muem9vbU9uQ2xpY2spLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Muem9vbU9uQ2xpY2sgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJEZWJ1ZyBtb2RlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJPcGVuIERldlRvb2xzIChDb21tYW5kK09wdGlvbitJIG9yIENvbnRyb2wrU2hpZnQrSSkgdG8gY29weSB0aGUgZGVidWcgbG9ncy5cIlxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLmRlYnVnKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLmRlYnVnID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzVGFiRmVhdHVyZSBpbXBsZW1lbnRzIEZlYXR1cmUge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzU2VydmljZSkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFkZFNldHRpbmdUYWIoXG4gICAgICBuZXcgT2JzaWRpYW5ab29tUGx1Z2luU2V0dGluZ1RhYihcbiAgICAgICAgdGhpcy5wbHVnaW4uYXBwLFxuICAgICAgICB0aGlzLnBsdWdpbixcbiAgICAgICAgdGhpcy5zZXR0aW5nc1xuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7fVxufVxuIiwiaW1wb3J0IHsgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZvbGRpbmdFbmFibGVkKGFwcDogQXBwKSB7XG4gIGNvbnN0IGNvbmZpZzoge1xuICAgIGZvbGRIZWFkaW5nOiBib29sZWFuO1xuICAgIGZvbGRJbmRlbnQ6IGJvb2xlYW47XG4gIH0gPSB7XG4gICAgZm9sZEhlYWRpbmc6IHRydWUsXG4gICAgZm9sZEluZGVudDogdHJ1ZSxcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIC4uLihhcHAudmF1bHQgYXMgYW55KS5jb25maWcsXG4gIH07XG5cbiAgcmV0dXJuIGNvbmZpZy5mb2xkSGVhZGluZyAmJiBjb25maWcuZm9sZEluZGVudDtcbn1cbiIsImltcG9ydCB7IGZvbGRhYmxlIH0gZnJvbSBcIkBjb2RlbWlycm9yL2xhbmd1YWdlXCI7XG5pbXBvcnQgeyBFZGl0b3JTdGF0ZSB9IGZyb20gXCJAY29kZW1pcnJvci9zdGF0ZVwiO1xuXG5leHBvcnQgY2xhc3MgQ2FsY3VsYXRlUmFuZ2VGb3Jab29taW5nIHtcbiAgcHVibGljIGNhbGN1bGF0ZVJhbmdlRm9yWm9vbWluZyhzdGF0ZTogRWRpdG9yU3RhdGUsIHBvczogbnVtYmVyKSB7XG4gICAgY29uc3QgbGluZSA9IHN0YXRlLmRvYy5saW5lQXQocG9zKTtcbiAgICBjb25zdCBmb2xkUmFuZ2UgPSBmb2xkYWJsZShzdGF0ZSwgbGluZS5mcm9tLCBsaW5lLnRvKTtcblxuICAgIGlmICghZm9sZFJhbmdlICYmIC9eXFxzKihbLSorXXxcXGQrXFwuKVxccysvLnRlc3QobGluZS50ZXh0KSkge1xuICAgICAgcmV0dXJuIHsgZnJvbTogbGluZS5mcm9tLCB0bzogbGluZS50byB9O1xuICAgIH1cblxuICAgIGlmICghZm9sZFJhbmdlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4geyBmcm9tOiBsaW5lLmZyb20sIHRvOiBmb2xkUmFuZ2UudG8gfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUmFuZ2VTZXQsIFJhbmdlVmFsdWUgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivc3RhdGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlU2V0VG9BcnJheTxUIGV4dGVuZHMgUmFuZ2VWYWx1ZT4oXG4gIHJzOiBSYW5nZVNldDxUPlxuKTogQXJyYXk8eyBmcm9tOiBudW1iZXI7IHRvOiBudW1iZXIgfT4ge1xuICBjb25zdCByZXMgPSBbXTtcbiAgY29uc3QgaSA9IHJzLml0ZXIoKTtcbiAgd2hpbGUgKGkudmFsdWUgIT09IG51bGwpIHtcbiAgICByZXMucHVzaCh7IGZyb206IGkuZnJvbSwgdG86IGkudG8gfSk7XG4gICAgaS5uZXh0KCk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cbiIsImltcG9ydCB7IEVkaXRvclN0YXRlLCBFeHRlbnNpb24sIFN0YXRlRmllbGQgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivc3RhdGVcIjtcbmltcG9ydCB7IERlY29yYXRpb24sIERlY29yYXRpb25TZXQsIEVkaXRvclZpZXcgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivdmlld1wiO1xuXG5pbXBvcnQgeyB6b29tSW5FZmZlY3QsIHpvb21PdXRFZmZlY3QgfSBmcm9tIFwiLi91dGlscy9lZmZlY3RzXCI7XG5pbXBvcnQgeyByYW5nZVNldFRvQXJyYXkgfSBmcm9tIFwiLi91dGlscy9yYW5nZVNldFRvQXJyYXlcIjtcblxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9Mb2dnZXJTZXJ2aWNlXCI7XG5cbmNvbnN0IHpvb21NYXJrSGlkZGVuID0gRGVjb3JhdGlvbi5yZXBsYWNlKHsgYmxvY2s6IHRydWUgfSk7XG5cbmNvbnN0IHpvb21TdGF0ZUZpZWxkID0gU3RhdGVGaWVsZC5kZWZpbmU8RGVjb3JhdGlvblNldD4oe1xuICBjcmVhdGU6ICgpID0+IHtcbiAgICByZXR1cm4gRGVjb3JhdGlvbi5ub25lO1xuICB9LFxuXG4gIHVwZGF0ZTogKHZhbHVlLCB0cikgPT4ge1xuICAgIHZhbHVlID0gdmFsdWUubWFwKHRyLmNoYW5nZXMpO1xuXG4gICAgZm9yIChjb25zdCBlIG9mIHRyLmVmZmVjdHMpIHtcbiAgICAgIGlmIChlLmlzKHpvb21JbkVmZmVjdCkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS51cGRhdGUoeyBmaWx0ZXI6ICgpID0+IGZhbHNlIH0pO1xuXG4gICAgICAgIGlmIChlLnZhbHVlLmZyb20gPiAwKSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS51cGRhdGUoe1xuICAgICAgICAgICAgYWRkOiBbem9vbU1hcmtIaWRkZW4ucmFuZ2UoMCwgZS52YWx1ZS5mcm9tIC0gMSldLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGUudmFsdWUudG8gPCB0ci5uZXdEb2MubGVuZ3RoKSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS51cGRhdGUoe1xuICAgICAgICAgICAgYWRkOiBbem9vbU1hcmtIaWRkZW4ucmFuZ2UoZS52YWx1ZS50byArIDEsIHRyLm5ld0RvYy5sZW5ndGgpXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZS5pcyh6b29tT3V0RWZmZWN0KSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnVwZGF0ZSh7IGZpbHRlcjogKCkgPT4gZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuXG4gIHByb3ZpZGU6ICh6b29tU3RhdGVGaWVsZCkgPT4gRWRpdG9yVmlldy5kZWNvcmF0aW9ucy5mcm9tKHpvb21TdGF0ZUZpZWxkKSxcbn0pO1xuXG5leHBvcnQgY2xhc3MgS2VlcE9ubHlab29tZWRDb250ZW50VmlzaWJsZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJTZXJ2aWNlKSB7fVxuXG4gIHB1YmxpYyBnZXRFeHRlbnNpb24oKTogRXh0ZW5zaW9uIHtcbiAgICByZXR1cm4gem9vbVN0YXRlRmllbGQ7XG4gIH1cblxuICBwdWJsaWMgY2FsY3VsYXRlSGlkZGVuQ29udGVudFJhbmdlcyhzdGF0ZTogRWRpdG9yU3RhdGUpIHtcbiAgICByZXR1cm4gcmFuZ2VTZXRUb0FycmF5KHN0YXRlLmZpZWxkKHpvb21TdGF0ZUZpZWxkKSk7XG4gIH1cblxuICBwdWJsaWMgY2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRSYW5nZShzdGF0ZTogRWRpdG9yU3RhdGUpIHtcbiAgICBjb25zdCBoaWRkZW4gPSB0aGlzLmNhbGN1bGF0ZUhpZGRlbkNvbnRlbnRSYW5nZXMoc3RhdGUpO1xuXG4gICAgaWYgKGhpZGRlbi5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IFthXSA9IGhpZGRlbjtcblxuICAgICAgaWYgKGEuZnJvbSA9PT0gMCkge1xuICAgICAgICByZXR1cm4geyBmcm9tOiBhLnRvICsgMSwgdG86IHN0YXRlLmRvYy5sZW5ndGggfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IGZyb206IDAsIHRvOiBhLmZyb20gLSAxIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhpZGRlbi5sZW5ndGggPT09IDIpIHtcbiAgICAgIGNvbnN0IFthLCBiXSA9IGhpZGRlbjtcblxuICAgICAgcmV0dXJuIHsgZnJvbTogYS50byArIDEsIHRvOiBiLmZyb20gLSAxIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMga2VlcE9ubHlab29tZWRDb250ZW50VmlzaWJsZShcbiAgICB2aWV3OiBFZGl0b3JWaWV3LFxuICAgIGZyb206IG51bWJlcixcbiAgICB0bzogbnVtYmVyXG4gICkge1xuICAgIGNvbnN0IGVmZmVjdCA9IHpvb21JbkVmZmVjdC5vZih7IGZyb20sIHRvIH0pO1xuXG4gICAgdGhpcy5sb2dnZXIubG9nKFxuICAgICAgXCJLZWVwT25seVpvb21lZENvbnRlbnQ6a2VlcE9ubHlab29tZWRDb250ZW50VmlzaWJsZVwiLFxuICAgICAgXCJrZWVwIG9ubHkgem9vbWVkIGNvbnRlbnQgdmlzaWJsZVwiLFxuICAgICAgZWZmZWN0LnZhbHVlLmZyb20sXG4gICAgICBlZmZlY3QudmFsdWUudG9cbiAgICApO1xuXG4gICAgdmlldy5kaXNwYXRjaCh7XG4gICAgICBlZmZlY3RzOiBbZWZmZWN0XSxcbiAgICB9KTtcbiAgICB2aWV3LmRpc3BhdGNoKHtcbiAgICAgIGVmZmVjdHM6IFtcbiAgICAgICAgRWRpdG9yVmlldy5zY3JvbGxJbnRvVmlldyh2aWV3LnN0YXRlLnNlbGVjdGlvbi5tYWluLCB7XG4gICAgICAgICAgeTogXCJzdGFydFwiLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2hvd0FsbENvbnRlbnQodmlldzogRWRpdG9yVmlldykge1xuICAgIHRoaXMubG9nZ2VyLmxvZyhcIktlZXBPbmx5Wm9vbWVkQ29udGVudDpzaG93QWxsQ29udGVudFwiLCBcInNob3cgYWxsIGNvbnRlbnRcIik7XG5cbiAgICB2aWV3LmRpc3BhdGNoKHsgZWZmZWN0czogW3pvb21PdXRFZmZlY3Qub2YoKV0gfSk7XG4gICAgdmlldy5kaXNwYXRjaCh7XG4gICAgICBlZmZlY3RzOiBbXG4gICAgICAgIEVkaXRvclZpZXcuc2Nyb2xsSW50b1ZpZXcodmlldy5zdGF0ZS5zZWxlY3Rpb24ubWFpbiwge1xuICAgICAgICAgIHk6IFwiY2VudGVyXCIsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTm90aWNlLCBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgeyBFZGl0b3JTdGF0ZSB9IGZyb20gXCJAY29kZW1pcnJvci9zdGF0ZVwiO1xuaW1wb3J0IHsgRWRpdG9yVmlldyB9IGZyb20gXCJAY29kZW1pcnJvci92aWV3XCI7XG5cbmltcG9ydCB7IEZlYXR1cmUgfSBmcm9tIFwiLi9GZWF0dXJlXCI7XG5pbXBvcnQgeyBpc0ZvbGRpbmdFbmFibGVkIH0gZnJvbSBcIi4vdXRpbHMvaXNGb2xkaW5nRW5hYmxlZFwiO1xuXG5pbXBvcnQgeyBDYWxjdWxhdGVSYW5nZUZvclpvb21pbmcgfSBmcm9tIFwiLi4vbG9naWMvQ2FsY3VsYXRlUmFuZ2VGb3Jab29taW5nXCI7XG5pbXBvcnQgeyBLZWVwT25seVpvb21lZENvbnRlbnRWaXNpYmxlIH0gZnJvbSBcIi4uL2xvZ2ljL0tlZXBPbmx5Wm9vbWVkQ29udGVudFZpc2libGVcIjtcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvTG9nZ2VyU2VydmljZVwiO1xuXG5leHBvcnQgdHlwZSBab29tSW5DYWxsYmFjayA9ICh2aWV3OiBFZGl0b3JWaWV3LCBwb3M6IG51bWJlcikgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIFpvb21PdXRDYWxsYmFjayA9ICh2aWV3OiBFZGl0b3JWaWV3KSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgWm9vbUZlYXR1cmUgaW1wbGVtZW50cyBGZWF0dXJlIHtcbiAgcHJpdmF0ZSB6b29tSW5DYWxsYmFja3M6IFpvb21JbkNhbGxiYWNrW10gPSBbXTtcbiAgcHJpdmF0ZSB6b29tT3V0Q2FsbGJhY2tzOiBab29tT3V0Q2FsbGJhY2tbXSA9IFtdO1xuXG4gIHByaXZhdGUga2VlcE9ubHlab29tZWRDb250ZW50VmlzaWJsZSA9IG5ldyBLZWVwT25seVpvb21lZENvbnRlbnRWaXNpYmxlKFxuICAgIHRoaXMubG9nZ2VyXG4gICk7XG5cbiAgcHJpdmF0ZSBjYWxjdWxhdGVSYW5nZUZvclpvb21pbmcgPSBuZXcgQ2FsY3VsYXRlUmFuZ2VGb3Jab29taW5nKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLCBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyU2VydmljZSkge31cblxuICBwdWJsaWMgY2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRSYW5nZShzdGF0ZTogRWRpdG9yU3RhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5rZWVwT25seVpvb21lZENvbnRlbnRWaXNpYmxlLmNhbGN1bGF0ZVZpc2libGVDb250ZW50UmFuZ2UoXG4gICAgICBzdGF0ZVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgY2FsY3VsYXRlSGlkZGVuQ29udGVudFJhbmdlcyhzdGF0ZTogRWRpdG9yU3RhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5rZWVwT25seVpvb21lZENvbnRlbnRWaXNpYmxlLmNhbGN1bGF0ZUhpZGRlbkNvbnRlbnRSYW5nZXMoXG4gICAgICBzdGF0ZVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5QWZ0ZXJab29tSW4oY2I6IFpvb21JbkNhbGxiYWNrKSB7XG4gICAgdGhpcy56b29tSW5DYWxsYmFja3MucHVzaChjYik7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5QWZ0ZXJab29tT3V0KGNiOiBab29tT3V0Q2FsbGJhY2spIHtcbiAgICB0aGlzLnpvb21PdXRDYWxsYmFja3MucHVzaChjYik7XG4gIH1cblxuICBwdWJsaWMgem9vbUluKHZpZXc6IEVkaXRvclZpZXcsIHBvczogbnVtYmVyKSB7XG4gICAgY29uc3QgbCA9IHRoaXMubG9nZ2VyLmJpbmQoXCJab29tRmVhdHVyZTp6b29tSW5cIik7XG4gICAgbChcInpvb21pbmcgaW5cIik7XG5cbiAgICBpZiAoIWlzRm9sZGluZ0VuYWJsZWQodGhpcy5wbHVnaW4uYXBwKSkge1xuICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgYEluIG9yZGVyIHRvIHpvb20sIHlvdSBtdXN0IGZpcnN0IGVuYWJsZSBcIkZvbGQgaGVhZGluZ1wiIGFuZCBcIkZvbGQgaW5kZW50XCIgdW5kZXIgU2V0dGluZ3MgLT4gRWRpdG9yYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByYW5nZSA9IHRoaXMuY2FsY3VsYXRlUmFuZ2VGb3Jab29taW5nLmNhbGN1bGF0ZVJhbmdlRm9yWm9vbWluZyhcbiAgICAgIHZpZXcuc3RhdGUsXG4gICAgICBwb3NcbiAgICApO1xuXG4gICAgaWYgKCFyYW5nZSkge1xuICAgICAgbChcInVuYWJsZSB0byBjYWxjdWxhdGUgcmFuZ2UgZm9yIHpvb21pbmdcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5rZWVwT25seVpvb21lZENvbnRlbnRWaXNpYmxlLmtlZXBPbmx5Wm9vbWVkQ29udGVudFZpc2libGUoXG4gICAgICB2aWV3LFxuICAgICAgcmFuZ2UuZnJvbSxcbiAgICAgIHJhbmdlLnRvXG4gICAgKTtcblxuICAgIGZvciAoY29uc3QgY2Igb2YgdGhpcy56b29tSW5DYWxsYmFja3MpIHtcbiAgICAgIGNiKHZpZXcsIHBvcyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHpvb21PdXQodmlldzogRWRpdG9yVmlldykge1xuICAgIGNvbnN0IGwgPSB0aGlzLmxvZ2dlci5iaW5kKFwiWm9vbUZlYXR1cmU6em9vbUluXCIpO1xuICAgIGwoXCJ6b29taW5nIG91dFwiKTtcblxuICAgIHRoaXMua2VlcE9ubHlab29tZWRDb250ZW50VmlzaWJsZS5zaG93QWxsQ29udGVudCh2aWV3KTtcblxuICAgIGZvciAoY29uc3QgY2Igb2YgdGhpcy56b29tT3V0Q2FsbGJhY2tzKSB7XG4gICAgICBjYih2aWV3KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyRWRpdG9yRXh0ZW5zaW9uKFxuICAgICAgdGhpcy5rZWVwT25seVpvb21lZENvbnRlbnRWaXNpYmxlLmdldEV4dGVuc2lvbigpXG4gICAgKTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiem9vbS1pblwiLFxuICAgICAgbmFtZTogXCJab29tIGluXCIsXG4gICAgICBpY29uOiBcIm9ic2lkaWFuLXpvb20tem9vbS1pblwiLFxuICAgICAgZWRpdG9yQ2FsbGJhY2s6IChlZGl0b3IpID0+IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgY29uc3QgdmlldzogRWRpdG9yVmlldyA9IChlZGl0b3IgYXMgYW55KS5jbTtcbiAgICAgICAgdGhpcy56b29tSW4odmlldywgdmlldy5zdGF0ZS5zZWxlY3Rpb24ubWFpbi5oZWFkKTtcbiAgICAgIH0sXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICAgICAgICBrZXk6IFwiLlwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiem9vbS1vdXRcIixcbiAgICAgIG5hbWU6IFwiWm9vbSBvdXQgdGhlIGVudGlyZSBkb2N1bWVudFwiLFxuICAgICAgaWNvbjogXCJvYnNpZGlhbi16b29tLXpvb20tb3V0XCIsXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgZWRpdG9yQ2FsbGJhY2s6IChlZGl0b3IpID0+IHRoaXMuem9vbU91dCgoZWRpdG9yIGFzIGFueSkuY20pLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSxcbiAgICAgICAgICBrZXk6IFwiLlwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHt9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaXNCdWxsZXRQb2ludChlOiBIVE1MRWxlbWVudCkge1xuICByZXR1cm4gKFxuICAgIGUgaW5zdGFuY2VvZiBIVE1MU3BhbkVsZW1lbnQgJiZcbiAgICAoZS5jbGFzc0xpc3QuY29udGFpbnMoXCJsaXN0LWJ1bGxldFwiKSB8fFxuICAgICAgZS5jbGFzc0xpc3QuY29udGFpbnMoXCJjbS1mb3JtYXR0aW5nLWxpc3RcIikpXG4gICk7XG59XG4iLCJpbXBvcnQgeyBFZGl0b3JTZWxlY3Rpb24gfSBmcm9tIFwiQGNvZGVtaXJyb3Ivc3RhdGVcIjtcbmltcG9ydCB7IEVkaXRvclZpZXcgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivdmlld1wiO1xuXG5pbXBvcnQgeyBpc0J1bGxldFBvaW50IH0gZnJvbSBcIi4vdXRpbHMvaXNCdWxsZXRQb2ludFwiO1xuXG5pbXBvcnQgeyBTZXR0aW5nc1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xpY2tPbkJ1bGxldCB7XG4gIGNsaWNrT25CdWxsZXQodmlldzogRWRpdG9yVmlldywgcG9zOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgRGV0ZWN0Q2xpY2tPbkJ1bGxldCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGNsaWNrT25CdWxsZXQ6IENsaWNrT25CdWxsZXRcbiAgKSB7fVxuXG4gIGdldEV4dGVuc2lvbigpIHtcbiAgICByZXR1cm4gRWRpdG9yVmlldy5kb21FdmVudEhhbmRsZXJzKHtcbiAgICAgIGNsaWNrOiB0aGlzLmRldGVjdENsaWNrT25CdWxsZXQsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbW92ZUN1cnNvclRvTGluZUVuZCh2aWV3OiBFZGl0b3JWaWV3LCBwb3M6IG51bWJlcikge1xuICAgIGNvbnN0IGxpbmUgPSB2aWV3LnN0YXRlLmRvYy5saW5lQXQocG9zKTtcblxuICAgIHZpZXcuZGlzcGF0Y2goe1xuICAgICAgc2VsZWN0aW9uOiBFZGl0b3JTZWxlY3Rpb24uY3Vyc29yKGxpbmUudG8pLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkZXRlY3RDbGlja09uQnVsbGV0ID0gKGU6IE1vdXNlRXZlbnQsIHZpZXc6IEVkaXRvclZpZXcpID0+IHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5zZXR0aW5ncy56b29tT25DbGljayB8fFxuICAgICAgIShlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB8fFxuICAgICAgIWlzQnVsbGV0UG9pbnQoZS50YXJnZXQpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcG9zID0gdmlldy5wb3NBdERPTShlLnRhcmdldCk7XG4gICAgdGhpcy5jbGlja09uQnVsbGV0LmNsaWNrT25CdWxsZXQodmlldywgcG9zKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IEVkaXRvclZpZXcgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivdmlld1wiO1xuXG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSBcIi4vRmVhdHVyZVwiO1xuXG5pbXBvcnQgeyBEZXRlY3RDbGlja09uQnVsbGV0IH0gZnJvbSBcIi4uL2xvZ2ljL0RldGVjdENsaWNrT25CdWxsZXRcIjtcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBab29tSW4ge1xuICB6b29tSW4odmlldzogRWRpdG9yVmlldywgcG9zOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgWm9vbU9uQ2xpY2tGZWF0dXJlIGltcGxlbWVudHMgRmVhdHVyZSB7XG4gIHByaXZhdGUgZGV0ZWN0Q2xpY2tPbkJ1bGxldCA9IG5ldyBEZXRlY3RDbGlja09uQnVsbGV0KHRoaXMuc2V0dGluZ3MsIHtcbiAgICBjbGlja09uQnVsbGV0OiAodmlldywgcG9zKSA9PiB0aGlzLmNsaWNrT25CdWxsZXQodmlldywgcG9zKSxcbiAgfSk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIHpvb21JbjogWm9vbUluXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyRWRpdG9yRXh0ZW5zaW9uKFxuICAgICAgdGhpcy5kZXRlY3RDbGlja09uQnVsbGV0LmdldEV4dGVuc2lvbigpXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHt9XG5cbiAgcHJpdmF0ZSBjbGlja09uQnVsbGV0KHZpZXc6IEVkaXRvclZpZXcsIHBvczogbnVtYmVyKSB7XG4gICAgdGhpcy5kZXRlY3RDbGlja09uQnVsbGV0Lm1vdmVDdXJzb3JUb0xpbmVFbmQodmlldywgcG9zKTtcbiAgICB0aGlzLnpvb21Jbi56b29tSW4odmlldywgcG9zKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4vU2V0dGluZ3NTZXJ2aWNlXCI7XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3NTZXJ2aWNlKSB7fVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gIGxvZyhtZXRob2Q6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZGVidWcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zb2xlLmluZm8obWV0aG9kLCAuLi5hcmdzKTtcbiAgfVxuXG4gIGJpbmQobWV0aG9kOiBzdHJpbmcpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHRoaXMubG9nKG1ldGhvZCwgLi4uYXJncyk7XG4gIH1cbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgT2JzaWRpYW5ab29tUGx1Z2luU2V0dGluZ3Mge1xuICBkZWJ1ZzogYm9vbGVhbjtcbiAgem9vbU9uQ2xpY2s6IGJvb2xlYW47XG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IE9ic2lkaWFuWm9vbVBsdWdpblNldHRpbmdzID0ge1xuICBkZWJ1ZzogZmFsc2UsXG4gIHpvb21PbkNsaWNrOiB0cnVlLFxufTtcblxuZXhwb3J0IGludGVyZmFjZSBTdG9yYWdlIHtcbiAgbG9hZERhdGEoKTogUHJvbWlzZTxPYnNpZGlhblpvb21QbHVnaW5TZXR0aW5ncz47XG4gIHNhdmVEYXRhKHNldHRpZ25zOiBPYnNpZGlhblpvb21QbHVnaW5TZXR0aW5ncyk6IFByb21pc2U8dm9pZD47XG59XG5cbnR5cGUgSyA9IGtleW9mIE9ic2lkaWFuWm9vbVBsdWdpblNldHRpbmdzO1xudHlwZSBWPFQgZXh0ZW5kcyBLPiA9IE9ic2lkaWFuWm9vbVBsdWdpblNldHRpbmdzW1RdO1xudHlwZSBDYWxsYmFjazxUIGV4dGVuZHMgSz4gPSAoY2I6IFY8VD4pID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5nc1NlcnZpY2UgaW1wbGVtZW50cyBPYnNpZGlhblpvb21QbHVnaW5TZXR0aW5ncyB7XG4gIHByaXZhdGUgc3RvcmFnZTogU3RvcmFnZTtcbiAgcHJpdmF0ZSB2YWx1ZXM6IE9ic2lkaWFuWm9vbVBsdWdpblNldHRpbmdzO1xuICBwcml2YXRlIGhhbmRsZXJzOiBNYXA8SywgU2V0PENhbGxiYWNrPEs+Pj47XG5cbiAgY29uc3RydWN0b3Ioc3RvcmFnZTogU3RvcmFnZSkge1xuICAgIHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2U7XG4gICAgdGhpcy5oYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuZGVidWc7XG4gIH1cbiAgc2V0IGRlYnVnKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJkZWJ1Z1wiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgem9vbU9uQ2xpY2soKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLnpvb21PbkNsaWNrO1xuICB9XG4gIHNldCB6b29tT25DbGljayh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwiem9vbU9uQ2xpY2tcIiwgdmFsdWUpO1xuICB9XG5cbiAgb25DaGFuZ2U8VCBleHRlbmRzIEs+KGtleTogVCwgY2I6IENhbGxiYWNrPFQ+KSB7XG4gICAgaWYgKCF0aGlzLmhhbmRsZXJzLmhhcyhrZXkpKSB7XG4gICAgICB0aGlzLmhhbmRsZXJzLnNldChrZXksIG5ldyBTZXQoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVycy5nZXQoa2V5KS5hZGQoY2IpO1xuICB9XG5cbiAgcmVtb3ZlQ2FsbGJhY2s8VCBleHRlbmRzIEs+KGtleTogVCwgY2I6IENhbGxiYWNrPFQ+KTogdm9pZCB7XG4gICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzLmdldChrZXkpO1xuXG4gICAgaWYgKGhhbmRsZXJzKSB7XG4gICAgICBoYW5kbGVycy5kZWxldGUoY2IpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy52YWx1ZXMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICBERUZBVUxUX1NFVFRJTkdTLFxuICAgICAgYXdhaXQgdGhpcy5zdG9yYWdlLmxvYWREYXRhKClcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgc2F2ZSgpIHtcbiAgICBhd2FpdCB0aGlzLnN0b3JhZ2Uuc2F2ZURhdGEodGhpcy52YWx1ZXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXQ8VCBleHRlbmRzIEs+KGtleTogVCwgdmFsdWU6IFY8Sz4pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlc1trZXldID0gdmFsdWU7XG4gICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5oYW5kbGVycy5nZXQoa2V5KTtcblxuICAgIGlmICghY2FsbGJhY2tzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBjYiBvZiBjYWxsYmFja3MudmFsdWVzKCkpIHtcbiAgICAgIGNiKHZhbHVlKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEVkaXRvciwgTm90aWNlLCBQbHVnaW4sIGFkZEljb24gfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsgRWRpdG9yVmlldyB9IGZyb20gXCJAY29kZW1pcnJvci92aWV3XCI7XG5cbmltcG9ydCB7IEZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9GZWF0dXJlXCI7XG5pbXBvcnQgeyBIZWFkZXJOYXZpZ2F0aW9uRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0hlYWRlck5hdmlnYXRpb25GZWF0dXJlXCI7XG5pbXBvcnQgeyBMaW1pdFNlbGVjdGlvbkZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9MaW1pdFNlbGVjdGlvbkZlYXR1cmVcIjtcbmltcG9ydCB7IExpc3RzU3R5bGVzRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0xpc3RzU3R5bGVzRmVhdHVyZVwiO1xuaW1wb3J0IHsgUmVzZXRab29tV2hlblZpc2libGVDb250ZW50Qm91bmRhcmllc1Zpb2xhdGVkRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL1Jlc2V0Wm9vbVdoZW5WaXNpYmxlQ29udGVudEJvdW5kYXJpZXNWaW9sYXRlZEZlYXR1cmVcIjtcbmltcG9ydCB7IFNldHRpbmdzVGFiRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL1NldHRpbmdzVGFiRmVhdHVyZVwiO1xuaW1wb3J0IHsgWm9vbUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9ab29tRmVhdHVyZVwiO1xuaW1wb3J0IHsgWm9vbU9uQ2xpY2tGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvWm9vbU9uQ2xpY2tGZWF0dXJlXCI7XG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvTG9nZ2VyU2VydmljZVwiO1xuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XG5cbmFkZEljb24oXG4gIFwib2JzaWRpYW4tem9vbS16b29tLWluXCIsXG4gIGA8cGF0aCBmaWxsPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIGQ9XCJNNDIsNkMyMy4yLDYsOCwyMS4yLDgsNDBzMTUuMiwzNCwzNCwzNGM3LjQsMCwxNC4zLTIuNCwxOS45LTYuNGwyNi4zLDI2LjNsNS42LTUuNmwtMjYtMjYuMWM1LjEtNiw4LjItMTMuNyw4LjItMjIuMSBDNzYsMjEuMiw2MC44LDYsNDIsNnogTTQyLDEwYzE2LjYsMCwzMCwxMy40LDMwLDMwUzU4LjYsNzAsNDIsNzBTMTIsNTYuNiwxMiw0MFMyNS40LDEwLDQyLDEwelwiPjwvcGF0aD48bGluZSB4MT1cIjI0XCIgeTE9XCI0MFwiIHgyPVwiNjBcIiB5Mj1cIjQwXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMTBcIj48L2xpbmU+PGxpbmUgeDE9XCI0MlwiIHkxPVwiMjBcIiB4Mj1cIjQyXCIgeTI9XCI2MFwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjEwXCI+PC9saW5lPmBcbik7XG5hZGRJY29uKFxuICBcIm9ic2lkaWFuLXpvb20tem9vbS1vdXRcIixcbiAgYDxwYXRoIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgZD1cIk00Miw2QzIzLjIsNiw4LDIxLjIsOCw0MHMxNS4yLDM0LDM0LDM0YzcuNCwwLDE0LjMtMi40LDE5LjktNi40bDI2LjMsMjYuM2w1LjYtNS42bC0yNi0yNi4xYzUuMS02LDguMi0xMy43LDguMi0yMi4xIEM3NiwyMS4yLDYwLjgsNiw0Miw2eiBNNDIsMTBjMTYuNiwwLDMwLDEzLjQsMzAsMzBTNTguNiw3MCw0Miw3MFMxMiw1Ni42LDEyLDQwUzI1LjQsMTAsNDIsMTB6XCI+PC9wYXRoPjxsaW5lIHgxPVwiMjRcIiB5MT1cIjQwXCIgeDI9XCI2MFwiIHkyPVwiNDBcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIxMFwiPjwvbGluZT5gXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPYnNpZGlhblpvb21QbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICBwcm90ZWN0ZWQgem9vbUZlYXR1cmU6IFpvb21GZWF0dXJlO1xuICBwcm90ZWN0ZWQgZmVhdHVyZXM6IEZlYXR1cmVbXTtcblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgY29uc29sZS5sb2coYExvYWRpbmcgb2JzaWRpYW4tem9vbWApO1xuXG4gICAgaWYgKHRoaXMuaXNMZWdhY3lFZGl0b3JFbmFibGVkKCkpIHtcbiAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgIGBab29tIHBsdWdpbiBkb2VzIG5vdCBzdXBwb3J0IGxlZ2FjeSBlZGl0b3IgbW9kZSBzdGFydGluZyBmcm9tIHZlcnNpb24gMC4yLiBQbGVhc2UgZGlzYWJsZSB0aGUgXCJVc2UgbGVnYWN5IGVkaXRvclwiIG9wdGlvbiBvciBtYW51YWxseSBpbnN0YWxsIHZlcnNpb24gMC4xIG9mIFpvb20gcGx1Z2luLmAsXG4gICAgICAgIDMwMDAwXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgKHdpbmRvdyBhcyBhbnkpLk9ic2lkaWFuWm9vbVBsdWdpbiA9IHRoaXM7XG5cbiAgICBjb25zdCBzZXR0aW5ncyA9IG5ldyBTZXR0aW5nc1NlcnZpY2UodGhpcyk7XG4gICAgYXdhaXQgc2V0dGluZ3MubG9hZCgpO1xuXG4gICAgY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlclNlcnZpY2Uoc2V0dGluZ3MpO1xuXG4gICAgY29uc3Qgc2V0dGluZ3NUYWJGZWF0dXJlID0gbmV3IFNldHRpbmdzVGFiRmVhdHVyZSh0aGlzLCBzZXR0aW5ncyk7XG4gICAgdGhpcy56b29tRmVhdHVyZSA9IG5ldyBab29tRmVhdHVyZSh0aGlzLCBsb2dnZXIpO1xuICAgIGNvbnN0IGxpbWl0U2VsZWN0aW9uRmVhdHVyZSA9IG5ldyBMaW1pdFNlbGVjdGlvbkZlYXR1cmUoXG4gICAgICB0aGlzLFxuICAgICAgbG9nZ2VyLFxuICAgICAgdGhpcy56b29tRmVhdHVyZVxuICAgICk7XG4gICAgY29uc3QgcmVzZXRab29tV2hlblZpc2libGVDb250ZW50Qm91bmRhcmllc1Zpb2xhdGVkRmVhdHVyZSA9XG4gICAgICBuZXcgUmVzZXRab29tV2hlblZpc2libGVDb250ZW50Qm91bmRhcmllc1Zpb2xhdGVkRmVhdHVyZShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgbG9nZ2VyLFxuICAgICAgICB0aGlzLnpvb21GZWF0dXJlLFxuICAgICAgICB0aGlzLnpvb21GZWF0dXJlXG4gICAgICApO1xuICAgIGNvbnN0IGhlYWRlck5hdmlnYXRpb25GZWF0dXJlID0gbmV3IEhlYWRlck5hdmlnYXRpb25GZWF0dXJlKFxuICAgICAgdGhpcyxcbiAgICAgIGxvZ2dlcixcbiAgICAgIHRoaXMuem9vbUZlYXR1cmUsXG4gICAgICB0aGlzLnpvb21GZWF0dXJlLFxuICAgICAgdGhpcy56b29tRmVhdHVyZSxcbiAgICAgIHRoaXMuem9vbUZlYXR1cmUsXG4gICAgICB0aGlzLnpvb21GZWF0dXJlLFxuICAgICAgdGhpcy56b29tRmVhdHVyZVxuICAgICk7XG4gICAgY29uc3Qgem9vbU9uQ2xpY2tGZWF0dXJlID0gbmV3IFpvb21PbkNsaWNrRmVhdHVyZShcbiAgICAgIHRoaXMsXG4gICAgICBzZXR0aW5ncyxcbiAgICAgIHRoaXMuem9vbUZlYXR1cmVcbiAgICApO1xuICAgIGNvbnN0IGxpc3RzU3R5bGVzRmVhdHVyZSA9IG5ldyBMaXN0c1N0eWxlc0ZlYXR1cmUoc2V0dGluZ3MpO1xuXG4gICAgdGhpcy5mZWF0dXJlcyA9IFtcbiAgICAgIHNldHRpbmdzVGFiRmVhdHVyZSxcbiAgICAgIHRoaXMuem9vbUZlYXR1cmUsXG4gICAgICBsaW1pdFNlbGVjdGlvbkZlYXR1cmUsXG4gICAgICByZXNldFpvb21XaGVuVmlzaWJsZUNvbnRlbnRCb3VuZGFyaWVzVmlvbGF0ZWRGZWF0dXJlLFxuICAgICAgaGVhZGVyTmF2aWdhdGlvbkZlYXR1cmUsXG4gICAgICB6b29tT25DbGlja0ZlYXR1cmUsXG4gICAgICBsaXN0c1N0eWxlc0ZlYXR1cmUsXG4gICAgXTtcblxuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiB0aGlzLmZlYXR1cmVzKSB7XG4gICAgICBhd2FpdCBmZWF0dXJlLmxvYWQoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBvbnVubG9hZCgpIHtcbiAgICBjb25zb2xlLmxvZyhgVW5sb2FkaW5nIG9ic2lkaWFuLXpvb21gKTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgZGVsZXRlICh3aW5kb3cgYXMgYW55KS5PYnNpZGlhblpvb21QbHVnaW47XG5cbiAgICBmb3IgKGNvbnN0IGZlYXR1cmUgb2YgdGhpcy5mZWF0dXJlcykge1xuICAgICAgYXdhaXQgZmVhdHVyZS51bmxvYWQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0Wm9vbVJhbmdlKGVkaXRvcjogRWRpdG9yKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBjb25zdCBjbTogRWRpdG9yVmlldyA9IChlZGl0b3IgYXMgYW55KS5jbTtcbiAgICBjb25zdCByYW5nZSA9IHRoaXMuem9vbUZlYXR1cmUuY2FsY3VsYXRlVmlzaWJsZUNvbnRlbnRSYW5nZShjbS5zdGF0ZSk7XG5cbiAgICBpZiAoIXJhbmdlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBmcm9tID0gY20uc3RhdGUuZG9jLmxpbmVBdChyYW5nZS5mcm9tKTtcbiAgICBjb25zdCB0byA9IGNtLnN0YXRlLmRvYy5saW5lQXQocmFuZ2UudG8pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyb206IHtcbiAgICAgICAgbGluZTogZnJvbS5udW1iZXIgLSAxLFxuICAgICAgICBjaDogcmFuZ2UuZnJvbSAtIGZyb20uZnJvbSxcbiAgICAgIH0sXG4gICAgICB0bzoge1xuICAgICAgICBsaW5lOiB0by5udW1iZXIgLSAxLFxuICAgICAgICBjaDogcmFuZ2UudG8gLSB0by5mcm9tLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHpvb21PdXQoZWRpdG9yOiBFZGl0b3IpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGNvbnN0IGNtOiBFZGl0b3JWaWV3ID0gKGVkaXRvciBhcyBhbnkpLmNtO1xuICAgIHRoaXMuem9vbUZlYXR1cmUuem9vbU91dChjbSk7XG4gIH1cblxuICBwdWJsaWMgem9vbUluKGVkaXRvcjogRWRpdG9yLCBsaW5lOiBudW1iZXIpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGNvbnN0IGNtOiBFZGl0b3JWaWV3ID0gKGVkaXRvciBhcyBhbnkpLmNtO1xuICAgIGNvbnN0IHBvcyA9IGNtLnN0YXRlLmRvYy5saW5lKGxpbmUgKyAxKS5mcm9tO1xuICAgIHRoaXMuem9vbUZlYXR1cmUuem9vbUluKGNtLCBwb3MpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0xlZ2FjeUVkaXRvckVuYWJsZWQoKSB7XG4gICAgY29uc3QgY29uZmlnOiB7IGxlZ2FjeUVkaXRvcjogYm9vbGVhbiB9ID0ge1xuICAgICAgbGVnYWN5RWRpdG9yOiBmYWxzZSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAuLi4odGhpcy5hcHAudmF1bHQgYXMgYW55KS5jb25maWcsXG4gICAgfTtcblxuICAgIHJldHVybiBjb25maWcubGVnYWN5RWRpdG9yO1xuICB9XG59XG4iXSwibmFtZXMiOlsiZWRpdG9yVmlld0ZpZWxkIiwiZWRpdG9yRWRpdG9yRmllbGQiLCJmb2xkYWJsZSIsIkVkaXRvclN0YXRlIiwiU3RhdGVFZmZlY3QiLCJTdGF0ZUZpZWxkIiwic2hvd1BhbmVsIiwiRWRpdG9yU2VsZWN0aW9uIiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJEZWNvcmF0aW9uIiwiRWRpdG9yVmlldyIsInZpZXciLCJOb3RpY2UiLCJhZGRJY29uIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFD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
