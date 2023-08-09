// const express = require("express");
import express, { response } from "express"
// const cors = require("cors");
import cors from "cors"
import dotenv from 'dotenv'
dotenv.config()
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb" 

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://sadikhasan13255:4G5V72OUXE11c5HC@cluster0.kz0zbjn.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://neloy:OW1M2haLBhuS0Km7@cluster0.ldswlo8.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1,strict: true,deprecationErrors: true,},});

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fppyswv.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1,strict: true,deprecationErrors: true,}});

//GET multiple data
const getMultipleData = async (collectionName) => {
  //collectionName = send the collection name
  const cursor = await collectionName.find({});
  const data = await cursor.toArray();
  return data;
};

//GET single data
const getSingleData = async (collection, query, options = {}) => {
  /*
    query = data(obj) you want to find
    options = optional parameter and by default it is empty
    example ->   const options = {
            _sort matched documents in descending order by rating
                sort: { "imdb.rating": -1 },
            _Include only the `title` and `imdb` fields in the returned document
                projection: { _id: 0, title: 1, imdb: 1 },
                      };
  */
  const data = await collection.findOne(query, options);
  return data 
};

//POST insert single data
const insertSingleData = async (collectionName, data) => {
  /*
    collectionName -> collection name of the database
    data -> the data wanted to store
    */
    let result = await collectionName.insertOne(data)
  return result;
};

//POST insert multiple data
const insertMultipleData = async (collectionName, data, options = {}) => {
  /* collectionName = name of the collection where to insert
       data = the data want to insert and this data should be inside an array
            example :  
              const data = [
                              { name: "cake", healthy: false },
                              { name: "lettuce", healthy: true },
                              { name: "donut", healthy: false }
                          ];
      __this option prevents additional documents from being inserted if one fails
      const options = { ordered: true };  
    */
  return result = await collectionName.insertMany(data, options);
};

//PUT update single data
const updateSinlgeData = async ( collectionName,  filter, dataTobeUpdated,option = true ) => {
  /*
      collectionName = name of the collection name
      filter = create a filter to update. Example:
              const filter = { title: "Random Harvest" };
      dataTobeUpdated = data you want to update
      options = this option is used if the data is absent then it will insert the data otherwise it will update it
                 const options = { upsert: true };
      */
  const options = { upsert: option };
  const updateDoc = { $set: dataTobeUpdated };
  let result = await collectionName.updateOne(filter, updateDoc, options);
  return result 
};

//PUT update multiple data
const updateMultipleData = async (collectionName, filter, dataTobeUpdated) => {
  /*
    collectionName = the collection name where the data will be updated
    filter = filter the data means where the datas will be updated. 
            example: create a filter to update all movies with a 'G' rating
                    const filter = { rated: "G" };
    
    dataTobeUpdated = data that will be update
    */
  const updateDoc = {
    $set: { dataTobeUpdated },
  };
  return result = await collectionName.updateMany(filter, updateDoc);
};

//POST replace single data
const replaceOneData = async (collectionName, filter, replacement) => {
  /*
    collectionName = collection where the data will be replaced 😪
    filter = the data need to be replaced. Here you can use regex. Example
              const filter = { title: "The Cat from Sector XYZ" }; (without regex)
              const filter = { title: { $regex: "The Cat from" } }; (with regex)
    replacement =  create a new document that will be used to replace the existing document. Example:
                      const replacement = {
                        title: `The Cat from Sector ${Math.floor(Math.random() * 1000) + 1}`,
                      };
    */ const query = filter;
  return result = await collectionName.replaceOne(query, replacement);
};

//DELETE delete single data
const deleteSingleData = async (collectionName, query) => {
  /*
    collectionName = the collection where data will be deleted -_-
    query = the data will be delete. Example
            const query = { title: "Annie Hall" };
    */
  const deleteData = query._id;
  const x = { _id: new ObjectId(deleteData) };
  // console.log("________x : ",x)
  const result = await collectionName.deleteOne(x);
  if (result.deletedCount === 1) {
    // console.log("Successfully deleted one document.");
    return true;
  } else{
    // console.log("No documents matched the query. Deleted 0 documents.");
    return false;
  }
};

//DELETE delete multiple data
const deleteMultipleData = async (collectionName, filter) => {
  /*
    collectionName = eta colection tar name -__-
    filter = the data need to be replaced. Here you can use regex. Example
              const filter = { title: "The Cat from Sector XYZ" }; (without regex)
              const filter = { title: { $regex: "The Cat from" } }; (with regex)
      */
  const query = filter;
  const result = await collectionName.deleteMany(query);
  if (result.deletedCount === 0) {
    // console.log("Nothing deleted.");
    return false;
  } else {
    // console.log("Successfully deleted");
    return false;
  }
};

//GET estimated data count and count the specific category data
const countAmountData = async (collectionName, estimateCount = false, query) => {
  /*
    collectionName = eta collection name
    estimateCount = true means it will give estimate count of data means count of all data and false means it will give the amount of specific categories' of data
    query = filtered data Query for movies from Canada. Example:
            const query = { countries: "Canada" };
    */
  const filter = query;
  if (estimateCount) {
    let estimate = 0
    return estimate = await collectionName.estimatedDocumentCount();
  } else {
    let count = 0
    return  count = await collectionName.countDocuments(filter);
  }
};

//you can watch the change of the data base which is kinda high level but a needed feature
//check it from below link asd
//https://www.mongodb.com/docs/drivers/node/current/usage-examples/changeStream/

async function run() {
  try {
    await client.connect();





    //here collection and database will be added
    // const Users = client.db("users").collection("roleMailUID");
    const CompanyInfo = client.db("users").collection("companyInfo")
    const EmployeeInfo = client.db("users").collection("employeeInfo")
    const UserRole = client.db("users").collection("role")
    const Jobs = client.db("jobs").collection("jobsInfo")


    //**********************GET********************************** */
    app.get("/  ", async (req,res) => {
      const result = await getMultipleData(Users)
      // console.log(result)
      // console.log("users")
      res.send(result)
    })

    app.get("/notification", async (req,res) => {
      const resultCompany = await getMultipleData(CompanyInfo)
      const resultEmployee = await getMultipleData(EmployeeInfo)

      res.send({resultCompany,resultEmployee})
      // console.log("is user present")
    })

    app.get('/get-single-user',async (req, res) => {
      const uid = req.query;
      // console.log('mew:',uid);
      let data
        data = await getSingleData(UserRole,uid,{})
        // Simulating a response with sample data 
        // console.log(data)
        res.send(data)
    });//***/

    app.get('/get-single-user-info',async (req, res) => {
      const query = req.query; // `okhan theke ekhane jai dibo setai ekhane thakbe`:"mewmew@mew.com"
      console.log('mew:',query);
        // Perform any necessary operations using the query
        let data
        data = await getSingleData(EmployeeInfo,query,{})
        // Simulating a response with sample data 
        // console.log("Data from line 231", data)
        res.send(data)  
      xxxxxxxxxxxxxxxxxxxxxxx
    })/***/

    app.get('/user-type', async(req,res)=>{
      const { uid } = req.query;
      // console.log("user type is ", req.query)
      const result = await getSingleData(UserRole,req.query,{})
      res.send(result)
      // console.log(result)
    })/***/

    app.get('/show-all-jobs', async(req,res)=>{
      const result = await getMultipleData(Jobs)
      res.send(result)
      // console.log(result)
    })/***/




    app.get("/get-single-job-details-employee/:id", async (req,res)=>{
      const id = req.params.id;//64987ecdac17d9f9ded4170e  it is job id

      const query = {_id:new ObjectId(id)}

      const jobData = await getSingleData(Jobs,query,{})

      // console.log(jobData)
      res.send(jobData)

    })//***/


    app.get("/get-company-for-employee/:uid",async (req,res) => {
      const company = await getSingleData(CompanyInfo,req.params,{})
      res.send(company)
    })/** */


    app.get("/get-other-posted-jobs-by-this-company/:uid", async (req, res) => {
      try {
        const company = await getSingleData(CompanyInfo, req.params, {});
        const jobsArray = company.jobs;
        let postedJobs = [];
        let newArray = [];
    
        await Promise.all(jobsArray.map(async (job) => {
          const x = { _id: job };
          const y = JSON.stringify(x);
          const id = y.split('"')[3];
          const z = await getSingleData(Jobs, { _id: new ObjectId(id) }, {});
          newArray.push(z);
        }));
    
        console.log(newArray);
        res.send(newArray);
      } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
      }
    });/***/

    app.get("/get-all-saved-jobs/:_id",async(req,res) => {
      const query = req.params
      const response = await getSingleData(Jobs, { _id: new ObjectId(query._id) }, {});


      console.log(response)
      res.send(response)
    })/***/
    


    app.get("/get-total-count",async(req,res)=>{
      
      const jobs = await countAmountData(Jobs,false,{})
      const companies = await countAmountData(CompanyInfo,false,{approval:true})
      const employee = await countAmountData(EmployeeInfo,false,{})
      console.log(jobs,companies,employee)
      res.send({totalJobs:jobs,totalCompany:companies,totalEmployees:employee})
    })



    app.get("/get-company-details/:uid",async (req,res)=>{
      const uid = req.params
      const reponse = await getSingleData(CompanyInfo,uid,{})
      res.send(reponse)
    })

    app.get("/get-single-employee-for-company",async(req,res)=>{
      const query = req.params;
    
      try {
        const job = await EmployeeInfo.findOne(query);
        console.log(job)
        res.send(job);
      } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).send('Internal Server Error');
      }
    })/** */
    



app.get('/get-single-employee-info',async (req,res)=>{

    const data = await getMultipleData(EmployeeInfo)
    res.send(data)  
})

app.get('/get-single-employee/:employeeUID',async (req,res)=>{

  const employee = await getSingleData(EmployeeInfo,{uid:req.params.employeeUID},{})
  res.json({payload:{employee}})
    
})/** */

app.get("/get-employee-applied-jobs/:employeeUID",async(req,res)=>{
  const uid = req.params.employeeUID
  
  const respose = await getSingleData(EmployeeInfo,{uid:uid},{})

  res.send(respose)
})


app.get("/superadmin-get-all-company",async (req,res)=>{
  const allPendingCompany = await getMultipleData(CompanyInfo)
  res.send(allPendingCompany)
})


app.get("/get-all-review",async (req,res)=>{
  const allReview = await getMultipleData(UserRole)
  res.send(allReview)
})/**review */




    //**********************POST********************************** */
    // app.post("/insertuser", async (req, res) => {
    //   console.log(" 1 ta call hoitese", req.body.email);
    //   const result = await insertSingleData(Users, req.body);
    //   console.log(result);
    //   console.log("insert user");
    //   res.json({request: 'success'});
    // });

    app.post("/create-new-user-company", async (req, res) => {
      // console.log(" 1 ta call hoitese", req.body.role);
      const result = await insertSingleData(CompanyInfo, req.body);
      const data = {
        email:req.body.email,
        uid:req.body.uid,
        role:req.body.role
      }
      await insertSingleData(UserRole,data) 
      // console.log(result);
      // console.log("insert user");
      res.json({request: 'success'});
    });/***/

    app.post("/create-new-user-employee", async (req, res) => {
      // console.log(" 1 ta call hoitese", req.body.role);
      const result = await insertSingleData(EmployeeInfo, req.body);
      // console.log(req.body,"and",result)
      const data = {
        email:req.body.email,
        uid:req.body.uid,
        role:req.body.role
      }
      await insertSingleData(UserRole,data) 
      // console.log(result);
      // console.log("insert user");
      res.json({request: 'success'});
    });/***/


    app.post("/set-employee-apply-job",async (req, res) => {
      const { _id, uid } = req.body;//{ uid: 'L8O9My8ydNdc4AzgRCHrc1HF1rq1' } + 
      //uid is employee's uid == pUildlyWd0cJucoHATIneAXrTx73
      //_id is job's id == pUildlyWd0cJucoHATIneAXrTx73
      // Do something with _id and uid parameters 
      


      //task 1 start
      const queryJob = {_id: new ObjectId(_id)}
      let job = await Jobs.findOne(queryJob);
      //task 1 done



      //task 2 start
      // uid is the employee uid 
      // task 2 done



      //task 3 start
      const isUidPresent = job.whoApplied.includes(uid);
      //task 3 done 

      const b = []


      // task 4 start
      if (isUidPresent) {
        return res.send("You already applied here...")
      }else{
        const newWhoAppliedArray = [...job.whoApplied,uid]
      //task 4 done


            //task 6 start 
            let employee = await getSingleData(EmployeeInfo,{uid:uid},{})
            //task 6 done

            let aj = employee.appliedJobs

            // employee.appliedJobs.push(_id)
            delete employee.appliedJobs

            aj = [...aj,_id]

            employee ={
              ... employee,
              appliedJobs: aj
            }





      //task 5 start
        delete job.whoApplied
          job = {
          ...job,
          whoApplied:newWhoAppliedArray
        }
        const updatedJob = await updateSinlgeData(Jobs,queryJob,job,true)
        const updatedEmployee = await updateSinlgeData(EmployeeInfo,{uid:uid},employee,true)
        // console.log(updatedJob,updatedEmployee)
        return  res.send("UpdatedJob")
        //task 5 done
      }








    });/***/


    app.post("/set-employee-profile",async (req,res)=>{
      const response = await updateSinlgeData(EmployeeInfo,{email:req.body.email},req.body,true)
      res.send(response)
    })


    app.post("/add-job",async (req,res) =>{
      // console.log("uid is ",req.body)
      const result = await insertSingleData(Jobs,req.body)
      const jobs = await getSingleData(CompanyInfo,{uid:req.body.uid})
      
      let jobArray = jobs?.jobs
      const myJSON = JSON.stringify(result.insertedId); 
      const regex = /"(.*?)"/; // Matches the content inside double quotes
      const match = regex.exec(myJSON);
      const id = match[1]; // Extract the ID from the matched string  

      jobArray.push(id); // Inserting jobID into the jobArray
      console.log("inserted result id ",jobArray)

      const finalRes = await updateSinlgeData(CompanyInfo,{uid:req.body.uid},{jobs:jobArray})
      res.send(finalRes)
      // res.send(jobs)
    })/***/

    app.post("/set-company-profile",async (req,res) =>{
      // console.log(req.body)
      const result = await insertSingleData(CompanyInfo,req.body)
      res.send(result)
    })

    app.post("/set-employee",async (req,res) =>{
      // console.log(req.body)
      const result = await insertSingleData(EmployeeInfo,req.body)
      res.send(result)
    })

    app.post("/set-user-type",async (req,res) => {
      // console.log(req.body)
      const result = await insertSingleData(Users,req.body)
      res.send(result.data)
    })

    app.post("/add-job-wishlist",async (req,res) => {
      // console.log(req.body)
      let data = req.body
      let user = await getSingleData(EmployeeInfo,{uid:data.uid},{})
      // console.log("clicked from wishlist ",user.savedJobs.length)
      if (user.savedJobs.length == 0) {
        user.savedJobs.push(data._id)
        // console.log(user.savedJobs)
        user = await updateSinlgeData(EmployeeInfo,{uid:data.uid},{savedJobs:user.savedJobs},true)
        // await user.save();
        // console.log(user)
        res.send(user)
      }else{
        user.savedJobs.find( async (x) => {
          if (x===data._id) {
            // console.log("matchedcount 1")
            res.send({matchedCount:1})
          }else{
            // console.log("updatecoount 1")

            user.savedJobs.push(data._id)
            user = await updateSinlgeData(EmployeeInfo,{uid:data.uid},{appliedJobs:user.appliedJobs},true)
            // await user.save();
            // console.log(user)
            res.send(user)
          }
        })
      }
      


    })

    app.post("/add-job-appliedlist",async (req,res) => {
      // console.log(req.body)
      let data = req.body
      let user = await getSingleData(EmployeeInfo,{uid:data.uid},{})
      // console.log()
      user.appliedJobs.find( async (x) => {
        if (x===data._id) {
          res.send({matchedCount:1})
        }else{
          user.appliedJobs.push(data._id)
          user = await updateSinlgeData(EmployeeInfo,{uid:data.uid},{appliedJobs:user.appliedJobs},true)
          // await user.save();
          res.send(user)
        }
      })

    })



    //**********************DELETE********************************** */
    app.delete("/delete-a-user",async (req,res) => {
      // console.log("delete a user line 237 :" ,req.query)
      let result =await deleteSingleData(Users,req.query)

      res.send(result)
    })

    app.delete("/delete-single-company-bysuperadmin/:uid", async (req, res) => {
      try {
        const result = await CompanyInfo.deleteOne(req.params);
        const userCollection = await UserRole.deleteOne(req.params);
        const delres =await Jobs.deleteMany( req.params )
        
    
        res.send({delres:delres,result:result,userCollection:userCollection});
      } catch (error) {
        console.error("Error deleting single company by superadmin:", error);
        res.status(500).send("Internal Server Error");
      }
    });
    
    

    app.delete('/delete-a-job', async (req, res) => {
      try {
        await Promise.all([
          (async () => {
            console.log(req.query);
            const query = { _id: req.query.job_id };
            const deleteJobResponse = await deleteSingleData(Jobs, query);
    
            if (deleteJobResponse) {
              let companyData = await getSingleData(CompanyInfo, { uid: req.query.companyUID }, {});
              const companyNewJobs = companyData.jobs.filter((job) => job.toString() !== req.query.job_id);
              delete companyData.jobs;
              companyData = {
                ...companyData,
                jobs: companyNewJobs,
              };
    
              const companyUpdate = await updateSinlgeData(CompanyInfo, { uid: companyData.uid }, companyData, true);
    
              const allEmployees = await getMultipleData(EmployeeInfo);
              let multipleEmployeeUpdateResponse = [];
    
              await Promise.all(
                allEmployees.map(async (employee) => {
                  let updatedEmployeeJobs = [];

                  updatedEmployeeJobs =( employee.calledForInterview || []).filter((job) => job.job_id !== req.query.job_id);
                  
                  if (updatedEmployeeJobs===[]) {
                    if (employee.calledForInterview.length === updatedEmployeeJobs.length) {
                      delete employee.calledForInterview;
      
                      let updatedEmployee = {
                        ...employee,
                        calledForInterview: updatedEmployeeJobs,
                      };
      
                      let response = await updateSinlgeData(EmployeeInfo, { uid: employee.uid }, updatedEmployee, false);
                      multipleEmployeeUpdateResponse.push(response);
                    }
                  }

                })
              );
    
              res.send({ multipleEmployeeUpdateResponse: multipleEmployeeUpdateResponse, companyUpdate: companyUpdate });
            }
          })(),
        ]);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });
    



    //**********************UPDATE / PUT********************************** */

    app.patch("/insert-a-review/:uid",async(req,res)=>{
      console.log(req.body)
      console.log(req.params)
      const result = await updateSinlgeData(UserRole,req.params,req.body,true)
      res.send(result)
    })


    app.patch("/update-single-employee/:uid",async (req,res)=>{
      console.log(req.params)
      console.log(req.body)
      let employee = await getSingleData(EmployeeInfo,req.params,{})
      delete employee.previousNotificationCount
      employee = {
        ...employee,
        previousNotificationCount:req.body.previousNotificationCount
      }
      const result = await updateSinlgeData(EmployeeInfo,req.params,employee,true)
      console.log(result)
      res.send(result)
    })


    app.put("/update-single-company/:uid",async (req,res)=>{
      const id = req.params.uid
      let data = req.body
      data.uid=id
      console.log(data)
      let result = await updateSinlgeData(CompanyInfo,{uid:id},data,true)
      // console.log(result)
      res.send(result)
    })

    app.put("/remove-array-item", async (req, res) => {
      try {
        const data = req.body;
    
        let employeeData = await getSingleData(EmployeeInfo, { uid: data.employeeUID }, {});
        let companyData = await getSingleData(CompanyInfo, { uid: data.companyUID }, {});
        const jobData = await getSingleData(Jobs, { uid: data.companyUID }, {});
        console.log(data,employeeData);


        
        const companyInterviewWith = companyData.appointmentDetails
        let updatedCompanyInterviewWith = companyInterviewWith.filter(item => item.appointmentEmployeeUID !== data.employeeUID && item.job_id !== data.job_id )
        delete companyData.appointmentDetails
        companyData = { ...companyData , appointmentDetails:updatedCompanyInterviewWith }

        const employeeInterviewWith = employeeData.calledForInterview
        let updatedEmployeeInterviewWith = employeeInterviewWith.filter(item => item.appointmentCompanyUID !== data.companyUID && item.job_id !== data.job_id )






        // res.send({companyData,employeeData,companyInterviewWith,employeeInterviewWith})
        // res.send({employeeInterviewWith,up datedEmployeeInterviewWith})

        // const companyAppointmentDetails = {
        //   appointmentEmployeeUID: data.employeeUID,
        //   interviewTime: data.interviewTime,
        //   job_id: data.job_id,
        // };
    
        // companyData.appointmentDetails.push(companyAppointmentDetails);

        // let companyResponse = await updateSinlgeData(CompanyInfo, { uid: data.companyUID }, companyData, true);
    
        // const employeeData = await getSingleData(EmployeeInfo, { uid: data.employeeUID }, {});
    
        // const employeeAppointmentDetails = {
        //   appointmentCompanyUID: data.companyUID,
        //   interviewTime: data.interviewTime,
        //   job_id: data.job_id,
        // };
    
        // employeeData.calledForInterview.push(employeeAppointmentDetails);
    
        // let employeeResponse = await updateSinlgeData(EmployeeInfo, { uid: data.employeeUID }, employeeData, true);
    
        // console.log(companyResponse);
        // console.log(employeeResponse);
    
        // res.send({ message: "Data updated successfully",companyResponse,employeeResponse });
      } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });/***/

    app.put("/update-add-an-array", async (req, res) => {
      try {
        const data = req.body;
        console.log(data);
    
        const companyData = await getSingleData(CompanyInfo, { uid: data.companyUID }, {});
    
        const companyAppointmentDetails = {
          appointmentEmployeeUID: data.employeeUID,
          interviewTime: data.interviewTime,
          job_id: data.job_id,
        };
    
        companyData.appointmentDetails.push(companyAppointmentDetails);

        let companyResponse = await updateSinlgeData(CompanyInfo, { uid: data.companyUID }, companyData, true);
    
        const employeeData = await getSingleData(EmployeeInfo, { uid: data.employeeUID }, {});
    
        const employeeAppointmentDetails = {
          appointmentCompanyUID: data.companyUID,
          interviewTime: data.interviewTime,
          job_id: data.job_id,
        };
    
        employeeData.calledForInterview.push(employeeAppointmentDetails);
    
        let employeeResponse = await updateSinlgeData(EmployeeInfo, { uid: data.employeeUID }, employeeData, true);
    
        console.log(companyResponse);
        console.log(employeeResponse);
    
        res.send({ message: "Data updated successfully",companyResponse,employeeResponse });
      } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });/***/


    app.put("/save-job",async(req,res)=>{

      //task 1 start
      const jobid = req.body.id
      //task 1 done


      //task 2 start
      const uid = req.body.uid
      //task 2 done

      
      //task 2.5 start
      const id ={_id:new ObjectId(jobid)}
      //task2.5 done


      //task 3 start
      let employee = await getSingleData(EmployeeInfo,{uid:uid},{})
      console.log(employee)
      //task 3 done

      //task 4 start
      let job = await getSingleData(Jobs,id,{})
      //task 4 done


      //task 4.5 start
      const isIncludes = employee.savedJobs.includes(jobid)
      if (isIncludes) {
        return res.send("already saved")
      }else{
      //task 4.5 done


      // task 5 starts
      const newEmployeeSavedJobsArray = [...employee.savedJobs,jobid]
      delete employee.savedJobs
      employee = {
        ...employee,
        savedJobs:newEmployeeSavedJobsArray
      }
      //task 5 done


      //task 6 starts
      const updateEmployee = await updateSinlgeData(EmployeeInfo,{uid:uid},employee,true)
      //task 6 done


      //task 6.5 start
        const whoSavedNewArray = [...job.whoSaved,uid]
        delete job.whoSaved
        job = {
          ...job,
          whoSaved:whoSavedNewArray
        }
      //task 6.5 done


      //task 7 start
      const updatedJobs = await updateSinlgeData(Jobs,id,job,true)
      //task 7 done

      
      //task 8 starts
      return res.send({updateEmployee:updateEmployee,updatedJobs:updatedJobs})
      //task 8 done


      }
    })


    app.put("/update-single-user/:uid",async (req,res)=>{
      const id = req.params.uid
      // console.log(id)
      let data = req.body
      // console.log(data)
      let result = await updateSinlgeData(CompanyInfo,{uid:id},data,true)
      // console.log(result)
      res.send(result)
    })/***/

    app.patch("/update-employee-profile-jobHistory-section/:employeeUID", async (req, res) => {
      try {
        const employeeUID = req.params.employeeUID;
        const updatedData = req.body;
    
        let employeeData = await getSingleData(EmployeeInfo, { uid: employeeUID }, {});
        delete employeeData.workExperience.jobHistory;
        console.log(updatedData.workExperience.jobHistory);
        employeeData.workExperience.jobHistory = updatedData.workExperience.jobHistory;
    
        const response = await updateSinlgeData(EmployeeInfo, { uid: employeeUID }, employeeData, true);
    
        res.send(response);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
      }
    });/** */


    app.patch("/update-employee-profile-education/:employeeUID", async (req, res) => {
      try {
        const employeeUID = req.params.employeeUID;
        const updatedData = req.body;
    
        let employeeData = await getSingleData(EmployeeInfo, { uid: employeeUID }, {});
        delete employeeData.workExperience.education;
        console.log(updatedData.workExperience.education);
        employeeData.workExperience.education = updatedData.workExperience.education;
    
        const response = await updateSinlgeData(EmployeeInfo, { uid: employeeUID }, employeeData, true);
    
        res.send(response);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
      }
    });/**/


    app.patch("/update-employee-other-infos/:uid",async (req,res)=>{

      console.log(req.body,req.params)
      const uid = req.params
      const updatedDoc = req.body
      const response = await updateSinlgeData(EmployeeInfo,uid,updatedDoc,false)
      res.send(response)
    })/** */
    


  } finally {
    // await client.close();

  }
}
run().catch(console.dir);


    app.get("/", (req, res) => {
      res.send("Hello from  bd jobs from port -> ");
    });
    
    app.listen(port, () => {
      console.log(`server is listening from port `,port);
    });
