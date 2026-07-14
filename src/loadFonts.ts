import { continueRender, delayRender, staticFile } from "remotion";

const waitForFonts = delayRender("Loading OPPO Sans");

if (typeof document !== "undefined") {
  Promise.all([
    new FontFace("OPPO Sans", `url(${staticFile("fonts/OPPOSans-R.ttf")})`, {
      weight: "400",
    }).load(),
    new FontFace("OPPO Sans", `url(${staticFile("fonts/OPPOSans-M.ttf")})`, {
      weight: "500",
    }).load(),
    new FontFace("OPPO Sans", `url(${staticFile("fonts/OPPOSans-H.ttf")})`, {
      weight: "800",
    }).load(),
  ])
    .then((fonts) => {
      fonts.forEach((font) => document.fonts.add(font));
      continueRender(waitForFonts);
    })
    .catch(() => continueRender(waitForFonts));
} else {
  continueRender(waitForFonts);
}
