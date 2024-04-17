enum PuzzleType {
  '2x2' = '2x2',
  '3x3' = '3x3',
  '4x4' = '4x4',
  '5x5' = '5x5',
  '6x6' = '6x6',
  '7x7' = '7x7',
  'pyraminx' = 'pyraminx',
  'megaminx' = 'megaminx',
  'skewb' = 'skewb',
  'clock' = 'clock',
  'square1' = 'square1',
}

class ScrambleGenerator {
  private active: Set<string> = new Set<string>();
  private opposite: { [key: string]: string } = {
    U: 'D',
    D: 'U',
    L: 'R',
    R: 'L',
    F: 'B',
    B: 'F',
  };

  private randomNum(limit: number): number {
    return Math.floor(Math.random() * limit);
  }

  private removeIntersections(curr: string): void {
    this.active.forEach((move) => {
      if (move !== curr && move !== this.opposite[curr]) this.active.delete(move);
    });
  }

  private standardScramble(size: string, length: number): string[] {
    const moves = ['U', 'D', 'L', 'R', 'F', 'B'];
    const endings = size === 'small' ? ['', "'", '2'] : ['', "'", '2', 'w', "w'", 'w2'];
    const n = moves.length;
    const m = endings.length;
    const scramble: string[] = [];
    let count = 0;
    while (count < length) {
      const randMove = moves[this.randomNum(n)];
      if (
        (scramble[count - 1] &&
          (scramble[count - 1].startsWith(randMove) ||
            (size !== 'large' ? false : scramble[count - 1].startsWith('3' + randMove)))) ||
        this.active.has(randMove)
      )
        continue;
      this.active.add(randMove);
      const num = this.randomNum(m);
      scramble.push(
        (size === 'large' && num >= 3 && Math.random() < 0.5 ? '3' : '') + randMove + endings[num]
      );
      this.removeIntersections(randMove);
      count++;
    }
    return scramble;
  }

  public generateScramble(type: PuzzleType): string[] {
    switch (type) {
      case PuzzleType['2x2']:
        return this.standardScramble('small', 12);
      case PuzzleType['3x3']:
        return this.standardScramble('small', 25);
      case PuzzleType['4x4']:
        return this.standardScramble('medium', 40);
      case PuzzleType['5x5']:
        return this.standardScramble('medium', 60);
      case PuzzleType['6x6']:
        return this.standardScramble('large', 85);
      case PuzzleType['7x7']:
        return this.standardScramble('large', 95);
      case PuzzleType.pyraminx:
        return this.pyraminxScramble();
      case PuzzleType.megaminx:
        return this.megaminxScramble();
      case PuzzleType.skewb:
        return this.skewbScramble();
      case PuzzleType.clock:
        return this.clockScramble();
      case PuzzleType.square1:
        return this.square1Scramble();
    }
  }

  public getScrambleTypes() {
    return Object.keys(PuzzleType).map((key) => PuzzleType[key]);
  }

  private pyraminxScramble(): string[] {
    const moves = ['U', 'L', 'R', 'B', 'u', 'l', 'r', 'b'];
    const endings = ['', "'", '2'];
    const movedTips = new Set<string>();
    const n = moves.length;
    const m = endings.length;
    const scramble: string[] = [];
    let count = 0;
    while (count < 25) {
      const randMove = moves[this.randomNum(n)];
      if (
        (scramble[count - 1] && scramble[count - 1].startsWith(randMove)) ||
        movedTips.has(randMove)
      )
        continue;
      if (/^[ulrb]$/.test(randMove)) movedTips.add(randMove);
      scramble.push(randMove + endings[this.randomNum(m)]);
      count++;
    }
    return scramble;
  }

  private megaminxScramble(): string[] {
    const moves = ['U', 'R', 'D'];
    const active = {
      U: false,
      D: false,
    };
    const n = moves.length;
    const scramble: string[] = [];
    let count = 0;
    while (count < 70) {
      const randMove = moves[this.randomNum(n)];
      if (
        (scramble[count - 1] && scramble[count - 1].startsWith(randMove)) ||
        active[randMove as keyof typeof active]
      )
        continue;
      if (randMove in active) active[randMove as keyof typeof active] = true;
      else if (randMove === 'R') {
        active['U'] = false;
        active['D'] = false;
      }
      scramble.push(
        randMove +
          (randMove === 'U' ? (Math.random() < 0.5 ? "'" : '') : Math.random() < 0.5 ? '++' : '--')
      );
      count++;
    }
    return scramble;
  }

  private skewbScramble(): string[] {
    const moves = ['U', 'L', 'R', 'B'];
    const n = moves.length;
    const scramble: string[] = [];
    let count = 0;
    while (count < 12) {
      const randMove = moves[this.randomNum(n)];
      if (scramble[count - 1] && scramble[count - 1].startsWith(randMove)) continue;
      scramble.push(randMove + (Math.random() < 0.5 ? "'" : ''));
      count++;
    }
    return scramble;
  }

  private square1Scramble(): string[] {
    const moves = ['U', 'D', 'R', 'L', 'u', 'd', 'r', 'l', 'M', 'E', 'S'];
    const n = moves.length;
    const scramble: string[] = [];
    let count = 0;
    while (count < 25) {
      const randMove = moves[this.randomNum(n)];
      if (scramble[count - 1] && scramble[count - 1] === randMove) continue;
      scramble.push(randMove);
      count++;
    }
    return scramble;
  }

  private clockScramble(): string[] {
    const pins = ['UR', 'DR', 'DL', 'UL'];
    const backMoves = ['U', 'R', 'D', 'L', 'ALL'];
    const frontMoves = pins.concat(backMoves);
    const randomClockScrambleString = (): string[] => {
      let filteringMoveCount = 0;
      const randomSuffix = (): string => {
        const amount = this.randomNum(12);
        if (amount !== 0) filteringMoveCount++;
        if (amount <= 6) return `${amount}+`;
        else return `${12 - amount}-`;
      };
      const moves: string[] = [];
      const side = (families: string[]): void => {
        for (const family of families) {
          moves.push(`${family}${randomSuffix()}`);
        }
      };
      side(frontMoves);
      moves.push('y2');
      side(backMoves);
      if (filteringMoveCount < 2) return randomClockScrambleString();
      for (const pin of pins) {
        if (this.randomNum(2) === 0) moves.push(pin);
      }
      return moves;
    };
    return randomClockScrambleString();
  }
}

const scrambler = new ScrambleGenerator();

export { scrambler, PuzzleType };
