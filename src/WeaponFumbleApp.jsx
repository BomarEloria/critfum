import { useState } from "react";


/*
Weapon Fumble App
Version: v1.0.3
Status: STABLE – CANONICAL FUMBLES (LOCKED)
License: MIT

LOCKED COMPONENT
----------------
• Do not combine with critical hit logic
• Do not refactor FUMBLES
• Do not normalize wording
• Tables must remain verbatim
*/

const randomOf = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Defensive clamp to keep rolls in a safe, publish‑grade range
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/* ===================== FUMBLE CAUSES ===================== */
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

/* ===================== FUMBLES — VERBATIM (v1.0.3) ===================== */
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
  ],

  twoHanded: [
    { min: 1, max: 25, effect: "Lose your grip. You lose the opportunity to take an open swing." },
    { min: 26, max: 30, effect: "Drop your weapon. It will take 2 rds to draw new one, or 4 to recover the old." },
    { min: 31, max: 40, effect: "You slip into fog of mind. You lose 1 round in order to collect your thoughts." },
    { min: 41, max: 50, effect: "Stumble over unseen imaginary deceased turtle. You lose 2 rds of action but can still parry." },
    { min: 51, max: 60, effect: "Bad move, you lose 2 rounds of open swings, fortunately you can still parry." },
    { min: 61, max: 70, effect: "Lose your grip and juggle your weapon for 2 rounds. You can still parry." },
    { min: 71, max: 80, effect: "Very bad move. You are stunned and unable to parry for 2 rounds. Not good!" },
    { min: 81, max: 85, effect: "Lose your grip and juggle your weapon for 3 rounds. You can still parry." },
    { min: 86, max: 90, effect: "Incredibly bad move. You are stunned and unable to parry for 3 rounds." },
    { min: 91, max: 95, effect: "You stumble and nearly fall down in an apparent attempt to commit suicide. You are stunned 4 rounds." },
    { min: 96, max: 99, effect: "You trip and fall. It will take 4 rounds to recover. You are unable to parry for 3 rounds." },
    { min: 100, max: 100, effect: "Worst move anyone has seen in ages. Everyone stops to stare." }
  ],

  spearPolearms: [
    { min: 1, max: 25, effect: "Lose your grip. You lose the opportunity to taken an open swing." },
    { min: 26, max: 30, effect: "Fumble your delivery. You lose the option to attack but can still parry." },
    { min: 31, max: 40, effect: "You slip and are stunned for 1 round. Alright, you just look clumsy, try again." },
    { min: 41, max: 50, effect: "Lose your grip and juggle weapon for 2 rounds. You can still parry. Your next swing is at -10%." },
    { min: 51, max: 60, effect: "You slip and almost fall. You are stunned an unable to parry for 2 rounds." },
    { min: 61, max: 70, effect: "Lose your grip and juggle weapon for 3 rounds. Your next swing is at -10%." },
    { min: 71, max: 80, effect: "Fumble your follow through. You lose 3 rounds and are stunned for 2 rounds." },
    { min: 81, max: 85, effect: "Clumsy move. You are stunned and unable top parry for 3 rounds." },
    { min: 86, max: 90, effect: "Drop your weapon. It will take 2 rounds to draw new one or 6 to recover the old." },
    { min: 91, max: 95, effect: "You trip and fall. It will take 4 rounds to recover. You are unable to parry for 3 rounds." },
    { min: 96, max: 99, effect: "You injure your shoulder. You are stunned and unable top parry for 3 rounds. Fight at -35%" },
    { min: 100, max: 100, effect: "You break your weapon and are stunned and not able to parry for 6 rounds." }
  ],

  mountedArms: [
    { min: 1, max: 25, effect: "Lose your grip. You lose the opportunity to take an open strike." },
    { min: 26, max: 30, effect: "Fumble your delivery. You lose 2 rounds, but can still parry." },
    { min: 31, max: 40, effect: "You slip and lose your saddle position. You lose 2 rounds but can still parry." },
    { min: 41, max: 50, effect: "Your mount rears and you are quite stunned for 2 rounds during the recovery." },
    { min: 51, max: 60, effect: "You lose your grip and fumble your weapon. You are stunned for 3 rounds." },
    { min: 61, max: 70, effect: "Your poor mount stumbles and you are stunned and unable to parry for 2 rounds." },
    { min: 71, max: 80, effect: "You break your weapon and lose 2 rounds while drawing a new one." },
    { min: 81, max: 85, effect: "You drop your weapon in one of your lighter moments. Lose 2 rounds drawing a new one." },
    { min: 86, max: 90, effect: "You drop your weapon and lose 2 rounds drawing new one. You take 10 hits." },
    { min: 91, max: 95, effect: "Your seating is improper and you find yourself stunned and unable to parry for 3 rounds." },
    { min: 96, max: 99, effect: "Your body absorbs the impact you take 20 hits and are stunned and unable to parry for 6 rounds." },
    { min: 100, max: 100, effect: "You fall off your mount. Roll on the \"D\" critical strike table (crushes)" }
  ],

  thrownArms: [
    { min: 1, max: 25, effect: "Lose your grip. You elect not to attack because of lost control." },
    { min: 26, max: 30, effect: "Fumble your delivery, hang onto your weapon. Subtract 10% from next attack." },
    { min: 31, max: 40, effect: "You slip and lose 2 rounds to fully recover. You hold onto weapon and can still parry" },
    { min: 41, max: 50, effect: "You fumble weapon after lose your grip. You are stunned for 3 rounds." },
    { min: 51, max: 60, effect: "Poor release. Weapon lands harmlessly 20 feet to the left of the target." },
    { min: 61, max: 70, effect: "Very poor release sends weapon off directly to the right. Reroll if someone lies in the new path." },
    { min: 71, max: 80, effect: "You slip and lose 3 rounds to fully recover. You hold onto weapon but cannot parry." },
    { min: 81, max: 85, effect: "You drop your weapon. It will take 2 rounds to draw new one or 4 to recover the old." },
    { min: 86, max: 90, effect: "You fumble your weapon badly but hang onto it. You are stunned and unable to parry for 5 rounds." },
    { min: 91, max: 95, effect: "You let go of your weapon too early and send it off 30 feet behind you." },
    { min: 96, max: 99, effect: "You fall down. Your shot goes astray. You are stunned for 12 rounds." },
    { min: 100, max: 100, effect: "You hit yourself during delivery. Roll on the \"D\" critical strike table (crushes)" }
  ],

  bows: [
    { min: 1, max: 25, effect: "Lose your grip. You elect not to attack. Good Choice." },
    { min: 26, max: 30, effect: "One's ten thumbs just cannot handle loading. You lose the round." },
    { min: 31, max: 40, effect: "You fumble your ammunition. You lose 2 rounds trying to recover - real weak, kid!" },
    { min: 41, max: 50, effect: "Break arrow and lose your cool. Find yourself out of 2 rounds of action." },
    { min: 51, max: 60, effect: "Drop your arrow. You lose 2 rounds reloading. Try hand arms next time!" },
    { min: 61, max: 70, effect: "Drop your bow. You lose 2 rounds while retrieving it and reloading." },
    { min: 71, max: 80, effect: "Bowstring breaks. You lose 2 rounds drawing new weapon or 6 while restringing bow." },
    { min: 81, max: 85, effect: "You fumble your weapon. You are stunned and quite unable to parry for the next 3 rounds." },
    { min: 86, max: 90, effect: "You let arrow fly much too soon. You strike 20 feet short of target. You are out 2 rounds." },
    { min: 91, max: 95, effect: "Slip and fall down. Your shot goes astray. You are stunned for 5 rds unable to parry for 2 rds." },
    { min: 96, max: 99, effect: "Break your bow. You are stunned and unable to parry for 4 rounds of action. Good luck pal!" },
    { min: 100, max: 100, effect: "Poor judgement. You let arrow fly and lose an ear. That stings." }
  ]
};

export default function WeaponFumbleApp() {
  const [type, setType] = useState("oneHanded");
  const [roll, setRoll] = useState(1);
  const [result, setResult] = useState(null);

  const generateFumble = () => {
    const safeRoll = clamp(roll, 1, 100);
    const entry = FUMBLES[type].find(r => safeRoll >= r.min && safeRoll <= r.max);
    setResult({ cause: randomOf(FUMBLE_CAUSES), effect: entry.effect });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
     <div style={{ maxWidth: 500, margin: "0 auto" }}><div style={{ maxWidth: 500, margin="number"}
    min={1}
    max={100}
    value={roll}
    onChange={e => setRoll(Number(e.target.value))}
  />
</div>
  <button onClick={generateFumble}>Resolve Fumble (d100)</button>
  <input

    </div>
  );
}
