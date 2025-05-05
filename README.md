# ProjetDistrib - Fitness Tracking Application

## Authors

Anaïs Kadic  
Titouan Brierre

## Project Description

A microservices-based fitness tracking application with:
- User authentication service (Node.js)
- Workout sessions tracking service (Node.js)
- Frontend interface (html/js)
- MySQL database 
- Kubernetes/Docker deployment

## Prerequisites

- Docker Desktop
- Minikube
- kubectl

## Local testing :

Run at the root of the project :

```
docker-compose up --build
```


Then open your browser to the following address

```
http://localhost:8080/login.html
```

You can now create an account and login to add a session and see the list of your previous sessions

## Kubernetes testing

Start Minikube

```
minikube start
```

Activate ingress

```
minikube addons enable ingress
```

Create ConfigMaps (run at the root of the project)

```
kubectl create configmap mysql-init --from-file=init.sql
kubectl create configmap frontend-config --from-file=frontend/
```

Deploy components

```
kubectl apply -f k8s/
```

Wait for the deployment to be complete, it can take a few minutes.

Open the frontend service on navigator to create an account and login to add a session and see the list of your previous sessions

```
minikube service frontend
```
