# FAB-SIM

**Deterministic Industrial Systems Testbed**

> A cross-functional Hardware-in-the-Loop (HIL) emulator for SRE, Platform, Data, Security, and Manufacturing Engineering.

---

## Executive Summary

FAB-SIM is a **deterministic industrial systems testbed** designed to validate how control systems behave under failure, latency, security constraints, and data contracts—**without physical hardware**.

Where traditional industrial simulators optimize for realism, FAB-SIM optimizes for **reproducibility, auditability, and system guarantees**.

It is built for engineers who need to *explain*, *replay*, and *prove* system behavior—not just observe it.

> **FAB-SIM allows:**
>
> - **SREs** to replay production incidents deterministically  
> - **Platform Engineers** to validate secure, identity-driven interfaces  
> - **Data Engineers** to generate schema-correct, analytics-ready telemetry  
> - **Security Engineers** to enforce PKI and RBAC in OT environments  
> - **Manufacturing Engineers** to validate HIL behavior without physical PLCs  

---

## Design Invariants (Non-Negotiable)

FAB-SIM is governed by the following engineering invariants.  
These are not features—they are **laws**.

### Invariant 1 — Determinism Is Absolute

Given the same seed and configuration, FAB-SIM must produce **bit-for-bit identical outcomes**.

- All randomness is seeded
- All chaos is replayable
- All failures are reproducible

If a failure cannot be replayed, it is treated as a **defect in the simulator**.

---

### Invariant 2 — Time Is a First-Class Input

Time is never implicit.

- Simulation ticks are explicit
- Latency is modeled and injected deterministically
- Ordering and timing are observable

FAB-SIM allows engineers to debug **time behavior**, not just application logic.

---

### Invariant 3 — Interfaces Are Contracts, Not Suggestions

All external interfaces are:

- Versioned
- Authenticated
- Schema-bound

Breaking a contract is considered a **system violation**, not a warning.

---

### Invariant 4 — Security Is a Property, Not a Feature

Security behavior must be:

- Enforceable
- Testable
- Fail-closed

There are no insecure defaults and no "development-only" bypasses.

---

### Invariant 5 — Observability Extends Below the Application

When enabled, FAB-SIM can observe behavior below the application layer:

- Kernel-level latency
- Syscall jitter
- Network retransmissions

This allows diagnosis of **physical and OS-level bottlenecks**, not just symptoms.

---

## Architecture Overview

FAB-SIM is composed of deterministic subsystems layered to mirror real industrial environments:

```
┌─────────────────────────────────────────────────────────────────┐
│                        FAB-SIM Testbed                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │   CLI Layer     │    │  Chaos Engine   │    │   Schema    │ │
│  │  (clap)         │◄──►│  (seeded RNG)   │◄──►│  Registry   │ │
│  └────────┬────────┘    └─────────────────┘    └─────────────┘ │
│           │                                                     │
│  ┌────────▼────────┐    ┌─────────────────┐                     │
│  │  PLC Simulator  │◄──►│  Telemetry      │                     │
│  │  (deterministic)│    │  Collector      │                     │
│  └────────┬────────┘    └────────┬────────┘                     │
│           │                       │                             │
│  ┌────────▼────────┐    ┌────────▼────────┐                     │
│  │  Modbus TCP     │    │  Parquet/Avro   │                     │
│  │  Server (502)   │    │  Export         │                     │
│  └─────────────────┘    └─────────────────┘                     │
│                                                                 │
│  ┌─────────────────────────────────────────┐                    │
│  │      OPC-UA Server (4840)               │                    │
│  │  ┌─────────────┐  ┌─────────────────┐  │                    │
│  │  │ X.509 Certs │  │  RBAC Policy    │  │                    │
│  │  │ (mutual TLS)│  │  (Read/Write)   │  │                    │
│  │  └─────────────┘  └─────────────────┘  │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                 │
│  ┌─────────────────────────────────────────┐ (Linux only)       │
│  │      eBPF Tracing (optional)            │                    │
│  │  ┌─────────────┐  ┌─────────────────┐  │                    │
│  │  │ kprobes     │  │  Histograms     │  │                    │
│  │  │ (syscalls)  │  │  (Prometheus)   │  │                    │
│  │  └─────────────┘  └─────────────────┘  │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Architectural Core: Deterministic Simulation

### Concept

Most industrial simulators rely on non-deterministic randomness, making failures impossible to reproduce.

FAB-SIM is built on a single premise:

> **Chaos is only useful if it is replayable.**

Every simulation run is initialized with a 64-bit seed that governs *all* stochastic behavior in the system.

---

### Deterministic Execution Model

The seed controls:

| Behavior | Implementation |
|----------|---------------|
| Sensor drift | `drift_rate += rng.gen_range(-0.0001..0.0001)` |
| Packet loss | `rng.gen::<f64>() < loss_rate` |
| Latency jitter | `rng.gen_range(min_ms..=max_ms)` |
| State transitions | 0.1% probability per tick, deterministic sequence |
| Fault injection | Seeded fault schedule |

```rust
use rand::{Rng, SeedableRng};
use rand_chacha::ChaCha8Rng;

pub struct PlcSimulator {
    rng: ChaCha8Rng,  // Deterministic CSPRNG
    seed: u64,
    // ...
}

impl PlcSimulator {
    pub fn new(seed: u64) -> Self {
        Self {
            rng: ChaCha8Rng::seed_from_u64(seed),
            seed,
            // ...
        }
    }
}
```

Reusing the same seed produces **identical system behavior**, including timing and event ordering.

This enables forensic-grade replay of incidents observed in CI, staging, or analysis pipelines.

---

### Property-Based State Validation

PLC behavior is modeled as a **state machine with invariants**.

Using property-based testing (`proptest`), FAB-SIM continuously verifies that:

- All state transitions are valid
- No undefined states are reachable
- Fault and degraded modes remain bounded

```rust
proptest! {
    #[test]
    fn test_state_machine_never_undefined(seed: u64, ticks in 1..1000usize) {
        let mut sim = PlcSimulator::new(seed);
        
        for _ in 0..ticks {
            sim.tick().unwrap();
        }
        
        // All PLCs should be in a valid state
        for plc in sim.plcs.values() {
            prop_assert!(
                matches!(plc.state, 
                    PlcState::Initializing |
                    PlcState::Running |
                    PlcState::Degraded |
                    PlcState::Maintenance |
                    PlcState::Fault |
                    PlcState::EmergencyStopped
                ),
                "PLC reached invalid state: {:?}", plc.state
            );
        }
    }
}
```

This validates *classes of behavior*, not individual scenarios.

---

### Replay Semantics

Replay is a first-class capability.

```bash
# Original run
fabsim run --seed 381492 --duration 60s

# Exact replay of the same failure
fabsim run --replay 381492 --duration 60s
```

Replay guarantees:

- Identical event ordering
- Identical timing behavior
- Identical failure surfaces

---

### Role Alignment

| Role | Signal |
|------|--------|
| **SRE** | Deterministic root-cause analysis |
| **Data / ML** | Reproducible synthetic datasets |
| **Manufacturing** | Control logic validation without hardware |

---

## 2. Secure Connectivity: OPC-UA with X.509 Identity

### Concept

FAB-SIM intentionally exposes the contrast between:

- **Legacy industrial protocols** (Modbus TCP)
- **Modern, secure standards** (OPC-UA)

The goal is not compatibility—it is **controlled migration and validation**.

---

### Identity-Driven Communication

The OPC-UA interface enforces mutual authentication using X.509 certificates.

- All sessions are encrypted
- All clients must present trusted certificates
- Anonymous access is rejected

Security defaults are never weakened.

```rust
use opcua::server::prelude::*;

pub struct OpcUaServer {
    server: Server,
    security_config: SecurityConfig,
}

impl OpcUaServer {
    pub fn new(bind_addr: String, security_config: SecurityConfig) -> Result<Self> {
        let mut server_builder = ServerBuilder::new();
        
        // Configure security policies
        let security_policies = vec![
            SecurityPolicy::Basic256Sha256,
            SecurityPolicy::Aes256Sha256RsaPss,
        ];
        
        // Require SignAndEncrypt mode
        let security_modes = vec![MessageSecurityMode::SignAndEncrypt];
        
        // Load X.509 certificates
        let (cert, key) = Self::load_or_generate_certs(&security_config)?;
        server_builder.certificate(cert);
        server_builder.private_key(key);
        
        // Configure X.509 user token
        server_builder.user_token(
            "x509_token",
            ServerUserToken::new_x509("x509_token", &security_config.trust_list_path)?
        );
        
        // ...
    }
}
```

---

### Role-Based Access Control (RBAC)

Access is enforced at the node level:

| Role | Permissions | Node Access |
|------|-------------|-------------|
| **Monitor** | Read, Browse | `*/Registers/*`, `*/Sensors/*`, `Telemetry/*` |
| **Operator** | Read, Write, Call | All registers, state changes allowed |
| **Engineer** | Full (except Admin) | All nodes including configuration |
| **Admin** | All | Complete system access |

Permissions are bound to cryptographic identity, not network location.

---

### Security Failures as Testable Outcomes

Security violations are deterministic and observable:

- Invalid certificates are rejected
- Unauthorized writes fail predictably
- Access violations surface as explicit events

This enables validation of security posture under operational conditions.

---

### Role Alignment

| Role | Signal |
|------|--------|
| **Security Engineering** | PKI, encryption, fail-closed design |
| **Platform Engineering** | Identity-driven internal interfaces |
| **Manufacturing / OT** | Secure HIL validation |

---

## 3. Data Discipline: Schema Contracts

### Concept

Industrial telemetry is treated as first-class data, not logs.

FAB-SIM enforces schema contracts using explicit versioning and compatibility rules.

---

### Schema-on-Write Telemetry

Telemetry is serialized using **Apache Avro** or **JSON Schema**:

- All fields are typed
- All schema versions are explicit
- Breaking compatibility is a pipeline failure

```json
{
    "type": "record",
    "name": "TelemetryPoint",
    "namespace": "com.fabsim",
    "doc": "Industrial telemetry data point - Version 1",
    "fields": [
        {"name": "timestamp", "type": "long", "doc": "Unix timestamp in microseconds"},
        {"name": "plc_id", "type": "string", "doc": "PLC identifier"},
        {"name": "measurement_type", "type": "string", "doc": "Type of measurement"},
        {"name": "name", "type": "string", "doc": "Measurement name"},
        {"name": "value_numeric", "type": ["null", "double"], "default": null},
        {"name": "value_string", "type": ["null", "string"], "default": null},
        {"name": "quality", "type": "string", "doc": "Data quality indicator"}
    ]
}
```

#### Schema Evolution (V2)

```json
{
    "type": "record",
    "name": "TelemetryPoint",
    "namespace": "com.fabsim",
    "doc": "Industrial telemetry data point - Version 2",
    "fields": [
        // ... V1 fields ...
        {"name": "value_bool", "type": ["null", "boolean"], "default": null, "doc": "[NEW] Boolean value"},
        {"name": "schema_version", "type": "string", "default": "v2", "doc": "[NEW] Schema version"},
        {"name": "tags", "type": ["null", {"type": "map", "values": "string"}], "default": null, "doc": "[NEW] Metadata tags"}
    ]
}
```

Backward compatibility is enforced: new fields must have defaults.

---

### Analytics-Ready Export

FAB-SIM can export telemetry directly to **Apache Parquet**:

```bash
fabsim run --seed 12345 --export-parquet ./telemetry.parquet
```

Exports are optimized for:

- Columnar analytics
- Time-series processing
- Large-scale data pipelines

| Column | Type | Compression |
|--------|------|-------------|
| timestamp | TIMESTAMP_MICROS | ZSTD |
| plc_id | STRING | ZSTD |
| measurement_type | STRING | DICTIONARY |
| name | STRING | ZSTD |
| value_numeric | DOUBLE | SNAPPY |
| quality | STRING | DICTIONARY |

---

### Role Alignment

| Role | Signal |
|------|--------|
| **Data Engineering** | Schema-on-write discipline |
| **DevOps** | Contract-respecting producers |
| **Analytics / ML** | Clean synthetic datasets |

---

## 4. Systems Observability (Optional)

### Concept

Application-level metrics are insufficient for diagnosing many production failures.

FAB-SIM optionally supports kernel-level observability using **eBPF**.

---

### Observable Signals

| Signal | Metric | Use Case |
|--------|--------|----------|
| Syscall latency | `modbus_syscall_latency_us` | Detect kernel-level jitter |
| TCP retransmissions | `tcp_retransmit_count` | Network reliability |
| Socket buffer pressure | `socket_buffer_drops` | Capacity planning |

These signals expose OS-level causes of latency and jitter that logs cannot see.

---

### Role Alignment

| Role | Signal |
|------|--------|
| **SRE / Platform** | Staff-level systems debugging |
| **Performance Engineering** | Kernel-aware diagnosis |

---

## 5. Deterministic Chaos Engineering

FAB-SIM injects chaos using the same seeded RNG as the simulator.

Failures are:

- **Controlled** — bounded by configuration
- **Repeatable** — same seed, same failures
- **Replayable** — forensic-grade reproduction

---

### Supported Chaos Scenarios

| Scenario | Description | Use Case |
|----------|-------------|----------|
| `slow_network` | 100-500ms latency injection | Test timeout handling |
| `flaky_network` | 10% packet loss | Test retry logic |
| `network_partition` | Split PLC cluster | Test split-brain handling |
| `resource_exhaustion` | Simulate memory pressure | Test graceful degradation |

---

### Chaos CLI

```bash
# Inject 50ms latency with 10ms jitter
fabsim run --seed 12345 --latency 50 --latency-jitter 10

# Simulate 10% packet loss
fabsim run --seed 12345 --packet-loss 0.1

# Combined chaos
fabsim run --seed 12345 --latency 50ms --packet-loss 0.05 --duration 300s
```

---

### Deterministic Chaos Implementation

```rust
pub struct ChaosEngine {
    rng: ChaCha8Rng,  // Same seed as PLC simulator
    latency_config: Option<LatencyConfig>,
    packet_loss_config: Option<PacketLossConfig>,
}

impl ChaosEngine {
    pub fn should_drop_packet(&mut self) -> bool {
        if let Some(config) = &self.packet_loss_config {
            self.rng.gen::<f64>() < config.rate
        } else {
            false
        }
    }
    
    pub fn get_latency(&mut self) -> u64 {
        if let Some(config) = &self.latency_config {
            self.rng.gen_range(config.min_ms..=config.max_ms)
        } else {
            0
        }
    }
}
```

---

## 72-Hour Execution Roadmap

### Day 1: The Deterministic Engine

| Task | Status | Output |
|------|--------|--------|
| Initialize Rust workspace | ✅ | `Cargo.toml` with dependencies |
| Implement `tokio-modbus` server | ✅ | Modbus TCP server on port 502 |
| Add `rand_chacha` seeded RNG | ✅ | Deterministic sensor drift |
| Add `proptest` for state machine | ✅ | Property-based tests pass |
| CLI with `--seed` flag | ✅ | `./fabsim --seed 12345` |

**Day 1 Output:** A CLI that spawns a "jittery" PLC that is 100% replayable via `--seed`.

```bash
$ fabsim run --seed 12345 --duration 10s
[2024-01-15T10:00:00Z INFO] FAB-SIM v0.1.0 starting up
[2024-01-15T10:00:00Z INFO] Simulation seed: 12345
[2024-01-15T10:00:00Z INFO] PLC simulator initialized with 4 PLCs
[2024-01-15T10:00:10Z INFO] Simulation complete
    Seed:              12345
    Duration:          10s
    PLC Ticks:         1000
    SLA Violations:    2
```

---

### Day 2: The Modern Interface (OPC-UA)

| Task | Status | Output |
|------|--------|--------|
| Integrate `opcua-rs` | ✅ | OPC-UA server on port 4840 |
| Generate X.509 certs | ✅ | `./certs/*.pem` files |
| Implement RBAC | ✅ | Read-Only vs Read/Write nodes |
| Certificate validation | ✅ | Rejects unsigned connections |

**Day 2 Output:** A secure endpoint that requires a certificate to read simulated PLC values.

```bash
# Generate certificates
$ fabsim gencerts --output-dir ./certs

# Run with OPC-UA security
$ fabsim run --enable-opcua --cert-path ./certs/server_cert.pem
[2024-01-15T10:00:00Z INFO] OPC-UA server started with X.509 security
```

---

### Day 3: Data Contracts & Chaos

| Task | Status | Output |
|------|--------|--------|
| Implement Avro serialization | ✅ | Schema v1 and v2 registered |
| Add `--export-parquet` flag | ✅ | Parquet export functionality |
| Add chaos commands | ✅ | `--latency`, `--packet-loss` |
| Final integration test | ✅ | 1-minute simulation with SLA violation |

**Day 3 Output:** Run a 1-minute simulation, export to Parquet, and show the SLA violation in logs.

```bash
$ fabsim run --seed 12345 --export-parquet ./telemetry.parquet --duration 60s
[2024-01-15T10:00:00Z INFO] Telemetry exported to Parquet (245 KB)
[2024-01-15T10:01:00Z INFO] SLA Violations: 3

# Analyze in Python
>>> import pandas as pd
>>> df = pd.read_parquet('./telemetry.parquet')
>>> df[df['quality'] == 'bad'].count()
```

---

## CLI Reference

### Global Options

```
fabsim [OPTIONS] <COMMAND>

Commands:
  run         Run deterministic industrial simulation
  gencerts    Generate X.509 certificates
  validate    Validate configuration file
  help        Print this message
```

---

### `run` Command

```
fabsim run [OPTIONS]

Options:
  -s, --seed <SEED>              Deterministic seed for simulation
      --replay <SEED>            Alias for --seed (replay mode)
  -d, --duration <SECONDS>       Simulation duration [default: 60]
  -p, --plc-count <COUNT>        Number of PLCs [default: 4]
  -r, --register-count <COUNT>   Registers per PLC [default: 100]
      --speed <MULTIPLIER>       Simulation speed [default: 1.0]
      
      --enable-modbus            Enable Modbus TCP [default: true]
      --modbus-addr <ADDR>       Modbus bind address [default: 0.0.0.0:502]
      
      --enable-opcua             Enable OPC-UA [default: true]
      --opcua-addr <ADDR>        OPC-UA bind address [default: 0.0.0.0:4840]
      --cert-path <PATH>         Server certificate [default: ./certs/server_cert.pem]
      --key-path <PATH>          Server private key [default: ./certs/server_key.pem]
      --require-client-auth      Require X.509 client auth [default: true]
      
      --export-parquet <PATH>    Export telemetry to Parquet
      --export-avro <PATH>       Export telemetry to Avro
      
      --latency <MS>             Inject latency (milliseconds)
      --latency-jitter <MS>      Latency jitter [default: 10]
      --packet-loss <RATE>       Packet loss rate (0.0-1.0)
      
  -h, --help                     Print help
```

---

### Examples

```bash
# Basic simulation with random seed
fabsim run --duration 120s

# Deterministic simulation
fabsim run --seed 12345 --duration 60s

# Replay a failure
fabsim run --replay 12345 --duration 60s

# Export to Parquet for analysis
fabsim run --seed 12345 --export-parquet ./telemetry.parquet

# Inject chaos
fabsim run --seed 12345 --latency 100ms --packet-loss 0.05

# Production-grade with security
fabsim run \
  --seed 12345 \
  --cert-path ./certs/server_cert.pem \
  --key-path ./certs/server_key.pem \
  --require-client-auth \
  --export-parquet ./telemetry.parquet
```

---

### Environment Variables

All CLI options can be set via environment variables:

```bash
export FABSIM_SEED=12345
export FABSIM_DURATION=300
export FABSIM_ENABLE_OPCUA=true
export FABSIM_CERT_PATH=./certs/server_cert.pem
export FABSIM_EXPORT_PARQUET=./telemetry.parquet
export FABSIM_LATENCY_MS=50
export FABSIM_PACKET_LOSS=0.1

fabsim run  # Uses environment configuration
```

---

## Success Definition

FAB-SIM is considered complete when the following statement is true:

> "FAB-SIM allows SREs to replay a production incident deterministically,  
> Data Engineers to generate schema-perfect synthetic telemetry,  
> and Manufacturing Engineers to validate HIL security without physical hardware."

---

## License

MIT OR Apache-2.0

---

## Contributing

Contributions are welcome in areas such as:

- Additional industrial protocols (EtherNet/IP, Profinet)
- New deterministic chaos scenarios
- Expanded observability probes
- Tooling for analysis and visualization

---

*FAB-SIM: Deterministic chaos for industrial systems.*
