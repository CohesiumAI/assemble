---
name: automation-workflow
description: Multi-tool automation workflow design with triggers, actions, error handling, and monitoring
agents: [automation, devops, dev-backend]
trigger: /automate
---

# Skill : Automation Workflow

## Objective
Design and implement a complete automation workflow using no-code/low-code tools (n8n, Make, Zapier) or custom scripts. Define triggers, transformation steps, third-party integrations, error handling, and monitoring to reliably automate repetitive business processes.

## When to use
- To automate a repetitive business process involving multiple tools or services
- When creating an integration between two systems that don't communicate natively
- When a data flow needs to be automated between applications (CRM, ERP, ticketing tool, etc.)
- To set up automatic notifications based on events
- When automating reporting tasks, data synchronization, or provisioning

## Steps
1. **Map the current process** — Document the existing manual process: steps, actors, tools used, execution frequency, data volume, and time spent. Identify pain points and frequent errors.
2. **Define the target workflow** — Design the automated workflow: trigger (webhook, schedule, event), processing steps, branching conditions, loops, and exit points. Produce a flow diagram.
3. **Select tools and connectors** — Choose the appropriate automation platform (n8n for self-hosted, Make for flexibility, Zapier for simplicity) and verify connector availability for each involved service.
4. **Configure the trigger** — Implement the workflow trigger: incoming webhook, polling schedule (cron), application event, message queue, or manual trigger with parameters.
5. **Implement processing steps** — Configure each workflow node: API calls, data transformations (mapping, filtering, aggregation), logical conditions (if/else, switch), and loops (for each).
6. **Handle errors and retries** — Implement error handling at each critical step: retries with exponential backoff, alternative error paths, failure notifications, and dead letter queue.
7. **Test the workflow end-to-end** — Execute the workflow with representative test data, verify each step, validate data transformations, and simulate error cases to verify resilience.
8. **Deploy and monitor** — Activate the workflow in production, configure monitoring alerts (failures, latency, abnormal volume), set up logs, and define maintenance procedures.

## Exit Checklist
- [ ] The current process is documented and automation gains are quantified
- [ ] The workflow flow diagram is clear and validated by stakeholders
- [ ] All connectors and APIs are configured with appropriate authentication
- [ ] The trigger works reliably (webhook verified, schedule correct)
- [ ] Data transformations are correct and mappings are validated
- [ ] Error handling is implemented with retries and failure notifications
- [ ] The workflow is tested with representative data (nominal and error cases)
- [ ] Monitoring and alerts are in place for production supervision

## Output Format
```
Automation Workflow Specification

Name : [descriptive workflow name]
Platform : [n8n / Make / Zapier / custom script]
Designer : [agent automation]
Date : [date]
Frequency : [real-time / every X minutes / daily / weekly]

Automated process :
  - Description : [what the workflow does in one sentence]
  - Trigger : [webhook / schedule / event]
  - Estimated volume : [X executions per day/week]
  - Time saved : [X hours per week]

Flow diagram :
  [Trigger] → [Step 1 : Data retrieval]
             → [Step 2 : Transformation / Filtering]
             → [Condition : validation]
                → YES → [Step 3A : Main action]
                       → [Step 4 : Success notification]
                → NO  → [Step 3B : Rejection handling]
                       → [Step 4B : Team alert]

Integrated services :
  | Service        | Connector | Action                   | Authentication  |
  |----------------|-----------|--------------------------|-----------------|
  | [Service 1]    | REST API  | Retrieve data            | API Key         |
  | [Service 2]    | Webhook   | Send notification        | OAuth 2.0       |
  | [Service 3]    | Native SDK| Create record            | Token           |

Error handling :
  - Retry : 3 attempts with exponential backoff (1s, 5s, 30s)
  - Failure notification : [Slack / email / PagerDuty]
  - Dead letter queue : [enabled / disabled]
  - Fallback : [alternative action on definitive failure]

Monitoring :
  - Dashboard : [link to dashboard]
  - Alerts : [alert trigger conditions]
  - Logs : [retention and detail level]
  - SLA : [expected response time, target success rate]
```
