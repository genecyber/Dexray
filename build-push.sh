docker build . -t us.gcr.io/multichain-prod/dexray3:v1 $1
gcloud docker -- push us.gcr.io/multichain-prod/dexray3
cd k8s/
kubectl apply -f app.yaml
cd ..