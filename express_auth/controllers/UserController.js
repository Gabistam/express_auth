const User = require('../models/User');
const { userResponseParser } = require('../utils/userResponseParser');

// Récupérer le profil de l'utilisateur
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user.userId } });
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé.');
        }
        res.render('pages/profile', { user: userResponseParser(user) });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération du profil.');
    }
};

// Mettre à jour les informations de l'utilisateur
exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        await User.update({ username, email }, { where: { id: req.user.userId } });
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la mise à jour du profil.');
    }
};

// Supprimer le compte utilisateur
exports.deleteAccount = async (req, res) => {
    try {
        await User.destroy({ where: { id: req.user.userId } });
        res.redirect('/logout'); // Après la suppression, déconnectez l'utilisateur
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la suppression du compte.');
    }
};

// Autres méthodes liées à l'utilisateur peuvent être ajoutées ici
