"use server";

/* Fonctions et  modules nécessaires pour la connexion à la base de données, la gestion des erreurs, et le revalidation de chemin avec next/cache pour la mise à jour instantanée des données sur le site.*/
import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
/* Cette fonction prend en paramètre les données d'un nouvel utilisateur, établit une connexion à la base de données, crée un nouvel utilisateur dans la base de données avec ces données, puis retourne l'utilisateur créé. Les données sont nettoyées en les convertissant en JSON.*/
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
/* Lecture d'un utilisateur par son ID : Cette fonction cherche un utilisateur par son clerkId (un identifiant unique pour chaque utilisateur), se connecte à la base de données, et retourne les données de l'utilisateur si trouvé. Si aucun utilisateur n'est trouvé, une erreur est générée.*/
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
/* Mise à jour d'un utilisateur : Permet de mettre à jour les données d'un utilisateur identifié par son clerkId. Après la connexion à la base de données, elle cherche et met à jour l'utilisateur avec les nouvelles données fournies et retourne l'utilisateur mis à jour. En cas d'échec, une erreur est générée.*/
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
/* Suppression d'un utilisateur : Supprime un utilisateur basé sur son clerkId. Après avoir trouvé l'utilisateur, il est supprimé de la base de données. La fonction tente également de revalider le chemin racine ("/") pour mettre à jour les données affichées sur le site. Retourne l'utilisateur supprimé ou null si la suppression échoue.*/
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    /* Lorsqu'un utilisateur est supprimé, il est possible que cela impacte le contenu affiché sur la page d'accueil (par exemple, un compteur d'utilisateurs ou une liste d'utilisateurs actifs). En appelant revalidatePath("/") après une suppression, vous indiquez à Next.js de régénérer cette page lors de la prochaine requête, assurant ainsi que le contenu affiché est à jour.*/
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITS
/* Mise à jour des crédits d'un utilisateur : Cette fonction est conçue pour ajuster le solde de crédits d'un utilisateur, soit en ajoutant ou en soustrayant des crédits. Elle recherche l'utilisateur par son ID et utilise l'opérateur $inc pour incrémenter ou décrémenter le creditBalance selon le creditFee fourni.*/
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee }},
      { new: true }
    )

    if(!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}