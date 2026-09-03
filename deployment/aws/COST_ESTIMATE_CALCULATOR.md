# AWS Cloud Infrastructure Monthly Cost Estimate Calculator

**Target Deployment Scale:** Municipal City (500,000 Citizens / 5,000 Monthly Complaints)

| AWS Resource | Specification | Quantity / Usage | Monthly Cost (USD) |
| :--- | :--- | :--- | :--- |
| **AWS EC2 (API / UI)** | `t3.medium` (2 vCPU, 4GB RAM) | 2 Instances (Auto-Scaling) | **$60.40** |
| **AWS RDS PostgreSQL** | `db.t3.medium` Multi-AZ, 50GB SSD | 1 Cluster | **$104.20** |
| **Application Load Balancer (ALB)** | 1 ALB + LCU hours | 1 ALB | **$22.50** |
| **AWS S3 (Evidence Storage)** | Standard S3 (AES-256) | 100 GB Storage + GET/PUT requests | **$3.50** |
| **AWS CloudFront CDN** | Global Edge Distribution | 250 GB Data Transfer Out | **$21.25** |
| **AWS CloudWatch** | Custom Metrics, Alarms, Logs | 10 GB Logs + 5 Alarms | **$8.00** |
| **AWS Route 53** | Hosted Zone + Health Checks | 1 Domain | **$0.50** |
| **TOTAL ESTIMATED MONTHLY COST** | | | **~$220.35 / Month** |

---

## Cost Optimization Recommendations
1. **AWS Savings Plans / Reserved Instances:** 1-Year or 3-Year Reserved Instances reduce EC2 & RDS costs by up to **42%**.
2. **S3 Intelligent-Tiering:** Automatically transitions older evidence files (>90 days) to Glacier Instant Retrieval, saving up to **68%** on long-term evidence archiving.
