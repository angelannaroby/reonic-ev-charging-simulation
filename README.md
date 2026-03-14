# EV Charging Demand Simulator

Thank you for taking the time to review this submission!

This repository contains my implementation of the Reonic take-home assignment. It covers **Task 1 (simulation logic)** and **Task 2a (frontend visualization)**.
You can view the running simulation directly on the **[GitHub Page](https://angelannaroby.github.io/reonic-ev-charging-simulation/)**.

## Task 1

The simulation logic is implemented in [src/lib/simulation.ts](src/lib/simulation.ts)

By default, the program simulates 20 chargepoints with 11 kW charging power over one year in 15-minute intervals, following the probability distributions provided in the assignment.

The simulation calculates the values requested in the task: total energy consumed, theoretical maximum power demand, actual peak demand, and the resulting concurrency factor.

## Task 2a

Task 2a provides a small interface to run the simulation and visualize the results.  
The UI allows adjusting the input parameters and viewing the resulting metrics and load profiles.

**Notes on the simulation logic**

One thing I was slightly unsure about while implementing the simulation was how to interpret the arrival probabilities from the assignment. The table provides probabilities per hour, while the simulation runs in 15-minute ticks.

To keep the expected number of arrivals consistent with the hourly probabilities, I convert the hourly probability into an equivalent per-tick probability before applying it in the simulation.

The UI also includes an option to run the simulation with deterministic randomness, using a seeded random generator.

## Tech Stack

React, TypeScript, Tailwind CSS, Recharts, Vite.

No UI component libraries were used, in line with the assignment instructions. I also tried to keep the overall codebase **simple and straightforward**.

## Running the project

Install the dependencies with `npm install`.  
Start the development server with `npm run dev`.

I would be happy to hear any feedback or suggestions 🙂