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
  
##  Project Structure

```bash
ProjetDistrib/
├── docker-compose.yml             # Docker Compose file for local testing
├── frontend/                      # Static frontend (HTML, JS)
│   ├── app.js                   
│   ├── Dockerfile              
│   ├── index.html                
│   └── login.html                
├── init.sql                       # SQL script to initialize MySQL schema
├── k8s/                           # Kubernetes deployment YAML files
│   ├── frontend-deployment.yaml
│   ├── frontend-mtls.yaml        
│   ├── ingress.yaml               
│   ├── mysql-deployment.yaml
│   ├── rbac-sessions-service.yaml
│   ├── rbac-users-service.yaml
│   ├── sessions-service-deployment.yaml
│   ├── strict-mtls.yaml      
│   └── users-service-deployment.yaml
├── nginx/                     
│   └── default.conf
├── package-lock.json          
├── README.md                  
├── sessions-service/             # Microservice to handle workout sessions
│   ├── app.js                 
│   ├── db.js                     
│   ├── Dockerfile                 
│   └── package.json
├── token.txt                 
└── users-service/                # Microservice for user authentication
    ├── app.js                     
    ├── db.js                     
    ├── Dockerfile                 
    ├── package.json
    ├── package-lock.json
```

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

Activate istio

```
minikube addons enable istio
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


## Verify That the Database Works

Here's how to verify that the data sent from the application is saved in the MySQL database deployed in Kubernetes.

### 1. Start the Minikube Cluster

If not already done, make sure Minikube is running and all components have been deployed:

- See instructions in the **"Kubernetes testing"** section

Check that all pods are in `Running` state:

```bash
kubectl get pods
```

### 2. Access the Application

Launch the frontend service:
```
minikube service frontend
```
This will open the application in your browser.

### 3. Create a User via the Interface

  1. On the login page, click on Create Account

  2. Enter a username and a password

  3. Click Register

### 4. Add a Workout Session

  1. Once logged in, enter a session duration (e.g., 33 minutes)

  2. Click on Add session

A request is sent to the API and the session is saved in the database.

### 5. Verify the Data in MySQL

Launch a temporary MySQL client pod inside the cluster:
```
kubectl delete pod mysql-client  # si nécessaire
kubectl run mysql-client --rm -it --image=mysql:8.0 --restart=Never -- bash
```
Inside the pod, connect to MySQL:
```
mysql -h mysql -u root -p
```
Password: password

Then run the following SQL commands:
```
USE fitness_db;
```
```
-- View all users
SELECT * FROM users;
```
```
-- View recorded workout sessions
SELECT * FROM sessions;
```
```
-- See who did what (with join)
SELECT u.username, s.date, s.duration
FROM sessions s
JOIN users u ON s.user_id = u.id
ORDER BY s.id DESC;
```

Example of Expected Output
```sql
mysql> USE fitness_db;
Database changed

mysql> SELECT * FROM users;
+----+----------+----------+
| id | username | password |
+----+----------+----------+
|  1 | ana      | test     |
+----+----------+----------+
1 row in set (0.00 sec)

mysql> SELECT * FROM sessions;
+----+---------+---------------------+----------+
| id | user_id | date                | duration |
+----+---------+---------------------+----------+
|  3 |       1 | 2025-05-16 19:00:45 |       30 |
+----+---------+---------------------+----------+
1 row in set (0.01 sec)
```
##  API Endpoints

Below is a list of the REST API endpoints exposed by the two microservices.

### Users Service (`users-service`)

| Method | Endpoint     | Description                             |
|--------|--------------|-----------------------------------------|
| POST   | `/register`  | Create a new user account               |
| POST   | `/login`     | Authenticate a user and return user ID |

### Sessions Service (`sessions-service`)

| Method | Endpoint             | Description                                           |
|--------|----------------------|-------------------------------------------------------|
| POST   | `/sessions`          | Add a new workout session (`userId` + `duration`)    |
| GET    | `/sessions/:userId`  | Get all sessions for a given user                    |

##  Security

Here are the steps used to verify that Istio and RBAC security mechanisms are correctly applied to the Kubernetes cluster.

---

### TEST 1 – Check Istio Sidecar Injection (`2/2 READY`)
Run:
```bash
kubectl get pods
```
You should see all your main service pods in Running state with 2/2,

### TEST 2 – Verify that mTLS is enforced (STRICT)

List all PeerAuthentication rules:
```
kubectl get peerauthentication -A
```
You should see:
```
NAMESPACE   NAME       MODE     ...
default     default    STRICT
```

### TEST 3 – Check that the frontend is in PERMISSIVE mode
```
kubectl get peerauthentication -n default
```
Then inspect the configuration of the frontend rule:
```
kubectl get peerauthentication frontend -o yaml
```
This allows unauthenticated external HTTP traffic to reach the frontend, which is required for browser access.

### TEST 4 – Verify RBAC with a Kubernetes Token

1. Generate a token:
```
kubectl create token users-service-account
```
2. Get your API server address:
```
kubectl cluster-info
```
You’ll see something like:
```
Kubernetes control plane is running at https://192.168.49.2:8443
```
3. Test access with curl:
```
curl -H "Authorization: Bearer <YOUR_TOKEN>" https://<KUBE_API_SERVER>/api/v1/namespaces --insecure
```

This confirms that:

  The token is valid and authenticated

  Access is denied due to RBAC restrictions
