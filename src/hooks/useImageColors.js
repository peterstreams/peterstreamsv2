import { useState, useEffect } from "react";

export function useImageColors(imageUrl) {
  const [colors, setColors] = useState(null);

  useEffect(() => {
    if (!imageUrl) {
      setColors(null);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const w = (canvas.width = 40);
        const h = (canvas.height = 40);
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;

        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        let vR = 0, vG = 0, vB = 0, maxSat = 0;

        for (let i = 0; i < data.length; i += 4) {
          const pr = data[i], pg = data[i + 1], pb = data[i + 2];
          rSum += pr; gSum += pg; bSum += pb; count++;

          const max = Math.max(pr, pg, pb);
          const min = Math.min(pr, pg, pb);
          const sat = max === 0 ? 0 : (max - min) / max;
          const lum = (pr + pg + pb) / 3;

          if (sat > maxSat && sat > 0.25 && lum > 20 && lum < 235) {
            maxSat = sat;
            vR = pr; vG = pg; vB = pb;
          }
        }

        const r = Math.round(rSum / count);
        const g = Math.round(gSum / count);
        const b = Math.round(bSum / count);

        const vibrant = maxSat > 0.25 ? { r: vR, g: vG, b: vB } : { r, g, b };
        if (!cancelled) setColors({ vibrant, dominant: { r, g, b } });
      } catch (e) {
        if (!cancelled) setColors(null);
      }
    };

    img.onerror = () => { if (!cancelled) setColors(null); };
    img.src = imageUrl;

    return () => { cancelled = true; };
  }, [imageUrl]);

  return colors;
}