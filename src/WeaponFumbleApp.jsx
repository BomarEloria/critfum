import { useState } from "react";

/*
Weapon Fumble App
Version: v1.0.3
Status: STABLE – CANONICAL FUMBLES (LOCKED)
License: MIT
*/

const randomOf = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const FUMBLE_CAUSES = [
  "tripping over your own ambition",
  "a deeply unhelpful pebble",
  "your feet briefly forgetting how feet work",
  "a mistimed step that history will not forgive",
  "gravity taking a personal interest",
  "confidence wildly outpacing coordination",
  "a dramatic move nobody asked for",
  "trying something very impressive at the wrong moment",
  "a momentary disagreement between you and your equipment",
  "your grip slipping at the worst possible instant",
  "battlefield terrain choosing violence",
  "your body vetoing the plan",
  "a spectacular loss of dignity",
  "your limbs rebelling in unison",
  "a legendary blunder future bards will mock",
  "the universe briefly laughing at you"
];

const FUMBLES = {
  oneHanded: [
    { min: 1, max: 25, effect: "Lose your grip and the opportunity to get an open blow." },
    { min: 26, max: 30, effect: "Drop your weapon. It will take 1 round to draw a new one, or 2 to recover the old." },
    { min: 31, max: 40, effect: "You slip with grace and lose the opportunity to get in the vital blow." },
    { min: 41, max: 50, effect: "Bad follow through. You lose your opportunity and give yourself 1 hit. Real weak." },
    { min: 51, max: 60, effect: "You slip without grace and lose 2 rounds worth of opportunity. Good luck pal!" },
    { min: 61, max: 70, effect: "Lose your grip and juggle your weapon for 2 rounds. You can still parry." },
    { min: 71, max: 80, effect: "Lose your grip and juggle your weapon for 2 rounds. Unfortunately you cannot parry." },
    { min: 81, max: 85, effect: "You lose your wind and realize you should relax, not swing for 2 rounds." },
    { min: 86, max: 90, effect: "Foe's smooth moves leave you stunned for 2 rounds. Hopefully you'll learn." },
    { min: 91, max: 95, effect: "You stumble. The classless display leaves your stunned for 3 rounds." },
    { min: 96, max: 99, effect: "Swallow tongue in the excitement. You are unable to parry for 3 rounds." },
    { min: 100, max: 100, effect: "Bad taste and poor execution. You attempt to maim yourself spectacularly." }
  ]
};

export default function WeaponFumbleApp() {
  const [type, setType] = useState("oneHanded");
  const [roll, setRoll] = useState(1);
  const [result, setResult] = useState(null);

  const generateFumble = () => {
    const safeRoll = clamp(roll, 1, 100);
    const entry = FUMBLES[type].find(
      (r) => safeRoll >= r.min && safeRoll <= r.max
    );
    setResult({ cause: randomOf(FUMBLE_CAUSES), effect: entry.effect });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
      <div style={{ maxWidth: 500, width: "100%" }}>
        <h2>Weapon Fumble Generator</h2>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <option value="oneHanded">One‑Handed</option>
        </select>

        <input
          type="number"
          min={1}
          max={100}
          value={roll}
          onChange={(e) => setRoll(Number(e.target.value))}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button onClick={generateFumble} style={{ width: "100%" }}>
          Resolve Fumble (d100)
        </button>

        {result && (
          <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc" }}>
            <p>
              <strong>Cause:</strong> {result.cause}
            </p>
            <p>
              <strong>Result:</strong> {result.effect}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
