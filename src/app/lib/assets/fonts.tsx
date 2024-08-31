import localFont from "next/font/local";

export const zisouSlabs = localFont({
  src: [
    {
      path: "../../../../public/fonts/Zizou Slab-Regular 1.otf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../../../../public/fonts/Zizou Slab-Bold 1.otf",
      weight: "900",
      style: "normal"
    }
  ],
  display: "swap"
});
