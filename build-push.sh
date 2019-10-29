docker build . -t us.gcr.io/multichain-prod/dexray2:v1 $1
gcloud docker -- push us.gcr.io/multichain-prod/dexray2
cd k8s/
kubectl apply -f app.yaml
cd ..