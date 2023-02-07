export interface NounSeed {
  background: number;
  body: number;
  head: number;
  glasses: number;
  skill: number;
}

export interface EncodedImage {
  filename: string;
  data: string;
}

export interface NounData {
  parts: EncodedImage[];
  background: string;
}
