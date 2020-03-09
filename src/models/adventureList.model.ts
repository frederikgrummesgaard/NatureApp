import { AdventureEntry } from "./adventureEntry.model";

export class AdventureList {
    id: number;
    name: string;
    description: string;
    adventureEntries: AdventureEntry[];
    isCompleted: boolean;
}