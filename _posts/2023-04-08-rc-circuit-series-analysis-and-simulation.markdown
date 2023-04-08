---
layout: post
title:  "RC Circuit (Series) Analysis and Simulation"
date:   2023-04-08 15:22:33 -0300
categories: electronics
---

{% include _mathjax_support.html %}

Salutes from Araraquara!

So I was recapping a few circuits topics from engineering school and I had so much fun analysing an RC (series) circuit that I went as far as coding a simulator for it and creating [a new repo I intend to increment with a few more circuit simulators in the future.](https://github.com/vasconcedu/circuits)

This post explores the theory behind RC (series) circuits and wraps it up with a few simulations I've coded myself. Get ready for a couple of first order differential equations! It's going to be fun! :) 

## What's an RC Circuit? 

I'll go straight to the point. Here's what we're talking about: 

<img src="/images/rc-series-circuit.png" />

An RC (series) circuit contains a resistor $R$ and a capacitor $C$, hence the name. $V_s$ represents a DC power supply and $V_o$ is the initial voltage across the capacitor. As for $V_{out}$, it's the voltage across the capacitor at any point in time, expressed as a function of $V_s$, $V_o$, $R$, $C$ and time, as we shall see. 

In fact, the entire point of the analysis herein is to determine $V_{out}$ and how it behaves with respect to those variables. In order to do so, we'll take a look at two distinct scenarios. 

## Scenario #1: $V_s$ is disattached 

If we connect $R$ to ground, here's what the circuit will look like: 

<img src="/images/rc-series-circuit-no-vs.png" />

Examining this circuit allows us to determine how the capacitor discharges after it's charged until the point where voltage $V_o$ is observed across its terminals, then allowed to discharge.

If we call the current that flows from $V_{out}$ across $R$ to ground $i_R$, and the current that flows from $V_{out}$ across $C$ to ground $i_C$, then Kirchhoff's Current Law tell us that: 

$i_C + i_R = 0$

But:

- $i_C = C{dV \over dt}$ and
- $i_R = {V \over R}$

Hence: 

$C{dV \over dt} + {V \over R} = 0$

$\implies {dV \over dt} + {V \over RC} = 0$

This is a first order differential equation. Here's what we can do to solve it for $V$:

${dV \over dt} + {V \over RC} = 0$

$\implies {dV \over dt} = -{V \over RC}$

$\implies {dV \over V} = -{dt \over RC}$

In other words: 

${1 \over V} dV = -{1 \over RC} dt$

We can solve this by integrating both sides: 

$\int{ 1 \over V} dV = \int-{ 1 \over RC} dt$

$\implies \ln{V} + k_1 = -{t \over RC} + k_2$

$\implies \ln{V} = -{t \over RC} + k_2 - k_1$

We'll make $k_2 - k_1 = \ln \space {k}$: 

$\ln{V} = -{t \over RC} + \ln{k}$

Now, since $\ln{x \over y} = \ln{x} - \ln{y}$:

$\ln{V \over k} = -{t \over RC}$

And since $e^{\ln{x}} = x$, then:

${V \over k} = {e^{-{t \over RC}}}$

$\implies {V(t)} = {k \cdot e^{-{t \over RC}}}$

Now, if we remember that the initial voltage across $C$ is $V_o$, then we can calculate the value of constant $k$:

$V(0) = k \cdot e^{-{0 \over RC}} = V_o$

$\implies k = V_o$

So we can rewrite $V(t)$ (which is the same as $V_{out}(t)$) as:

$V_{out}(t) = {V_o \cdot e^{-{t \over RC}}} \space \blacksquare$

And this is how the voltage across $C$ (namely the output voltage of the circuit) decays. I told you it was going to be fun! :) 

Next, we'll take a look at how the capacitor charges when $V_s$ is attached to the circuit.

## Scenario #2: $V_s$ is attached 

<img src="/images/rc-series-circuit.png" />

Kirchhoff's Voltage Law tells us that: 

${(V_s - V) \over R} = C{dV \over dt}$

$\implies {(V_s - V) \over RC} = {dV \over dt}$

$\implies {dt \over RC} = {dV \over (V_s - V)}$

In other words: 

${1 \over RC} dt = {1 \over (V_s - V)} dV$

Multiplying by $-1$:

${-{1 \over RC}} dt = {1 \over (V - V_s)} dV$

We can now integrate both sides: 

$\int {-{1 \over RC}} dt = \int {1 \over (V - V_s)} dV$

$\implies -{t \over RC} + k_3 = ln{(V - V_s)} + k_4$

We'll make $ln \space {k} = k_3 - k_4$, so:

$-{t \over RC} + ln \space {k} = ln{(V - V_s)}$

Again, since $\ln{x \over y} = \ln{x} - \ln{y}$:

$-{t \over RC} = ln{(V - V_s) \over k}$

And again, since $e^{\ln{x}} = x$, then:

${e^{-{t \over RC}}} = {(V - V_s) \over k}$

$\implies {k \cdot e^{-{t \over RC}}} = V - V_s$

$\implies V(t) = {V_s + k \cdot e^{-{t \over RC}}}$

Now, if we remember that the initial voltage across $C$ is $V_o$, then we can calculate the value of constant $k$:

$V(0) = V_o = {V_s + k \cdot e^{-{0 \over RC}}}$

$\implies V_o = {V_s + k}$

$\implies k = V_o - V_s$

Hence: 

$V(t) = {V_s + (V_o - V_s) \cdot e^{-{t \over RC}}} \space \blacksquare$

Again, so much fun! :D

## Simulating 

Now that we've done the math, we can go ahead and implement this in code. I've coded [a Python script to simulate both of the scenarios above.](https://github.com/vasconcedu/circuits/blob/master/rc-series/rc-series.py) In fact, if we think about it, the difference between them is just that $V_s = 0 \space V$ for scenario #1, whereas $V_s \gt 0 \space V$ for scenario #2, so we can use the same script to simulate both scenarios! :) 

The Python script I've coded takes the following arguments: 

- `--Vs` is the source voltage (in V);
- `--Vo` is the initial voltage across the capacitor (also in V);
- `--R` is the resistance (in Ω);
- `--C` is the capacitance (in µF); and
- `--t` is the simulation time (in s).

If we run the script as shown below, we'll simulate charging (scenario #2) a 4.7 µF capacitor that's in series with a 3.3 kΩ resistor, using a 12.26 V power supply. Total simulation time is 10 s: 

```bash
python3 rc-series.py --Vs 12.26 --R 3300 --C 4.7 --t 10
```

And we'll see the following `matplotlib` plot: 

<img src="/images/rc-series-circuit-charging.png" />

Likewise, if we run the script as shown below, we'll simulate discharging (scenario #1) a 4.7 µF capacitor that's in series with a 3.3 kΩ resistor, after charging it up to 6.13 V. Total simulation time is 10 s: 

```bash
python3 rc-series.py --Vo 6.13 --R 3300 --C 4.7 --t 10
```

And we'll see the following `matplotlib` plot: 

<img src="/images/rc-series-circuit-discharging.png" />

## Real Circuit Video 

I've actually wired the circuit simulated above for scenario #1 (with an additional LED) so that you can take a look at how it behaves in real life. I always find it magical when math comes true right in front of your eyes! :) 

<img src="/images/rc-series-circuit.gif" />

## Wrap Up 

If anyone ever reads this, hope it was helpful and as much fun to read as it was for me to write it. 

Time for Easter Vigil! Happy Easter, Brothers and Sisters in Christ! This is the day the Lord has made; let us rejoice and be glad. Alleluia! ⛪
