const cds = require('@sap/cds');
const { SELECT, UPDATE } = cds.ql;

class BookshopService extends cds.ApplicationService {
  init() {
    this.before('CREATE', 'Books', async (req) => {
      const { title, author } = req.data;
      if (!title || !author) {
        req.error(400, 'Title and author are required');
      }
    });

    this.before('UPDATE', 'Books', async (req) => {
      if (req.data.price && req.data.price < 0) {
        req.error(400, 'Price cannot be negative');
      }
    });

    this.after('READ', 'Books', async (books, req) => {
      if (Array.isArray(books)) {
        books.forEach(book => {
          book.inStock = book.stock > 0;
        });
      } else if (books) {
        books.inStock = books.stock > 0;
      }
    });

    this.on('addStock', async (req) => {
      const { bookId, quantity } = req.data;
      const { Books } = this.entities;
      
      const book = await SELECT.one.from(Books).where({ ID: bookId });
      if (!book) {
        req.error(404, `Book with ID ${bookId} not found`);
      }
      
      await UPDATE(Books).set({ stock: book.stock + quantity }).where({ ID: bookId });
      return `Added ${quantity} units to book "${book.title}"`;
    });

    this.on('getBooksByAuthor', async (req) => {
      const { authorName } = req.data;
      const { Books } = this.entities;
      
      return await SELECT.from(Books).where({ author: authorName });
    });

    return super.init();
  }
}

module.exports = BookshopService;
