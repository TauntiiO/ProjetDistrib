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
# Password: password

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
