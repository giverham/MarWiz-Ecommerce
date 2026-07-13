import { useState, useEffect, useCallback } from "react";

let currentPath = window.location.hash.slice(1) || "/";
const listeners = new Set<(path: string) => void>();

const updatePath = () => {
  const newPath = window.location.hash.slice(1) || "/";
  if (newPath !== currentPath) {
    currentPath = newPath;
    listeners.forEach(l => l(currentPath));
  }
};

window.addEventListener("hashchange", updatePath);

export function useRouter() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    listeners.add(setPath);
    return () => {
      listeners.delete(setPath);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
    currentPath = to.startsWith('#') ? to.slice(1) : to;
    listeners.forEach(l => l(currentPath));
    window.scrollTo(0, 0);
  }, []);

  return { path, navigate };
}
