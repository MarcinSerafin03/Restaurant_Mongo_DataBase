# Oracle 

---

Imiona i nazwiska autorów :

---

<style>
  {
    font-size: 16pt;
  }
</style>

<style scoped>
 li, p {
    font-size: 14pt;
  }
</style>

<style scoped>
 pre {
    font-size: 10pt;
  }
</style>

# Tabele

- `Accounts` - konta użytkowników
  - `account_id` - id użytkownika, klucz główny
  - `login` - login
  - `password` - hasło
  - `firstname` - imie
  - `lastname` - nazwisko
  - `mail` - mail użytkownika
- `Dishes` - dania
  - `dish_id` - id dania klucz główny
  - `price` - cena
  - `product` - użyty produkt, klucz obcy
- `Products` - produkty
  - `product_id` - id produktu, klucz główny
  - `amount` - ilość
  - `amount type` - rodzaj ilości (kg, l, etc.)
  - `supplier_id` - id dostawcy, klucz obcy


- `Delivery` - historia zamówień od dostawców
  - `delivery_id` - id zamówienia, klucz główny
  - `date` - data dostawy
  - `supplier_id` - id dostawcy, klucz obcy
- `Delivery_Details`
  - `delivery_id` - id zamówienia, klucz obcy
  - `product_amount` - ilość produktów
  - `product` - produkt
  - `price_per_unit` - cena za jednostke produktu
  - `price` - cena za całą dostawe produktu

- `Suppliers` - dostawcy
 - `supplier_id` - id dostawcy, klucz główny
 - `supplier_name` - nazwa dostawcy
 - `phone` - numer telefonu
 - `mail` - mail dostawcy
 - `address` - adres dostawcy

- `History` - historia zamówień użytkowników
  - `history_id` - id zamówienia użytkownika,klucz główny
  - `date` - data zamówienia
  - `price` - cena za całe zamówioenie
  - `paid` - czy zostało opłacone

- `History_Details` - szczegóły zamówień użytkowników
  - `history_id` - id zamówienia użytkownika,klucz obcy
  - `dish_id` - zamówione danie
  - `amount` - ilość zamówionego dania
  - `dish_price` - cena zamówionego dania




```sql
create sequence s_account_seq
 start with 1
 increment by 1;
create table ACCOUNTS
(
    ACCOUNT_ID int not null
        constraint PK_ACCOUNTS
            primary key,
    LOGIN      VARCHAR2(50),
    PASSWORD   VARCHAR2(50),
    FIRSTNAME  VARCHAR2(50),
    LASTNAME   VARCHAR2(50),
    MAIL       VARCHAR2(50),
    PHONE      INT,
    ADDRESS     VARCHAR(50)
);
alter table ACCOUNTS
 modify ACCOUNT_ID int default s_account_seq.nextval;

```
``` sql
create sequence s_dishes_seq
 start with 1
 increment by 1;
create table DISHES
(
    DISH_ID int not null
        constraint PK_DISHES
            primary key,
    PRICE   FLOAT,
    PRODUCT_ID VARCHAR2(50)
);
alter table DISHES
 modify DISH_ID int default s_dishes_seq.nextval;
alter table DISHES
add constraint product_id_fk1 foreign key
( PRODUCT_ID ) references PRODUCTS ( PRODUCT_ID );

```
``` sql
create sequence s_products_seq
 start with 1
 increment by 1;
create table PRODUCTS
(
    PRODUCT_ID  int not null
        constraint PK_PRODUCT
            primary key,
    AMOUNT      FLOAT,
    AMOUNT_TYPE VARCHAR2(50),
    SUPPLIER_ID NUMBER
);
alter table PRODUCTS
modify PRODUCT_ID int default s_products_seq.nextval;
alter table PRODUCTS
add constraint supplier_id_fk1 foreign key
( SUPPLIER_ID ) references SUPPLIERS ( SUPPLIER_ID );

```
``` sql
create sequence s_delivery_seq
 start with 1
 increment by 1;
create table delivery
(
 delivery_id int not null
 constraint pk_delivery
 primary key,
 supplier_id int,
    "DATE" date,
    price float
);
alter table delivery
 modify delivery_id int default s_delivery_seq.nextval;
alter table delivery
add constraint supplier_id_fk2 foreign key
( supplier_id ) references SUPPLIERS ( supplier_id );

```
``` sql
create sequence s_delivery_details_seq
 start with 1
 increment by 1;
create table delivery_details
(
 delivery_id int not null,
    PRODUCT_AMOUNT FLOAT,
    PRODUCTS VARCHAR2(50),
    PRICE_PER_UNIT FLOAT,
    PRICE FLOAT
);
alter table delivery_details
add constraint delivery_id_fk1 foreign key
( delivery_id ) references DELIVERY ( delivery_id );

```
``` sql
create sequence s_suppliers_seq
 start with 1
 increment by 1;
create table SUPPLIERS
(
    SUPPLIER_ID  int not null
        constraint PK_SUPPLIER
            primary key,
    SUPPLIER_NAME VARCHAR2(50),
    PHONE         NUMBER,
    MAIL          VARCHAR2(50),
    ADDRESS       VARCHAR2(50)
);
alter table SUPPLIERS
 modify SUPPLIER_ID int default s_suppliers_seq.nextval;


```
``` sql
create sequence s_history_seq
 start with 1
 increment by 1;
create table HISTORY
(
    HISTORY_ID  int not null
        constraint PK_HISTORY
            primary key,
    "DATE"        DATE,
    PRICE         FLOAT,
    PAID          CHAR(1)
);
alter table HISTORY
 modify HISTORY_ID int default s_history_seq.nextval;

```
``` sql
create sequence s_history_details_seq
 start with 1
 increment by 1;
create table HISTORY_DETAILS
(
    HISTORY_ID int,
    DISH_ID VARCHAR2(50),
    AMOUNT         NUMBER,
    DISH_PRICE          VARCHAR2(50)
);
alter table HISTORY_DETAILS
add constraint history_id_fk1 foreign key
( HISTORY_ID ) references HISTORY ( HISTORY_ID );
```