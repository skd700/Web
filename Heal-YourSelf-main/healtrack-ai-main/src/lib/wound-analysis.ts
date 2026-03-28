import type { WoundAnalysis } from "./wound-types";

export function analyzeWoundImage(
  imageDataUrl: string,
): Promise<WoundAnalysis> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const totalPixels = data.length / 4;

      let redPixels = 0;
      let swollenPixels = 0;
      let skinPixels = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Detect skin-tone pixels (broad range)
        const isSkin =
          r > 60 &&
          g > 30 &&
          b > 15 &&
          r > g &&
          r > b &&
          r - g > 15 &&
          Math.abs(r - g) < 170;

        if (isSkin) {
          skinPixels++;

          // Redness: high red channel, low green/blue relative to red
          const rednessRatio = r / (g + b + 1);
          if (rednessRatio > 1.3 && r > 130 && g < 140) {
            redPixels++;
          }

          // Swelling proxy: darker/purplish skin tones indicating inflammation
          const brightness = (r + g + b) / 3;
          if (
            brightness > 80 &&
            brightness < 200 &&
            Math.abs(r - b) < 50 &&
            r > g
          ) {
            swollenPixels++;
          }
        }
      }

      const skinRatio = skinPixels / totalPixels;
      const effectiveTotal = skinPixels > 100 ? skinPixels : totalPixels;

      const rednessScore = Math.min(
        100,
        Math.round((redPixels / effectiveTotal) * 400),
      );
      const swellingScore = Math.min(
        100,
        Math.round((swollenPixels / effectiveTotal) * 300),
      );

      const combinedRisk = rednessScore * 0.6 + swellingScore * 0.4;
      
       let overallRisk: "low" | "medium" | "high";

       if (rednessScore >= 40) {
         overallRisk = "high";
       } else if (rednessScore >= 5) {
         overallRisk = "medium";
       } else {
         overallRisk = "low";
       }
      const healingScore = Math.max(0, Math.round(100 - combinedRisk));

      let notes = "";
      if (rednessScore > 60)
        notes +=
          "Significant redness detected — possible infection or irritation. ";
      else if (rednessScore > 30) notes += "Moderate redness observed. ";
      else notes += "Minimal redness. ";

      if (swellingScore > 50) notes += "Notable swelling indicators present. ";
      else if (swellingScore > 25) notes += "Mild swelling indicators. ";

      if (skinRatio < 0.1)
        notes += "Low skin-area detection — results may be less accurate. ";

      if (overallRisk === "high") notes += "Recommend clinical follow-up.";
      else if (overallRisk === "medium")
        notes += "Continue monitoring closely.";
      else notes += "Healing appears to be progressing normally.";

      resolve({
        rednessScore,
        swellingScore,
        overallRisk,
        healingScore,
        notes,
      });
    };
    img.src = imageDataUrl;
  });
}
