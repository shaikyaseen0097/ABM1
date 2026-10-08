# 🔋 Adaptive Battery Cell Voltage Monitoring Controller

A scenario-aware **Adaptive Battery Cell Voltage Monitoring Controller** designed to overcome the limitations of fixed-threshold battery voltage monitoring.

This project combines **RTL design, adaptive threshold control, and verification concepts** with a web-based dashboard for visualizing battery operating conditions.

---

## 📌 Project Overview

Conventional battery voltage monitoring systems generally use fixed voltage thresholds to detect under-voltage and over-voltage conditions.

However, battery operating conditions can change depending on the operating mode. A fixed threshold may therefore fail to detect certain early voltage transitions or abnormal conditions.

This project proposes an **Adaptive Voltage Threshold Controller** that dynamically selects voltage thresholds according to the battery's operating mode.

The project also focuses on verification using:

- UVM
- Constrained-Random Verification
- Functional Coverage
- Cross Coverage

---

## 🎯 Problem Statement

Fixed-threshold voltage monitors may fail to detect early **over-voltage and under-voltage conditions** when the battery operates under different modes.

Additionally, conventional directed testing may miss important **adaptive threshold transitions** during verification.

### The project addresses these issues by providing:

- Dynamic voltage threshold selection
- Operating-mode-aware monitoring
- Under-voltage detection
- Over-voltage detection
- Adaptive threshold transition monitoring
- Comprehensive RTL verification

---

## 💡 Proposed RTL Innovation

The main innovation is an:

### Adaptive Voltage Threshold Controller

Instead of using one fixed voltage threshold, the controller dynamically selects the appropriate voltage limits based on the selected operating mode.

### Example Operating Modes

| Operating Mode | Under-Voltage | Over-Voltage |
|---------------|---------------:|-------------:|
| Normal        | 3.00 V         | 4.20 V       |
| Charging      | 3.10 V         | 4.25 V       |
| Low Power     | 3.20 V         | 4.10 V       |
| Fault Test    | 3.55 V         | 3.85 V       |

> **Note:** The threshold values above are demonstration values used by the web dashboard. The actual SystemVerilog design should use the thresholds defined in the final RTL specification.

---

# 🏗️ System Architecture

```text
                 Battery Cell Voltage
                          │
                          ▼
                ┌──────────────────┐
                │   Voltage Input  │
                │    / ADC Data    │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │   Mode Detector  │
                │                  │
                │ Normal           │
                │ Charging         │
                │ Low Power        │
                │ Fault Test       │
                └────────┬─────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Adaptive Threshold   │
              │     Controller       │
              └──────────┬───────────┘
                         │
                         ▼
                ┌──────────────────┐
                │    Comparator    │
                └────────┬─────────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
              ▼          ▼          ▼
        Under-Voltage   Normal   Over-Voltage
