# Kubernetes Deployment (My Way)

This folder contains a production-ready baseline for:
- Kubernetes app deployment (frontend, backend, mysql)
- Load balancing via NGINX Ingress
- Monitoring via kube-prometheus-stack + ServiceMonitor

## 1) Prerequisites

- A running Kubernetes cluster
- kubectl configured to your cluster context
- Helm installed
- NGINX Ingress Controller installed

Install ingress-nginx (if missing):

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.type=LoadBalancer
```

## 2) Build and push images

Update image names in:
- `k8s/base/backend-deployment.yaml`
- `k8s/base/frontend-deployment.yaml`

Replace `ghcr.io/REPLACE_ME_OWNER/...` with your registry paths.

## 3) Configure secrets

Copy and apply your secrets (do not keep example values):

```bash
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/base/app-secret.example.yaml
kubectl apply -f k8s/base/mysql-secret.example.yaml
```

## 4) Deploy app stack

```bash
kubectl apply -k k8s/base
kubectl get pods -n my-way
kubectl get svc -n my-way
kubectl get ingress -n my-way
```

## 5) Install monitoring

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace \
  -f k8s/monitoring/kube-prometheus-values.yaml
```

Apply ServiceMonitor:

```bash
kubectl apply -f k8s/monitoring/backend-servicemonitor.yaml
```

## 6) Access URLs

- App URL: ingress external IP / DNS
- Grafana URL: `kubectl get svc -n monitoring kube-prometheus-stack-grafana`

Get Grafana admin password:

```bash
kubectl get secret -n monitoring kube-prometheus-stack-grafana \
  -o jsonpath='{.data.admin-password}' | base64 --decode
```

## Notes

- Backend metrics endpoint: `/actuator/prometheus`
- Backend health endpoint for probes: `/actuator/health`
- Update `CORS_ALLOWED_ORIGINS` in backend deployment as needed for your real domain.
