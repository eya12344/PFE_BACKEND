const Gift = require("../models/gift");

exports.getGift = async (req, res) => {
  try {
    const gifts = await Gift.find().populate("creator");
    res.status(200).json(gifts);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des gifts" });
    console.log(error);
  }
};

// Create list
exports.createlist = async (req, res) => {
  try {
    const { theme, category, gifts, creator } = req.body;
    const newGiftList = new Gift({ theme, category, gifts, creator });

    await newGiftList.save();
    res.status(201).json(newGiftList);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la liste" });
  }
};

// Update list
exports.updatelist = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGiftList = await Gift.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedGiftList) {
      return res.status(404).json({ error: "Liste introuvable" });
    }
    res.status(200).json(updatedGiftList);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la liste" });
  }
};

// Liker / Disliker gift
// exports.likeGift = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({ error: "ID utilisateur requis" });
//     }

//     const giftList = await Gift.findById(id);
//     if (!giftList) {
//       return res.status(404).json({ error: "Liste introuvable" });
//     }

//     const index = giftList.likers.indexOf(userId);
//     if (index === -1) {
//       giftList.likers.push(userId); // Liker
//     } else {
//       giftList.likers.splice(index, 1); // Disliker
//     }

//     await giftList.save();
//     res.status(200).json(giftList);
//   } catch (error) {
//     res.status(500).json({ error: "Erreur lors de l'ajout du like" });
//   }
// };

// delete list
exports.deletelist = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGiftList = await Gift.findByIdAndDelete(id);

    if (!deletedGiftList) {
      return res.status(404).json({ error: "Liste introuvable" });
    }
    res.status(200).json({ message: "Liste supprimée avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la liste" });
  }
};
