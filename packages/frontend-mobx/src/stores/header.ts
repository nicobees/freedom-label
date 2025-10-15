import { action, makeObservable, observable } from 'mobx';

const UNDO_REDO_PORTAL_ELEMENT_ID = 'header-undo-redo-portal';

export class HeaderStore {
  portalElementId: string = UNDO_REDO_PORTAL_ELEMENT_ID;
  undoRedoPortalElement: HTMLElement | null = null;

  constructor() {
    makeObservable(this, {
      setUndoRedoPortalElement: action,
      undoRedoPortalElement: observable,
    });
  }

  setUndoRedoPortalElement(element: HTMLElement | null) {
    this.undoRedoPortalElement = element;
  }
}
