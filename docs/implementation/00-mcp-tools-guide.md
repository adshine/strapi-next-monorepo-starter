# MCP Tools Quick Reference

This guide maps implementation tasks to specific MCP tools available in your environment.

## Available MCP Tools

### 📋 Task Management (taskmaster-ai)

- **Initialize**: `mcp__taskmaster-ai__initialize_project`
- **Parse Docs**: `mcp__taskmaster-ai__parse_prd`
- **Track Progress**: `mcp__taskmaster-ai__set_task_status`
- **Get Tasks**: `mcp__taskmaster-ai__get_tasks`
- **Expand Tasks**: `mcp__taskmaster-ai__expand_task`

### 🔧 Strapi CMS (strapi-mcp)

- **Content Types**: `mcp__strapi-mcp__create_content_type`
- **Entries**: `mcp__strapi-mcp__create_entry`, `get_entries`, `update_entry`
- **Media**: `mcp__strapi-mcp__upload_media_from_path`
- **Relations**: `mcp__strapi-mcp__connect_relation`
- **Components**: `mcp__strapi-mcp__create_component`

### 💳 Stripe Payments (stripe)

- **Products**: `mcp__stripe__create_product`, `list_products`
- **Prices**: `mcp__stripe__create_price`, `list_prices`
- **Customers**: `mcp__stripe__create_customer`, `list_customers`
- **Invoices**: `mcp__stripe__create_invoice`, `list_invoices`
- **Subscriptions**: `mcp__stripe__list_subscriptions`, `update_subscription`
- **Payment Links**: `mcp__stripe__create_payment_link`

### 🐳 Docker & Kubernetes (MCP_DOCKER)

- **Docker**: `mcp__MCP_DOCKER__docker`
- **Kubectl**: `mcp__MCP_DOCKER__kubectl_create`, `kubectl_apply`, `kubectl_get`
- **Pods**: `mcp__MCP_DOCKER__exec_in_pod`, `kubectl_logs`
- **Port Forward**: `mcp__MCP_DOCKER__port_forward`
- **Helm**: `mcp__MCP_DOCKER__install_helm_chart`

### 💻 Desktop Commander (MCP_DOCKER)

- **Files**: `mcp__MCP_DOCKER__read_file`, `write_file`, `edit_block`
- **Processes**: `mcp__MCP_DOCKER__start_process`, `interact_with_process`
- **Search**: `mcp__MCP_DOCKER__search_code`, `search_files`
- **Config**: `mcp__MCP_DOCKER__get_config`, `set_config_value`

### 📚 Documentation (context7, linear, Wikipedia)

- **Library Docs**: `mcp__context7__get-library-docs`
- **Linear Issues**: `mcp__linear__create_issue`, `list_issues`
- **Wikipedia**: `mcp__MCP_DOCKER__search_wikipedia`

### 🔍 Other Utilities

- **Web Fetch**: `mcp__MCP_DOCKER__fetch`
- **YouTube**: `mcp__MCP_DOCKER__get_transcript`
- **Sequential Thinking**: `mcp__MCP_DOCKER__sequentialthinking`
- **Knowledge Graph**: `mcp__MCP_DOCKER__create_entities`

## Implementation Task Mapping

### Phase 1: Project Setup

```bash
# Initialize task tracking
mcp__taskmaster-ai__initialize_project --projectRoot $(pwd)

# Parse requirements into tasks
mcp__taskmaster-ai__parse_prd \
  --input docs/platform-implementation-spec.md \
  --numTasks 50

# Setup environment files
mcp__MCP_DOCKER__write_file \
  --path .env.local \
  --content "..."
```

### Phase 2: Database & Strapi

```bash
# Create Strapi content types
mcp__strapi-mcp__create_content_type \
  --displayName "Project" \
  --singularName "project" \
  --pluralName "projects" \
  --attributes '{"title": {"type": "string"}}'

# Upload template files
mcp__strapi-mcp__upload_media_from_path \
  --filePath "./templates/template1.zip"
```

### Phase 3: Stripe Setup

```bash
# Create products
mcp__stripe__create_product \
  --name "Solo Plan" \
  --description "For individual creators"

# Create prices
mcp__stripe__create_price \
  --product "prod_xxx" \
  --unit_amount 2400 \
  --currency "usd" \
  --recurring '{"interval": "month"}'

# Test payment flow
mcp__stripe__create_payment_link \
  --price "price_xxx" \
  --quantity 1
```

### Phase 4: Docker Deployment

```bash
# Build containers
mcp__MCP_DOCKER__docker \
  --args "build -t framer-strapi ."

# Deploy to Kubernetes
mcp__MCP_DOCKER__kubectl_apply \
  --manifest "$(cat k8s/deployment.yaml)"

# Monitor pods
mcp__MCP_DOCKER__kubectl_get \
  --resourceType "pods" \
  --namespace "default"
```

### Phase 5: Testing & Monitoring

```bash
# Run tests in container
mcp__MCP_DOCKER__exec_in_pod \
  --name "strapi-pod" \
  --command "npm test"

# Check logs
mcp__MCP_DOCKER__kubectl_logs \
  --resourceType "pod" \
  --name "strapi-xxx"

# Update task status
mcp__taskmaster-ai__set_task_status \
  --id "15" \
  --status "done"
```

## Common Workflows

### Creating a New Feature

1. Create task: `mcp__taskmaster-ai__add_task`
2. Create Strapi content type: `mcp__strapi-mcp__create_content_type`
3. Implement API endpoint (follow 02-api-contracts.md)
4. Test with Stripe MCP if payment-related
5. Deploy with Docker MCP
6. Update task status: `mcp__taskmaster-ai__set_task_status`

### Debugging Production Issues

1. Check pod status: `mcp__MCP_DOCKER__kubectl_get`
2. View logs: `mcp__MCP_DOCKER__kubectl_logs`
3. Execute commands: `mcp__MCP_DOCKER__exec_in_pod`
4. Create Linear issue: `mcp__linear__create_issue`
5. Research solution: `mcp__context7__get-library-docs`

### Environment Management

1. Read current config: `mcp__MCP_DOCKER__read_file --path .env`
2. Update values: `mcp__MCP_DOCKER__edit_block`
3. Validate: `mcp__MCP_DOCKER__start_process --command "node validate-env.js"`
4. Apply to pod: `mcp__MCP_DOCKER__kubectl_apply`

## Tips for MCP Tool Usage

1. **Always use absolute paths** with Desktop Commander file operations
2. **Check task status frequently** with Task Manager to stay organized
3. **Use Strapi MCP for content** instead of manual database operations
4. **Test Stripe webhooks locally** before deploying
5. **Monitor pods continuously** during deployments
6. **Batch operations** when possible (e.g., create multiple Stripe products at once)
7. **Use research tools** (Context7, Wikipedia) when stuck on technical issues
8. **Track everything** in Task Manager for visibility

## Error Handling

### Common MCP Tool Errors

**"Tool not found"**

- Ensure MCP server is running
- Check tool name spelling
- Verify tool is configured in MCP settings

**"Permission denied"**

- Check file/folder permissions
- Ensure proper authentication (Stripe, Strapi)
- Verify environment variables are set

**"Resource not found"**

- Confirm IDs are correct (Stripe products, Strapi entries)
- Check namespace for Kubernetes resources
- Verify file paths are absolute

**"Rate limited"**

- Add delays between API calls
- Use bulk operations where available
- Check rate limit settings in services

## Getting Help

1. Use `mcp__MCP_DOCKER__sequentialthinking` for complex problem solving
2. Search documentation with `mcp__context7__resolve-library-id`
3. Check implementation docs in this folder
4. Create tasks for blockers with `mcp__taskmaster-ai__add_task`

Remember: These MCP tools are designed to automate repetitive tasks and maintain consistency across the implementation. Use them liberally!
