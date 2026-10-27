/** The car's systems, in plain words. Each step drives the animation in the scene. */
export type SystemId = "body" | "chassis" | "powertrain" | "brakes" | "suspension" | "fuel" | "wheels" | "cabin";

export interface CarSystem {
  id: SystemId;
  name: string;
  summary: string;
  steps: string[];
}

export const SYSTEMS: CarSystem[] = [
  {
    id: "powertrain",
    name: "Engine and drivetrain",
    summary: "Turns fuel into turning wheels.",
    steps: [
      "Intake. A piston drops and pulls in air and fuel.",
      "Compression. It rises and squeezes the mix.",
      "Power. A spark ignites it and drives the piston down. Four cylinders take turns, so one is always pushing.",
      "Exhaust. The piston rises again and pushes the burnt gas out.",
      "The gearbox trades speed for force, the driveshaft carries it back, and the differential lets the rear wheels turn at different speeds through a corner.",
    ],
  },
  {
    id: "brakes",
    name: "Brakes",
    summary: "Turn motion into heat.",
    steps: [
      "You press the pedal. A master cylinder pushes brake fluid down the lines.",
      "Fluid barely compresses, so the force reaches every wheel almost at once.",
      "Pistons in each caliper squeeze pads against the spinning disc.",
      "Friction turns the car's motion into heat. In a hard stop a disc can pass 300°C.",
    ],
  },
  {
    id: "suspension",
    name: "Suspension and steering",
    summary: "Keeps the tyres on the road and points them.",
    steps: [
      "Springs carry the car's weight and soak up bumps.",
      "Dampers stop the springs from bouncing, so the tyres stay pressed to the road.",
      "The steering rack turns the front wheels. The inside wheel turns a little more than the outside one, so both follow the curve.",
    ],
  },
  {
    id: "fuel",
    name: "Fuel and exhaust",
    summary: "Fuel in at one end, cleaned gas out the other.",
    steps: [
      "A pump in the tank sends fuel forward to the injectors.",
      "Burnt gas leaves the engine through the exhaust pipe.",
      "The catalytic converter turns the worst gases into less harmful ones.",
      "The muffler quiets it before it leaves the tailpipe.",
    ],
  },
  {
    id: "wheels",
    name: "Wheels and tyres",
    summary: "Where the car meets the road.",
    steps: [
      "Each tyre touches the road on a patch about the size of a postcard. Everything the car does goes through those four patches.",
      "Tread channels push water out from under the rubber so it can grip.",
      "The rim carries the load to the hub, which spins on bearings.",
    ],
  },
  {
    id: "body",
    name: "Body",
    summary: "The shell, panels, doors and lights.",
    steps: [
      "The shell keeps the weather out and holds the cabin rigid.",
      "Crumple zones at the front and back fold in a crash so the cabin doesn't.",
    ],
  },
  {
    id: "chassis",
    name: "Chassis",
    summary: "What everything bolts to.",
    steps: [
      "Most cars today build the frame into the shell. This one shows a simple ladder frame so you can see where the loads go: two rails and cross members carrying the engine, the passengers and the road.",
    ],
  },
  {
    id: "cabin",
    name: "Cabin",
    summary: "Seats, dashboard and controls.",
    steps: ["The steering wheel turns a column that runs down to the rack under the bonnet. The seats bolt to the floor, which bolts to the frame."],
  },
];

export const PAINTS = [
  { name: "Signal orange", hex: "#e8541c" },
  { name: "Graphite", hex: "#2b2d31" },
  { name: "Chalk", hex: "#e9e6df" },
  { name: "Atlantic blue", hex: "#1f4e79" },
  { name: "Forest", hex: "#1e3b2e" },
];
