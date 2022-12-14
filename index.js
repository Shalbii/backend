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
        res.send("Campaign Exist" + JSON.stringify(result))
        return
      }
      else {
        res.send(" Campaign does not Exist")
        return
      }

    });
  });

  app.post("/getsingletask", (req, res) => {
    let id = req.body.id;
    let sql = "select tt.txtActivitytype,tc.txtConversionType from tblactivity ta join tblactivitytype tt on ta.refActivitytype=tt.id join tblconversiontype tc on ta.refConversionStatus=tc.id where ta.id = '" + id + "';"
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      if (result !== '') {
        res.send("Task Exist" + JSON.stringify(result))
        return
      }
      else {
        res.send(" Task does not Exist")
        return
      }

    });
  });

  app.post('/SalespersonwiseSuccessRate', (req, res) => {
    let sql = "SELECT tm.refLeadId,tl.txtFirstName,tc.txtConversionType, count(tl.txtFirstName) FROM tblleads tl JOIN tblleadcampaignmap tm ON tl.id = tm.refLeadId JOIN tblactivity ta ON tm.id = ta.refMapid JOIN tblconversiontype tc ON tc.id = ta.refConversionStatus WHERE tc.txtConversionType = 'Prospect ' group by tl.txtFirstName;"
    con.query(sql, function (err, result) {
      if (err) throw err
      console.log(result)
      res.send(result)
    });
  });


  app.post("/campaignwiseprospectcount", (req, res) => {
    let sql =
      "SELECT tl.refCampaignId CampaignId,tc.txtCampaignName CampaignName,tt.txtConversionType ConversionType,COUNT(txtCampaignName) count FROM tblcampaign tc JOIN tblleadcampaignmap tl ON tc.id = tl.refCampaignId JOIN tblactivity ta ON tl.id = ta.refMapid JOIN tblconversiontype tt ON ta.refConversionStatus = tt.id WHERE tt.txtConversionType = 'Prospect' GROUP BY tc.txtCampaignName;";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  });



  app.post('/leadsfunnel', (req, res) => {
    let sql = "select count(id) leadscount from crm.tblleads union all SELECT count(d.txtConversionType) as NoOfLeads FROM crm.tblleads a JOIN crm.tblleadcampaignmap b ON a.id = b.refLeadId JOIN crm.tblactivity c ON b.id = c.refMapid JOIN crm.tblconversiontype d ON c.refConversionStatus = d.id where d.txtConversionType = 'Nurturing ' or d.txtConversionType = 'Prospect ' group by d.txtConversionType;"
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result)
      res.send(result)
    });
  });


  app.post("/Managerwiseprospectcount", (req, res) => {
    let Jobrole = req.body.Jobrole;
    let sql = "select A.txtJobTitle,B.txtFirstName,E.txtconversiontype,count(E.txtConversionType) count from tbljobtitle A join tblusers B on B.refJobTitle=A.id  join tblleadcampaignmap C on B.refCreatedBy=C.id join tblactivity D on D.refMapid=C.id join tblconversiontype E on D.refConversionStatus=E.id where txtJobTitle='" + Jobrole + "';"
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  });

  app.post('/prospectGrowth', (req, res) => {
    let sql = "SELECT d.txtConversionType, COUNT(d.txtConversionType) as count FROM crm.tblleads a JOIN crm.tblleadcampaignmap b ON a.id = b.refLeadId JOIN crm.tblactivity c ON b.id = c.refMapid JOIN crm.tblconversiontype d ON c.refConversionStatus = d.id WHERE d.txtConversionType = 'Prospect';"
    con.query(sql, function (err, result) {
      if (err) throw err
      console.log(result)
      res.send(result)
    });
  });

  app.post('/Prospectprogress', (req, res) => {
    let sql = "select tct.txtconversiontype,tpt.txtProgresstype from tblactivity ta join tblconversiontype tct on ta.refConversionStatus=tct.id join tblprogresstype tpt on ta.refProgressStatus=tpt.id where tct.txtconversiontype='Prospect ';"
    con.query(sql, function (err, result) {
      if (err) throw err
      console.log(result)
      res.send(result)
    });
  });


  app.post("/getuserlistwithfilter", (req, res) => {

    let value_filter = req.body.value_filter;
    let filtername = req.body.filtername;
    let sql = "select * from tblusers where " + value_filter + "='" + filtername + "' or " + value_filter + " like '" + filtername + "';";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result" + result);
      res.send(result)
    })
  })
});


app.post("/GetLeadListWithFilter", (req, res) => {
  let username = req.body.username;
  let name = req.body.name;

  let sql = "select * from tblleads where txtFirstName= '" + username + "';";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);

    if (username != "" || name != "") {
      if (username != "" & name == "") {
        if (result != "") {
          res.send("success" + JSON.stringify(result));
        }
        else {
          res.send("error");
        }
      }
      if (username == "" & name != "") {
        let sql1 = "select * from tblleads where txtFirstName like '" + name + "';";
        con.query(sql1, function (err, result1) {
          if (err) throw err;
          console.log("Result: " + result1);
          if (result1 != "") {
            res.send("success" + JSON.stringify(result1));
          }
          else {
            res.send("error");
          }
        });

      }
      if (username != "" & name != "") {
        res.send("please use username or name");
      }
    }

  })
});


app.post("/getCampaignlistwithfilter", (req, res) => {

  let value_filter = req.body.value_filter;
  let filtername = req.body.filtername;
  let sql = "select A.id,A.refCampaignId ,B.txtCampaignName from tblleadcampaignmap A join tblcampaign B on A.refCampaignId=B.id  where " + value_filter + "='" + filtername + "' or " + value_filter + " like '" + filtername + "';";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result" + result);
    res.send(result)
  })
})


app.post("/getProspectlistwithfilter", (req, res) => {

  let value_filter = req.body.value_filter;
  let filtername = req.body.filtername;
  let sql = "select D.id,D.txtFirstName,D.txtCompanyName,D.txtEmail,B.txtConversionType from tblactivity A join tblconversiontype B on A.refConversionStatus=B.id join tblleadcampaignmap C on A.refMapid =C.id join tblleads D on C.refLeadId=D.id where " + value_filter + "='" + filtername + "' or " + value_filter + " like '" + filtername + "';";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result" + result);
    res.send(result)
  })
})
app.post("/updatecampaign", (req, res) => {
  let Campaignname = req.body.Campaignname;
  let Startdate = req.body.Startdate;
  let Enddate = req.body.Enddate;
  let id = req.body.id;
  let sql = "update tblcampaign  set txtCampaignName='" + Campaignname + "',dtStartdate='" + Startdate + "',dtEnddate='" + Enddate + "'  where id = " + id + ";"

  con.query(sql, function (err, result) {
    if (err) throw err;
    if (Campaignname == "") {
      res.send("Campaignname is mandatory")
      return res
    }
    if (Startdate == "") {
      res.send(" Startdate is mandatory")
      return res
    }
    if (Enddate == "") {
      res.send("Enddate  is mandatory")
      return res
    }
    if (id == "") {
      res.send("id  is mandatory")
      return res
    }
    if (result == "") {
      res.send("campaign not exists")
      console.log("Result" + result);
      return res
    }
    else {
      res.send("Campaign updated" + JSON.stringify(result))


    }

  });
  app.post("/gettasklistwithfilter", (req, res) => {

    let value_filter = req.body.value_filter;
    let filtername = req.body.filtername;

    let sql = "select A.id,B.txtActivitytype from tblactivity A join tblactivitytype B on A.refActivitytype=B.id where " + value_filter + "='" + filtername + "' or " + value_filter + " like '" + filtername + "';";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result" + result);
      res.send(result)
    })
  })

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

