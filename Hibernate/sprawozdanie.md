__Zadanie 1:__
Product:
```java
package org.example;


import jakarta.persistence.*;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int  productID;
    private String productName;
    private int  unitsInStock;
    @ManyToOne
    private Supplier supplier;

    public Product(){}

    public Product(String productName, int unitsInStock,Supplier supplier){
        this.productName = productName;
        this.unitsInStock = unitsInStock;
        this.supplier = supplier;

    }

}
```

Supplier:
```java
package org.example;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int supplierID;
    private String companyName;
    private String street;
    private String city;

    public Supplier(){};

    public Supplier(String companyName, String street, String city) {
        this.companyName = companyName;
        this.street = street;
        this.city = city;
    }

}
```

hibernate:
```java
<?xml version='1.0' encoding='utf-8'?>
<!DOCTYPE hibernate-configuration PUBLIC
        "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
        "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
    <session-factory>
        <property
                name="connection.driver_class">org.apache.derby.jdbc.ClientDriver</property>
        <property
                name="connection.url">jdbc:derby://127.0.0.1/AntoniDulewiczDatabase
        </property>
        <property name="show_sql">true</property>
        <property name="format_sql">true</property>
        <property name="use_sql_comments">true</property>
        <property name="hbm2ddl.auto">create-drop</property>
        <mapping class="org.example.Product"></mapping>
        <mapping class="org.example.Supplier"></mapping>
    </session-factory>
</hibernate-configuration>
```

Main:
```java
package org.example;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

public class Main {
    private static SessionFactory sessionFactory = null;

    public static void main(String[] args){
        sessionFactory = getSessionFactory();

        Session session = sessionFactory.openSession();

        Supplier supplier = new Supplier("MyCompany","Kawiory","Cracow");
        Product product = new Product("Kredka",10,supplier);


        Transaction tx = session.beginTransaction();
        session.save(supplier);
        session.save(product);
        tx.commit();

        session.close();
    }

    private static SessionFactory getSessionFactory(){
        if(sessionFactory == null){
            Configuration configuration = new Configuration();
            sessionFactory = configuration.configure().buildSessionFactory();
        }
        return sessionFactory;
    }
}
```
Product:
![image](images/zad1_product.png)

Supplier:
![image](images/zad1_supplier.png)

Relacja:
![image](images/zad1.png)

__Zadanie 2:__
Main:
```java
package org.example;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import java.util.Set;

public class Main {
    private static SessionFactory sessionFactory = null;

    public static void main(String[] args){
        sessionFactory = getSessionFactory();

        Session session = sessionFactory.openSession();

        Product product1 = new Product("Kredka",10);
        Product product2 = new Product("Ołówek",20);
        Set<Product> products = Set.of(product1,product2);
        Supplier supplier = new Supplier("MyCompany","Kawiory","Cracow",products);


        Transaction tx = session.beginTransaction();
        session.save(product1);
        session.save(product2);
        session.save(supplier);
        tx.commit();

        session.close();
    }

    private static SessionFactory getSessionFactory(){
        if(sessionFactory == null){
            Configuration configuration = new Configuration();
            sessionFactory = configuration.configure().buildSessionFactory();
        }
        return sessionFactory;
    }
}
```
Products:
![image](images/zad2_products.png)

Supplier_products:
![image](images/zad2_supplier_products.png)

Relacja:
![image](images/zad2.png)
