export const getLdtkMapPath = (fileName: string): string => {
  const url = window.location.href;
  if (url.includes("localhost:5173")) {
    // dev mode: load from src
    return `src/assets/ldtk/${fileName}`;
  }
  // prod mode: load from copied /ldtk folder
  return `ldtk/${fileName}`;
}
