import { action, makeObservable, observable } from 'mobx';

const UNDO_REDO_PORTAL_ELEMENT_ID = 'header-undo-redo-portal';

export class HeaderStore {
  portalElementId: string = UNDO_REDO_PORTAL_ELEMENT_ID;
  undoRedoPortalElement: HTMLElement | null = null;
  viewMessage: null | {
    detail: string;
    header: string;
    type: 'info' | 'warning';
  } = null;

  constructor() {
    makeObservable(this, {
      resetViewMessage: action,
      setUndoRedoPortalElement: action,
      setViewMessage: action,
      undoRedoPortalElement: observable,
      viewMessage: observable,
    });
  }

  resetViewMessage() {
    this.viewMessage = null;
  }

  setUndoRedoPortalElement(element: HTMLElement | null) {
    this.undoRedoPortalElement = element;
  }

  setViewMessage(viewMessage: {
    detail: string;
    header: string;
    type: 'info' | 'warning';
  }) {
    this.viewMessage = viewMessage;
  }
}
