import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data) => {
    let claims = {
        admin: true,
        subscriber: true
    }
    return admin.auth().getUserByEmail(data.email).then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, claims);
    }).then(() => {
        return {
            message: `User: ${data.email} has been made an admin`
        }
    }).catch((error) => {
        return error;
    });
});

exports.addSubscriberRole = functions.https.onCall((data) => {
    let claims = {
        admin: false,
        subscriber: true
    }
    return admin.auth().getUserByEmail(data.email).then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, claims);
    }).then(() => {
        return {
            message: `User: ${data.email} has been made a subscriber`
        }
    }).catch((error) => {
        return error;
    });
});

exports.removeSubscriberRole = functions.https.onCall((data) => {
    let claims = {
        admin: false,
        subscriber: false
    }
    return admin.auth().getUserByEmail(data.email).then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, claims);
    }).then(() => {
        return {
            message: `User: ${data.email} is no longer a subscriber`
        }
    }).catch((error) => {
        return error;
    });
});

