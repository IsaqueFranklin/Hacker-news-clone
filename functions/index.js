const functions = require("firebase-functions");

const LINKS_PER_PAGE = 10

const admin = require('firebase/admin')
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: https://hacker-news-57514-default-rtdb.firebaseio.com/
})
const db = admin.firestore()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/linksPagination?offset=20
//
exports.linksPagination = functions.https.onRequest((request, response) => {
  response.set('Acces-Control-Allow-Origin', "*")
  let linksRef = db.collection('links')
  const offset = Number(request.query.offset)
  linksRef
    .orderBy('created', 'desc')
    .limit(LINKS_PER_PAGE)
    .offset(offset)
    .get()
    .then(snapshot => {
        snapshot.docs.map(doc => {
            return {id: doc.id, ...doc.data() }
        })
        response.json(links)
    })
});
