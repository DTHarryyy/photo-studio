export type UserLayer =
  | {
      id: string;
      type: "sticker";
      src: string;
      name: string;
      /** x position: 0-100, percentage of container width, centered */
      x: number;
      /** y position: 0-100, percentage of container height, centered */
      y: number;
      /** rendered size: percentage of container width (default 15) */
      size: number;
      rotation: number;
      zIndex: number;
    }
  | {
      id: string;
      type: "text";
      text: string;
      /** x position: 0-100, percentage of container width */
      x: number;
      /** y position: 0-100, percentage of container height */
      y: number;
      /** font size: percentage of container width (default 7) */
      fontSize: number;
      fontFamily: string;
      color: string;
      zIndex: number;
    };

export type LayerPatch = Partial<{
  src: string;
  name: string;
  text: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  zIndex: number;
}>;
