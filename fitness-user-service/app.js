require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json()); // Pour parser le JSON

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch(err => console.error("Erreur MongoDB:", err));

// Routes
app.use("/api/users", userRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en écoute sur ${PORT}`));