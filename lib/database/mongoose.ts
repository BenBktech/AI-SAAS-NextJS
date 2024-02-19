/* gérer la connexion à une base de données MongoDB dans un projet Next.js, en 
utilisant Mongoose, une bibliothèque qui facilite les interactions entre Node.js 
et MongoDB. Il montre comment établir une connexion réutilisable à la base de 
données pour éviter les connexions multiples inutiles qui pourraient surcharger 
la base de données et ralentir l'application. */
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

/* Cette interface définit un type pour gérer la connexion et la promesse de 
connexion à MongoDB. Elle contient deux propriétés : conn, qui stockera 
l'instance de connexion à la base de données, et promise, qui stockera la 
promesse de connexion.*/
interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

/* Utilise une variable globale pour stocker l'objet de connexion afin de 
réutiliser la connexion à la base de données à travers les différentes requêtes à 
l'application Next.js. Cela permet d'éviter de créer une nouvelle connexion à 
chaque fois, ce qui serait inefficace.*/
let cached: MongooseConnection = (global as any).mongoose

/* Si l'objet de mise en cache n'existe pas déjà (c'est-à-dire lors de la 
première exécution), il est initialisé avec conn et promise définis à null. */
if(!cached) {
    cached = (global as any).mongoose = { 
        conn: null, promise: null 
    }
}

export const connectToDatabase = async () => {
    /* Vérification de la connexion existante : Si une connexion à la base de 
    données est déjà établie (cached.conn), elle est immédiatement retournée pour 
    être réutilisée.*/
    if(cached.conn) return cached.conn;

    /* Vérification de l'URL de la base de données : Si l'URL de la base de 
    données n'est pas définie, une erreur est lancée pour alerter du problème de 
    configuration.*/
    if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');

    /* Établissement de la connexion : Si aucune promesse de connexion n'est en 
    cours, une nouvelle connexion est initiée avec mongoose.connect. Cette 
    connexion est configurée avec l'URL de la base de données et des options 
    spécifiques, comme le nom de la base de données (dbName) et bufferCommands 
    défini sur false pour ne pas tamponner les commandes si la connexion n'est 
    pas encore établie.*/
    cached.promise = 
        cached.promise || 
        mongoose.connect(MONGODB_URL, { 
            dbName: 'imaginify', bufferCommands: false 
        })

    /* Mise en cache de la connexion : La promesse de la connexion est attendue 
    avec await, et l'instance de connexion résultante est stockée dans cached.
    conn avant d'être retournée.*/
    cached.conn = await cached.promise;

    return cached.conn;
}