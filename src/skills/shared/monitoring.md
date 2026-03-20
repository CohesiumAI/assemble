---
name: monitoring
description: Monitoring and observability setup and analysis — metrics, logs, traces, alerting, and operational dashboards
agents: [devops, data, dev-backend]
trigger: /monitor
---

# Skill : Monitoring & Observability

## Objective

Set up a comprehensive observability strategy covering the three pillars (metrics, logs, traces), configure relevant alerts, and create operational dashboards. This skill enables rapid detection, diagnosis, and resolution of production incidents.

## When to use

- When deploying a new service or microservice to production
- To diagnose an incident or performance degradation in production
- When the alerting system generates too much noise (false positives) or is insufficient
- When migrating to a new observability stack
- To create or improve operational dashboards for an existing service
- When SLOs/SLIs need to be defined or revised

## Steps

1. **Identify critical signals** — Apply the RED method (Rate, Errors, Duration) for services and USE (Utilization, Saturation, Errors) for resources. Define key business metrics (conversion rate, orders/minute, processing latency). Map service dependencies.
2. **Instrument the application** — Add custom metrics (counters, histograms, gauges) with Prometheus/OpenTelemetry. Configure structured logging (JSON) with standard fields (request_id, user_id, service, level, timestamp). Implement distributed tracing with appropriate spans.
3. **Configure collection and storage** — Deploy collection agents (Prometheus scraper, Fluentd/Vector, OpenTelemetry Collector). Configure data retention by level: high-resolution metrics (15 days), aggregated (90 days), logs (30 days), traces (7 days).
4. **Define SLOs and error budgets** — Establish Service Level Objectives aligned with business needs: availability (99.9% = 43min downtime/month), latency (P95 < 500ms), error rate (< 0.1%). Calculate error budgets and define actions when they are consumed.
5. **Configure alerts** — Create symptom-based alerts (not cause-based) with appropriate thresholds. Implement multi-level alerts: warning (Slack notification), critical (PagerDuty/OpsGenie page). Avoid alert fatigue by grouping and deduplicating.
6. **Create dashboards** — Build dashboards by audience: operational overview (SRE), service detail (developers), business metrics (product). Follow the 4 Golden Signals principle: latency, traffic, errors, saturation.
7. **Document runbooks** — For each critical alert, write a runbook: alert description, step-by-step diagnosis, corrective actions, escalation criteria. Link each alert to its runbook in the notification system.
8. **Validate and iterate** — Test alerts with simulated incidents (chaos engineering). Review triggered alerts monthly: remove non-actionable ones, adjust thresholds, add missing alerts identified during real incidents.

## Exit Checklist

- [ ] RED/USE metrics are collected for each service and resource
- [ ] Structured logging is implemented with standard fields
- [ ] Distributed tracing is operational with log-trace correlation
- [ ] SLOs are defined and error budgets calculated
- [ ] Alerts cover critical symptoms without alert fatigue
- [ ] Dashboards are created by audience (ops, dev, product)
- [ ] A runbook exists for each critical alert
- [ ] The system has been tested with a simulated incident

## Output Format

```markdown
## Monitoring & Observability Plan

**Service :** [service name]
**Stack :** [Prometheus + Grafana | Datadog | New Relic | ELK | ...]
**Environnement :** [production | staging]
**Date :** [date]

### Defined SLOs

| SLI | Objective (SLO) | Window | Error budget |
|-----|-----------------|--------|--------------|
| Availability | 99.9% | 30 days | 43 min |
| Latency P95 | < 500ms | 30 days | 0.1% requests |
| Error rate (5xx) | < 0.1% | 30 days | [budget] |

### Instrumented metrics

#### Application metrics (RED)
| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `http_requests_total` | Counter | method, path, status | Total HTTP requests |
| `http_request_duration_seconds` | Histogram | method, path | Request duration |
| `http_errors_total` | Counter | method, path, error_code | Error count |

#### Infrastructure metrics (USE)
| Resource | Utilization | Saturation | Errors |
|----------|-------------|------------|--------|
| CPU | `cpu_usage_percent` | `cpu_throttled_seconds` | — |
| Memory | `memory_usage_bytes` | `memory_oom_kills` | — |
| Disk | `disk_usage_percent` | `disk_io_queue_length` | `disk_errors` |
| Network | `network_bytes_total` | `network_drops_total` | `network_errors` |

### Configured alerts

| Alert | Condition | Severity | Channel | Runbook |
|-------|-----------|----------|---------|---------|
| Service unavailable | `up == 0` for 2min | Critical | PagerDuty | [link] |
| High latency | `P95 > 1s` for 5min | Warning | Slack #ops | [link] |
| High error rate | `5xx > 1%` for 5min | Critical | PagerDuty | [link] |
| Error budget < 20% | Monthly budget consumed at 80% | Warning | Slack #ops | [link] |

### Main dashboard

**Recommended panels :**
1. Traffic — requests/second per endpoint (time series)
2. Latency — P50/P95/P99 per endpoint (time series)
3. Error rate — 4xx/5xx percentage (time series + threshold)
4. Saturation — CPU, memory, DB connections (gauges)
5. SLO burn rate — error budget consumption (indicator)
6. Dependencies — latency and availability of external services (table)

### Runbook template

#### Alert : [Alert name]
1. **Verify** — Confirm the alert via the dashboard [link]
2. **Diagnose** — Check the logs: `kubectl logs -l app=service --since=10m`
3. **Correlate** — Check associated traces in [tracing tool]
4. **Act** — [Specific corrective action]
5. **Escalate** — If not resolved in 15min, contact [team/person]
6. **Post-mortem** — Document the incident in [tool]
```
