import { Tale } from "./tale.model";

export class TaleCategory {
    id: number;
    name: string;
    description: string;
    pictureURL: string;
    tales: Tale[];
}