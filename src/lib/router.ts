import { useState, useEffect, useCallback } from "react";

// Redirect hash routing to clean URLs on initial page load
if (window.location.hash) {
  let hashPath = window.location.hash.slice(1) || "/";
  if (hashPath && !hashPath.startsWith("/")) {
    hashPath = "/" + hashPath;
  }
  window.history.replaceState(null, "", hashPath);
}

let currentPath = window.location.pathname || "/";
const listeners = new Set<(path: string) => void>();

const updatePath = () => {
  const newPath = window.location.pathname || "/";
  if (newPath !== currentPath) {
    currentPath = newPath;
    listeners.forEach(l => l(currentPath));
  }
};

window.addEventListener("popstate", updatePath);

export function useRouter() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    listeners.add(setPath);
    return () => {
      listeners.delete(setPath);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    // If navigating to home or other virtual pages
    let target = to.startsWith("#") ? to.slice(1) || "/" : to;
    if (target && !target.startsWith("/")) {
      target = "/" + target;
    }
    window.history.pushState(null, "", target);
    currentPath = target;
    listeners.forEach(l => l(currentPath));
    window.scrollTo(0, 0);
  }, []);

  return { path, navigate };
}

