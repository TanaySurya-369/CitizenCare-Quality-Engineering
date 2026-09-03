# AWS Cloud Architecture & Deployment Runbook

## 1. Cloud Architecture Blueprint

CitizenCare is architected for deployment onto Amazon Web Services (AWS) with zero architectural rework:

```
[Internet Citizens & Staff]
           ↓
[AWS Route 53 (DNS) & CloudFront CDN]
           ↓
[AWS Application Load Balancer (ALB) - HTTPS / TLS]
           ↓
[AWS EC2 / ECS Fargate Clusters (Node.js REST API + Nginx Frontend)]
           ↓
 ┌─────────────────────────┬─────────────────────────┐
 │                         │                         │
 ▼                         ▼                         ▼
[AWS RDS PostgreSQL]      [AWS S3 Bucket]           [AWS CloudWatch]
(Multi-AZ Replica)        (Complaint Evidence)      (Logs, Metrics, Alarms)
```

---

## 2. Infrastructure Component Matrix

| Service | Responsibility | Configuration |
| :--- | :--- | :--- |
| **AWS EC2 / ECS** | Host Node.js backend container & Nginx frontend | `t3.medium` instances behind Auto-Scaling Group |
| **AWS RDS** | Managed relational PostgreSQL 16 database | `db.t3.medium`, Multi-AZ deployment, automated daily snapshots |
| **AWS S3** | Secure storage for uploaded photographic evidence & reports | Encrypted with SSE-S3 (AES-256), private bucket policy via IAM |
| **AWS CloudWatch** | Application performance telemetry & centralized logging | Alarms configured for SLA breach spikes (>5%) and API latency (>500ms) |

---

## 3. Deployment Runbook

### Step 1: Provision PostgreSQL Database on AWS RDS
```bash
aws rds create-db-instance \
    --db-instance-identifier citizencare-prod-db \
    --db-instance-class db.t3.medium \
    --engine postgres \
    --allocated-storage 20 \
    --master-username citizencare_admin \
    --master-user-password MasterDBPassword123!
```

### Step 2: Provision S3 Storage Bucket
```bash
aws s3api create-bucket --bucket citizencare-evidence-storage --region us-east-1
```

### Step 3: Run Database Migrations on EC2 / ECS
```bash
export DATABASE_URL="postgresql://citizencare_admin:MasterDBPassword123!@citizencare-prod-db.cxxxx.rds.amazonaws.com:5432/citizencare_db"
npx prisma migrate deploy
```

### Step 4: Launch via Docker Compose or ECS Task
```bash
docker compose -f docker-compose.yml up -d --build
```
