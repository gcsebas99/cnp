
export type AdventureSlot = {
  id: number;
  saved: boolean;
  reachedLevels: number;
  currentLevel: number;
  currentRoom: string;
  obtainedItems: string[];
};

export type MinigameScores = {
  tennisHighScore: number;
  basketDashHighScore: number;
  roleRushHighScore: number;
};

export class PersistentGameStateManager {
  private static STORAGE_KEY = "gameState";

  private static state: {
    adventureSlots: AdventureSlot[];
    minigames: MinigameScores;
  };

  /** Initialize storage and load state */
  static init() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      this.state = JSON.parse(raw);
    } else {
      this.state = {
        adventureSlots: Array.from({ length: 5 }, (elem, index) => ({
          id: index,
          saved: false,
          reachedLevels: 0,
          currentLevel: 0,
          currentRoom: "",
          obtainedItems: []
        })),
        minigames: {
          tennisHighScore: 0,
          basketDashHighScore: 0,
          roleRushHighScore: 0
        }
      };
      this.saveState();
    }
  }

  /** Save full state to localStorage */
  static saveState() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }

  // ---------------------------
  // Adventure Slot Management
  // ---------------------------

  static getAdventureSlot(slotId: number): AdventureSlot {
    return this.state.adventureSlots[slotId];
  }

  static saveAdventureSlot(slotId: number, data: Partial<AdventureSlot>) {
    this.state.adventureSlots[slotId] = {
      ...this.state.adventureSlots[slotId],
      ...data,
      saved: true
    };
    this.saveState();
  }

  static clearAdventureSlot(slotId: number) {
    this.state.adventureSlots[slotId] = {
      id: slotId,
      saved: false,
      reachedLevels: 0,
      currentLevel: 0,
      currentRoom: "",
      obtainedItems: []
    };
    this.saveState();
  }

  static unlockLevel(slotId: number, level: number) {
    const slot = this.state.adventureSlots[slotId];
    slot.reachedLevels = Math.max(slot.reachedLevels, level);
    this.saveState();
  }

  static setLastRoom(slotId: number, roomId: string) {
    const slot = this.state.adventureSlots[slotId];
    slot.currentRoom = roomId;
    this.saveState();
  }

  static addObtainedItem(slotId: number, item: string) {
    const slot = this.state.adventureSlots[slotId];
    if (!slot.obtainedItems.includes(item)) {
      slot.obtainedItems.push(item);
      this.saveState();
    }
  }

  // ---------------------------
  // Minigames Management
  // ---------------------------

  static getHighScore(minigame: keyof MinigameScores) {
    return this.state.minigames[minigame];
  }

  static setHighScore(minigame: keyof MinigameScores, score: number) {
    if (score > this.state.minigames[minigame]) {
      this.state.minigames[minigame] = score;
      this.saveState();
    }
  }
}
