import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

// True only on the client, where persisted auth/cart state has been loaded from localStorage
export const useIsClient = () => useSyncExternalStore(noopSubscribe, () => true, () => false);
