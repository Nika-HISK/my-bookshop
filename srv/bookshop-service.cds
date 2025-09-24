using my.bookshop from '../db/schema';

service BookshopService {
  entity Books as projection on bookshop.Books;
  entity Authors as projection on bookshop.Authors;
  
  action addStock(bookId: Integer, quantity: Integer) returns String;
  function getBooksByAuthor(authorName: String) returns array of Books;
}
