"use client";

import { ReactNode, useContext, useState } from "react";
import { motion, AnimatePresence, useIsPresent } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  NavigationPromisesContext,
  PathnameContext,
  PathParamsContext,
  SearchParamsContext,
} from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { useLenis } from "@studio-freight/react-lenis";

/*
 * Page transitions live here, in the persistent root layout, rather than in app/template.tsx:
 * - A template is remounted whenever the top-level segment changes, which killed AnimatePresence
 *   before any exit animation could play.
 * - Next's `children` renders whatever route is *current*, so the exiting wrapper showed the new page
 *   during the exit and the page then mounted a second time. FrozenRouter fixes that below.
 */

// While a page is animating out, keep feeding it the router state it was rendered with: the route tree
// (so it keeps showing the old route instead of the new one) and the values behind usePathname,
// useParams and useSearchParams (so it doesn't react to the new URL, e.g. refetch with the next
// page's params). While it is the current page it gets live updates, so search-param changes still
// work; freezing only applies during the exit.
function FrozenRouter({ children }: { children: ReactNode }) {
  const live = {
    layout: useContext(LayoutRouterContext),
    pathname: useContext(PathnameContext),
    params: useContext(PathParamsContext),
    searchParams: useContext(SearchParamsContext),
    // Only set in development, where the navigation hooks read from it instead
    navigationPromises: useContext(NavigationPromisesContext),
  };
  const isPresent = useIsPresent();
  const [lastPresent, setLastPresent] = useState(live);

  // Track the latest values while present (React's "adjust state during render" pattern)
  const changed = (Object.keys(live) as (keyof typeof live)[]).some((key) => live[key] !== lastPresent[key]);
  if (isPresent && changed) {
    setLastPresent(live);
  }

  const value = isPresent ? live : lastPresent;
  return (
    <LayoutRouterContext.Provider value={value.layout}>
      <PathnameContext.Provider value={value.pathname}>
        <PathParamsContext.Provider value={value.params}>
          <SearchParamsContext.Provider value={value.searchParams}>
            <NavigationPromisesContext.Provider value={value.navigationPromises}>
              {children}
            </NavigationPromisesContext.Provider>
          </SearchParamsContext.Provider>
        </PathParamsContext.Provider>
      </PathnameContext.Provider>
    </LayoutRouterContext.Provider>
  );
}

export default function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const content = <FrozenRouter>{children}</FrozenRouter>;

  // Helper to determine route type
  const isHome = pathname === "/";
  const isProducts = pathname.startsWith("/products");
  const isAbout = pathname === "/about";
  const isRewards = pathname === "/rewards";

  const renderTransition = () => {
    if (isHome) {
      // Split Screen Reveal
      return (
        <div key={pathname} className="flex-1 w-full flex flex-col relative">
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            exit={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 left-0 w-1/2 bg-primary z-[100] origin-left"
            style={{ pointerEvents: "none" }}
          />
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            exit={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 w-1/2 bg-primary z-[100] origin-right"
            style={{ pointerEvents: "none" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 w-full flex flex-col"
          >
            {content}
          </motion.div>
        </div>
      );
    }

    if (isProducts) {
      // Slide from Right
      return (
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 w-full flex flex-col"
        >
          {content}
        </motion.div>
      );
    }

    if (isAbout) {
      // Ethereal Fade Scale
      return (
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex-1 w-full flex flex-col"
        >
          {content}
        </motion.div>
      );
    }

    if (isRewards) {
      // Curtain Reveal
      return (
        <div key={pathname} className="flex-1 w-full flex flex-col relative">
          <motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-primary z-[100] origin-top"
            style={{ pointerEvents: "none" }}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 w-full flex flex-col"
          >
            {content}
          </motion.div>
        </div>
      );
    }

    // Default Fallback
    return (
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4 }}
        className="flex-1 w-full flex flex-col"
      >
        {content}
      </motion.div>
    );
  };

  // Next scrolls to the top when a navigation commits, but the new page only mounts once the old one
  // has finished animating out, so reset the scroll position at that moment instead
  const handleExitComplete = () => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {renderTransition()}
    </AnimatePresence>
  );
}
