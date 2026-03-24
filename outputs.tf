##############################################
# Outputs
##############################################

# output "ecr_repository_url" {
#   description = "ECR Repository URL"
#   value       = aws_ecr_repository.app_repo.repository_url
# }

output "ecs_cluster_name" {
  description = "ECS Cluster name"
  value       = aws_ecs_cluster.app_cluster.name
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.app_alb.dns_name
}

output "dashboard_service_name" {
  description = "ECS Service name"
  value       = aws_ecs_service.app_service["dashboard"].name
}
output "authors_service_name" {
  description = "ECS Service name"
  value       = aws_ecs_service.app_service["authors"].name
}
output "books_service_name" {
  description = "ECS Service name"
  value       = aws_ecs_service.app_service["books"].name
}

output "task_role_arn" {
  description = "Task Execution Role ARN"
  value       = aws_iam_role.ecs_task_execution_role.arn
}

output "dashboard_repo_url" {
  description = "ecr_repo repo url"
  value       = aws_ecr_repository.app_repos["dashboard-repo"].repository_url
}
output "authors_repo_url" {
  description = "ecr_repo repo url"
  value       = aws_ecr_repository.app_repos["authors-repo"].repository_url
}
output "books_repo_url" {
  description = "ecr_repo repo url"
  value       = aws_ecr_repository.app_repos["books-repo"].repository_url
}