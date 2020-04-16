import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
    return admin.auth().getUserByEmail(data.email).then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
    }).then(() => {
        return {
            message: `User: ${data.email} has been made an admin`
        }
    }).catch((error) => {
        return error;
    });
});

