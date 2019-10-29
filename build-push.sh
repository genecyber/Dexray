docker build . -t us.gcr.io/multichain-prod/dexray:v5 $1
gcloud docker -- push us.gcr.io/multichain-prod/dexray
cd k8s/
kubectl apply -f app.yaml
cd ..