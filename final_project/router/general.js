const express = require('express');
let books = require("./booksdb.js");
const books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist= (username)=>
{
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}
public_users.post("/register", (req,res) => {
  const {username} = req.body;
  const {password} = req.body;

  if(username && password)
  {
    if(!doesExist(username))
    {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
    }
    else{
        return res.status(404).json({message: "User already exists!"});
    }
  }
  else{
    return res.status(404).json({message: "Unable to register user."});
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    const allbooks = await books.find();
  res.send(allbooks);

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const reqauthor = req.params.author;
    const matchbooks =[];

    Object.keys(books).forEach((key)=>{
        const book = books[key];
        if(book.author === reqauthor)
        {
            matchbooks.push({isbn: key, ...book });
        }
    });
    if(matchbooks.length>0)
    {
        return res.status(200).json({ books: matchbooks });
    } else {
      return res.status(404).json({ message: "No books found for the specified author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title} = req.params;
    const matchbooks =[];

    Object.keys(books).forEach((key)=>{
        const book = books[key];
        if(book.title === title)
        {
            matchbooks.push({isbn: key, ...book });
        }
    });
    if(matchbooks.length>0)
    {
        return res.status(200).json({ books: matchbooks });
    } else {
      return res.status(404).json({ message: "No books found for the specified author" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
