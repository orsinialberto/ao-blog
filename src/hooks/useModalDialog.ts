import { useEffect, type RefObject } from "react";

function trapFocus(e: KeyboardEvent, dialog: HTMLElement | null) {
  const focusable = dialog?.querySelectorAll<HTMLElement>("button");
  if (!focusable?.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/**
 * Modal behaviour shared by the lightboxes: focus moves to `initialFocusRef` on open and back
 * to the opener on close, the page behind does not scroll, Tab stays inside the dialog and
 * every other key goes to `onKeyDown` (keep it stable with useCallback).
 */
export function useModalDialog(
  dialogRef: RefObject<HTMLElement | null>,
  initialFocusRef: RefObject<HTMLElement | null>,
  onKeyDown: (e: KeyboardEvent) => void,
) {
  useEffect(() => {
    const opener = document.activeElement;
    initialFocusRef.current?.focus();
    return () => {
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [initialFocusRef]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Tab") trapFocus(e, dialogRef.current);
      else onKeyDown(e);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dialogRef, onKeyDown]);
}
