const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //Stores all the contacts
    const result = await mongodb.getCollection().find();
    //Puts the result into an awway and reports a success message.
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
};
const getSingle = async (req, res) => {
    //Stores the contact ID
    const contactId = new ObjectId(req.params.id);
    
    //Pulls the data of a single contact from the database depending on the contact id
    const result = await mongodb.getCollection().find({_id: contactId});
    
    //Puts the result into an awway and reports a success message.
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
};
const createContact = async (req, res) => {
    //creates an array with the contact fields
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    //push the contact array to the database
    const response = await mongodb.getCollection().insertOne(contact);
    //Success and Error message
    if (response.acknowledged) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the contact.');
    }
};
const updateContact = async (req, res) => {
    //Stores the contact ID
    const contactId = new ObjectId(req.params.id);
    //creates an array with the contact fields. You need to complete each field. It doesn't work just for one specific field. 
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    //push the contact array to the database and replace it with the old contact from the database. You have to specify the contactId
    const response = await mongodb.getCollection().replaceOne({_id: contactId}, contact);
    //Success and Error message
    console.log(response);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the contact.');
    }
};

const deleteContact = async (req, res) => {
    //Stores the contact ID
    const contactId = new ObjectId(req.params.id);
    //Deletes a contact depending on the id and if the ID exists. 
    const response = await mongodb.getCollection().remove({ _id: contactId }, true);
    //Success and Error message.
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
    }
};

//exports the functions
module.exports = {getAll, getSingle, createContact, updateContact, deleteContact};