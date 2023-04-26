import { useEffect, useRef, ReactNode, useMemo, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

// const modalRoot = document.querySelector("#modal-root") as HTMLElement;

type PortalProps = {
    children: ReactNode;
    onPortalClose?: () => void
    title: string
    windowWidth?: number
    windowHeight?: number
};
function copyStyles(sourceDoc: Document, targetDoc: Document) {
    Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
        if (styleSheet.cssRules) {
            // true for inline styles
            const newStyleEl = sourceDoc.createElement("style");

            Array.from(styleSheet.cssRules).forEach(cssRule => {
                newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
            });

            targetDoc.head.appendChild(newStyleEl);
        } else if (styleSheet.href) {
            // true for stylesheets loaded from a URL
            const newLinkEl = sourceDoc.createElement("link");

            newLinkEl.rel = "stylesheet";
            newLinkEl.href = styleSheet.href;
            targetDoc.head.appendChild(newLinkEl);
        }
    });
}
function Portal({
    children,
    onPortalClose,
    title,
    windowWidth = 400,
    windowHeight = 300
}: PortalProps) {
    const containerEl = useMemo(() => document.createElement("div"), [])
    useEffect(() => {
        const theme = localStorage.getItem('theme') || 'light'
        const externalWindow = window.open("", "", `width=${windowWidth},height=${windowHeight},left=200,top=200`)

        if (externalWindow) {
            externalWindow.document.documentElement.dataset.mode = theme;
            externalWindow.document.title = title;
            let setFavicon = document.createElement('link');
            setFavicon.type = 'image/x-icon';
            setFavicon.rel = 'shortcut icon';
            setFavicon.href = 'http://127.0.0.1:5173/socialfly.ico';
            externalWindow.document.head.appendChild(setFavicon);

            containerEl.id = 'root'
            copyStyles(document, externalWindow.document);
            externalWindow.document.body.appendChild(containerEl);

        }
        function beforeUnload(e: BeforeUnloadEvent) {
            e.preventDefault();
            onPortalClose && onPortalClose();
            return true;
        }
        externalWindow?.addEventListener("beforeunload", beforeUnload);
        return () => {
            externalWindow?.removeEventListener("beforeunload", beforeUnload)
            externalWindow && externalWindow.close()
        }
    }, [])
    return createPortal(children, containerEl);
}

export default Portal