import { AdventureEntry } from "./adventureEntry.model";

export class AdventureList {
    id: string;
    name: string;
    description: string;
    adventureEntries: AdventureEntry[];
    isCompleted: boolean;
    pictureURL: string;
}