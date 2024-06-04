const schemas = {
    Products: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "supplier_name","price", "stock"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                supplier_name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                price: {
                    bsonType: "double",
                    description: "must be a double and is required"
                },
                stock: {
                    bsonType: "object",
                    required: ["quantity", "unit"],
                    properties: {
                        quantity: {
                            bsonType: "number",
                            description: "must be an number and is required"
                        },
                        unit: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        }
                    }
                }
            }
        }
    },
    Clients: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            'name',
            'surname',
            'email',
            'password',
            'phone',
            'address',
            'history',
            'reservations'
          ],
          properties: {
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            surname: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            email: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            password: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            phone: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            address: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            history: {
              bsonType: 'array',
              description: 'must be an array if present',
              items: {
                bsonType: ['object', 'null'],
                required: [
                  'order_id',
                  'date',
                  'price',
                  'address',
                  'status',
                  'dishes'
                ],
                properties: {
                  order_id: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                  },
                  date: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                  },
                  price: {
                      bsonType: "number",
                      description: "must be a number and is required"
                  },
                  address: {
                    bsonType: "string",
                    description: "must be a string and is required"
                  },
                  status: {
                    enum: ["pending", "in progress", "delivered"],
                    description: "can only be one of the enum values and is required"
                  },   
                  dishes: {
                    bsonType: 'array',
                    description: 'must be an array and is required',
                    items: {
                      bsonType: 'object',
                      required: [
                        'dish_id',
                        'name',
                        'price'
                      ],
                      properties: {
                        dish_id: {
                          bsonType: 'string',
                          description: 'must be a string and is required'
                        },
                        name: {
                            bsonType: 'string',
                            description: 'must be a string and is required'
                        },
                        price: {
                            bsonType: "number",
                            description: "must be a number and is required"
                        }
                      }
                    }
                  }
                }
              }
            },
            reservations: {
              bsonType: 'array',
              description: 'must be an array if present',
              minItems: 0,
              items: {
                bsonType: ['object', 'null'],
                required: [
                  'reservation_id',
                  'date',
                  'time',
                  'people',
                  'isCanceled'
                ],
                properties: {
                  reservation_id: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                  },
                  date: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                  },
                  time: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                  },
                  people: {
                    bsonType: 'int',
                    description: 'must be an int and is required'
                  },
                  isCanceled: {
                    bsonType: 'bool',
                    description: 'must be a bool and is required'
                  }
                }
              }
            }
          },
        },
        
    },
    Dishes: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "description", "price", "products"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                description: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                price: {
                    bsonType: "number",
                    description: "must be a number and is required"
                },
                products: {
                    bsonType: "array",
                    description: "must be an array and is required",
                    items: {
                        bsonType: "object",
                        required: ["name","supplier_name", "quantity", "unit"],
                        properties: {
                            name: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            supplier_name: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            quantity: {
                                bsonType: "number",
                                description: "must be an number and is required"
                            },
                            unit: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            }
                        }
                    }
                }
            }
        }
    },
    Suppliers: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "contact", "products_supplied"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                contact: {
                    bsonType: "object",
                    required: ["phone", "email", "address"],
                    properties: {
                        phone: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        email: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        address: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        }
                    }
                },
                products_supplied: {
                    bsonType: "array",
                    description: "must be an array and is required",
                    items: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    }
                }
            }
        }
    },
    Carts: {
        $jsonSchema: {
            bsonType: "object",
            required: ["client_id", "dishes"],
            properties: {
                client_id: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                dishes: {
                    bsonType: "array",
                    description: "must be an array and is required",
                    items: {
                        bsonType: "object",
                        required: ["dish_id", "quantity"],
                        properties: {
                            dish_id: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            quantity: {
                                bsonType: "number",
                                description: "must be an number and is required"
                            }
                        }
                    }
                }
            }
        }
    },
    Orders : {
        $jsonSchema: {
            bsonType: "object",
            required: ["client", "date", "cart", "dishes", "price", "address", "status"],
            properties: {
                client: {
                    bsonType: "object",
                    description: "must be an object and is required",
                    required: ["client_id", "name", "surname"],
                    properties: {
                        client_id: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        name: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        surname: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        }
                    }
                },
                date: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                cart: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                dishes: {
                    bsonType: "array",
                    description: "must be an array and is required",
                    items: {
                        bsonType: "object",
                        required: ["dish_id", "dish_name", "quantity", "price"],
                        properties: {
                            dish_id: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            dish_name: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            quantity: {
                                bsonType: "number",
                                description: "must be an number and is required"
                            },
                            price: {
                                bsonType: "number",
                                description: "must be a number and is required"
                            }
                        }
                    }
                },
                price: {
                    bsonType: "number",
                    description: "must be a number and is required"
                },
                address: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                status: {
                    enum: ["pending", "in progress", "delivered"],
                    description: "can only be one of the enum values and is required"
                }
            }
        }
    },
    SupplierOrders : {
        $jsonSchema: {
            bsonType: "object",
            required: ["supplier_id", "date", "products", "price", "status"],
            properties: {
                supplier_id: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                date: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                product:{
                    bsonType: "object",
                    required: ["product_id", "price"],
                    properties: {
                        product_id: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        price: {
                            bsonType: "number",
                            description: "must be a double and is required"
                        }
                    }
                },
                price: {
                    bsonType: "number",
                    description: "must be a number and is required"
                },
                status: {
                    enum: ["pending", "in progress", "delivered"],
                    description: "can only be one of the enum values and is required"
                }
            }
            
        }
    },  
    Admins: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name","surname", "email", "password","phone","address"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                surname: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                password: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                phone: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                address: {
                    bsonType: "string",
                    description: "must be a string and is required"
                }
            }
        }
    },
    Sessions: {
        $jsonSchema: {
            bsonType: "object",
            required: ["expires","session"],
            properties: {
                expires: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                session: {
                    bsonType: "object",
                    required: ["cookie","isAdmin"],
                    properties: {
                        cookie: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        isAdmin: {
                            bsonType: "bool",
                            description: "must be a bool and is required"
                        }
                    }
                }
            }
        },
    },
    Reservations: {
        $jsonSchema: {
            bsonType: "object",
            required: ["client","date","time","people","isCanceled"],
            properties: {
                client: {
                    bsonType: "object",
                    required: ["name","surname","email","password","phone","address"/* ,"history","reservations" */],
                    properties: {
                        name: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        surname: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        email: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        password: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        phone: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        address: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                    }
                },
                date: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                time: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                people: {
                    bsonType: "int",
                    description: "must be an int and is required"
                },
                isCanceled: {
                    bsonType: "bool",
                    description: "must be a bool and is required"
                }
            }
        }
    }
};