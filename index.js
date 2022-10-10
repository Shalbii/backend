const express = require('express')
const app = express()
const port = 4000;
app.use(express.json());

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password",
  database: "crm"
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  // app.get("/", (req, res)=>{
  //     res.send("Test")
  // })

  // app.get("/sampleapi",(req, res)=>{
  //     res.send("Sample API")
  // })

  //  app.post("/addition",(req, res)=>{
  //     let a=req.body.numone;
  //     let b=req.body.numtwo;
  //      let sum=a+b;
  //      res.send("Result="+sum)
  //  })

  //  app.post("/multiply",(req, res)=>{
  //     let a=req.body.numone;
  //     let b=req.body.numtwo;
  //      let multiply=a*b;
  //      res.send("Result="+multiply)
  //  })

  //  app.post("/divide",(req, res)=>{
  //     let a=req.body.numone;
  //     let b=req.body.numtwo;
  //      let divide=a/b;
  //      res.send("Result="+divide)
  //  })

  app.post("/loginapi", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let sql = "select id from tblusers where txtFirstName ='" + username + "' and txtPassword='" + password + "'";

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
      if (result == '') {
        res.send("Incorrect");
      }
      else {
        res.send("valid field" + JSON.stringify(result));
      }
      // res.send("Valid"+JSON.stringify(result))
    });
  });

  app.post("/signupapi", (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;

    let sql =
      "SELECT txtFirstName,txtEmail FROM tblusers where txtEmail='" + email + "'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
      if ((email != "") & (firstname != "")) {
        if (result != "") {
          res.send("user already exist please login" + JSON.stringify(result));
        } else {
          let sqlinsert = "insert into tblusers(txtFirstName,txtLastName,txtEmail,txtPassword) values('" + firstname + "','" + lastname + "','" + email + "','" + password + "') ;";
          con.query(sqlinsert, function (err, result1) {
            if (err) throw err;
            console.log("inserted" + result1);
            res.send("New user ")
          });
        }
      } else {
        res.send("email and firstname mandatory");

      }
    });
  });



  app.post("/verifyotpapi", (req, res) => {
    let otp = req.body.otp;
    let sql = "select txtOTP,dtOTPsent from tblusers where txtOTP='" + otp + "'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
      if (result == "") {
        res.send("OTP no match");
        return res
      }

      else {
        res.send("Valid" + JSON.stringify(result));
      }
    });
  });
  //})



  app.post("/AddCampaign", (req, res) => {
    let Campaignname = req.body.Campaignname;
    let Producttype = req.body.Producttype;
    let Startdate = req.body.Startdate;
    let Enddate = req.body.Enddate;
    let Createdon = req.body.Createdon;
    let sqlselect = "select tc.txtCampaignName,tp.txtProducttype from tblcampaign tc join tblproducttype tp on tc.refProducttype=tp.id where tc.txtCampaignName ='" + Campaignname + "'";
    let sql = "insert into tblcampaign(txtCampaignName,refProducttype,dtStartdate,dtEnddate,dtCreatedOn) values('" + Campaignname + "','" + Producttype + "','" + Startdate + "','" + Enddate + "','" + Createdon + "');";

    con.query(sqlselect, function (err, result) {
      if (err) throw err;
      console.log("Result" + result);
      if (Campaignname !== "") {
        if (result != "") {
          res.send("Campaignname already exist" + JSON.stringify(result));
        }
        else {
          con.query(sql, function (err, result1) {
            if (err) throw err;
            console.log("inserted" + result1);
            res.send("New Campaign added ")
          });

        }
      } else {
        res.send("Campaign Name is Mandatory")
      }

    })
  })

  app.post("/getsingleprofile", (req, res) => {
    let id = req.body.id;
    let sql = "select txtSuffix,txtFirstName,txtLastName,txtEmail,txtPassword from tblusers where id  = '" + id + "';"
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Profile  displayed")
      if (result != "") {
        res.send("Profile Information " + JSON.stringify(result))
        return
      }
      else {
        res.send("Profile does not exist")
        return
      }
    });
  });


  app.post("/insertsingleprofile", (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;
    //let repassword=req.body.repassword;
    let sql = "select txtEmail from tblusers where txtEmail =  '" + email + "';"
    let sql1 = "insert into tblusers(txtFirstName,txtLastName,txtEmail,txtPassword) values ('" + firstname + "','" + lastname + "','" + email + "','" + password + "');"
    if (firstname == "") {
      res.send("Firstname is empty")
      return
    }
    if (lastname == "") {
      res.send("Lastname is empty")
      return
    }
    if (email == "") {
      res.send("Email is empty")
      return
    }
    if (password == "") {
      res.send("Password is empty")
      return
    }
    // if (repassword == "") {
    //   res.send("Repassword is empty")
    //   return
    // }
    // if (password != repassword) {
    //   res.send("Password's do not match")
    //   return
    //}
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result = " + JSON.stringify(result))
      if (result != "") {
        res.send("Profile already exists!")
        return
      }
      else {
        con.query(sql1, function (err, result) {
          if (err) throw err;
          res.send("Profile Inserted!")
          console.log("New user profile details inserted")
          return
        });
      }
    });
  });

  app.post("/getsinglelead", (req, res) => {
    let id = req.body.id;
    let sql = "select txtSuffix,txtFirstName,txtLastName,txtEmail from tblusers where id  = '" + id + "';"
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Lead  displayed")

      if (result != "") {
        res.send("Lead Information " + JSON.stringify(result))
        return
      }
      else {
        res.send("Lead does not exist")
        return
      }
    });
  });


  app.post("/resendotpapi", (req, res) => {
    let otp = req.body.otp;
    let phonenumber = req.body.phonenumber
    let sql = "select txtPhonenumber,txtOTP from tblusers where txtPhonenumber='" + phonenumber + "'";
    if (phonenumber == "") {
      res.send("phonenumber is mandatory");
      return res
    }
    if (otp == "") {
      res.send("otp is mandatory");
      return res
    }
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Resend: " + result);

    });
  });


  app.post("/insertsinglelead", (req, res) => {
    let FirstName = req.body.FirstName;
    let LastName = req.body.LastName;
    let email = req.body.email;
    let Phone = req.body.Phone;
    let sql = "select txtEmail from tblleads where txtEmail =  '" + email + "';"
    let sql1 = "insert into tblleads (txtFirstName, txtLastName, txtEmail, txtPhone) values('" + FirstName + "', '" + LastName + "','" + email + "','" + Phone + "');"
    if (FirstName == "") {
      res.send("FirstName is empty")
      return
    }
    if (LastName == "") {
      res.send("LastName is empty")
      return
    }
    if (email == "") {
      res.send("email is empty")
      return
    }
    if (Phone == "") {
      res.send("Phone is empty")
    }

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result = " + JSON.stringify(result))
      if (result != "") {
        res.send("Lead already exists!")
        return
      }
      else {
        con.query(sql1, function (err, result) {
          if (err) throw err;
          res.send("Lead Inserted!")
          console.log("New user Lead details inserted")
          return
        });
      }

    });
  });



  app.post("/updatesingleprofileapi", (req, res) => {
    let firstname = req.body.firstname;
    let email = req.body.email;
    let id = req.body.id;
    let sql = "select id,txtFirstName,txtEmail from tblusers where txtEmail= '" + email + "'";
    let sqlupdate = "update tblusers    set txtEmail='" + email + "'    where id='" + id + "'";
    if (firstname == "") {
      res.send("firstname is mandatory");
      return res
    }
    if (email == "") {
      res.send("email is mandatory");
      return res
    }
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      if (result != "") {
        res.send("already exist");
      }
    });
    con.query(sqlupdate, function (err, result) {
      if (err) throw err;
      console.log("updated" + result);
      res.send("updated")
    });
  })


  app.post("/updatesinglelead", (req, res) => {
    let firstname = req.body.firstname;
    let email = req.body.email;
    let id = req.body.id;
    let sql = "select id,txtFirstName,txtEmail from tblleads where txtEmail= '" + email + "'";
    let sqlupdate = "update tblleads   set txtEmail='" + email + "'    where id='" + id + "'";
    if (firstname == "") {
      res.send("firstname is mandatory");
      return res
    }
    if (email == "") {
      res.send("email is mandatory");
      return res
    }
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      if (result != "") {
        res.send("already exist");
      }
    });
    con.query(sqlupdate, function (err, result) {
      if (err) throw err;
      console.log("updated" + result);
      res.send("updated")
    });
  })
//email&name
  app.post("/updatesinglecampaign", (req, res) => {
    let campname = req.body.campname;
    //let email = req.body.email;
    let id = req.body.id;
    let sql = "select txtCampaignName  from tblcampaign where id= '" + id + "'";
    let sqlupdate = "update tblcampaign  set txtCampaignName='" + campname + "'    where id='" + id + "'";
    if (campname == "") {
      res.send("campname is mandatory");
      return res
    }
    
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      if (result != "") {
        res.send("already exist");
      }
    });
    con.query(sqlupdate, function (err, result) {
      if (err) throw err;
      console.log("updated" + result);
      res.send("updated")
    });
  })


  app.post("/getsinglecampaign", (req, res) => {
    let id = req.body.id;
    let sql = "select tblcampaign.txtCampaignName,tblproducttype.txtProducttype from tblcampaign left join tblproducttype on tblcampaign.refProducttype =tblproducttype.id where tblcampaign.id = '" + id + "';"
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      if (result !== '') {
        res.send("Campaign Exist" +JSON.stringify(result))
        return
      }
      else {
        res.send(" Campaign does not Exist")
        return
      }
  
    });
  });


  
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

