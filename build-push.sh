docker build . -t us.gcr.io/multichain-prod/dexray:v1 $1
gcloud docker -- push us.gcr.io/multichain-prod/dexray
cd k8s/
kubectl apply -f app.yaml
cd ..