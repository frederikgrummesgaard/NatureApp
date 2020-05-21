import { AdventureEntry } from "./adventureEntry.model";

export class AdventureList {
    id: string;
    name: string;
    description: string;
    difficulty: number;
    adventureEntries: AdventureEntry[];
    isCompleted: boolean;
    pictureURL: string;
}