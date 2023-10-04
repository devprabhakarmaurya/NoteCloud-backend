const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const verifytoken = require('../middleware/verifytoken');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all the notes of loggedin user GET "/api/auth/getnotes".  Login required
router.get('/getnotes', verifytoken, async (req, res) => {
    try {
        // savedNotes is a array of all the notes 
        const savedNotes = await Note.find({ user: req.user });
        res.json(savedNotes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
//ROUTE 2: Add notes of loggedin user POST "/api/auth/addnote".  Login required
router.post("/addnote", verifytoken, [
    body('title').isLength({ min: 3 }).withMessage("Invalid Title"),
    body('description').isLength({ min: 5 }).withMessage("Invalid Description"),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const note = new Note({
            title: title,
            description: description,
            tag: tag,
            user: req.user
        });

        const savedNote = await note.save();
        
        // Send a 201 Created status and the saved note as JSON
        res.status(201).json({ message: 'Note added successfully', note: savedNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
//ROUTE 3: Updating notes of loggedin user PUT "/api/auth/updatenote".  Login required
router.put('/updatenote/:id', verifytoken, async (req, res) => {
    const { title, description, tag } = req.body; 
    try {
        // newNote will formed when anything will be updated 
        let newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the note to be updated and update it if user is verfied
        let note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).json({message: "No such note found"})
        };
        //Before updating check whether user is authorised or not
        if((String)(note.user)!==(String)(req.user)){
            return   res.status(401).json({message: "Not Authorized"})
        };
        //finding note by id and updating with new obj newNote
        note = await Note.findByIdAndUpdate(req.params.id, newNote, {new: true});
        res.status(201).json(note);
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }

    }) 
//ROUTE 4: Deleting notes of loggedin user DELETE "/api/auth/updatenote".  Login required
router.delete('/deletenote/:id', verifytoken, async (req, res) => {  
    try {
        //Find the note to be updated and update it if user is verfied
        let note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).json({message: "No such note found"})
        };
        //Before updating check whether user is authorised or not
        if((String)(note.user)!==(String)(req.user)){
            return   res.status(401).json({message: "Not Authorized"})
        };
        //finding note by id and updating with new obj newNote
        note = await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Deleted Note Successfully' });
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }) 
module.exports = router;