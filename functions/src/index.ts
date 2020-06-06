import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data) => {
    return admin.auth().getUserByEmail(data.email).then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true,
            subscriber: true
        });
    }).then(() => {
        return {
            message: `User: ${data.email} has been made an admin`
        }
    }).catch((error) => {
        return error;
    });
});

exports.addSubscriberRole = functions.https.onCall((data) => {
    console.log(data.email);
    return admin.auth().getUserByEmail(data.email).then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, {
            subscriber: true
        });
    }).then(() => {
        return {
            message: `User: ${data.email} has been made a subscriber`
        }
    }).catch((error) => {
        return error;
    });
});

exports.removeSubscriberRole = functions.https.onCall((data) => {
    return admin.auth().getUserByEmail(data.email).then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, {
            subscriber: false
        });
    }).then(() => {
        return {
            message: `User: ${data.email} is no longer a subscriber`
        }
    }).catch((error) => {
        return error;
    });
});

