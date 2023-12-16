const express = require('express');
const { createRoom, joinRoom, addMember, fetchMembers, fetchHost, fetchMessages, fetchPayments, fetchRoomName, isRoom } = require('../controllers/roomController');
const router = express.Router();

router.route("/createroom").post(createRoom)
router.route("/joinroom").post(joinRoom)
router.route("/addmember").post(addMember)
router.route("/members/:id").get(fetchMembers)
router.route("/host/:id").get(fetchHost)
router.route("/roomname/:id").get(fetchRoomName)
router.route("/messages/:id").get(fetchMessages)
router.route("/payments/:id").get(fetchPayments)
router.route("/isRoom").post(isRoom)

module.exports = router;