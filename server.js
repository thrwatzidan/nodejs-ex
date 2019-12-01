//  OpenShift sample Node application
 /* RestFul Service By Node
Author: thrwat zidan
*/
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
require('events').EventEmitter.prototype._maxListeners = 100;
//register var

var name;
var birthday;
var phone;
var email;
var password;
var address;
//connect to Mysql
var conn = mysql.createConnection({
    host: 'remotemysql.com',
    user: '8I5BUK0q4r',
    password: 'caOUefsMFH',
    database: '8I5BUK0q4r'

});
//connection function 
conn.connect(function (err) {
    if (!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }
});

//body-parser init
var app = express();
app.use(bodyParser.json()); //Accept Json Params
app.use(bodyParser.urlencoded({
    extended: true
})); //Accept URL ENCode Params


/*----------------------------------Unknown Register-------------------------------------------  */

app.post('/unomyRegister/', (request, response, next) => {
    var post_data = request.body; //Get POST params from Body key
    name = post_data.name;
    birthday = post_data.birthday
    phone = post_data.phone;
    email = post_data.email;
    password = post_data.password;
    address = post_data.address;
    var avatar = post_data.avatar;
    var id = post_data.id;

    conn.query('SELECT * FROM `member` where phone=? AND isBlocked = 0', [phone], function (err, result, fields) {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        if (result && result.length)
            //response.json('User already exists !!!');
            response.end(JSON.stringify("User already exists !!!"));
        else {
            conn.query('INSERT INTO `member`(`id`, `name`, `birthday`, `phone`, `email`, `password`, `address`, `avatar`, `createdAt`, `updatedAt`, `isBlocked`)' +
                ' VALUES (?,?,?,?,?,?,?,?,NOW(),NOW(),0)', [id,name, birthday, phone, email, password, address, avatar],
                function (err, result, fields) {
                    conn.on('error', function (err) {
                        console.log('[MySQL Error]', err);
                        response.json('Register error : ', err);
                    });
                    if(!err)
                    response.end(JSON.stringify('Register Successful'));
                    else
                    response.send(JSON.stringify(err))
                });
        }
    });

});

/*----------------------------------Register-------------------------------------------  */

app.post('/register/', (request, response, next) => {
    var post_data = request.body; //Get POST params from Body key
    name = post_data.name;
    birthday = post_data.birthday
    phone = post_data.phone;
    email = post_data.email;
    password = post_data.password;
    address = post_data.address;
    var avatar = post_data.avatar;

    conn.query('SELECT * FROM `member` where phone=? AND isBlocked = 0', [phone], function (err, result, fields) {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        if (result && result.length)
            //response.json('User already exists !!!');
            response.end(JSON.stringify("User already exists !!!"));
        else {
            conn.query('INSERT INTO `member` ( `name`, `birthday`, `phone`, `email`, `password`, `address`,`avatar`, `createdAt`, `updatedAt`,`isBlocked`) ' +
                ' VALUES (?,?,?,?,?,?,?,NOW(),NOW(),0)', [name, birthday, phone, email, password, address, avatar],
                function (err, result, fields) {
                    conn.on('error', function (err) {
                        console.log('[MySQL Error]', err);
                        response.json('Register error : ', err);
                    });
                    response.end(JSON.stringify('Register Successful'));
                    
                });
        }
    });

});

/*-------------------------------------------------- login----------------------------------------------*/

app.post('/Userlogin/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    const phone = post_data.phone;
    const password = post_data.password;
    conn.query('SELECT * FROM `member`  where phone=? AND password=? HAVING member.isBlocked = 0 ',
        [phone, password], (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            //response.json(result);
            //  var passrow=result[""].password
            if (result && result.length) {
                response.end(JSON.stringify(result));
            } else {
                response.end(JSON.stringify("'User not exists !!!'"));
             
        }
        });
});
/*   ********************************************check member **************************************  */

app.use('/checkuser/', (request, response, next) => {
    var post_data = request.body;
    const phone = post_data.phone;
    const isBlocked = post_data.isBlocked;
    var message = "";
    conn.query('SELECT `id`, `name`, `birthday`, `phone`, `email`, `password`, `address`, `avatar`, `createdAt`, `updatedAt`, CASE WHEN isBlocked =0 THEN "FALSE" ELSE "TRUE" END AS isBlocked FROM `member` where phone=? AND isBlocked = ?',
     [phone,isBlocked], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result && result.length) {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                // var name= (row.name);
                //var phone= (row.phone);
                //var address= (row.address);
                //var email= (row.email);
                response.end(JSON.stringify(row));
            }
            // response.writeHead(200, { 'Content-Type': 'application/json'});
            //   response.end(JSON.stringify(result));
            // response.end();
        } else {
            response.end(JSON.stringify("'User not exists !!!'"));
        }
    });
});

/*   ********************************************get member data**************************************  */
app.post('/getMemberInformation/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    const phone = post_data.phone;
    const isBlocked = post_data.isBlocked;
var sql='SELECT `id`, `name`, `birthday`, `phone`, `email`, `password`, `address`, `avatar`, `createdAt`, `updatedAt`, CASE WHEN isBlocked =0 THEN "FALSE" ELSE "TRUE" END AS isBlocked FROM `member` where phone=? AND isBlocked = 0'
    conn.query(sql, [phone], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result && result.length) {
            response.end(JSON.stringify(result));
        } else {
            response.json("'User not exists !!!'");
        }
    });
});
/***************************************Update Member Data Profiler****************************** */

app.post('/upDateMemberProfile/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var id = post_data.id;
    var row, name, phone, address, birthday, email, avatar, password;
    var nameres, phoneres, birthres, passres, emailres, addrres, avatres;
    conn.query('SELECT member.id, member.`name`, member.birthday, member.phone, member.email, member.`password`, member.address, member.avatar, member.createdAt, member.updatedAt FROM `member` WHERE member.id = ? ', [id], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        if (result && result.length) {
            for (var i = 0; i < result.length; i++) {
                row = result[i];
                nameres = row.name;
                phoneres = row.phone;
                birthres = row.birthday;
                emailres = row.email;
                passres = row.password;
                addrres = row.address;
                avatres = row.avatar;
                console.log('[Mysql result]', nameres);

                if (!nameres == null || birthres == null || phoneres == null || emailres == null || passres == null || addrres == null || avatres == null) {
                    name = post_data.name;
                    birthday = post_data.birthday
                    phone = post_data.phone;
                    email = post_data.email;
                    password = post_data.password;
                    address = post_data.address;
                    avatar = post_data.avatar;
                } else {
                    name = post_data.nameres;
                    birthday = post_data.birthres;
                    phone = post_data.phoneres;
                    email = post_data.emailres;
                    password = post_data.passres;
                    address = post_data.addrres;
                    avatar = post_data.avatres;
                }
            }
        } else {
            response.json("'User not exists !!!'");
        }
        conn.query('UPDATE `member` SET `name`=?,`birthday`=?,`phone`=?,`email`=?,`password`=?,`address`=?,`avatar`=?,`updatedAt`=NOW()' +
            '  WHERE id=? ', [name, birthday, phone, email, password, address, avatar, id], (err, res, fields) => {
                conn.on('error', function (err) {
                    console.log('[Mysql ERROR]', err);
                });
                if (res && res.length) {
                    console.log('MemberID', id);
                    response.end(JSON.stringify('Done'));
                } else {
                    response.json("'User Error !!!'");
                }
            });

    });
});

/*   **********************************************Update Member Name***************************  */
app.post('/upDateMemberName/', (request, response, next) => {
    var post_data = request.body;
    var id = post_data.id;
    var name = post_data.name;
    conn.query("UPDATE `member` SET `name`=? ,updatedAt=now() where id=?", [name, id], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));
            // console.log('Post Titles: ',rows);       
        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});

/*   **********************************************Update Member Phone**************************************  */
app.post('/upDateMemberphone/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var id = post_data.id;
    var phone = post_data.phone;
    conn.query("UPDATE `member` SET `phone`=?,updatedAt=now() where id=?", [phone, id], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));
        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});

/*   **********************************************Update Member Password**************************************  */
app.post('/upDateMemberpassword/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var id = post_data.id;
    var password = post_data.password;
    conn.query("UPDATE `member` SET `password`=?,updatedAt=now() where id=?", [password, id], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));
        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});
/*   **********************************************Update Member Address**************************************  */
app.post('/upDateMemberaddress/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var id = post_data.id;
    var address = post_data.address;
    conn.query("UPDATE `member` SET `address`=?,updatedAt=now() where id=?", [address, id], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("Done"));
        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});

/*   **********************************************Update Member email **************************************  */
app.post('/upDateMemberemail/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var id = post_data.id;
    var email = post_data.email;
    conn.query("UPDATE `member` SET `email`=? ,updatedAt=now() where id=?", [email, id], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));
        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});

/*   **********************************************Update Member avatar **************************************  */
app.post('/upDateMemberavatar/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var id = post_data.id;
    var avatar = post_data.avatar;
    conn.query("UPDATE `member` SET `avatar`=? ,updatedAt=now()  where id=?", [avatar, id], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));

        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});

/*   **********************************************Count Shipped Order **************************************  */
app.post('/countShipedOrder/', (request, response, next) => {
    var post_data = request.body;
    var id = post_data.id;
    conn.query("SELECT COUNT(*) FROM `order` WHERE `order`.Order_Statuse = 3 AND `order`.Member_ID = ?", [id], function (err, result) {
        //connection.release();
        if (result && result.length) {
            response.end(JSON.stringify(result));
        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});

/*   **********************************************get Menu Item**************************************  */

app.get('/viewmenu/', (request, response, next) => {
    conn.query('SELECT * FROM `menu` ', (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        //console.log(result);
        if (result && result.length) {
            response.end(JSON.stringify(result));
        } else {
            response.json("'Error Getting menu !!!'");
        }
    });

});

/*****************************************************getFoodByMenuID********************************* */

app.post('/viewfoods/', (request, response, next) => {
    var post_data = request.body;
    const Menu_ID = post_data.Menu_ID;
    const member_favourit_id = post_data.member_favourit_id;
    conn.query('SELECT * FROM `food_item` WHERE `Menu_ID` =? ', [Menu_ID],
        (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            if (result && result.length) {
                response.end(JSON.stringify(result));
                for (var x = 0; x < result.length; x++) {
                    var row = result[x];
                }
            } else
                response.end(JSON.stringify("'Wrong Data'"));
        });

});

/***********************************************************getAllFood********************************* */
app.get('/viewallfood/', (request, response, next) => {
    conn.query(' SELECT * FROM `food_item` ', (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        //console.log(result);
        if (result && result.length) {
            response.end(JSON.stringify(result));

        } else {
            response.json("'Error Getting menu !!!'");
        }
    });

});

/********************************************** get Cover FOODITEM ******************************************** */

app.post('/getCoverItemDetails/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 

    const food_id = post_data.food_id;

    var sql = 'SELECT food_item.Food_Item_ID, food_item.Food_Item_Name, food_item.Food_item_Description, food_item.Food_Item_price, food_item.Food_item_Image, food_item.Item_Offer, ratecomment.`comment`, ratecomment.rate, ratecomment.foodItem_Id, ratecomment.createdAt, top_sells.food_id, top_sells.food_quantity FROM food_item LEFT OUTER JOIN ratecomment ON food_item.Food_Item_ID = ratecomment.foodItem_Id LEFT OUTER JOIN top_sells ON food_item.Food_Item_ID = top_sells.food_id WHERE ( top_sells.food_id = ? ) HAVING food_item.Food_Item_ID = ? LIMIT 1' ;

    conn.query(sql, [food_id,food_id], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result && result.length) {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
            }
            
            response.end(JSON.stringify(result));
        }
          else{

              response.end(JSON.stringify("'Wrong Entry Data'"));
                  }

    });


});

/****************************************************getAllFood BY ID********************************* */
app.post('/viewFoodById/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 
    const Menu_ID = post_data.Menu_ID;
    const Food_Item_ID = post_data.Food_Item_ID;
    conn.query('SELECT * FROM `food_item` WHERE `Menu_ID` =? ', [Menu_ID]
        // conn.query('SELECT * FROM member where email=? ',[email]
        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length) {
                conn.query('SELECT * FROM `food_item` WHERE food_item.Menu_ID = ?  ORDER BY food_item.Menu_ID =? DESC ,food_item.Food_Item_ID = ? DESC', [Menu_ID, Menu_ID, Food_Item_ID]
                    // conn.query('SELECT * FROM member where email=? ',[email]
                    , (err, res, fields) => {
                        conn.on('error', function (err) {
                            console.log('[Mysql ERROR]', err);
                        });
                        // response.send(user); 
                        if (res && res.length) {

                            response.end(JSON.stringify(res));
                        } else
                            response.end(JSON.stringify("'Wrong Data'"));
                    });
            } else
                response.end(JSON.stringify("'Wrong Data'"));
        });
});

/* ********************************************Cart Order*********************************************** */

app.post('/addToCart/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 
    const Menu_ID = post_data.Menu_ID;
    conn.query('SELECT * FROM `food_item` WHERE `Menu_ID` =? ', [Menu_ID]
        // conn.query('SELECT * FROM member where email=? ',[email]
        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length) {
                response.end(JSON.stringify(result));
            } else
                response.end(JSON.stringify("'Wrong Data'"));
        });
});

/* ********************************************DeleteFromFavourits*********************************************** */
app.post('/DeleteFromFavourits/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 
    const member_favourit_id = post_data.member_favourit_id;
    const food_item_favourit_id = post_data.food_item_favourit_id;
    conn.query('DELETE FROM `favourite` WHERE `member_favourit_id` =? AND `food_item_favourit_id` =? ', [member_favourit_id, food_item_favourit_id], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });

        if (result) {
            response.end(JSON.stringify("Delete From Favorites"));
        }
    });
});



/* ********************************************viewAllFavourits*********************************************** */

app.post('/ViewFoodItemCount/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 
    const Menu_ID = post_data.Menu_ID;

    var sql='SELECT DISTINCT (SELECT COUNT(*) FROM food_item WHERE Menu_ID = ?) AS FoodCount FROM food_item';

    conn.query( sql, [Menu_ID]

        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length) {
                response.end(JSON.stringify(result));
            } else {
                response.end(JSON.stringify("No Food item Found"));
            }
        });
});

/* ********************************************viewAllFavourits*********************************************** */

app.post('/viewAllFavourits/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 
    const member_favourit_id = post_data.member_favourit_id;
    conn.query(' SELECT member.*,food_item.* FROM favourite INNER JOIN food_item ON favourite.food_item_favourit_id = food_item.Food_Item_ID INNER JOIN member ON favourite.member_favourit_id = member.id  WHERE member_favourit_id = ?', [member_favourit_id]

        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length) {
                response.end(JSON.stringify(result));
            } else {
                response.end(JSON.stringify("No Favourites Found"));
            }
        });
});

/*******************************************ViewFavouretIcon ************************************/
app.post('/viewFavouritsIcon/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 
    const member_favourit_id = post_data.member_favourit_id;
    const Menu_ID = post_data.Menu_ID;
    var FoodID, FavouriteFID, PostFood;
    conn.query('SELECT * FROM `food_item` WHERE `Menu_ID` =? ', [Menu_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        if (result && result.length) {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
            }
            //var FODS=row.Food_Item_ID;
            FoodID = row.Food_Item_ID;
            PostFood = post_data.FoodID;
            console.log('Post Titles: ', PostFood);
            conn.query('SELECT favourite.member_favourit_id, favourite.food_item_favourit_id, favourite.isExist FROM `favourite` WHERE food_item_favourit_id = ? AND member_favourit_id = ?', [PostFood, member_favourit_id], (err, res, fields) => {
                conn.on('error', function (err) {
                    console.log('[Mysql ERROR]', err);
                });
                // response.send(user); 
                for (var i = 0; i < res.length; i++) {
                    var row = res[i];
                    FavouriteFID = row.food_item_favourit_id
                }
                if (res) {
                    if (PostFood == FavouriteFID && FavouriteFID != 0) {
                        response.end(JSON.stringify("isExist"));
                    } else {
                        response.end(JSON.stringify("notExist"));
                    }
                    //   console.log('Fav', FavouriteFID, '&& Food', PostFood);
                } else {
                    response.end(JSON.stringify("Error Exist"));
                }
            });

        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });

});

/* ******************************************** favourites Function *********************************************** */

app.post('/FavouritsFunction/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 
    var member_favourit_id = post_data.member_favourit_id;
    var food_item_favourit_id = post_data.food_item_favourit_id;
    conn.query(' SELECT favourite.member_favourit_id,favourite.food_item_favourit_id,favourite.isExist FROM `favourite`  WHERE  favourite.member_favourit_id = ? AND favourite.food_item_favourit_id = ? ', [member_favourit_id, food_item_favourit_id], function (err, result, fields) {
        conn.on('error', function (err) {
            //console.log('[Mysql ERROR]',err);
        });
        if (result && result.length) {
            conn.query('DELETE FROM `favourite` WHERE `member_favourit_id` =? AND `food_item_favourit_id` =? ', [member_favourit_id, food_item_favourit_id],
                function (error, res, fields) {
                    conn.on('error', function (err) {
                        //console.log('[MySQL Error]',err);
                        response.json('Added Favorites  error : ', err);
                    });
                    if (res)
                        response.json('Delete From Favorites');
                });
        } else {
            conn.query(' INSERT INTO `favourite`(`member_favourit_id`, `food_item_favourit_id`,`isExist`) VALUES (?,?,1)', [member_favourit_id, food_item_favourit_id],
                function (error, res, fields) {
                    conn.on('error', function (err) {
                        //console.log('[MySQL Error]',err);
                        response.json('Added Favorites  error : ', err);
                    });
                    if (res)
                        response.json(' Successful Add To Favorites');
                });
        }

    });
});
/************************************  Insert Rate Comment ****************************************** */
app.post('/RateCommentFunction/', (request, response, next) => {
    var post_data = request.body;
    var rate = post_data.rate;
    var comment = post_data.comment;
    var foodItem_Id = post_data.foodItem_Id;
    var member_Id = post_data.member_Id;
    var member_name = post_data.member_name;
    conn.query(' INSERT INTO `ratecomment`(`comment`, `rate`,  `member_Id`,`member_name`, `foodItem_Id`,`createdAt`) VALUES (?,?,?,?,?,NOW()) ', [comment, rate, member_Id, member_name, foodItem_Id], function (err, result, fields) {
        conn.on('error', function (err) {
            //console.log('[Mysql ERROR]',err);
        });
        response.end(JSON.stringify("'Adding Comment And Rate Successful'"));
    });
});

/************************************  Call All Comment ****************************************** */
app.post('/getallCommentRate/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 
    var IDS = 'ratecomment.foodItem_Id';
    var foodIDS = post_data.IDS;
    conn.query('SELECT member.`name`,ratecomment.`comment`,ratecomment.rate,ratecomment.member_Id,ratecomment.member_name,ratecomment.foodItem_Id,ratecomment.createdAt FROM `ratecomment` INNER JOIN member ON ratecomment.member_Id = member.id where ratecomment.foodItem_Id =?', [foodIDS]
        // conn.query('SELECT * FROM member where email=? ',[email]
        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // console.log(foodIDS);
            // response.send(user); 
            if (result && result != null) {
                //console.log(JSON.stringify(result));
                response.end(JSON.stringify(result));
            } else
                response.end(JSON.stringify("'There is No Data For this Food'"));
        });

});
/* *************************************************getRatesOnly*********************************** */
app.post('/getRatesOnly/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 
    var IDS = 'ratecomment.foodItem_Id';
    var foodIDS = post_data.IDS;

    conn.query('SELECT member.`name`,ratecomment.`comment`,ratecomment.rate,ratecomment.member_Id,ratecomment.foodItem_Id,ratecomment.createdAt FROM `ratecomment` INNER JOIN member ON ratecomment.member_Id = member.id where ratecomment.foodItem_Id =?', [foodIDS]
        // conn.query('SELECT * FROM member where email=? ',[email]
        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            console.log(foodIDS);
            // response.send(user); 
            if (result && result != null) {
                // console.log(JSON.stringify(result));
                response.end(JSON.stringify(result));
            } else
                response.end(JSON.stringify("'There is No Data For this Food'"));
        });

});
/************************************************get Count Rate comment ************************************* *****/
app.post('/getCountRate/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 

    var IDS = 'ratecomment.member_Id';
    var MemberIDS = post_data.IDS;
    conn.query('SELECT COUNT(*) FROM `ratecomment` WHERE ratecomment.member_Id =?', [MemberIDS]
        // conn.query('SELECT * FROM member where email=? ',[email]
        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // console.log(MemberIDS);
            // response.send(user); 
            if (result && result != null) {
                //console.log(JSON.stringify(result));
                response.end(JSON.stringify(result));
            } else
                response.end(JSON.stringify("'Please Comment Our Food '"));
        });

});

/************************************************GetOfferFood************************************* *****/

app.get('/viewAllOfferFood/', (request, response, next) => {
    conn.query(' SELECT * FROM `food_item` WHERE food_item.Item_Offer IS NOT NULL '

        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });

            if (result && result.length) {
                response.end(JSON.stringify(result));
            } else {
                response.json("'Error Getting Offer !!!'");
            }
        });

});

/*******************************************viewFoodCovers******************************************* */

app.get('/viewFoodCovers/', (request, response, next) => {
    conn.query('SELECT food_cover.cover_id, food_item.Food_Item_Name, food_item.Food_item_Image FROM `food_cover` INNER JOIN food_item ON food_cover.cover_id = food_item.Food_Item_ID '

        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            //console.log(result);
            if (result && result.length) {
                response.end(JSON.stringify(result));
            } else {
                response.json("'Error Getting Cover !!!'");
            }
        });

});

/************************************************** Post Order*************************************** */

app.post('/postorderToserver/', (request, response, next) => {
    var post_data = request.body;
    var Order_Details = post_data.Order_Details;
    var Order_Address = post_data.Order_Address
    var Order_Comment = post_data.Order_Comment;
    var Order_Price = post_data.Order_Price;
    var Payment_Method = post_data.Payment_Method;
    var Member_ID = post_data.Member_ID;
    var Member_Phone = post_data.Member_Phone;
    var Member_Name = post_data.Member_Name;

     var te = 'INSERT INTO `order`( `Member_ID`, `Member_Phone`, `Member_Name`, `Order_Details`, `Order_Comment`, `Order_Address`, `Payment_Method`, `Order_Price`, `Order_Statuse`, `Order_Date`) VALUES (?,?,?,?,?,?,?,?,0,NOW())'

    // var Insql='INSERT INTO `order`(`Member_Phone` , `Order_Details`, `Order_Comment`, `Order_Address`, `Payment_Method`, `Order_Price`,`Order_Statuse`,  `Member_ID`, `Order_Date`) VALUES (?,?,?,?,?,?,0,?,NOW())';
    conn.query(te, [Member_ID, Member_Phone, Member_Name, Order_Details, Order_Comment, Order_Address, Payment_Method, Order_Price]

        ,
        function (err, result, fields) {
            conn.on('error', function (err) {
                //console.log('[Mysql ERROR]',err);
            });
            if (result) {
                conn.query('SELECT * FROM `order` WHERE `Member_Phone`= ? ORDER BY Order_Id DESC LIMIT 1', [Member_Phone]

                    , (err, res, fields) => {
                        conn.on('error', function (err) {
                            console.log('[Mysql ERROR]', err);
                        });

                        for (var i = 0; i < res.length; i++) {
                            var row = res[i];

                            if (res && res.length > 0) {
                                //    console.log(JSON.stringify(row));
                                response.end(JSON.stringify(row));
                            } else
                                response.end(JSON.stringify("'Error'"));
                        }

                    });
            }

        });


});


/**********************************************Update Token********************************************** */

app.post('/updatetoken/', (request, response, next) => {
    var post_data = request.body;

    var Phone = post_data.Phone;
    var Token = post_data.Token;
    var IsServerToken = post_data.IsServerToken;

    var sql = 'INSERT INTO `token`(`Phone`, `Token`, `IsServerToken`)  VALUES (?,?,?) ON DUPLICATE KEY UPDATE Token=? , IsServerToken=?  ';

    conn.query(sql, [Phone, Token, IsServerToken, Token, IsServerToken],
        function (err, result, fields) {
            conn.on('error', function (err) {
                // console.log('[Mysql ERROR]',err);
                response.end(JSON.stringify(err));
            });
            if (result) {

                conn.query('SELECT * FROM `token` WHERE `Phone` = ?', [Phone]

                    // conn.query('SELECT * FROM member where email=? ',[email]
                    , (err, result, fields) => {
                        conn.on('error', function (err) {
                            console.log('[Mysql ERROR]', err);
                        });

                        if (result && result.length > 0) {
                            // console.log(JSON.stringify(result));
                            response.end(JSON.stringify(result));
                        } else
                            response.end(JSON.stringify("'Error'"));

                    });

            }

        });


});

/* ************************************************* get Token *************************************** */


app.post('/gettoken/', (request, response, next) => {
    var post_data = request.body;
    var Phone = post_data.Phone;

    var IsServerToken = post_data.IsServerToken;

    conn.query(' SELECT * FROM `token` WHERE Phone=? AND IsServerToken=? ', [Phone, IsServerToken]

        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });

            //console.log(result);
            if (result && result.length) {

                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                }
                console.log(JSON.stringify(row));
                response.end(JSON.stringify(row));

            } else {

                response.json("'Error Getting Token !!!'");
            }
        });

});

/* ************************************************* get all Token *************************************** */


app.post('/getalltoken/', (request, response, next) => {
    var post_data = request.body;
    var IsServerToken = post_data.IsServerToken;

    conn.query(' SELECT * FROM `token` WHERE  IsServerToken=? ', [IsServerToken]

        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            //console.log(result);
            if (result && result.length) {

                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    console.log("Token", row);
                }
                response.end(JSON.stringify(result));

            } else {

                response.json("'Error Getting Offer !!!'");
            }
        });

});


/**********************************************get Order +Driver By Status ********************************************** */

app.post('/getOrderDriverDetail/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 

    var Member_Phone = post_data.Member_Phone;
    var Order_Statuse = post_data.Order_Statuse;

var sql='SELECT `order`.Order_Id, `order`.Member_ID, `order`.Member_Phone,'
+' `order`.Member_Name, `order`.Order_Details, `order`.Order_Comment, '
+' `order`.Order_Address, `order`.Payment_Method, `order`.Order_Price,'
+' `order`.Order_Statuse, `order`.Order_Date, `order`.delivery,'
+' delivery_boy.delivery_Boy_ID, delivery_boy.delivery_Boy_name,'
+' delivery_boy.delivery_Boy_phones, delivery_boy.delivery_Boy_pass,'
+' delivery_boy.delivery_Boy_image, delivery_boy.delivery_Boy_national_id,'
+' delivery_boy.delivery_lat, delivery_boy.delivery_lng, delivery_boy.admin_ID,'
+' delivery_boy.isOnline FROM `order` LEFT OUTER JOIN delivery_boy ON '
+' `order`.delivery = delivery_boy.delivery_Boy_ID WHERE `order`.Member_Phone = ? '
+' AND `order`.Order_Statuse = ? ORDER BY Order_Id DESC LIMIT 5'
    conn.query(sql, [Member_Phone,Order_Statuse ]
        , (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result && result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];

                // console.log(JSON.stringify(row));
                response.end(JSON.stringify(result));
            }
        } else {
            response.end(JSON.stringify("'No Orders Yet!!! '"));
        }

    });


});

/**********************************************get current Order By Status && Order ID ********************************************** */

app.post('/getCurrentStatusByStatusandOrderID/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 

    var Order_Id = post_data.Order_Id;
    var Member_Phone = post_data.Member_Phone;
    var delivery = post_data.delivery;

var sql='SELECT `order`.Order_Statuse FROM `order` WHERE `order`.Order_Id = ? AND `order`.Member_Phone = ? AND `order`.delivery = ?'
    conn.query(sql,
     [Order_Id, Member_Phone,delivery ], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result && result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];

                // console.log(JSON.stringify(row));
                response.end(JSON.stringify(result));
            }
        } else {
            response.end(JSON.stringify("'No Orders Yet!!! '"));
        }

    });


});




/**********************************************get Order By Status ********************************************** */

app.post('/getorder/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 

    var Member_Phone = post_data.Member_Phone;
    var Order_Statuse = post_data.Order_Statuse;


    conn.query('SELECT * FROM `order` WHERE `Order_Statuse` =? AND `Member_Phone` =? ORDER BY Order_Id DESC LIMIT 5',
     [Order_Statuse, Member_Phone ], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result && result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];

                // console.log(JSON.stringify(row));
                response.end(JSON.stringify(result));
            }
        } else {
            response.end(JSON.stringify("'No Orders Yet!!! '"));
        }

    });


});


/**********************************************get Order By Status + posted ********************************************** */

app.post('/getAllPostredorder/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 

    var Member_Phone = post_data.Member_Phone;
    var Order_Statuse = post_data.Order_Statuse;


    conn.query('SELECT `order`.Order_Details FROM `order` WHERE `order`.Order_Statuse = ?    ', [Order_Statuse  ], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
    
 
        if (result && result.length > 0) {

          //  response.end(JSON.stringify(result));

          for (var i = 0; i < result.length; i++) {
            var row =  result[i];
        }
        var data=JSON.stringify(result)
        response.send(data)
      

          
 
 

 
            
            


        } else {
            response.end(JSON.stringify("'No Orders Yet!!! '"));
        }

    });


});


/********************************************** Cancel Order******************************************** */

app.post('/cancelorder/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 

    var Member_Phone = post_data.Member_Phone;
    var Member_ID = post_data.Member_ID;
    var Order_Id = post_data.Order_Id;

    conn.query('UPDATE `order` SET `Order_Statuse` = -1 WHERE `Order_Id`=? AND `Member_Phone`=? AND `Member_ID`=? ', [Order_Id, Member_Phone, Member_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result) {
            response.end(JSON.stringify("Order Has Been Cancelled"));
        } else {
            response.end(JSON.stringify("'Error while write to database'"));
        }

    });


});


/*--------------------------------- login----------------------------------------------*/

app.post('/loginAdmin/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    const admin_Phone = post_data.admin_Phone;
    const admin_Password = post_data.admin_Password;

    conn.query('SELECT * FROM `admin` where `admin_Phone`=? AND `admin_Password`=?  ', [admin_Phone, admin_Password], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result && result.length) {
            response.end(JSON.stringify(result));
        } else {
            response.json("'Wrong Input !!!'");
        }
    });


});
/*********************************************GET Member Data***************************** */
app.use('/getAdminInformation/', (request, response, next) => {
    var post_data = request.body;
    const admin_ID = post_data.admin_ID;

    conn.query('SELECT * FROM `admin` where `admin_ID`=? ', [admin_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result && result.length) {
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                response.end(JSON.stringify(row));
            }

            // response.end(JSON.stringify(result));
        } else {
            response.json("'User not exists !!!'");
        }
    });
});
/********************************************Update AdminToken************************* */

app.post('/updateAdmintoken/', (request, response, next) => {
    var post_data = request.body;

    var Phone = post_data.Phone;
    var Token = post_data.Token;
    var IsServerToken = post_data.IsServerToken;

    conn.query('INSERT INTO `token`(`Phone`, `Token`, `IsServerToken`)  VALUES (?,?,?) ON DUPLICATE KEY UPDATE Token=? , IsServerToken=?  ', [Phone, Token, IsServerToken, Token, IsServerToken]

        ,
        function (err, result, fields) {
            conn.on('error', function (err) {
                // console.log('[Mysql ERROR]',err);
                response.end(JSON.stringify(err));
            });
            if (result) {

                conn.query('SELECT * FROM `token` WHERE `Phone` = ?', [Phone]

                    // conn.query('SELECT * FROM member where email=? ',[email]
                    , (err, result, fields) => {
                        conn.on('error', function (err) {
                            console.log('[Mysql ERROR]', err);
                        });

                        if (result && result.length > 0) {
                            // console.log(JSON.stringify(result));
                            response.end(JSON.stringify(result));
                        } else
                            response.end(JSON.stringify("'Error'"));

                    });

            }

        });


});
/****************************************get Member DATA ****************/

app.post('/viewMembers/', (request, response, next) => {
    var post_data = request.body;
    const admin_ID = post_data.admin_ID;

    var sql = 'SELECT admin.admin_ID, member.id, member.`name`, member.birthday, member.phone, member.email, member.`password`, member.address, member.avatar, member.createdAt, member.updatedAt ,   CASE WHEN member.isBlocked =0 THEN "FALSE" ELSE "TRUE" END AS isBlocked  FROM `admin` , member HAVING admin.admin_ID = ?';
    conn.query(sql, [admin_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result && result.length) {

            response.end(JSON.stringify(result));
        } else {
            response.json("'Wrong Input !!!'");
        }
    });


});
/***************************************Get All Menu Item************************************** */
app.post('/viewMenus/', (request, response, next) => {
    var post_data = request.body;
    const admin_ID = post_data.admin_ID;

    var sql = 'SELECT menu.Menu_ID, menu.Menu_Name, menu.Menu_Image, admin.admin_ID FROM `admin` , menu WHERE admin.admin_ID = ?';
    conn.query(sql, [admin_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result && result.length) {
            response.end(JSON.stringify(result));
        } else {
            response.json("'Wrong Input !!!'");
        }
    });


});
/**************************************View Food By ID*************************************** */
app.post('/viewfoods/', (request, response, next) => {
    var post_data = request.body;
    const Menu_ID = post_data.Menu_ID;
    const member_favourit_id = post_data.member_favourit_id;
    conn.query('SELECT * FROM `food_item` WHERE `Menu_ID` =? ', [Menu_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        if (result && result.length) {
            response.end(JSON.stringify(result));
            for (var x = 0; x < result.length; x++) {
                var row = result[x];
            }
        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });

});
/**************************************View All Comment,Rate*************************************** */

app.post('/getallCommentRatebyitem/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 
    var IDS = 'ratecomment.foodItem_Id';
    var foodIDS = post_data.IDS;
    conn.query('SELECT member.`name`, ratecomment.`commentID`, ratecomment.`comment`,ratecomment.rate,ratecomment.member_Id,ratecomment.member_name,ratecomment.foodItem_Id,ratecomment.createdAt FROM `ratecomment` INNER JOIN `member` ON ratecomment.member_Id = member.id where ratecomment.foodItem_Id =?', [foodIDS]
        // conn.query('SELECT * FROM member where email=? ',[email]
        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // console.log(foodIDS);
            // response.send(user); 
            if (result && result != null) {
                //console.log(JSON.stringify(result));
                response.end(JSON.stringify(result));
            } else
                response.end(JSON.stringify("'There is No Data For this Food'"));
        });

});

/**************************************Block USER*************************************** */
app.post('/blockMemberById/', (request, response, next) => {
    var post_data = request.body;
    const isBlocked = post_data.isBlocked;
    const id = post_data.id;
    const phone = post_data.phone;

     var sql='UPDATE `member` SET `isBlocked`= ? WHERE `id` =? AND `phone`= ?' 
      
    conn.query(sql, [isBlocked,id,phone], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        if (!err) {
            response.end(JSON.stringify("Member status Updated"));

        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });

});

/**************************************View Food By ID*************************************** */
app.post('/getFoodByIDS/', (request, response, next) => {
    var post_data = request.body;
    const Menu_ID = post_data.Menu_ID;
    const Food_Item_ID = post_data.Food_Item_ID;

     var sql='SELECT food_item.Menu_ID, food_item.Food_Item_ID, food_item.Food_Item_Name, food_item.Food_item_Description, food_item.Food_Item_price, food_item.Food_item_Image, food_item.Item_Offer FROM food_item WHERE food_item.Food_Item_ID = ? AND food_item.Menu_ID = ?'
    conn.query(sql, [Food_Item_ID,Menu_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        if (result && result.length) {
            response.end(JSON.stringify(result));

        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });

});

/*****************************************GET ALL COMMENT RATE************************* */

app.post('/viewallCommentRate/', (request, response, next) => {
    var post_data = request.body;
    const admin_ID = post_data.admin_ID;

    var sql = 'SELECT admin.admin_ID, ratecomment.commentID, ratecomment.`comment`, ratecomment.rate, ratecomment.member_Id, ratecomment.member_name, ratecomment.foodItem_Id, ratecomment.createdAt FROM ratecomment , admin WHERE admin.admin_ID = ? ORDER BY ratecomment.createdAt DESC';
    conn.query(sql, [admin_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result && result.length) {
            
            response.end(JSON.stringify(result));
        } else {

            response.json("'Wrong Input !!!'");
        }
    });


});

/**************************************GET ALL FOOD *************************************** */
app.post('/viewallFoodItem/', (request, response, next) => {
    var post_data = request.body;
    const admin_ID = post_data.admin_ID;

    var sql = 'SELECT admin.admin_ID, food_item.Menu_ID, food_item.Food_Item_ID, food_item.Food_Item_Name, food_item.Food_item_Description, food_item.Food_Item_price, food_item.Food_item_Image, food_item.Item_Offer FROM `admin` , `food_item` WHERE admin.admin_ID = ?';
    conn.query(sql, [admin_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result && result.length) {
            response.end(JSON.stringify(result));
        } else {
            response.json("'Wrong Input !!!'");
        }
    });


});

/********************************VIEW FOOD ITEM BY ID******************************* */
/*
app.post('/viewFoodById/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 
    const Menu_ID = post_data.Menu_ID;
    const Food_Item_ID = post_data.Food_Item_ID;
    conn.query('SELECT * FROM `food_item` WHERE `Menu_ID` =? ', [Menu_ID]
        // conn.query('SELECT * FROM member where email=? ',[email]
        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length) {
                conn.query('SELECT * FROM `food_item` WHERE food_item.Menu_ID = ?  ORDER BY food_item.Menu_ID =? DESC ,food_item.Food_Item_ID = ? DESC', [Menu_ID, Menu_ID, Food_Item_ID]
                    // conn.query('SELECT * FROM member where email=? ',[email]
                    , (err, res, fields) => {
                        conn.on('error', function (err) {
                            console.log('[Mysql ERROR]', err);
                        });
                        // response.send(user); 
                        if (res && res.length) {
                            response.end(JSON.stringify(res));
                        } else
                            response.end(JSON.stringify("'Wrong Data'"));
                    });
            } else
                response.end(JSON.stringify("'Wrong Data'"));
        });
});
*/

/**********************************GET ALL ORDERS********************************** */
app.post('/getAllOrder/', (request, response, next) => {
    var post_data = request.body;
    var admin_ID = post_data.admin_ID;
    var Order_Statuse = post_data.Order_Statuse;
    //  var O='SELECT delivery_boy.delivery_Boy_ID, delivery_boy.delivery_Boy_name, delivery_boy.delivery_Boy_phones, delivery_boy.delivery_Boy_image, delivery_boy.delivery_Boy_national_id, delivery_boy.delivery_Boy_location, `order`.Order_Id, `order`.Member_Phone, `order`.Order_Details, `order`.Order_Comment, `order`.Order_Address, `order`.Payment_Method, `order`.Order_Price, `order`.Order_Statuse, `order`.Member_ID, `order`.Order_Date, `order`.delivery FROM `order` INNER JOIN delivery_boy ON `order`.delivery = delivery_boy.delivery_Boy_ID WHERE admin.admin_ID = ? AND `order`.Order_Statuse = ? '
    var sql = 'SELECT admin.admin_ID, `order`.Order_Id, `order`.Member_ID, `order`.Member_Phone, `order`.Member_Name, `order`.Order_Details, `order`.Order_Comment, `order`.Order_Address, `order`.Payment_Method, `order`.Order_Price, `order`.Order_Statuse, `order`.Order_Date, `order`.delivery FROM `admin` , `order` WHERE admin.admin_ID = ? AND `order`.Order_Statuse = ?'
    conn.query(sql,
        [admin_ID, Order_Statuse],
        (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];

                    // console.log(JSON.stringify(row));
                    response.end(JSON.stringify(result));
                }
            } else {
                response.end(JSON.stringify("'No Orders Yet!!! '"));
            }

        });


});
/*   **********************************************Update Menu Name***************************  */
app.post('/upDateMenuName/', (request, response, next) => {
    var post_data = request.body;
    var Menu_ID = post_data.Menu_ID;
    var Menu_Name = post_data.Menu_Name;
    conn.query("UPDATE `menu` SET `Menu_Name`=? where Menu_ID =?", [Menu_Name, Menu_ID], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));
            // console.log('Post Titles: ',rows);       
        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});
/*   **********************************************Update Menu Image **************************************  */
app.post('/upDateMenuImage/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var Menu_ID = post_data.Menu_ID;
    var Menu_Image = post_data.Menu_Image;
    conn.query("UPDATE `menu` SET `Menu_Image`=? where Menu_ID=?", [Menu_Image, Menu_ID], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));

        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});

/*   **********************************************DELETE MENU ITEM **************************************  */
app.post('/deleteMenutem/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var Menu_ID = post_data.Menu_ID;
    var sqlSEL = 'SELECT menu.Menu_ID, menu.Menu_Name, menu.Menu_Image FROM `menu` WHERE menu.Menu_ID = ?';
    var sql = 'DELETE FROM `menu` WHERE Menu_ID = ?';
    // var sql='DELETE FROM food_item WHERE food_item.Food_Item_ID = ? AND food_item.Menu_ID = ? AND food_item.Food_mange = ?';
    conn.query(sqlSEL, [Menu_ID], function (err, result) {
        //conn.query(sqlSEL, [Food_Item_ID, Menu_ID,Food_mange], function (err, result) {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        //connection.release();
        if (result && result.length) {
            //response.end(JSON.stringify(result));
            conn.query(sql, [Menu_ID],
                (err, result, fields) => {
                    conn.on('error', function (err) {
                        console.log('[Mysql ERROR]', err);
                    });
                    if (result && result.length) {
                        response.end(JSON.stringify("ERROR DELETE"));

                    } else
                        response.end(JSON.stringify("Item DELETED"));
                });

        } else {

            response.end(JSON.stringify("Item Not Found"));
        }
    });
});


/*   **********************************************Update Food Name***************************  */
app.post('/upDateFoodName/', (request, response, next) => {
    var post_data = request.body;
    var Food_Item_ID = post_data.Food_Item_ID;
    var Food_Item_Name = post_data.Food_Item_Name;
    var Menu_ID = post_data.Menu_ID;
    conn.query("UPDATE `food_item` SET `Food_Item_Name`=? where Menu_ID=? AND Food_Item_ID =?   ", [Food_Item_Name, Menu_ID, Food_Item_ID], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));
            // console.log('Post Titles: ',rows);       
        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});
/*   **********************************************Update Food Image **************************************  */
app.post('/upDateFoodImage/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var Menu_ID = post_data.Menu_ID;
    var Food_Item_ID = post_data.Food_Item_ID;
    var Food_item_Image = post_data.Food_item_Image;
    var sql='UPDATE `food_item` SET `Food_item_Image`=? where  Menu_ID=? AND Food_Item_ID=?'
    conn.query(sql, [Food_item_Image, Menu_ID, Food_Item_ID], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));

        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});

/*   **********************************************Update Food Price **************************************  */
app.post('/upDateFoodPrice/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var Menu_ID = post_data.Menu_ID;
    var Food_Item_ID = post_data.Food_Item_ID;
    var Food_Item_price = post_data.Food_Item_price;
    conn.query("UPDATE `food_item` SET `Food_Item_price`=? where  Menu_ID=? AND Food_Item_ID=?  ", [Food_Item_price, Menu_ID, Food_Item_ID], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));

        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});

/*   **********************************************Update Food Offer **************************************  */
app.post('/upDateFoodOffer/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var Menu_ID = post_data.Menu_ID;
    var Food_Item_ID = post_data.Food_Item_ID;
    var Item_Offer = post_data.Item_Offer;
    conn.query("UPDATE `food_item` SET `Item_Offer`=? where  Menu_ID=? AND Food_Item_ID=?  ", [Item_Offer, Menu_ID, Food_Item_ID], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));

        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});
/*   **********************************************Update Food Description **************************************  */
app.post('/upDateFoodDescription/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var Menu_ID = post_data.Menu_ID;
    var Food_Item_ID = post_data.Food_Item_ID;
    var Food_item_Description = post_data.Food_item_Description;
    conn.query("UPDATE `food_item` SET `Food_item_Description`=? where  Menu_ID=? AND Food_Item_ID=?  ",
        [Food_item_Description, Menu_ID, Food_Item_ID],
        function (err, rows) {
            //connection.release();
            if (!err) {
                response.end(JSON.stringify("'Done'"));

            } else
                response.end(JSON.stringify("'Wrong Data'"));
        });
});
/*   **********************************************DELETE Food Item **************************************  */
app.post('/deleteFoodItem/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var Menu_ID = post_data.Menu_ID;
    var Food_Item_ID = post_data.Food_Item_ID;
    var sqlSEL = 'SELECT food_item.Menu_ID, food_item.Food_Item_ID, food_item.Food_Item_Name, food_item.Food_item_Description, food_item.Food_Item_price, food_item.Food_item_Image, food_item.Item_Offer FROM `food_item` WHERE Menu_ID = ? AND Food_Item_ID = ?';
    var sql = 'DELETE FROM `food_item` WHERE Food_Item_ID = ?';
    // var sql='DELETE FROM food_item WHERE food_item.Food_Item_ID = ? AND food_item.Menu_ID = ? AND food_item.Food_mange = ?';
    conn.query(sqlSEL, [Menu_ID, Food_Item_ID], function (err, result) {
        //conn.query(sqlSEL, [Food_Item_ID, Menu_ID,Food_mange], function (err, result) {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        //connection.release();
        if (result && result.length) {
            //response.end(JSON.stringify(result));
            conn.query(sql, [Food_Item_ID],
                (err, result, fields) => {
                    conn.on('error', function (err) {
                        console.log('[Mysql ERROR]', err);
                    });
                    if (result && result.length) {
                        response.end(JSON.stringify("ERROR DELETE"));

                    } else
                        response.end(JSON.stringify("Item DELETED"));
                });

        } else {

            response.end(JSON.stringify("Item Not Found"));
        }
    });
});

/*   **********************************************INSERT MENU ITEM  **************************************  */
app.post('/insertNewMenuItem/', (request, response, next) => {
    var post_data = request.body; //Get POST params from Body key
    var Menu_Name = post_data.Menu_Name;
    var Menu_Image = post_data.Menu_Image;

    var SELsql = 'SELECT * FROM `menu` where Menu_Name = ?';
    var sql = 'INSERT INTO `menu`( `Menu_Name`, `Menu_Image`) VALUES (?,?)'
    conn.query(SELsql, [Menu_Name], function (err, result, fields) {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        if (result && result.length)
            response.json('Menu already exists !!!');
        else {
            conn.query(sql, [Menu_Name, Menu_Image],
                function (err, result, fields) {
                    conn.on('error', function (err) {
                        console.log('[MySQL Error]', err);
                        response.json('Register error : ', err);
                    });
                    response.json('New Menu Successful Added');
                });
        }
    });

});

/*   **********************************************INSERT Food ITEM  **************************************  */
app.post('/insertNewFoodItem/', (request, response, next) => {
    var post_data = request.body; //Get POST params from Body key
    var Menu_ID = post_data.Menu_ID;
    var Food_Item_Name = post_data.Food_Item_Name;
    var Food_item_Description = post_data.Food_item_Description;
    var Food_Item_price = post_data.Food_Item_price;
    var Food_item_Image = post_data.Food_item_Image;
    var Item_Offer = post_data.Item_Offer;

    var SELsql = 'SELECT * FROM `food_item` where Menu_ID = ? AND Food_Item_Name = ?';
    var sql = 'INSERT INTO `food_item`(`Menu_ID`,  `Food_Item_Name`, `Food_item_Description`, `Food_Item_price`, `Food_item_Image`, `Item_Offer`) VALUES (?,?,?,?,?,?) ';
    conn.query(SELsql, [Menu_ID, Food_Item_Name], function (err, result, fields) {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        if (result && result.length)
            response.json('Item already exists !!!');
        else {
            conn.query(sql, [Menu_ID, Food_Item_Name, Food_item_Description, Food_Item_price, Food_item_Image, Item_Offer],
                function (err, result, fields) {
                    conn.on('error', function (err) {
                        console.log('[MySQL Error]', err);
                        response.json('Register error : ', err);
                    });
                    
                    response.json('New Food Item Successful Added');
                });
        }
    });

});

/*   **********************************************Create delivery-boy Account  **************************************  */
app.post('/createDeliveryboyAccount/', (request, response, next) => {
    var post_data = request.body; //Get POST params from Body key
    var delivery_Boy_phones = post_data.delivery_Boy_phones;
    var delivery_Boy_name = post_data.delivery_Boy_name;
    var delivery_Boy_pass = post_data.delivery_Boy_pass;
    var delivery_Boy_image = post_data.delivery_Boy_image;
    var delivery_Boy_national_id = post_data.delivery_Boy_national_id;
    var admin_ID = post_data.admin_ID;


    var SELsql = 'SELECT * FROM `delivery_boy` where delivery_Boy_phones = ?';

    var sql = 'INSERT INTO `delivery_boy`( `delivery_Boy_name`, `delivery_Boy_phones`, `delivery_Boy_pass`, `delivery_Boy_image`, `delivery_Boy_national_id`, `admin_ID`,`isOnline`) VALUES (?,?,?,?,?,?,"0")';
    conn.query(SELsql, [delivery_Boy_phones], function (err, result, fields) {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        if (result && result.length)
            response.json('Account already exists !!!');
        else {
            conn.query(sql, [delivery_Boy_name, delivery_Boy_phones, delivery_Boy_pass, delivery_Boy_image, delivery_Boy_national_id, admin_ID],
                function (err, result, fields) {
                    conn.on('error', function (err) {
                        console.log('[MySQL Error]', err);
                        response.json('Create error : ', err);
                    });
                    if (!err) {
                        response.json('Delivery-Boy account Successful Added');
                        console.log('ERROR', err);
                    } else
                        response.json('Error To Create New Account');
                });
        }
    });

});

/*   **********************************************Update Food Offer **************************************  */
app.post('/upAdminImage/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var admin_ID = post_data.admin_ID;
    var admin_Img = post_data.admin_Img;

    var sql = 'UPDATE `admin` SET `admin_Img`=? where  admin_ID=? ';
    conn.query(sql, [admin_Img, admin_ID], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));

        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});

/*   **********************************************Update manger Name **************************************  */
app.post('/upAdminName/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var admin_ID = post_data.admin_ID;
    var admin_name = post_data.admin_name;

    var sql = 'UPDATE `admin` SET `admin_name`=? where  admin_ID=? ';
    conn.query(sql, [admin_name, admin_ID], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));

        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});

/*   **********************************************Update manger phone **************************************  */
app.post('/upAdminPhone/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var admin_ID = post_data.admin_ID;
    var admin_Phone = post_data.admin_Phone;

    var sql = 'UPDATE `admin` SET `admin_Phone`=? where  admin_ID=? ';
    conn.query(sql, [admin_Phone, admin_ID], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));

        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});
/*   **********************************************Update manger Pass **************************************  */
app.post('/upAdminPass/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var admin_ID = post_data.admin_ID;
    var admin_Password = post_data.admin_Password;

    var sql = 'UPDATE `admin` SET `admin_Password`=? where  admin_ID=? ';
    conn.query(sql, [admin_Password, admin_ID], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));

        } else
            response.end(JSON.stringify("'Wrong Data'"));
    });
});

/*   **********************************************DELETE drivder account **************************************  */
app.post('/deletedriveraccount/', (request, response, next) => {
    var post_data = request.body;
    var delivery_Boy_phones = post_data.delivery_Boy_phones;

    var sqlSEL = 'SELECT * FROM `delivery_boy` WHERE `delivery_Boy_phones`=?';
    var sql = 'DELETE FROM `delivery_boy` WHERE `delivery_Boy_phones`=?';
    // var sql='DELETE FROM food_item WHERE food_item.Food_Item_ID = ? AND food_item.Menu_ID = ? AND food_item.Food_mange = ?';
    conn.query(sqlSEL, [delivery_Boy_phones], function (err, result) {
        //conn.query(sqlSEL, [Food_Item_ID, Menu_ID,Food_mange], function (err, result) {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        //connection.release();
        if (result && result.length) {
            //response.end(JSON.stringify(result));
            conn.query(sql, [delivery_Boy_phones],
                (err, result, fields) => {
                    conn.on('error', function (err) {
                        console.log('[Mysql ERROR]', err);
                    });
                    if (result && result.length) {
                        response.end(JSON.stringify("ERROR DELETE"));

                    } else
                        response.end(JSON.stringify("Item DELETED"));
                });

        } else {

            response.end(JSON.stringify("Item Not Found"));
        }
    });
});

/**********************************GET ALL Drivers********************************** */
app.post('/getAllDrivers/', (request, response, next) => {
    var post_data = request.body;
    var admin_ID = post_data.admin_ID;
    var Order_Statuse = post_data.Order_Statuse;

   // var sql = 'SELECT * FROM `delivery_boy` WHERE `admin_ID`=?'
    var sql = 'SELECT delivery_Boy_ID, delivery_Boy_name, delivery_Boy_phones, delivery_Boy_pass, delivery_Boy_image, delivery_Boy_national_id, delivery_lat, delivery_lng, CASE WHEN delivery_boy.isOnline =0 THEN "FALSE" ELSE "TRUE" END AS isOnline FROM delivery_boy WHERE `admin_ID`=?'
    conn.query(sql,
        [admin_ID],
        (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];

                    // console.log(JSON.stringify(row));
                    response.end(JSON.stringify(result));
                }
            } else {
                response.end(JSON.stringify("'No Driver Yet!!! '"));
            }

        });
});

/**********************************GET Online Drivers Location ********************************** */

app.post('/getOnlineDriversLocation/', (request, response, next) => {
    var post_data = request.body;
    var isOnline = post_data.isOnline;
    //var Order_Statuse = post_data.Order_Statuse;

  //  var sql = 'SELECT * FROM `delivery_boy` WHERE `isOnline`=?'
    var q='SELECT delivery_Boy_ID, delivery_Boy_name, delivery_Boy_phones, delivery_Boy_pass, delivery_Boy_image, delivery_Boy_national_id, delivery_lat, delivery_lng, CASE WHEN delivery_boy.isOnline =0 THEN "FALSE" ELSE "TRUE" END AS isOnline FROM delivery_boy WHERE `isOnline`=?'
    conn.query(q,
        [isOnline],
        (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];

                    // console.log(JSON.stringify(row));
                    response.end(JSON.stringify(result));
                }
            } else {
                response.end(JSON.stringify("'No Driver Online!!! '"));
            }

        });
});



/**********************************GETlastOrder ********************************** */

app.post('/getLastOrder/', (request, response, next) => {
    var post_data = request.body;
    var Member_Phone = post_data.Member_Phone;
    //var Order_Statuse = post_data.Order_Statuse;

    var sql = 'SELECT * FROM `order` where Order_Id=(select max(Order_Id) from `order`) and `Member_Phone`= ?'
    conn.query(sql,[Member_Phone],
        
        (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length > 0) {
                
                    // console.log(JSON.stringify(row));
                    response.end(JSON.stringify(result));
            } else {
                response.end(JSON.stringify("'Error in Get Your Order!!! '"));
            }

        });
});
/********************************************** Update  Order Status ******************************************** */

app.post('/updateOrderStatus/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 

    var Member_Phone = post_data.Member_Phone;
    var Member_ID = post_data.Member_ID;
    var Order_Id = post_data.Order_Id;
    var Order_Statuse = post_data.Order_Statuse;

    var sql = 'UPDATE `order` SET `Order_Statuse` = ? WHERE `Order_Id`=? AND `Member_Phone`=? AND `Member_ID`=? ';

    conn.query(sql, [Order_Statuse, Order_Id, Member_Phone, Member_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result) {
            response.end(JSON.stringify("Change status Successfully"));
        } else {
            response.end(JSON.stringify("'Error while write to database'"));
        }

    });


});


/********************************************** Get Token ******************************************** */
/*
app.post('/getToken/', (request, response, next) => {
    var post_data = request.body;
    var Phone = post_data.Phone;
    
    var IsServerToken = post_data.IsServerToken;

    conn.query(' SELECT * FROM `token` WHERE Phone=? AND IsServerToken=? ', [Phone, IsServerToken]

        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });

            //console.log(result);
            if (result && result.length) {

                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                }
               // console.log(JSON.stringify(row));
                response.end(JSON.stringify(row));

            } else {

                response.json("'Error Getting Offer !!!'");
            }
        });

});

*/
/***************************************************************************** */



/*   **********************************************Insert Driver ID TO Order  **************************************  */
app.post('/AddDriverToOrder/', (request, response, next) => {
    var post_data = request.body; //Get POST params from Body key
    var Order_Id = post_data.Order_Id;
    var delivery = post_data.delivery;

    var SELsql = 'SELECT * FROM `order` WHERE `Order_Id`=? ';

    var t = 'UPDATE `order` SET `delivery`=? where  Order_Id=? '

    //  var sql='INSERT INTO `order`(`delivery`) VALUES (?) where Order_Id = ?'; 
    conn.query(SELsql, [Order_Id], function (err, result, fields) {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        if (result && result.length)
            conn.query(t, [delivery, Order_Id],
                function (err, result, fields) {
                    conn.on('error', function (err) {
                        console.log('[MySQL Error]', err);
                        response.json('Create error : ', err);
                    });
                    if (!err) {
                        response.end(JSON.stringify('Order Sent To Driver Successful'));
                        
                    } else
                    response.end(JSON.stringify('Error Sending Order To driver'));
                    //response.json('Error Sending Order To driver');
                });
                else {
                    response.end(JSON.stringify('Purshing Order not exists !!!'));
            response.json('Purshing Order not exists !!!');

        }
    });

});

/**********************************GET ALL ORDERS Data After Deliverd********************************** */
app.post('/getOrderDataDeliverd/', (request, response, next) => {
    var post_data = request.body;
    var Order_Id = post_data.Order_Id;
    var Order_Statuse = post_data.Order_Statuse;

    var sql = 'SELECT `order`.Order_Id, `order`.Member_Phone, `order`.Order_Details, `order`.Order_Comment, `order`.Order_Address, `order`.Payment_Method, `order`.Order_Price, `order`.Order_Statuse, `order`.Member_ID, `order`.Order_Date, `order`.delivery, delivery_boy.delivery_Boy_ID, delivery_boy.delivery_Boy_name, delivery_boy.delivery_Boy_phones, delivery_boy.delivery_Boy_image, delivery_boy.delivery_Boy_national_id, delivery_boy.admin_ID, delivery_boy.delivery_lat, delivery_boy.delivery_lng FROM `order` INNER JOIN delivery_boy ON `order`.delivery = delivery_boy.delivery_Boy_ID WHERE `order`.Order_Statuse = ? AND `order`.Order_Id = ?'
    conn.query(sql, [Order_Statuse,Order_Id],
        (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    response.end(JSON.stringify(row));
                }

                // console.log(JSON.stringify(row));
            } else {
                response.end(JSON.stringify("'No Orders Yet!!! '"));
            }

        });


});

/**********************************GET ALL Driver Data ********************************** */
app.post('/getDriverData/', (request, response, next) => {
    var post_data = request.body;
    var admin_ID = post_data.admin_ID;

    var sql = 'SELECT * FROM `delivery_boy` WHERE `admin_ID`=?';
    conn.query(sql, [admin_ID],
        (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                }
                response.end(JSON.stringify(result));

                console.log(JSON.stringify(result));
            } else {
                response.end(JSON.stringify("'Error Can not get Geo '"));
            }

        });


});


/**********************************GET Order Per Day ********************************** */
app.get('/getOrderPerday/', (request, response, next) => {
    var post_data = request.body;
    var admin_ID = post_data.admin_ID;
    var sql = 'SELECT DATE(Order_Date) Date, COUNT( Order_Statuse) totalCOunt,SUM(Order_Price)price FROM `order` WHERE Order_Statuse=3 GROUP BY DATE(Order_Date)';
    //   var sql='SELECT DATE( Order_Date) Date, COUNT(DISTINCT Order_Statuse) totalCOunt FROM `order` WHere Order_Statuse=3 GROUP BY DATE( Order_Date)';  
    conn.query(sql,
        (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                }
                response.end(JSON.stringify(result));

                console.log(JSON.stringify(result));
            } else {
                response.end(JSON.stringify("'Error Can not get Geo '"));
            }

        });


});

/**********************************GET ALL Driver Location ********************************** */
app.get('/getOrderPermember/', (request, response, next) => {
    var post_data = request.body;
    var admin_ID = post_data.admin_ID;
    var sql = 'SELECT (Member_Phone) member_phone, COUNT( Order_Statuse) totalCOunt,SUM(Order_Price)price FROM `order` WHERE Order_Statuse=3 GROUP BY (Member_Phone)';
    //   var sql='SELECT DATE( Order_Date) Date, COUNT(DISTINCT Order_Statuse) totalCOunt FROM `order` WHere Order_Statuse=3 GROUP BY DATE( Order_Date)';  
    conn.query(sql,
        (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                }
                response.end(JSON.stringify(result));

                console.log(JSON.stringify(result));
            } else {
                response.end(JSON.stringify("'Error Can not get Geo '"));
            }

        });


});

/*   ********************************************delete Comment**************************************  */
app.post('/deleteComment/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    const member_Id = post_data.member_Id;
    const foodItem_Id = post_data.foodItem_Id;
    const commentID = post_data.commentID;
var sql='DELETE FROM `ratecomment` WHERE `member_Id` =? AND `foodItem_Id`= ? AND  `commentID` = ?'

    conn.query(sql, [member_Id,foodItem_Id,commentID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (!err) {
            response.end(JSON.stringify("Delete From Comment"));
        } else {
            response.json("'Comment not exists !!!'");
        }
    });
});


/*--------------------------------- login Delivery----------------------------------------------*/

app.post('/loginDelivery/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    const delivery_Boy_phones = post_data.delivery_Boy_phones;
    const delivery_Boy_pass = post_data.delivery_Boy_pass;

    conn.query('SELECT * FROM `delivery_boy` where delivery_Boy_phones=? AND delivery_Boy_pass=?  ',
        [delivery_Boy_phones, delivery_Boy_pass], (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length) {
                response.end(JSON.stringify(result));
            } else {
                response.json("'Wrong Input !!!'");
            }
        });


});
/*********************************************GET Member Data***************************** */
app.use('/getDeliveryInformation/', (request, response, next) => {
    var post_data = request.body;
    const delivery_Boy_ID = post_data.delivery_Boy_ID;

    conn.query('SELECT * FROM `delivery_boy` where delivery_Boy_ID=? ',
        [delivery_Boy_ID], (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length) {
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                    response.end(JSON.stringify(row));
                }

                // response.end(JSON.stringify(result));
            } else {
                response.json("'User not exists !!!'");
            }
        });
});
/********************************************Update AdminToken************************* */
app.post('/updateDeliverytoken/', (request, response, next) => {
    var post_data = request.body;

    var Phone = post_data.Phone;
    var Token = post_data.Token;
    var IsServerToken = post_data.IsServerToken;

    conn.query('INSERT INTO `token`(`Phone`, `Token`, `IsServerToken`)  VALUES (?,?,?) ON DUPLICATE KEY UPDATE Token=? , IsServerToken=?  ', [Phone, Token, IsServerToken, Token, IsServerToken]

        ,
        function (err, result, fields) {
            conn.on('error', function (err) {
                // console.log('[Mysql ERROR]',err);
                response.end(JSON.stringify(err));
            });
            if (result) {

                conn.query('SELECT * FROM `token` WHERE `Phone` = ?', [Phone]

                    // conn.query('SELECT * FROM member where email=? ',[email]
                    , (err, result, fields) => {
                        conn.on('error', function (err) {
                            console.log('[Mysql ERROR]', err);
                        });

                        if (result && result.length > 0) {
                            // console.log(JSON.stringify(result));
                            response.end(JSON.stringify(result));
                        } else
                            response.end(JSON.stringify("'Error'"));

                    });

            }

        });


});

/**********************************GET Order Where Delivery ID Equal  ********************************** */
//NOTE TO ADD DESC IN ORDER DATE

app.post('/getOrderWhereDelivery/', (request, response, next) => {
    var post_data = request.body;
    var delivery = post_data.delivery;
    var sql = 'SELECT `order`.Order_Id, `order`.Member_ID, `order`.Member_Phone, `order`.Member_Name, `order`.Order_Details, `order`.Order_Comment, `order`.Order_Address, `order`.Payment_Method, `order`.Order_Price, `order`.Order_Statuse, `order`.Order_Date, `order`.delivery FROM `order` WHERE `order`.Order_Statuse = 2 AND `order`.delivery = ? ';
    //   var sql='SELECT DATE( Order_Date) Date, COUNT(DISTINCT Order_Statuse) totalCOunt FROM `order` WHere Order_Statuse=3 GROUP BY DATE( Order_Date)';  
    conn.query(sql, [delivery],
        (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // response.send(user); 
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var row = result[i];
                }
                response.end(JSON.stringify(result));

                console.log(JSON.stringify(result));
            } else {
                response.end(JSON.stringify("'Error in gathering data '"));
            }

        });


});



/********************************************** Update  Order Status ******************************************** */
/*
app.post('/updateOrderStatus/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 

    var Member_Phone = post_data.Member_Phone;
    var Member_ID = post_data.Member_ID;
    var Order_Id = post_data.Order_Id;
    var Order_Statuse = post_data.Order_Statuse;

    var sql='UPDATE `order` SET `Order_Statuse` = ? WHERE `Order_Id`=? AND `Member_Phone`=? AND `Member_ID`=? ';

    conn.query(sql, [Order_Statuse,Order_Id, Member_Phone, Member_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result) {
            response.end(JSON.stringify("Order Has Been Cancelled"));
        } else {
            response.end(JSON.stringify("'Error while write to database'"));
        }

    });


});
*/
/********************************************** Update  Order Status ******************************************** */

app.post('/updateOrderStatusbydriver/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 

    var delivery = post_data.delivery;
    var Member_ID = post_data.Member_ID;
    var Order_Id = post_data.Order_Id;
    var Order_Statuse = post_data.Order_Statuse;

    var sql = 'UPDATE `order` SET `Order_Statuse` = ? WHERE `Order_Id`=? AND `delivery`=? AND `Member_ID`=? ';

    conn.query(sql, [Order_Statuse, Order_Id, delivery, Member_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result) {
            response.end(JSON.stringify("Order Has Been Cancelled"));
        } else {
            response.end(JSON.stringify("'Error while write to database'"));
        }

    });


});



/********************************************** Update  Driver Location ******************************************** */

app.post('/updateDeliveryLocation/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 

    var delivery_lat = post_data.delivery_lat;
    var delivery_lng = post_data.delivery_lng;
    var delivery_Boy_ID = post_data.delivery_Boy_ID;

    // var sql='UPDATE `order` SET `Order_Statuse` = ? WHERE `Order_Id`=? AND `delivery`=? AND `Member_ID`=? ';
    var sqlr = 'UPDATE `delivery_boy` SET `delivery_lat`=?,`delivery_lng`=? WHERE `delivery_Boy_ID`=?'
    conn.query(sqlr, [delivery_lat, delivery_lng, delivery_Boy_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result) {
            response.end(JSON.stringify("Location Has Been Updated"));
        } else {
            response.end(JSON.stringify("'Error while write to database'"));
        }

    });


});


/********************************************** ISDriver Online ******************************************** */

app.post('/isDeliveryBoyOnline/', (request, response, next) => {
    var post_data = request.body;
    //Extract foodItems by menu 


    var isOnline = post_data.isOnline;
    var delivery_Boy_ID = post_data.delivery_Boy_ID;

    var sqlr = 'UPDATE `delivery_boy` SET `isOnline`=? WHERE `delivery_Boy_ID`=?'
    conn.query(sqlr, [isOnline, delivery_Boy_ID], (err, result, fields) => {
        conn.on('error', function (err) {
            console.log('[Mysql ERROR]', err);
        });
        // response.send(user); 
        if (result) {
            response.end(JSON.stringify("Driver Status Has Been Updated"));
        } else {
            response.end(JSON.stringify("'Error while write to database'"));
        }

    });


});

/********************************************Insert INTO TOP SELLS************************* */

app.post('/insertToTopSell/', (request, response, next) => {
    var post_data = request.body;

    var food_quantity = post_data.food_quantity;
    var food_id = post_data.food_id;
     
    var sql ='INSERT INTO `top_sells`(`food_id`, `food_quantity`) VALUES (?,?)  ON DUPLICATE KEY UPDATE food_quantity = food_quantity+?';

     

    conn.query(sql, [food_id, food_quantity,food_quantity]

        ,
        function (err, result, fields) {
            conn.on('error', function (err) {
                // console.log('[Mysql ERROR]',err);
                response.end(JSON.stringify(err));
            });
            if (!err) {

                response.end(JSON.stringify("Insertaion Done"));
                
            }else{
                response.end(JSON.stringify("Insertaion Faild"));

            }

        });


});


/********************************************SELECT FROM TOP SELLS************************* */

app.get('/selectFromTopSell/', (request, response, next) => {
 
    var sql ='SELECT top_sells.food_id, top_sells.food_quantity, food_item.Food_Item_Name, food_item.Food_item_Image FROM top_sells INNER JOIN food_item ON top_sells.food_id = food_item.Food_Item_ID ORDER BY top_sells.food_quantity DESC LIMIT 10';
    conn.query(sql 

        ,
        function (err, result, fields) {
            conn.on('error', function (err) {
                // console.log('[Mysql ERROR]',err);
                response.end(JSON.stringify(err));
            });
            if (result && result.length > 0) {

                response.end(JSON.stringify(result));
                
            }else{
                response.end(JSON.stringify("Error in Top Sells"));

            }

        });


});


/*   **********************************************Update Driver Password**************************************  */
app.post('/upDateDeriverpassword/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var delivery_Boy_pass = post_data.delivery_Boy_pass;
    var delivery_Boy_ID = post_data.delivery_Boy_ID;
    var delivery_Boy_phones = post_data.delivery_Boy_phones;
    var sql='UPDATE `delivery_boy` SET  `delivery_Boy_pass`=?  WHERE  `delivery_Boy_ID`=? AND `delivery_Boy_phones`=?'
    conn.query(sql, [delivery_Boy_pass,delivery_Boy_ID,delivery_Boy_phones], function (err, rows) {
        //connection.release();
        if (!err) {
            response.end(JSON.stringify("'Done'"));
        } else
            response.send(JSON.stringify("'Wrong Data'"+err));
    });
});



/************************************************get Count Rate comment ************************************* *****/
app.post('/countOrdersForDriver/', (request, response, next) => {
    var post_data = request.body;
    //Extract email and Password
    var delivery = post_data.delivery;
    var Order_Statuse = post_data.Order_Statuse;

     

var sql='SELECT COUNT(*) FROM `order` WHERE `order`.delivery = ? AND `order`.Order_Statuse = ?'

    conn.query(sql, [delivery,Order_Statuse]
        // conn.query('SELECT * FROM member where email=? ',[email]
        , (err, result, fields) => {
            conn.on('error', function (err) {
                console.log('[Mysql ERROR]', err);
            });
            // console.log(MemberIDS);
            // response.send(user); 
            if (result && result != null) {
                //console.log(JSON.stringify(result));
                response.end(JSON.stringify(result));
            } else{
                response.send(JSON.stringify("'please check mangment'" +err));
                console.log("ERROR"+err);
            }
        });

});
/**************************************************************************** */





//start Server/in loclhost only port 8080 ---------.3306
const PORT=process.env.PORT || 3306
app.listen(PORT, () => {
    console.log("RestFul ِAPI Running "+PORT);
});
module.exports = app ;
// wahe up server

/*
var reqTimer = setTimeout(function wakeUp() {
    request("https://thawing-island-43296.herokuapp.com/", function() {
       console.log("WAKE UP DYNO");
    });
    return reqTimer = setTimeout(wakeUp, 1200000);
 }, 1200000);
 */

//socket = io.listen(process.env.PORT);


 

