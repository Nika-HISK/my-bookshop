namespace my.bookshop;

entity Books {
  key ID : Integer;
  title  : String(100) not null;
  author : String(100) not null;
  stock  : Integer default 0;
  price  : Decimal(9,2);
  createdAt : Timestamp @cds.on.insert: $now;
  modifiedAt : Timestamp @cds.on.insert: $now @cds.on.update: $now;
}

entity Authors {
  key ID : Integer;
  name : String(100) not null;
  email : String(100);
  books : Association to many Books on books.author = name;
  createdAt : Timestamp @cds.on.insert: $now;
}