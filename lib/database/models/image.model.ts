/* 
Ce fichier définit un modèle pour les images dans une application Next.js 
utilisant Mongoose, une bibliothèque ODM (Object Data Modeling) pour MongoDB. Il 
sert à structurer les données pour les enregistrements d'images dans la base de 
données MongoDB.*/

/* Document, Schema, model, models de mongoose : Ces importations permettent d'utiliser Mongoose pour définir des schémas et des modèles pour les documents MongoDB. Document est utilisé pour le typage TypeScript, Schema pour définir la structure des données, model pour créer des modèles basés sur ces schémas, et models pour accéder aux modèles existants.*/
import { Document, Schema, model, models } from "mongoose";

/* IImage : C'est une interface TypeScript définissant la structure et le type de données pour un enregistrement d'image. Chaque champ de l'interface correspond à un attribut de l'image dans la base de données.

Champs obligatoires (title, transformationType, publicId, secureURL) : Ces champs doivent être fournis pour chaque enregistrement d'image.

Champs optionnels (width, height, etc.) : Ces champs peuvent être inclus, mais ne sont pas requis pour chaque enregistrement d'image.

author : C'est un objet contenant des informations sur l'auteur de l'image. Il inclut un identifiant et le nom de l'auteur.
*/
export interface IImage extends Document {
  title: string;
  transformationType: string;
  publicId: string;
  secureURL: string; 
  width?: number;
  height?: number;
  config?: object; 
  transformationUrl?: string; 
  aspectRatio?: string;
  color?: string;
  prompt?: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
  }
  createdAt?: Date;
  updatedAt?: Date;
}

/* ImageSchema : C'est la définition du schéma Mongoose pour les images. Il détaille les types de données, la nécessité (obligatoire ou non) et les valeurs par défaut pour chaque champ.

Champs : Correspondent à ceux définis dans l'interface IImage, avec des spécifications supplémentaires comme le type de données (String, Number, Object, etc.), si un champ est requis (required: true), et les valeurs par défaut pour createdAt et updatedAt.

author : Ce champ fait référence à un autre document dans la base de données (probablement un utilisateur), utilisant son ID. C'est un exemple de relation entre documents dans MongoDB.
*/
const ImageSchema = new Schema({
  title: { type: String, required: true },
  transformationType: { type: String, required: true },
  publicId: { type: String, required: true },
  secureURL: { type: String, required: true },
  width: { type: Number },
  height: { type: Number },
  config: { type: Object },
  transformationUrl: { type: String },
  aspectRatio: { type: String },
  color: { type: String },
  prompt: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

/* Image : Cette ligne vérifie si un modèle nommé Image a déjà été créé (pour éviter les erreurs de création multiple) et, si non, crée un nouveau modèle en utilisant le ImageSchema. Le modèle est ce qui est effectivement utilisé dans l'application pour interagir avec la collection d'images dans MongoDB (par exemple, pour créer, lire, mettre à jour ou supprimer des enregistrements d'images).*/
const Image = models?.Image || model('Image', ImageSchema);

/* export default Image; : Exporte le modèle Image pour qu'il puisse être utilisé ailleurs dans l'application Next.js.*/
export default Image;